const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function cleanAboutImagesFinal() {
  try {
    console.log('🧹 FINAL CLEANUP: About Us Images');
    console.log('=' .repeat(50));
    
    // Get all About Us images
    const aboutImages = await client.fetch(`*[_type == "homepageImage" && page == "About Us"]{
      _id, 
      title, 
      originalFilename,
      category,
      displayOrder,
      _createdAt
    } | order(_createdAt asc)`);
    
    console.log(`📋 Found ${aboutImages.length} About Us images to clean`);
    
    // Define exactly what we want to keep
    const CORRECT_ABOUT_FILES = [
      'hero-1.jpg',          // Hero background
      'shape-1.png',         // Decorative shape
      'about-1.jpg',         // About section images 
      'about-2.jpg',
      'about-3.jpg',
      'brand-bg-shape.png'   // Brand background shape
    ];
    
    const toDelete = [];
    const toKeep = [];
    
    // Group by filename to handle duplicates
    const byFilename = {};
    aboutImages.forEach(img => {
      const filename = img.originalFilename || 'no-filename';
      if (!byFilename[filename]) byFilename[filename] = [];
      byFilename[filename].push(img);
    });
    
    console.log('\n🔍 Processing each file...');
    
    Object.entries(byFilename).forEach(([filename, images]) => {
      if (CORRECT_ABOUT_FILES.includes(filename)) {
        // Keep the first one, delete duplicates
        const [first, ...rest] = images.sort((a, b) => 
          new Date(a._createdAt) - new Date(b._createdAt)
        );
        
        toKeep.push(first);
        console.log(`   ✅ KEEP: ${filename}`);
        
        if (rest.length > 0) {
          toDelete.push(...rest);
          console.log(`   🗑️  DELETE ${rest.length} duplicates of ${filename}`);
        }
      } else {
        // Not a correct About Us file - delete all
        toDelete.push(...images);
        console.log(`   ❌ DELETE: ${filename} (${images.length} copies) - Not About page file`);
      }
    });
    
    console.log(`\n📊 Plan: Keep ${toKeep.length}, Delete ${toDelete.length}`);
    
    // Delete unnecessary images
    if (toDelete.length > 0) {
      console.log('\n🚀 Deleting...');
      for (const img of toDelete) {
        try {
          await client.delete(img._id);
          console.log(`   ✅ Deleted: ${img.originalFilename}`);
        } catch (error) {
          console.error(`   ❌ Error: ${error.message}`);
        }
      }
    }
    
    // Organize remaining images
    console.log('\n🔧 Organizing remaining images...');
    
    for (const img of toKeep) {
      let category = 'Gallery Section';
      let displayOrder = 1;
      
      switch (img.originalFilename) {
        case 'hero-1.jpg':
          category = 'Hero Section';
          displayOrder = 1;
          break;
        case 'shape-1.png':
          category = 'Gallery Section';
          displayOrder = 1;
          break;
        case 'about-1.jpg':
          category = 'Gallery Section';
          displayOrder = 2;
          break;
        case 'about-2.jpg':
          category = 'Gallery Section';
          displayOrder = 3;
          break;
        case 'about-3.jpg':
          category = 'Gallery Section';
          displayOrder = 4;
          break;
        case 'brand-bg-shape.png':
          category = 'Background Images';
          displayOrder = 1;
          break;
      }
      
      try {
        await client.patch(img._id).set({
          page: 'About Us',
          folder: 'About Us/images',
          category: category,
          displayOrder: displayOrder,
          isActive: true
        }).commit();
        
        console.log(`   ✅ ${img.originalFilename} -> ${category} (${displayOrder})`);
      } catch (error) {
        console.error(`   ❌ Error organizing ${img.originalFilename}:`, error.message);
      }
    }
    
    // Final check
    const final = await client.fetch(`*[_type == "homepageImage" && page == "About Us"] | order(category asc, displayOrder asc){
      _id, title, category, displayOrder, originalFilename
    }`);
    
    console.log(`\n✅ Final result: ${final.length} About Us images`);
    
    const grouped = {};
    final.forEach(img => {
      if (!grouped[img.category]) grouped[img.category] = [];
      grouped[img.category].push(img);
    });
    
    Object.entries(grouped).forEach(([cat, imgs]) => {
      console.log(`\n📁 ${cat} (${imgs.length}):`);
      imgs.forEach(img => {
        console.log(`   ${img.originalFilename} [${img.displayOrder}]`);
      });
    });
    
    console.log('\n🎉 About Us cleanup completed!');
    
  } catch (error) {
    console.error('❌ Cleanup error:', error);
  }
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN required');
  process.exit(1);
}

cleanAboutImagesFinal();
