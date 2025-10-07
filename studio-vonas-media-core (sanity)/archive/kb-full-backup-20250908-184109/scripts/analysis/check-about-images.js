const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function checkAndUpdateAboutImages() {
  try {
    console.log('🔍 Checking About page images in Sanity...');
    
    // Check existing about images 
    const aboutImages = await client.fetch(`*[_type == "homepageImage" && (
      title match "*About*" || 
      notes match "*About*" ||
      originalFilename match "hero-1.jpg" ||
      originalFilename match "about-*.jpg" ||
      originalFilename match "brand-*.png" ||
      originalFilename match "shape-1.png"
    )]{
      _id, title, page, folder, category, originalFilename, notes
    }`);
    
    console.log(`📋 Found ${aboutImages.length} potential About page images`);
    
    // Group by current state
    const needsUpdate = aboutImages.filter(img => img.page !== 'About Us');
    const alreadyUpdated = aboutImages.filter(img => img.page === 'About Us');
    
    console.log(`✅ Already updated: ${alreadyUpdated.length}`);
    console.log(`🔄 Need update: ${needsUpdate.length}`);
    
    if (alreadyUpdated.length > 0) {
      console.log('\n✅ Already Updated Images:');
      alreadyUpdated.forEach(img => {
        console.log(`   - ${img.title} (${img.category})`);
      });
    }
    
    if (needsUpdate.length > 0) {
      console.log('\n🔄 Images that need updating:');
      needsUpdate.forEach(img => {
        console.log(`   - ${img.title} (${img.originalFilename || 'no filename'})`);
      });
      
      console.log('\n🚀 Updating images with new page organization...');
      
      // Update each image
      for (const img of needsUpdate) {
        try {
          const patch = {
            page: 'About Us',
            folder: 'About Us/images'
          };
          
          await client.patch(img._id).set(patch).commit();
          console.log(`   ✅ Updated: ${img.title}`);
        } catch (error) {
          console.error(`   ❌ Error updating ${img.title}:`, error.message);
        }
      }
      
      console.log(`\n🎉 Successfully updated ${needsUpdate.length} About page images!`);
    }
    
    // Final check
    const finalCheck = await client.fetch(`*[_type == "homepageImage" && page == "About Us"]{
      _id, title, category, folder
    }`);
    
    console.log(`\n📊 Final count: ${finalCheck.length} images now properly organized under "About Us" page`);
    
    return finalCheck;
    
  } catch (error) {
    console.error('❌ Error checking About images:', error);
  }
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

checkAndUpdateAboutImages();
