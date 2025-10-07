const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function cleanupAboutUsImages() {
  try {
    console.log('🧹 Cleaning up About Us Page Images...');
    console.log('=' .repeat(60));
    
    // Get all images currently assigned to "About Us" page
    const aboutUsImages = await client.fetch(`*[_type == "homepageImage" && page == "About Us"]{
      _id, 
      title, 
      category,
      originalFilename,
      "imageUrl": image[0].image.asset->url
    }`);
    
    console.log(`📋 Found ${aboutUsImages.length} images assigned to About Us page:`);
    
    // Define what should actually be About Us images based on filenames
    const ACTUAL_ABOUT_US_FILES = [
      'hero-1.jpg',          // About hero background
      'about-1.jpg',         // About section images
      'about-2.jpg',
      'about-3.jpg', 
      'shape-1.png',         // About section shape (only the one in inner-about folder)
      'brand-1.png',         // About page brand logos
      'brand-2.png',
      'brand-3.png',
      'brand-4.png',
      'brand-5.png',
      'brand-bg-shape.png'   // About page brand background
    ];
    
    console.log('\n🔍 Analyzing each image...');
    
    const toKeep = [];
    const toMove = [];
    
    for (const img of aboutUsImages) {
      const filename = img.originalFilename;
      const title = img.title.toLowerCase();
      
      // Check if this is actually an About Us image
      const isActualAboutImage = 
        // Direct filename match
        ACTUAL_ABOUT_US_FILES.includes(filename) ||
        // Title contains "about" and looks like about content
        (title.includes('about') && 
         (title.includes('section') || title.includes('hero') || title.includes('brand'))) &&
        // Exclude homepage hero images that got mislabeled
        !title.includes('homepage hero') &&
        // Exclude channel-specific items
        !title.includes('channels') &&
        // Exclude footer items
        !title.includes('footer');
      
      if (isActualAboutImage) {
        toKeep.push(img);
        console.log(`   ✅ KEEP: ${img.title} (${filename})`);
      } else {
        toMove.push(img);
        console.log(`   🔄 MOVE: ${img.title} (${filename}) - Not About page content`);
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`   ✅ Keep in About Us: ${toKeep.length}`);
    console.log(`   🔄 Move to other pages: ${toMove.length}`);
    
    if (toMove.length > 0) {
      console.log('\n🚀 Moving misplaced images...');
      
      for (const img of toMove) {
        let newPage = 'Homepage'; // Default
        let newCategory = 'Other';
        
        // Determine correct page and category based on content
        if (img.title.toLowerCase().includes('homepage')) {
          newPage = 'Homepage';
          newCategory = 'Hero Section';
        } else if (img.title.toLowerCase().includes('channels')) {
          newPage = 'Channels';
          newCategory = 'Hero Section';
        } else if (img.title.toLowerCase().includes('footer')) {
          newPage = 'Global Assets';
          newCategory = 'Background Images';
        } else if (img.originalFilename === 'hero-shape-1-1.png') {
          newPage = 'Homepage';
          newCategory = 'Background Images';
        }
        
        try {
          await client.patch(img._id).set({
            page: newPage,
            folder: `${newPage}/images`,
            category: newCategory
          }).commit();
          
          console.log(`   ✅ Moved "${img.title}" to ${newPage}`);
        } catch (error) {
          console.error(`   ❌ Error moving ${img.title}:`, error.message);
        }
      }
    }
    
    // Now fix the About Us images that should stay
    console.log('\n🔧 Fixing About Us image categories...');
    
    for (const img of toKeep) {
      let correctCategory = 'Gallery Section'; // Default
      let displayOrder = 1;
      
      // Set correct categories based on filename/content
      if (img.originalFilename === 'hero-1.jpg' && img.title.toLowerCase().includes('about')) {
        correctCategory = 'Hero Section';
        displayOrder = 1;
      } else if (img.originalFilename === 'shape-1.png') {
        correctCategory = 'Gallery Section';
        displayOrder = 1;
      } else if (img.originalFilename?.includes('about-')) {
        correctCategory = 'Gallery Section';
        displayOrder = parseInt(img.originalFilename.match(/about-(\d+)/)?.[1] || '1') + 1;
      } else if (img.originalFilename?.includes('brand-')) {
        correctCategory = 'Brand Section';
        displayOrder = parseInt(img.originalFilename.match(/brand-(\d+)/)?.[1] || '1');
      } else if (img.originalFilename === 'brand-bg-shape.png') {
        correctCategory = 'Background Images';
        displayOrder = 1;
      }
      
      try {
        await client.patch(img._id).set({
          page: 'About Us',
          folder: 'About Us/images',
          category: correctCategory,
          displayOrder: displayOrder
        }).commit();
        
        console.log(`   ✅ Fixed "${img.title}" -> ${correctCategory} (Order: ${displayOrder})`);
      } catch (error) {
        console.error(`   ❌ Error fixing ${img.title}:`, error.message);
      }
    }
    
    // Final verification
    console.log('\n🧪 Final verification...');
    const finalCheck = await client.fetch(`*[_type == "homepageImage" && page == "About Us"] | order(category asc, displayOrder asc){
      _id, title, category, displayOrder, originalFilename
    }`);
    
    console.log(`\n✅ About Us page now has ${finalCheck.length} properly organized images:`);
    
    const byCategory = {};
    finalCheck.forEach(img => {
      if (!byCategory[img.category]) byCategory[img.category] = [];
      byCategory[img.category].push(img);
    });
    
    Object.entries(byCategory).forEach(([category, images]) => {
      console.log(`\n📁 ${category} (${images.length}):`);
      images.forEach(img => {
        console.log(`   - ${img.title} (${img.originalFilename}) [Order: ${img.displayOrder}]`);
      });
    });
    
    console.log('\n🎉 About Us page cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

cleanupAboutUsImages();
