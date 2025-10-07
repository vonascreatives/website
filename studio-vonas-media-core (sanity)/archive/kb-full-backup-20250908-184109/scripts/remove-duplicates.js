// Remove Specific Duplicates - Target the exact duplicate items
// Keep the clean emoji structure, remove the old messy ones

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || 'sk5MUsj2R008AHzNno2deJXdpndyDpRemUgr6KUs7HqxU21wEF88eJAWlBU657T86Wc29WpNftZuwj1KaThWN8vSPlmQRO0y3qRAwjTa56Eglbik5U4d4a95QKyUj1JtTDrou9JnGIw4iF535R6secIxTkrxG5Rh0puiPGRoB8u0c6P1TtF9',
  useCdn: false
});

// Exact duplicates to remove (keep the emoji versions, remove the plain ones)
const duplicatesToRemove = [
  'Company Foundation', // Remove - keep 🏢 Company Foundation
  'Team Management', // Remove - keep 👥 Team & Operations  
  'Content Production', // Remove - keep 🎬 Production Workflows
  'Tools and Systems', // Remove - keep 🛠️ Tools & Systems
  'External Collaboration', // Remove - keep 🤝 External Partnerships
];

async function removeDuplicates() {
  console.log('🎯 Starting targeted duplicate removal...');
  
  try {
    // Get all items
    const allItems = await client.fetch(`
      *[_type == "kbItem"] { 
        _id, 
        title, 
        "slug": slug.current,
        itemType,
        parent
      }
    `);
    
    console.log(`📊 Found ${allItems.length} total items`);
    
    // Find exact duplicates to remove
    const itemsToDelete = allItems.filter(item => 
      duplicatesToRemove.includes(item.title)
    );
    
    console.log(`🎯 Found ${itemsToDelete.length} duplicates to remove:`);
    itemsToDelete.forEach(item => console.log(`   - ${item.title}`));
    
    // First, remove parent references from child items
    console.log('🔗 Removing parent references from child items...');
    
    for (const duplicate of itemsToDelete) {
      const childItems = allItems.filter(item => 
        item.parent && item.parent._ref === duplicate._id
      );
      
      for (const child of childItems) {
        try {
          await client.patch(child._id).unset(['parent']).commit();
          console.log(`🔗 Removed parent ref from: ${child.title}`);
        } catch (err) {
          console.log(`⚠️  Could not remove parent ref from ${child.title}: ${err.message}`);
        }
      }
    }
    
    // Now delete the duplicate folders
    console.log('🗑️ Deleting duplicate items...');
    
    for (const duplicate of itemsToDelete) {
      try {
        await client.delete(duplicate._id);
        console.log(`❌ Deleted duplicate: ${duplicate.title}`);
      } catch (err) {
        console.log(`⚠️  Could not delete ${duplicate.title}: ${err.message}`);
      }
    }
    
    // Get remaining items to verify
    const remainingItems = await client.fetch(`
      *[_type == "kbItem" && itemType == "folder"] { 
        title,
        itemType
      }
    `);
    
    console.log('✅ Remaining folders:');
    remainingItems.forEach(item => console.log(`   ✓ ${item.title}`));
    
    console.log('🎉 Duplicate removal completed!');
    console.log('💡 Check the Studio to verify only clean emoji folders remain');
    
  } catch (error) {
    console.error('❌ Error during duplicate removal:', error);
    throw error;
  }
}

// Execute duplicate removal
removeDuplicates();