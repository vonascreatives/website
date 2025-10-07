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

async function loadRefinedAnalysis() {
  try {
    const analysisData = JSON.parse(fs.readFileSync('refined-homepage-analysis.json', 'utf8'));
    return analysisData.uploadCandidates;
  } catch (error) {
    console.error('❌ Error loading refined analysis data:', error);
    console.log('💡 Please run analyze-actual-homepage-usage.js first');
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
  const filename = imageInfo.filename.replace(/\.(jpg|jpeg|png|svg|webp)$/i, '');
  
  // Clean up filename for title
  let title = filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  // Category-specific prefixes
  const categoryPrefixes = {
    hero_backgrounds: 'Hero',
    about_decorative: 'About',
    service_icons: 'Service',
    brand_showcase: 'Brand',
    awards_badges: 'Award',
    testimonial_graphics: 'Testimonial',
    cta_banners: 'CTA',
    gallery_preview: 'Gallery',
    mission_values: 'Mission',
    decorative_elements: 'Decorative',
    social_feed: 'Social',
    company_branding: 'Logo'
  };
  
  const prefix = categoryPrefixes[imageInfo.category] || 'Homepage';
  
  if (!title.toLowerCase().includes(prefix.toLowerCase())) {
    title = `${prefix} ${title}`;
  }
  
  return title;
}

function generateDescription(imageInfo) {
  const descriptions = {
    hero_backgrounds: 'Hero section background or decorative element',
    about_decorative: 'About section standalone decorative image',
    service_icons: 'Service offering icon or graphic',
    brand_showcase: 'Partner brand or client logo showcase',
    awards_badges: 'Award badge or achievement recognition',
    testimonial_graphics: 'Testimonial section graphic element',
    cta_banners: 'Call-to-action banner or promotional image',
    gallery_preview: 'Gallery preview or portfolio showcase',
    mission_values: 'Mission or company values image',
    decorative_elements: 'Homepage decorative design element',
    social_feed: 'Social media feed image for homepage',
    company_branding: 'Company logo or main branding asset'
  };
  
  return descriptions[imageInfo.category] || 'Homepage content image';
}

function mapCategoryToSanityCategory(internalCategory) {
  const categoryMap = {
    hero_backgrounds: 'hero',
    about_decorative: 'about',
    service_icons: 'services',
    brand_showcase: 'gallery',
    awards_badges: 'testimonials',
    testimonial_graphics: 'testimonials',
    cta_banners: 'banner',
    gallery_preview: 'gallery',
    mission_values: 'about',
    decorative_elements: 'other',
    social_feed: 'gallery',
    company_branding: 'branding'
  };
  
  return categoryMap[internalCategory] || 'other';
}

function getImageDimensions(imageInfo) {
  const dimensionMap = {
    hero_backgrounds: { width: 1920, height: 1080, aspectRatio: '16:9' },
    about_decorative: { width: 600, height: 400, aspectRatio: '3:2' },
    service_icons: { width: 100, height: 100, aspectRatio: '1:1' },
    brand_showcase: { width: 200, height: 100, aspectRatio: '2:1' },
    awards_badges: { width: 150, height: 150, aspectRatio: '1:1' },
    testimonial_graphics: { width: 100, height: 100, aspectRatio: '1:1' },
    cta_banners: { width: 800, height: 400, aspectRatio: '2:1' },
    gallery_preview: { width: 400, height: 300, aspectRatio: '4:3' },
    mission_values: { width: 500, height: 400, aspectRatio: '5:4' },
    decorative_elements: { width: 300, height: 300, aspectRatio: '1:1' },
    social_feed: { width: 300, height: 300, aspectRatio: '1:1' },
    company_branding: { width: 200, height: 80, aspectRatio: '5:2' }
  };
  
  return dimensionMap[imageInfo.category] || { width: 400, height: 300, aspectRatio: '4:3' };
}

async function uploadFocusedHomepageImages() {
  try {
    console.log('🎯 Starting FOCUSED homepage image upload (no CMS duplication)...');
    console.log('=' .repeat(70));
    
    // Load refined analysis data
    const uploadCandidates = await loadRefinedAnalysis();
    if (!uploadCandidates) {
      return;
    }
    
    console.log(`📊 Found ${uploadCandidates.length} focused upload candidates`);
    
    // Check existing images to avoid duplicates
    const existingFilenames = await checkExistingImages();
    console.log(`📋 Found ${existingFilenames.length} existing images in Sanity`);
    
    // Filter out already uploaded images
    const imagesToUpload = uploadCandidates.filter(img => 
      !existingFilenames.includes(img.filename)
    );
    
    console.log(`🚀 Uploading ${imagesToUpload.length} new images\n`);
    
    let successCount = 0;
    let errorCount = 0;
    const processedImages = [];
    
    // Group by category for organized upload
    const categories = {};
    imagesToUpload.forEach(img => {
      if (!categories[img.category]) categories[img.category] = [];
      categories[img.category].push(img);
    });
    
    for (const [internalCategory, images] of Object.entries(categories)) {
      console.log(`\n📁 Processing ${internalCategory.toUpperCase().replace(/_/g, ' ')} (${images.length} images)`);
      console.log('─'.repeat(60));
      
      for (let i = 0; i < images.length; i++) {
        const imageInfo = images[i];
        const title = generateImageTitle(imageInfo);
        const priority = imageInfo.priority === 'high' ? '🔥' : '🟡';
        
        console.log(`${priority} [${i + 1}/${images.length}] ${title}`);
        console.log(`   📍 ${imageInfo.filename}`);
        
        try {
          // Upload image to Sanity
          const uploadedAsset = await uploadImageFile(imageInfo.fullPath, imageInfo.filename);
          
          if (!uploadedAsset) {
            console.log(`   ❌ Upload failed`);
            errorCount++;
            continue;
          }
          
          console.log(`   ✅ Asset: ${uploadedAsset._id}`);
          
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
            alt: `${title} - ${generateDescription(imageInfo)}`,
            caption: generateDescription(imageInfo)
          };
          
          // Create homepage image document
          const displayOrder = i + 1;
          const sanityCategory = mapCategoryToSanityCategory(internalCategory);
          
          const homepageImageDoc = {
            _type: 'homepageImage',
            title: title,
            slug: {
              _type: 'slug',
              current: generateSlug(`${sanityCategory}-${title}`)
            },
            image: [imageWithAlt],
            category: sanityCategory,
            placement: `${internalCategory.replace(/_/g, ' ')} ${displayOrder}`,
            displayOrder: displayOrder,
            isActive: true,
            deviceVisibility: ['desktop', 'tablet', 'mobile'],
            dimensions: getImageDimensions(imageInfo),
            originalFilename: imageInfo.filename,
            usage: 'content',
            notes: `${generateDescription(imageInfo)} (Priority: ${imageInfo.priority})`,
            lastUpdated: new Date().toISOString()
          };
          
          // Save to Sanity
          const result = await client.create(homepageImageDoc);
          console.log(`   ✅ Document: ${result._id}`);
          
          processedImages.push({
            title: title,
            category: sanityCategory,
            internalCategory: internalCategory,
            documentId: result._id,
            assetId: uploadedAsset._id,
            filename: imageInfo.filename,
            priority: imageInfo.priority
          });
          
          successCount++;
          
        } catch (error) {
          console.error(`   ❌ Error: ${error.message}`);
          errorCount++;
          continue;
        }
        
        // Small delay to avoid overwhelming the server
        if (i < images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
    
    console.log('\n🎉 Focused homepage image upload completed!\n');
    
    // Final summary by Sanity category
    const finalCategories = {};
    processedImages.forEach(img => {
      if (!finalCategories[img.category]) finalCategories[img.category] = [];
      finalCategories[img.category].push(img);
    });
    
    console.log('📊 Upload Summary by Sanity Category:');
    console.log('=' .repeat(50));
    Object.entries(finalCategories).forEach(([category, images]) => {
      const highPriority = images.filter(img => img.priority === 'high').length;
      const mediumPriority = images.filter(img => img.priority === 'medium').length;
      console.log(`📁 ${category.charAt(0).toUpperCase() + category.slice(1)}: ${images.length} images (🔥${highPriority} + 🟡${mediumPriority})`);
    });
    
    console.log(`\n🎯 Final Results:`);
    console.log(`✅ Successfully uploaded: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📈 Total processed: ${successCount + errorCount}`);
    console.log(`📋 Already existed: ${existingFilenames.length}`);
    
    // Check final totals
    const totalNowInSanity = await client.fetch(`count(*[_type == "homepageImage"])`);
    console.log(`\n📊 Total Homepage Images in Sanity: ${totalNowInSanity}`);
    
    return processedImages;
    
  } catch (error) {
    console.error('❌ Error during focused upload:', error);
  }
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

console.log('🚀 FOCUSED Homepage Image Upload - No CMS Duplication');
uploadFocusedHomepageImages();
