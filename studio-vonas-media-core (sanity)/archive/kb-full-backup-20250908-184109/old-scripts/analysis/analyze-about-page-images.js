const fs = require('fs');
const path = require('path');

// Based on actual analysis of About page components, here are the EXACT images used:

const ABOUT_PAGE_IMAGES = {
  // From AboutUsHero component
  hero: [
    'inner-about/hero/hero-1.jpg'           // Main hero background
  ],
  
  // From AboutUsArea component
  about: [
    'inner-about/about/shape-1.png',       // Decorative shape
    'inner-about/about/about-1.jpg',       // Left side about image
    'inner-about/about/about-2.jpg',       // Right side outer image
    'inner-about/about/about-3.jpg'        // Right side inner image
  ],
  
  // From BrandFive component
  brand: [
    'inner-about/brand/brand-1.png',       // Client brand logos
    'inner-about/brand/brand-2.png',
    'inner-about/brand/brand-3.png',
    'inner-about/brand/brand-4.png',
    'inner-about/brand/brand-5.png',
    'inner-about/brand/brand-bg-shape.png' // Brand section background
  ]
  
  // Note: TeamOne uses Sanity CMS data (creators), not static images
  // Note: FunFactOne uses only counters, no images  
  // Note: AwardOne is reused from homepage (already managed)
};

function analyzeAboutPageImages() {
  console.log('📋 ABOUT PAGE Image Analysis');
  console.log('=' .repeat(60));
  
  const imageBasePath = '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img';
  const results = {
    aboutPageImages: [],
    missingImages: [],
    totalFound: 0,
    totalMissing: 0
  };
  
  // Flatten all about page images
  const allAboutImages = [];
  Object.entries(ABOUT_PAGE_IMAGES).forEach(([section, images]) => {
    console.log(`\\n📁 ${section.toUpperCase()} SECTION:`);
    
    images.forEach(imagePath => {
      const fullPath = path.join(imageBasePath, imagePath);
      const filename = path.basename(imagePath);
      
      if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${filename} - FOUND`);
        results.aboutPageImages.push({
          section: section,
          filename: filename,
          relativePath: imagePath,
          fullPath: fullPath,
          exists: true,
          page: 'about'
        });
        results.totalFound++;
      } else {
        console.log(`   ❌ ${filename} - MISSING`);
        results.missingImages.push({
          section: section,
          filename: filename,
          relativePath: imagePath,
          fullPath: fullPath,
          exists: false,
          page: 'about'
        });
        results.totalMissing++;
      }
      
      allAboutImages.push({
        section: section,
        filename: filename,
        relativePath: imagePath,
        fullPath: fullPath,
        exists: fs.existsSync(fullPath),
        page: 'about'
      });
    });
  });
  
  console.log('\\n📊 SUMMARY:');
  console.log('=' .repeat(40));
  console.log(`✅ Found: ${results.totalFound} images`);
  console.log(`❌ Missing: ${results.totalMissing} images`);
  console.log(`📈 Total Expected: ${results.totalFound + results.totalMissing} images`);
  
  // Group by section for upload
  const imagesBySection = {};
  results.aboutPageImages.forEach(img => {
    if (!imagesBySection[img.section]) {
      imagesBySection[img.section] = [];
    }
    imagesBySection[img.section].push(img);
  });
  
  console.log('\\n📋 UPLOAD CANDIDATES BY SECTION:');
  console.log('-' .repeat(40));
  Object.entries(imagesBySection).forEach(([section, images]) => {
    console.log(`${section}: ${images.length} images`);
  });
  
  // Save results
  const analysisResults = {
    analysis_date: new Date().toISOString(),
    page: 'about',
    method: 'actual_component_analysis',
    description: 'Images identified by examining actual About page component code',
    sections: Object.keys(ABOUT_PAGE_IMAGES),
    images: allAboutImages,
    uploadCandidates: results.aboutPageImages,
    missingImages: results.missingImages,
    summary: {
      totalFound: results.totalFound,
      totalMissing: results.totalMissing,
      totalExpected: results.totalFound + results.totalMissing
    }
  };
  
  fs.writeFileSync('about-page-images.json', JSON.stringify(analysisResults, null, 2));
  console.log('\\n💾 Results saved to: about-page-images.json');
  
  return analysisResults;
}

// Run analysis
analyzeAboutPageImages();
