const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function cleanDeleteAboutImages() {
  try {
    console.log('🧹 CLEAN DELETE: About Us Images');
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
    
    console.log(`📋 Found ${aboutImages.length} About Us images to analyze`);
    
    // Define exactly what we want to keep (from our original audit)
    const CORRECT_ABOUT_FILES = [
      'hero-1.jpg',          // 1 hero
      'shape-1.png',         // 1 shape
      'about-1.jpg',         // 3 about section images 
      'about-2.jpg',
      'about-3.jpg',
      'brand-bg-shape.png'   // 1 brand background (we'll use Brand CMS for actual logos)
    ];
    
    const toDelete = [];
    const toKeep = [];
    
    // Group by filename to handle duplicates
    const byFilename = {};
    aboutImages.forEach(img => {
      const filename = img.originalFilename;
      if (!byFilename[filename]) byFilename[filename] = [];
      byFilename[filename].push(img);
    });
    
    console.log('\n🔍 Analyzing images by filename...');
    
    Object.entries(byFilename).forEach(([filename, images]) => {
      if (CORRECT_ABOUT_FILES.includes(filename)) {
        // Keep only the first (oldest) one, delete duplicates
        const [keepThis, ...deleteThese] = images.sort((a, b) => 
          new Date(a._createdAt) - new Date(b._createdAt)
        );
        
        toKeep.push(keepThis);
        console.log(`   ✅ KEEP: ${filename} (${keepThis.title})`);
        
        if (deleteThese.length > 0) {
          toDelete.push(...deleteThese);
          console.log(`   🗑️  DELETE ${deleteThese.length} duplicates of ${filename}`);
        }
      } else {
        // Delete all - not a correct About Us file
        toDelete.push(...images);
        console.log(`   ❌ DELETE ALL: ${filename} - Not an About page file`);
      }
    });
    
    console.log(`\n📊 Cleanup Plan:`);
    console.log(`   ✅ Keep: ${toKeep.length} images`);
    console.log(`   🗑️  Delete: ${toDelete.length} images`);
    
    if (toDelete.length > 0) {
      console.log('\n🚀 Deleting unnecessary images...');
      
      for (const img of toDelete) {
        try {
          await client.delete(img._id);
          console.log(`   ✅ Deleted: ${img.title} (${img.originalFilename})`);
        } catch (error) {
          console.error(`   ❌ Error deleting ${img.title}:`, error.message);
        }
      }
    }
    
    console.log('\n🔧 Organizing remaining About Us images...');
    
    // Now properly organize the remaining images
    for (const img of toKeep) {
      let category, displayOrder;
      
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
        default:
          category = 'Gallery Section';
          displayOrder = 5;
      }
      
      try {
        await client.patch(img._id).set({
          page: 'About Us',
          folder: 'About Us/images',
          category: category,
          displayOrder: displayOrder,
          isActive: true
        }).commit();
        
        console.log(`   ✅ Organized: ${img.originalFilename} -> ${category} (Order: ${displayOrder})`);
      } catch (error) {
        console.error(`   ❌ Error organizing ${img.title}:`, error.message);
      }
    }
    
    // Final verification
    const finalCheck = await client.fetch(`*[_type == "homepageImage" && page == "About Us"] | order(category asc, displayOrder asc){
      _id, title, category, displayOrder, originalFilename
    }`);
    
    console.log(`\n✅ About Us page now has ${finalCheck.length} clean, organized images:`);
    
    const byCategory = {};
    finalCheck.forEach(img => {
      if (!byCategory[img.category]) byCategory[img.category] = [];
      byCategory[img.category].push(img);
    });
    
    Object.entries(byCategory).forEach(([category, images]) => {
      console.log(`\n📁 ${category} (${images.length}):`);
      images.forEach(img => {
        console.log(`   ✅ ${img.originalFilename} - ${img.title} [Order: ${img.displayOrder}]`);
      });
    });
    
    console.log('\n🎉 About Us cleanup completed - No more duplicates or wrong images!');
