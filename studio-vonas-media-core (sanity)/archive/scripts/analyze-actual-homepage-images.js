const fs = require('fs');
const path = require('path');

// Based on actual analysis of homepage components, here are the EXACT images used:

const ACTUAL_HOMEPAGE_IMAGES = {
  // From HeroBannerOne component
  hero: [
    'home-01/hero/hero-bg-shape-1-1.svg',    // Main hero background shape
    'home-01/hero/hero-shape-1-1.png',       // Small shape decoration (40x40)
    'home-01/hero/hero-1-1.png'             // Main hero title image (270x160)
  ],
  
  // From BrandSlider component
  brand: [
    'home-01/brand/brand-1.png',             // Brand logos in slider
    'home-01/brand/brand-2.png',
    'home-01/brand/brand-3.png',
    'home-01/brand/brand-4.png',
    'home-01/brand/brand-5.png',
    'home-01/brand/brand-6.png',
    'home-01/brand/brand-7.png'
  ],
  
  // From ServiceOne component
  service: [
    'home-01/service/service-icon-1.png',    // Service icons
    'home-01/service/service-icon-2.png',
    'home-01/service/service-icon-3.png',
    'home-01/service/service-icon-4.png'
  ],
  
  // From ProjectOne component (static fallback images)
  project: [
    'home-01/project/project-1-1.jpg',       // Project gallery images
    'home-01/project/project-1-2.jpg',
    'home-01/project/project-1-3.jpg',
    'home-01/project/project-1-4.jpg',
    'home-01/project/project-1-5.jpg',
    'home-01/project/project-1-6.jpg',
    'inner-service/hero/hero-1-2.jpg'        // Full-width background image
  ],
  
  // From AwardOne component
  award: [
    'home-01/award/award-1.png',             // Award badges/images
    'home-01/award/award-2.png',
    'home-01/award/award-3.png',
    'home-01/award/award-4.png',
    'home-01/award/award-5.png',
    'home-01/award/award-6.png'
  ],
  
  // From home-1.tsx footer shapes
  footer: [
    'home-01/footer/footer-circle-shape-1.png',  // Footer overlay shapes
    'home-01/footer/footer-circle-shape-2.png'
  ]
  
  // Note: VideOne uses external video URL, not local images
  // Note: TestimonialOne uses only text content, no images
  // Note: TeamOne uses Sanity CMS data (creators), not static images
};

function analyzeActualHomepageImages() {
  console.log('🎯 ACCURATE Homepage Image Analysis');
  console.log('=' .repeat(60));
  
  const imageBasePath = '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img';
  const results = {
    actualHomepageImages: [],
    missingImages: [],
    totalFound: 0,
    totalMissing: 0
  };
  
  // Flatten all actual homepage images
  const allHomepageImages = [];
  Object.entries(ACTUAL_HOMEPAGE_IMAGES).forEach(([section, images]) => {
    console.log(`\\n📁 ${section.toUpperCase()} SECTION:`);
    
    images.forEach(imagePath => {
      const fullPath = path.join(imageBasePath, imagePath);
      const filename = path.basename(imagePath);
      
      if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${filename} - FOUND`);
        results.actualHomepageImages.push({
          section: section,
          filename: filename,
          relativePath: imagePath,
          fullPath: fullPath,
          exists: true
        });
        results.totalFound++;
      } else {
        console.log(`   ❌ ${filename} - MISSING`);
        results.missingImages.push({
          section: section,
          filename: filename,
          relativePath: imagePath,
          fullPath: fullPath,
          exists: false
        });
        results.totalMissing++;
      }
      
      allHomepageImages.push({
        section: section,
        filename: filename,
        relativePath: imagePath,
        fullPath: fullPath,
        exists: fs.existsSync(fullPath)
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
  results.actualHomepageImages.forEach(img => {
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
    method: 'actual_component_analysis',
    description: 'Images identified by examining actual homepage component code',
    sections: Object.keys(ACTUAL_HOMEPAGE_IMAGES),
    images: allHomepageImages,
    uploadCandidates: results.actualHomepageImages,
    missingImages: results.missingImages,
    summary: {
      totalFound: results.totalFound,
      totalMissing: results.totalMissing,
      totalExpected: results.totalFound + results.totalMissing
    }
  };
  
  fs.writeFileSync('actual-homepage-images.json', JSON.stringify(analysisResults, null, 2));
  console.log('\\n💾 Results saved to: actual-homepage-images.json');
  
  return analysisResults;
}

// Run analysis
analyzeActualHomepageImages();
