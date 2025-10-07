// Aggressive Knowledge Base Cleanup - Remove ALL duplicates and old references
// This will force delete everything and start completely fresh

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk5MUsj2R008AHzNno2deJXdpndyDpRemUgr6KUs7HqxU21wEF88eJAWlBU627T86Wc29WpNftZuwj1KaThWN8vSPlmQRO0y3qRAwjTa56Eglbik5U4d4a95QKyUj1JtTDrou9JnGIw4iF535R6secIxTkrxG5Rh0puiPGRoB8u0c6P1TtF9',
  useCdn: false
});

async function aggressiveCleanup() {
  console.log('🧹 Starting AGGRESSIVE cleanup - removing ALL duplicates...');
  
  try {
    // Get ALL items including drafts
    const allItems = await client.fetch(`
      *[_type == "kbItem"] { 
        _id, 
        title, 
        "slug": slug.current,
        _rev
      }
    `);
    
    console.log(`📊 Found ${allItems.length} total items to analyze`);
    
    // First, remove all parent references to avoid conflicts
    console.log('🔗 Removing all parent references...');
    
    const removeRefsPromises = allItems.map(item => 
      client.patch(item._id)
        .unset(['parent'])
        .commit()
        .then(() => console.log(`🔗 Removed refs from: ${item.title}`))
        .catch(err => console.log(`⚠️  Could not remove refs from ${item.title}: ${err.message}`))
    );
    
    await Promise.all(removeRefsPromises);
    console.log('✅ All parent references removed');
    
    // Now delete everything
    console.log('🗑️ Deleting ALL items...');
    
    const deletePromises = allItems.map(item => 
      client.delete(item._id)
        .then(() => console.log(`❌ Deleted: ${item.title}`))
        .catch(err => console.log(`⚠️  Could not delete ${item.title}: ${err.message}`))
    );
    
    await Promise.all(deletePromises);
    
    // Also delete any remaining FAQs
    const faqs = await client.fetch(`*[_type == "faq"] { _id, faqId }`);
    console.log(`🗑️ Deleting ${faqs.length} FAQ items...`);
    
    for (const faq of faqs) {
      try {
        await client.delete(faq._id);
        console.log(`❌ Deleted FAQ: ${faq.faqId}`);
      } catch (err) {
        console.log(`⚠️  Could not delete FAQ ${faq.faqId}: ${err.message}`);
      }
    }
    
    console.log('🎉 AGGRESSIVE cleanup completed!');
    console.log('💡 Now run the reorganize script to create clean structure');
    
  } catch (error) {
    console.error('❌ Error during aggressive cleanup:', error);
    throw error;
  }
}

// Execute aggressive cleanup
aggressiveCleanup();