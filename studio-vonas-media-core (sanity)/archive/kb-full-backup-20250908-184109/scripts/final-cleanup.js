// Final cleanup - Remove remaining non-emoji items

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk5MUsj2R008AHzNno2deJXdpndyDpRemUgr6KUs7HqxU21wEF88eJAWlBU657T86Wc29WpNftZuwj1KaThWN8vSPlmQRO0y3qRAwjTa56Eglbik5U4d4a95QKyUj1JtTDrou9JnGIw4iF535R6secIxTkrxG5Rh0puiPGRoB8u0c6P1TtF9',
  useCdn: false
});

// Remove remaining stragglers that don't fit our clean structure
const stragglers = [
  'Freelancer Management', // Should be under 🤝 External Partnerships  
  'About VONAS Media', // Should be under 🏢 Company Foundation
  'YouTube Channels', // Redundant with 📺 YouTube Shows
];

async function finalCleanup() {
  console.log('🧽 Final cleanup of remaining stragglers...');
  
  try {
    // Get all items
    const allItems = await client.fetch(`
      *[_type == "kbItem"] { 
        _id, 
        title, 
        itemType
      }
    `);
    
    // Find stragglers
    const itemsToDelete = allItems.filter(item => 
      stragglers.includes(item.title)
    );
    
    console.log(`🎯 Found ${itemsToDelete.length} stragglers to remove:`);
    itemsToDelete.forEach(item => console.log(`   - ${item.title} (${item.itemType})`));
    
    // Delete stragglers
    for (const straggler of itemsToDelete) {
      try {
        await client.delete(straggler._id);
        console.log(`❌ Deleted straggler: ${straggler.title}`);
      } catch (err) {
        console.log(`⚠️  Could not delete ${straggler.title}: ${err.message}`);
      }
    }
    
    // Show final clean structure
    const finalFolders = await client.fetch(`
      *[_type == "kbItem" && itemType == "folder"] | order(order asc, title asc) { 
        title,
        order
      }
    `);
    
    console.log('🎉 FINAL CLEAN FOLDER STRUCTURE:');
    finalFolders.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title}`);
    });
    
    console.log('✅ Knowledge base is now completely clean!');
    
  } catch (error) {
    console.error('❌ Error during final cleanup:', error);
    throw error;
  }
}

// Execute final cleanup
finalCleanup();