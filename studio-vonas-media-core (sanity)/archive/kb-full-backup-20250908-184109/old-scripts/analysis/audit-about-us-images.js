const {createClient} = require('@sanity/client');
const fs = require('fs');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function auditAboutUsImages() {
  try {
    console.log('🔍 COMPLETE AUDIT: About Us Images in Sanity');
    console.log('=' .repeat(70));
    
    // Get all About Us images currently in Sanity
    const currentAboutImages = await client.fetch(`*[_type == "homepageImage" && page == "About Us"]{
      _id, 
      title, 
      category,
      page,
      folder,
      displayOrder,
      originalFilename,
      originalPath,
      placement,
      notes,
      isActive,
      "imageUrl": image[0].image.asset->url,
      "alt": image[0].alt
    } | order(category asc, displayOrder asc)`);
    
    console.log(`📋 Current About Us images in Sanity: ${currentAboutImages.length}`);
    
    // Load the original audit to compare
    const expectedImages = JSON.parse(fs.readFileSync('about-page-images.json', 'utf8'));
    console.log(`📋 Expected About Us images from audit: ${expectedImages.images.length}`);
    
    console.log('\n📊 CURRENT STATE:');
    console.log('─'.repeat(50));
    
    const byCategory = {};
    currentAboutImages.forEach(img => {
      const cat = img.category || 'No Category';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(img);
    });
    
    Object.entries(byCategory).forEach(([category, images]) => {
      console.log(`\n📁 ${category} (${images.length}):`);
      images.forEach(img => {
        const status = img.isActive ? '🟢' : '🔴';
        console.log(`   ${status} ${img.title}`);
        console.log(`      📄 File: ${img.originalFilename || 'N/A'}`);
        console.log(`      🗂️  Folder: ${img.folder}`);
        console.log(`      📋 Order: ${img.displayOrder}`);
        console.log(`      🔗 URL: ${img.imageUrl ? '✅' : '❌'}`);
      });
    });
    
    console.log('\n📋 EXPECTED IMAGES FROM AUDIT:');
    console.log('─'.repeat(50));
    
    const expectedBySection = {};
    expectedImages.images.forEach(img => {
      if (!expectedBySection[img.section]) expectedBySection[img.section] = [];
      expectedBySection[img.section].push(img);
    });
    
    Object.entries(expectedBySection).forEach(([section, images]) => {
      console.log(`\n📁 ${section} section (${images.length}):`);
      images.forEach(img => {
        const exists = img.exists ? '✅' : '❌';
        console.log(`   ${exists} ${img.filename} (${img.relativePath})`);
      });
    });
    
    console.log('\n🔍 ANALYSIS:');
    console.log('─'.repeat(50));
    
    // Check which expected images are missing
    const expectedFilenames = expectedImages.images.map(img => img.filename);
    const currentFilenames = currentAboutImages.map(img => img.originalFilename).filter(Boolean);
    
    const missingFiles = expectedFilenames.filter(filename => !currentFilenames.includes(filename));
    const extraFiles = currentFilenames.filter(filename => !expectedFilenames.includes(filename));
    
    console.log(`❌ Missing expected files: ${missingFiles.length}`);
    missingFiles.forEach(file => console.log(`   - ${file}`));
    
    console.log(`⚠️  Extra unexpected files: ${extraFiles.length}`);
    extraFiles.forEach(file => console.log(`   - ${file}`));
    
    // Check for duplicates
    const filenameCounts = {};
    currentAboutImages.forEach(img => {
      const filename = img.originalFilename;
      if (filename) {
        filenameCounts[filename] = (filenameCounts[filename] || 0) + 1;
      }
    });
    
    const duplicates = Object.entries(filenameCounts).filter(([filename, count]) => count > 1);
    console.log(`🔄 Duplicate files: ${duplicates.length}`);
    duplicates.forEach(([filename, count]) => console.log(`   - ${filename} (${count} copies)`));
    
    console.log('\n💡 CLEANUP RECOMMENDATIONS:');
    console.log('─'.repeat(50));
    
    if (missingFiles.length > 0) {
      console.log('1. Upload missing images from original analysis');
    }
    
    if (extraFiles.length > 0) {
      console.log('2. Remove or relocate extra images that don\'t belong to About page');
    }
    
    if (duplicates.length > 0) {
      console.log('3. Remove duplicate images');
    }
    
    return {
      current: currentAboutImages,
      expected: expectedImages.images,
      missing: missingFiles,
      extra: extraFiles,
      duplicates: duplicates
    };
    
  } catch (error) {
    console.error('❌ Error during audit:', error);
  }
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

auditAboutUsImages();
