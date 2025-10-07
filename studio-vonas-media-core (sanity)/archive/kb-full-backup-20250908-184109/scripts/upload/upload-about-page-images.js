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

async function uploadAboutPageImages() {
  try {
    console.log('📋 ABOUT PAGE Images Upload');
    console.log('=' .repeat(50));
    
    // Load the about page images analysis
    const analysisData = JSON.parse(fs.readFileSync('about-page-images.json', 'utf8'));
    const aboutPageImages = analysisData.uploadCandidates;
    
    console.log(`📋 Found ${aboutPageImages.length} About page images from analysis`);
    
    // Check existing images in Sanity
    const existingImages = await client.fetch(`*[_type == "homepageImage"]{
      _id, title, originalFilename
    }`);
    
    const existingFilenames = existingImages.map(img => img.originalFilename).filter(Boolean);
    console.log(`📦 Found ${existingImages.length} existing homepage images in Sanity`);
    
    // Filter to get only missing images
    const missingImages = aboutPageImages.filter(img => 
      !existingFilenames.includes(img.filename)
    );
    
    console.log(`📤 Need to upload: ${missingImages.length} missing About page images`);
    console.log(`✅ Already exist: ${aboutPageImages.length - missingImages.length} images`);
    
    if (missingImages.length === 0) {
      console.log('\\n🎉 All About page images are already in Sanity!');
      return;
    }
    
    console.log('\\n🚀 Starting upload of missing About page images...');
    
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
      console.log(`\\n📁 Processing ABOUT ${section.toUpperCase()} section (${images.length} images)`);
      console.log('─'.repeat(60));
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const title = generateImageTitle(img);
        
        console.log(`🔄 [${i + 1}/${images.length}] ${title}`);
        console.log(`   📍 ${img.filename}`);
        console.log(`   🗂️  Section: ${img.section}`);
        
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
          const homepageImageDoc = createAboutPageImageDocument(img, uploadedAsset, title, i + 1);
          
          const result = await client.create(homepageImageDoc);
          console.log(`   ✅ Document: ${result._id}`);
          
          processedImages.push({
            section: img.section,
            filename: img.filename,
            title: title,
            documentId: result._id,
            assetId: uploadedAsset._id,
            page: 'about'
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
    
    console.log('\\n🎉 About page image upload completed!');
    
    // Final summary
    console.log(`\\n📊 Final Results:`);
    console.log(`✅ Successfully uploaded: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📈 Total processed: ${successCount + errorCount}`);
    console.log(`📋 Already existed: ${aboutPageImages.length - missingImages.length}`);
    
    // Check final totals
    const totalNowInSanity = await client.fetch(`count(*[_type == "homepageImage"])`);
    console.log(`\\n📊 Total Images in Sanity: ${totalNowInSanity}`);
    
    return processedImages;
    
  } catch (error) {
    console.error('❌ Error during About page upload:', error);
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
  
  // Section-specific prefixes for About page
  const sectionPrefixes = {
    hero: 'About Hero',
    about: 'About',
    brand: 'About Brand'
  };
  
  const prefix = sectionPrefixes[imageInfo.section] || 'About';
  
  if (!title.toLowerCase().includes('about')) {
    title = `${prefix} ${title}`;
  }
  
  return title;
}

function generateDescription(section, filename) {
  const descriptions = {
    hero: 'About page hero background image',
    about: 'About page content image',
    brand: 'About page brand/client logo'
  };
  
  return descriptions[section] || 'About page image';
}

function mapAboutSectionToSanityCategory(section) {
  const categoryMap = {
    hero: 'Hero Section',
    about: 'Gallery Section', 
    brand: 'Brand Section'
  };
  
  return categoryMap[section] || 'Other';
}

function createAboutPageImageDocument(imageInfo, uploadedAsset, title, displayOrder) {
  const sanityCategory = mapAboutSectionToSanityCategory(imageInfo.section);
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
      current: generateSlug(`about-${imageInfo.section}-${title}`)
    },
    image: [imageWithAlt],
    category: sanityCategory,
    page: 'About Us', // Use new page field
    folder: 'About Us/images', // Auto-generated folder path
    placement: `About page ${imageInfo.section} section ${displayOrder}`,
    displayOrder: displayOrder,
    isActive: true,
    deviceVisibility: ['desktop', 'tablet', 'mobile'],
    dimensions: getImageDimensions(imageInfo.section),
    originalPath: `assets/img/${imageInfo.relativePath}`,
    priority: imageInfo.section === 'hero' ? 'High' : 'Medium',
    usage: 'content',
    notes: `${description} (Page: About Us, Section: ${imageInfo.section})`,
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
    hero: { width: 1920, height: 1080, aspectRatio: '16:9' },
    about: { width: 600, height: 400, aspectRatio: '3:2' },
    brand: { width: 200, height: 100, aspectRatio: '2:1' }
  };
  
  return dimensionMap[section] || { width: 400, height: 300, aspectRatio: '4:3' };
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

console.log('🚀 About Page Images Upload');
uploadAboutPageImages();
