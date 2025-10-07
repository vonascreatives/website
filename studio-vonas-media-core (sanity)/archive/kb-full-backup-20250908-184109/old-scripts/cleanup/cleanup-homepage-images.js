const {createClient} = require('@sanity/client');
const fs = require('fs');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function cleanupHomepageImages() {
  try {
    console.log('🧹 Homepage Images Cleanup - Remove Non-Homepage Images');
    console.log('=' .repeat(70));
    
    // Load the actual homepage images analysis
    const analysisData = JSON.parse(fs.readFileSync('actual-homepage-images.json', 'utf8'));
    const actualHomepageFilenames = analysisData.uploadCandidates.map(img => img.filename);
    
    console.log(`📋 Found ${actualHomepageFilenames.length} actual homepage image filenames`);
    console.log(`📝 Actual homepage images: ${actualHomepageFilenames.join(', ')}`);
    
    // Get all homepage images in Sanity
    const allHomepageImages = await client.fetch(`*[_type == "homepageImage"]{
      _id, title, originalFilename
    }`);
    
    console.log(`📦 Found ${allHomepageImages.length} images in Sanity homepageImage collection`);
    
    // Find images to delete (not in the actual homepage list)
    const imagesToDelete = allHomepageImages.filter(img => 
      img.originalFilename && !actualHomepageFilenames.includes(img.originalFilename)
    );
    
    const imagesToKeep = allHomepageImages.filter(img => 
      img.originalFilename && actualHomepageFilenames.includes(img.originalFilename)
    );
    
    console.log(`\\n🗑️  Images to DELETE: ${imagesToDelete.length}`);
    console.log(`✅ Images to KEEP: ${imagesToKeep.length}`);
    console.log(`❓ Images without filename: ${allHomepageImages.length - imagesToDelete.length - imagesToKeep.length}`);
    
    if (imagesToDelete.length === 0) {
      console.log('\\n🎉 No cleanup needed - all images are actual homepage images!');
      return;
    }
    
    console.log('\\n📋 Images marked for deletion:');
    imagesToDelete.forEach((img, i) => {
      console.log(`${i + 1}. "${img.title}" (${img.originalFilename})`);
    });
    
    console.log('\\n⚠️  WARNING: This will permanently delete the above images from Sanity.');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to proceed...');
    
    // 5 second delay for safety
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\\n🗑️  Starting deletion process...');
    
    let deleteCount = 0;
    let errorCount = 0;
    
    for (const img of imagesToDelete) {
      try {
        console.log(`🔄 Deleting: "${img.title}" (${img.originalFilename})`);
        await client.delete(img._id);
        console.log(`   ✅ Deleted: ${img._id}`);
        deleteCount++;
      } catch (error) {
        console.error(`   ❌ Error deleting ${img.title}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\\n🎉 Cleanup completed!');
    
    // Final summary
    console.log(`\\n📊 Cleanup Results:`);
    console.log(`🗑️  Successfully deleted: ${deleteCount}`);
    console.log(`❌ Failed to delete: ${errorCount}`);
    console.log(`✅ Kept (actual homepage): ${imagesToKeep.length}`);
    
    // Verify final state
    const finalCount = await client.fetch(`count(*[_type == "homepageImage"])`);
    console.log(`\\n📊 Final Homepage Images in Sanity: ${finalCount}`);
    
    if (finalCount === actualHomepageFilenames.length) {
      console.log('🎯 Perfect! Database now contains exactly the real homepage images.');
    } else {
      console.log(`⚠️  Expected ${actualHomepageFilenames.length} images, but found ${finalCount}.`);
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

console.log('🧹 Starting Homepage Images Cleanup');
cleanupHomepageImages();
