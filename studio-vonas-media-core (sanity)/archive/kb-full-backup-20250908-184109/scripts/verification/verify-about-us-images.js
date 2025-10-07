const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function verifyAboutUsImages() {
  try {
    console.log('🔍 Verifying About Us page images organization...');
    console.log('=' .repeat(60));
    
    // Check all About Us page images
    const aboutUsImages = await client.fetch(`*[_type == "homepageImage" && page == "About Us"]{
      _id, 
      title, 
      page, 
      folder, 
      category, 
      placement, 
      displayOrder,
      isActive,
      "originalFilename": originalFilename,
      "imageUrl": image[0].image.asset->url,
      "alt": image[0].alt
    } | order(category asc, displayOrder asc)`);
    
    console.log(`📋 Found ${aboutUsImages.length} images with page='About Us'`);
    
    if (aboutUsImages.length === 0) {
      console.log('❌ No About Us images found! Need to fix the organization.');
      return;
    }
    
    // Group by category
    const imagesByCategory = {};
    aboutUsImages.forEach(img => {
      const cat = img.category || 'Other';
      if (!imagesByCategory[cat]) imagesByCategory[cat] = [];
      imagesByCategory[cat].push(img);
    });
    
    console.log('\n📁 About Us Images by Category:');
    console.log('─'.repeat(40));
    
    Object.entries(imagesByCategory).forEach(([category, images]) => {
      console.log(`\n${category} (${images.length} images):`);
      images.forEach(img => {
        const status = img.isActive ? '🟢' : '🔴';
        const folder = img.folder || 'NO FOLDER';
        console.log(`   ${status} ${img.title}`);
        console.log(`      📂 Folder: ${folder}`);
        console.log(`      📍 Original: ${img.originalFilename || 'N/A'}`);
        console.log(`      🔗 URL: ${img.imageUrl ? '✅ Has URL' : '❌ No URL'}`);
        console.log(`      📋 Order: ${img.displayOrder || 'N/A'}`);
      });
    });
    
    // Check if any images need folder correction
    const needsFolderFix = aboutUsImages.filter(img => 
      img.folder !== 'About Us/images' || img.page !== 'About Us'
    );
    
    if (needsFolderFix.length > 0) {
      console.log(`\n🔄 Found ${needsFolderFix.length} images that need folder correction:`);
      needsFolderFix.forEach(img => {
        console.log(`   - ${img.title}: page="${img.page}", folder="${img.folder}"`);
      });
      
      console.log('\n🚀 Fixing folder organization...');
      for (const img of needsFolderFix) {
        try {
          await client.patch(img._id).set({
            page: 'About Us',
            folder: 'About Us/images'
          }).commit();
          console.log(`   ✅ Fixed: ${img.title}`);
        } catch (error) {
          console.error(`   ❌ Error fixing ${img.title}:`, error.message);
        }
      }
    } else {
      console.log('\n✅ All About Us images are properly organized!');
    }
    
    // Final verification
    const finalCheck = await client.fetch(`*[_type == "homepageImage" && page == "About Us" && folder == "About Us/images"]{
      _id, title, category, isActive
    }`);
    
    console.log(`\n📊 Final verification: ${finalCheck.length} images properly organized in "About Us/images" folder`);
    
    return aboutUsImages;
    
  } catch (error) {
    console.error('❌ Error verifying About Us images:', error);
  }
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

verifyAboutUsImages();
