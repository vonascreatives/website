const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function removeDuplicates() {
  try {
    console.log('🔄 Removing Duplicate Homepage Images');
    console.log('=' .repeat(50));
    
    // Get all images
    const allImages = await client.fetch(`*[_type == "homepageImage"]{
      _id, _createdAt, title, originalFilename
    } | order(originalFilename asc, _createdAt asc)`);
    
    console.log(`📦 Found ${allImages.length} total images`);
    
    // Group by filename
    const imagesByFilename = {};
    allImages.forEach(img => {
      if (img.originalFilename) {
        if (!imagesByFilename[img.originalFilename]) {
          imagesByFilename[img.originalFilename] = [];
        }
        imagesByFilename[img.originalFilename].push(img);
      }
    });
    
    // Find duplicates
    const duplicates = [];
    const keepImages = [];
    
    Object.entries(imagesByFilename).forEach(([filename, images]) => {
      if (images.length > 1) {
        console.log(`\\n🔄 Found ${images.length} copies of: ${filename}`);
        
        // Keep the oldest (first created)
        const toKeep = images[0];
        const toDelete = images.slice(1);
        
        console.log(`   ✅ Keeping: "${toKeep.title}" (${toKeep._id})`);
        keepImages.push(toKeep);
        
        toDelete.forEach(img => {
          console.log(`   🗑️  Deleting: "${img.title}" (${img._id})`);
          duplicates.push(img);
        });
      } else {
        keepImages.push(images[0]);
      }
    });
    
    console.log(`\\n📊 Summary:`);
    console.log(`✅ Images to keep: ${keepImages.length}`);
    console.log(`🗑️  Duplicates to delete: ${duplicates.length}`);
    
    if (duplicates.length === 0) {
      console.log('\\n🎉 No duplicates found!');
      return;
    }
    
    console.log('\\n⚠️  WARNING: This will delete duplicate images. Wait 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\\n🗑️  Deleting duplicates...');
    
    let deleteCount = 0;
    for (const img of duplicates) {
      try {
        await client.delete(img._id);
        console.log(`   ✅ Deleted: ${img.originalFilename} (${img._id})`);
        deleteCount++;
      } catch (error) {
        console.error(`   ❌ Error deleting ${img.originalFilename}:`, error.message);
      }
    }
    
    console.log(`\\n🎉 Cleanup completed!`);
    console.log(`🗑️  Successfully deleted: ${deleteCount} duplicates`);
    
    // Final count
    const finalCount = await client.fetch(`count(*[_type == "homepageImage"])`);
    console.log(`📊 Final count: ${finalCount} homepage images`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

removeDuplicates();
