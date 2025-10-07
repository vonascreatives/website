const {createClient} = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function loadAnalysisData() {
  try {
    const analysisData = JSON.parse(fs.readFileSync('image-analysis.json', 'utf8'));
    return analysisData.recommendedForUpload;
  } catch (error) {
    console.error('❌ Error loading analysis data:', error);
    return null;
  }
}

async function checkExistingImages() {
  try {
    const existingImages = await client.fetch(`*[_type == "homepageImage"]{
      _id, title, originalFilename
    }`);
    
    return existingImages.map(img => img.originalFilename).filter(Boolean);
  } catch (error) {
    console.error('❌ Error checking existing images:', error);
    return [];
  }
}

async function uploadImageFile(filePath, filename) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`   ⚠️ File not found: ${filePath}`);
      return null;
    }

    const buffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(filename).toLowerCase();
    
    let contentType = 'image/jpeg';
    if (fileExtension === '.png') contentType = 'image/png';
    if (fileExtension === '.svg') contentType = 'image/svg+xml';
    if (fileExtension === '.webp') contentType = 'image/webp';

    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
      contentType: contentType,
    });

    return asset;
  } catch (error) {
    console.error(`   ❌ Upload error for ${filename}:`, error.message);
    return null;
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateImageTitle(imageInfo) {
  const category = imageInfo.category;
  const filename = imageInfo.filename.replace(/\.(jpg|jpeg|png|svg|webp)$/i, '');
  
  // Clean up filename for title
  let title = filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  // Add category prefix for clarity
  const categoryPrefixes = {
    hero: 'Hero',
    about: 'About',
    team: 'Team',
    portfolio: 'Portfolio',
    services: 'Service',
    gallery: 'Gallery',
    testimonials: 'Award',
    blog: 'Blog',
    banner: 'Banner'
  };
  
  const prefix = categoryPrefixes[category] || category;
  
  if (!title.toLowerCase().includes(prefix.toLowerCase())) {
    title = `${prefix} ${title}`;
  }
  
  return title;
}

function generateDescription(imageInfo) {
  const descriptions = {
    hero: 'Hero section image for homepage',
    about: 'About section content image',
    team: 'Team member photo or related image',
    portfolio: 'Portfolio project showcase image',
    services: 'Service offering icon or image',
    gallery: 'Gallery or brand showcase image',
    testimonials: 'Testimonial, award or achievement image',
    blog: 'Blog section featured image',
    banner: 'Call-to-action or banner image'
  };
  
  return descriptions[imageInfo.category] || `${imageInfo.category} section image`;
}

function getImageDimensions(imageInfo) {
  // Estimated dimensions based on category and typical usage
  const dimensionMap = {
    hero: { width: 1920, height: 1080, aspectRatio: '16:9' },
    about: { width: 600, height: 400, aspectRatio: '3:2' },
    team: { width: 300, height: 400, aspectRatio: '3:4' },
    portfolio: { width: 600, height: 400, aspectRatio: '3:2' },
    services: { width: 100, height: 100, aspectRatio: '1:1' },
    gallery: { width: 200, height: 150, aspectRatio: '4:3' },
    testimonials: { width: 150, height: 150, aspectRatio: '1:1' },
    blog: { width: 400, height: 300, aspectRatio: '4:3' },
    banner: { width: 800, height: 400, aspectRatio: '2:1' }
  };
  
  return dimensionMap[imageInfo.category] || { width: 400, height: 300, aspectRatio: '4:3' };
}

async function uploadAllHomepageImages() {
  try {
    console.log('🖼️ Starting comprehensive homepage image upload...');
    
    // Load analysis data
    const recommendedImages = await loadAnalysisData();
    if (!recommendedImages) {
      console.log('❌ Could not load image analysis data. Please run analyze-all-images.js first.');
      return;
    }
    
    console.log(`📊 Found ${recommendedImages.length} images recommended for upload`);
    
    // Check existing images to avoid duplicates
    const existingFilenames = await checkExistingImages();
    console.log(`📋 Found ${existingFilenames.length} existing images in Sanity`);
    
    // Filter out already uploaded images
    const imagesToUpload = recommendedImages.filter(img => 
      !existingFilenames.includes(img.filename)
    );
    
    console.log(`🚀 Uploading ${imagesToUpload.length} new images\n`);
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    const processedImages = [];
    
    // Group by category for organized upload
    const categories = {};
    imagesToUpload.forEach(img => {
      if (!categories[img.category]) categories[img.category] = [];
      categories[img.category].push(img);
    });
    
    for (const [category, images] of Object.entries(categories)) {
      console.log(`\n📁 Processing ${category.toUpperCase()} category (${images.length} images)`);\n      console.log('=' .repeat(60));\n      \n      for (let i = 0; i < images.length; i++) {\n        const imageInfo = images[i];\n        const title = generateImageTitle(imageInfo);\n        \n        console.log(`📝 [${i + 1}/${images.length}] ${title}`);\n        console.log(`   📍 File: ${imageInfo.filename}`);\n        console.log(`   📂 Path: ${imageInfo.relativePath}`);\n        \n        try {\n          // Upload image to Sanity\n          console.log(`   🔄 Uploading...`);\n          const uploadedAsset = await uploadImageFile(imageInfo.fullPath, imageInfo.filename);\n          \n          if (!uploadedAsset) {\n            console.log(`   ❌ Failed to upload`);\n            errorCount++;\n            continue;\n          }\n          \n          console.log(`   ✅ Asset uploaded: ${uploadedAsset._id}`);\n          \n          // Create imageWithAlt object\n          const imageWithAlt = {\n            _type: 'imageWithAlt',\n            _key: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,\n            image: {\n              _type: 'image',\n              asset: {\n                _type: 'reference',\n                _ref: uploadedAsset._id\n              }\n            },\n            alt: `${title} - ${generateDescription(imageInfo)}`,\n            caption: generateDescription(imageInfo)\n          };\n          \n          // Create homepage image document\n          const displayOrder = i + 1;\n          const homepageImageDoc = {\n            _type: 'homepageImage',\n            title: title,\n            slug: {\n              _type: 'slug',\n              current: generateSlug(title)\n            },\n            image: [imageWithAlt],\n            category: imageInfo.category,\n            placement: `${imageInfo.category} ${displayOrder}`,\n            displayOrder: displayOrder,\n            isActive: true,\n            deviceVisibility: ['desktop', 'tablet', 'mobile'],\n            dimensions: getImageDimensions(imageInfo),\n            originalFilename: imageInfo.filename,\n            usage: 'content',\n            notes: generateDescription(imageInfo),\n            lastUpdated: new Date().toISOString()\n          };\n          \n          // Save to Sanity\n          const result = await client.create(homepageImageDoc);\n          console.log(`   ✅ Document created: ${result._id}`);\n          \n          processedImages.push({\n            title: title,\n            category: imageInfo.category,\n            documentId: result._id,\n            assetId: uploadedAsset._id,\n            filename: imageInfo.filename\n          });\n          \n          successCount++;\n          \n        } catch (error) {\n          console.error(`   ❌ Error: ${error.message}`);\n          errorCount++;\n          continue;\n        }\n        \n        // Small delay to avoid overwhelming the server\n        if (i < images.length - 1) {\n          await new Promise(resolve => setTimeout(resolve, 500));\n        }\n      }\n    }\n    \n    console.log('\\n🎉 Comprehensive homepage image upload completed!');\n    \n    // Final summary\n    const finalCategories = {};\n    processedImages.forEach(img => {\n      if (!finalCategories[img.category]) finalCategories[img.category] = [];\n      finalCategories[img.category].push(img);\n    });\n    \n    console.log('\\n📊 Upload Summary by Category:');\n    console.log('=' .repeat(50));\n    Object.entries(finalCategories).forEach(([category, images]) => {\n      console.log(`📁 ${category.charAt(0).toUpperCase() + category.slice(1)}: ${images.length} images uploaded`);\n    });\n    \n    console.log(`\\n🎯 Final Results:`);\n    console.log(`✅ Successfully uploaded: ${successCount}`);\n    console.log(`❌ Failed: ${errorCount}`);\n    console.log(`📈 Total processed: ${successCount + errorCount}`);\n    console.log(`📋 Already existed: ${existingFilenames.length}`);\n    \n    // Check final totals\n    const totalNowInSanity = await client.fetch(`count(*[_type == \"homepageImage\"])`);\n    console.log(`\\n📊 Total Homepage Images in Sanity: ${totalNowInSanity}`);\n    \n    return processedImages;\n    \n  } catch (error) {\n    console.error('❌ Error during comprehensive upload:', error);\n  }\n}\n\n// Check environment variables\nif (!process.env.SANITY_API_TOKEN) {\n  console.error('❌ SANITY_API_TOKEN environment variable is required');\n  process.exit(1);\n}\n\nconsole.log('🚀 Starting Comprehensive Homepage Image Upload to Sanity CMS');\nconsole.log('=' .repeat(70));\nuploadAllHomepageImages();"
