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

async function uploadRealHomepageImages() {
  try {
    console.log('🎯 REAL Homepage Images Upload - Code-Based Analysis');
    console.log('=' .repeat(70));
    
    // Load the actual homepage images analysis
    const analysisData = JSON.parse(fs.readFileSync('actual-homepage-images.json', 'utf8'));
    const actualHomepageImages = analysisData.uploadCandidates;
    
    console.log(`📋 Found ${actualHomepageImages.length} actual homepage images from code analysis`);
    
    // Check existing images in Sanity
    const existingImages = await client.fetch(`*[_type == "homepageImage"]{
      _id, title, originalFilename
    }`);
    
    const existingFilenames = existingImages.map(img => img.originalFilename).filter(Boolean);
    console.log(`📦 Found ${existingImages.length} existing homepage images in Sanity`);
    
    // Filter to get only missing images
    const missingImages = actualHomepageImages.filter(img => 
      !existingFilenames.includes(img.filename)
    );
    
    console.log(`📤 Need to upload: ${missingImages.length} missing images`);
    console.log(`✅ Already exist: ${actualHomepageImages.length - missingImages.length} images`);
    
    if (missingImages.length === 0) {
      console.log('\\n🎉 All actual homepage images are already in Sanity!');
      return;
    }
    
    console.log('\\n🚀 Starting upload of missing images...');
    
    let successCount = 0;
    let errorCount = 0;
    const processedImages = [];
    
    // Group by section
    const imagesBySection = {};
    missingImages.forEach(img => {
      if (!imagesBySection[img.section]) imagesBySection[img.section] = [];
      imagesBySection[img.section].push(img);
    });
    
    // Upload by section
    for (const [section, images] of Object.entries(imagesBySection)) {
      console.log(`\\n📁 Processing ${section.toUpperCase()} section (${images.length} images)`);
      console.log('─'.repeat(50));
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const title = generateImageTitle(img);
        
        console.log(`🔄 [${i + 1}/${images.length}] ${title}`);
        console.log(`   📍 ${img.filename}`);
        
        try {
          // Upload image asset
          const uploadedAsset = await uploadImageFile(img.fullPath, img.filename);
          
          if (!uploadedAsset) {
            console.log(`   ❌ Upload failed`);
            errorCount++;
            continue;
          }
          
          console.log(`   ✅ Asset: ${uploadedAsset._id}`);
          
          // Create homepage image document
          const homepageImageDoc = createHomepageImageDocument(img, uploadedAsset, title, i + 1);
          
          const result = await client.create(homepageImageDoc);
          console.log(`   ✅ Document: ${result._id}`);
          
          processedImages.push({
            section: img.section,
            filename: img.filename,
            title: title,
            documentId: result._id,
            assetId: uploadedAsset._id
          });
          
          successCount++;
          
        } catch (error) {
          console.error(`   ❌ Error: ${error.message}`);
          errorCount++;
          continue;
        }
        
        // Small delay to avoid overwhelming the server
        if (i < images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }
    
    console.log('\\n🎉 Upload completed!');
    
    // Final summary
    console.log(`\\n📊 Final Results:`);
    console.log(`✅ Successfully uploaded: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📈 Total processed: ${successCount + errorCount}`);
    console.log(`📋 Already existed: ${actualHomepageImages.length - missingImages.length}`);
    
    // Check final totals
    const totalNowInSanity = await client.fetch(`count(*[_type == "homepageImage"])`);
    console.log(`\\n📊 Total Homepage Images in Sanity: ${totalNowInSanity}`);
    
    return processedImages;
    
  } catch (error) {
    console.error('❌ Error during upload:', error);
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

function generateImageTitle(imageInfo) {
  const filename = imageInfo.filename.replace(/\\.(jpg|jpeg|png|svg|webp)$/i, '');
  
  // Clean up filename for title
  let title = filename
    .replace(/[-_]/g, ' ')
    .replace(/\\b\\w/g, l => l.toUpperCase());
  
  // Section-specific prefixes
  const sectionPrefixes = {
    hero: 'Hero',
    brand: 'Brand',
    service: 'Service',
    project: 'Portfolio',
    award: 'Award',
    footer: 'Footer'
  };
  
  const prefix = sectionPrefixes[imageInfo.section] || 'Homepage';
  
  if (!title.toLowerCase().includes(prefix.toLowerCase())) {
    title = `${prefix} ${title}`;
  }
  
  return title;
}

function generateDescription(section, filename) {
  const descriptions = {
    hero: 'Hero section element',
    brand: 'Brand logo in brand slider',
    service: 'Service offering icon',
    project: 'Portfolio showcase image',
    award: 'Award badge or recognition',
    footer: 'Footer decoration element'
  };
  
  return descriptions[section] || 'Homepage content element';
}

function mapSectionToSanityCategory(section) {
  const categoryMap = {
    hero: 'hero',
    brand: 'gallery', // Brand showcase goes in gallery
    service: 'services',
    project: 'gallery',
    award: 'testimonials', // Awards go with testimonials
    footer: 'other'
  };
  
  return categoryMap[section] || 'other';
}

function createHomepageImageDocument(imageInfo, uploadedAsset, title, displayOrder) {
  const sanityCategory = mapSectionToSanityCategory(imageInfo.section);
  const description = generateDescription(imageInfo.section, imageInfo.filename);
  
  // Create imageWithAlt object
  const imageWithAlt = {
    _type: 'imageWithAlt',
    _key: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: uploadedAsset._id
      }
    },
    alt: `${title} - ${description}`,
    caption: description
  };
  
  return {
    _type: 'homepageImage',
    title: title,
    slug: {
      _type: 'slug',
      current: generateSlug(`${imageInfo.section}-${title}`)
    },
    image: [imageWithAlt],
    category: sanityCategory,
    placement: `${imageInfo.section} section ${displayOrder}`,
    displayOrder: displayOrder,
    isActive: true,
    deviceVisibility: ['desktop', 'tablet', 'mobile'],
    dimensions: getImageDimensions(imageInfo.section),
    originalFilename: imageInfo.filename,
    usage: 'content',
    notes: `${description} (Section: ${imageInfo.section})`,
    lastUpdated: new Date().toISOString()
  };
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getImageDimensions(section) {
  const dimensionMap = {
    hero: { width: 800, height: 600, aspectRatio: '4:3' },
    brand: { width: 200, height: 100, aspectRatio: '2:1' },
    service: { width: 100, height: 100, aspectRatio: '1:1' },
    project: { width: 400, height: 300, aspectRatio: '4:3' },
    award: { width: 150, height: 150, aspectRatio: '1:1' },
    footer: { width: 100, height: 100, aspectRatio: '1:1' }
  };
  
  return dimensionMap[section] || { width: 400, height: 300, aspectRatio: '4:3' };
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

console.log('🚀 REAL Homepage Images Upload - Based on Component Analysis');
uploadRealHomepageImages();
