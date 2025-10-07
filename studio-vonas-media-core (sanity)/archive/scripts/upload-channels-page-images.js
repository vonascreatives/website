const {createClient} = require('@sanity/client');
const fs = require('fs').promises;
const path = require('path');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

// All Channels page static decorative images from CHANNELS-PAGE-ALL-IMAGES.md
const channelImages = [
  // Hero Panel (StudioPanelOne) - 6 Static Images
  {
    category: 'channels-hero',
    placement: 'channels-hero-bg-1',
    title: 'Channels Hero Background Image 1',
    originalFilename: 'img-1.jpg',
    relativePath: '/assets/img/home-08/hero/img-1.jpg',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-1.jpg',
    usage: 'Hero decorative background image for Channels page',
    displayOrder: 1,
    componentImport: 'import hero_1 from "@/assets/img/home-08/hero/img-1.jpg";'
  },
  {
    category: 'channels-hero',
    placement: 'channels-hero-bg-2',
    title: 'Channels Hero Background Image 2',
    originalFilename: 'img-2.jpg',
    relativePath: '/assets/img/home-08/hero/img-2.jpg',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-2.jpg',
    usage: 'Hero decorative background image for Channels page',
    displayOrder: 2,
    componentImport: 'import hero_2 from "@/assets/img/home-08/hero/img-2.jpg";'
  },
  {
    category: 'channels-hero',
    placement: 'channels-hero-shape',
    title: 'Channels Hero Shape Decoration',
    originalFilename: 'shape-1.png',
    relativePath: '/assets/img/home-08/hero/shape-1.png',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/shape-1.png',
    usage: 'Shape decoration element for hero and portfolio sections',
    displayOrder: 3,
    componentImport: 'import shape from "@/assets/img/home-08/hero/shape-1.png";',
    notes: 'REUSED in StudioPanelThree (Portfolio section)'
  },
  {
    category: 'channels-hero',
    placement: 'channels-hero-thumb-1',
    title: 'Channels Hero Thumbnail 1',
    originalFilename: 'img-3.jpg',
    relativePath: '/assets/img/home-08/hero/img-3.jpg',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-3.jpg',
    usage: 'Right side thumbnail decoration in hero',
    displayOrder: 4,
    componentImport: 'import hero_thumb_1 from "@/assets/img/home-08/hero/img-3.jpg";'
  },
  {
    category: 'channels-hero',
    placement: 'channels-hero-thumb-2',
    title: 'Channels Hero Thumbnail 2',
    originalFilename: 'img-4.jpg',
    relativePath: '/assets/img/home-08/hero/img-4.jpg',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-4.jpg',
    usage: 'Right side thumbnail decoration in hero',
    displayOrder: 5,
    componentImport: 'import hero_thumb_2 from "@/assets/img/home-08/hero/img-4.jpg";'
  },
  {
    category: 'channels-hero',
    placement: 'channels-hero-thumb-3',
    title: 'Channels Hero Thumbnail 3',
    originalFilename: 'img-5.jpg',
    relativePath: '/assets/img/home-08/hero/img-5.jpg',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-5.jpg',
    usage: 'Right side thumbnail decoration in hero',
    displayOrder: 6,
    componentImport: 'import hero_thumb_3 from "@/assets/img/home-08/hero/img-5.jpg";'
  },
  {
    category: 'channels-hero',
    placement: 'channels-hero-thumb-4',
    title: 'Channels Hero Thumbnail 4',
    originalFilename: 'img-6.jpg',
    relativePath: '/assets/img/home-08/hero/img-6.jpg',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-6.jpg',
    usage: 'Right side thumbnail decoration in hero',
    displayOrder: 7,
    componentImport: 'import hero_thumb_4 from "@/assets/img/home-08/hero/img-6.jpg";'
  },

  // Services Panel (StudioPanelTwo) - 3 Images
  {
    category: 'channels-services',
    placement: 'channels-service-icon-1',
    title: 'Channels Service Icon 1',
    originalFilename: 'sv-icon-1.png',
    relativePath: '/assets/img/home-08/service/sv-icon-1.png',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/service/sv-icon-1.png',
    usage: 'Service icon decoration in services section',
    displayOrder: 1,
    componentImport: 'import s_icon_1 from "@/assets/img/home-08/service/sv-icon-1.png";'
  },
  {
    category: 'channels-services',
    placement: 'channels-service-icon-2',
    title: 'Channels Service Icon 2',
    originalFilename: 'sv-icon-2.png',
    relativePath: '/assets/img/home-08/service/sv-icon-2.png',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/service/sv-icon-2.png',
    usage: 'Service icon decoration in services section',
    displayOrder: 2,
    componentImport: 'import s_icon_2 from "@/assets/img/home-08/service/sv-icon-2.png";'
  },
  {
    category: 'channels-services',
    placement: 'channels-service-icon-3',
    title: 'Channels Service Icon 3',
    originalFilename: 'sv-icon-3.png',
    relativePath: '/assets/img/home-08/service/sv-icon-3.png',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/service/sv-icon-3.png',
    usage: 'Service icon decoration in services section',
    displayOrder: 3,
    componentImport: 'import s_icon_3 from "@/assets/img/home-08/service/sv-icon-3.png";'
  },

  // Testimonials Panel (StudioPanelFour) - 2 Images
  {
    category: 'channels-testimonials',
    placement: 'channels-testimonial-shape',
    title: 'Channels Testimonial Shape',
    originalFilename: 'test-1.png',
    relativePath: '/assets/img/home-08/testimonial/test-1.png',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/testimonial/test-1.png',
    usage: 'Testimonial decoration shape',
    displayOrder: 1,
    componentImport: 'import shape from "@/assets/img/home-08/testimonial/test-1.png";'
  },
  {
    category: 'channels-testimonials',
    placement: 'channels-testimonial-logo',
    title: 'Channels Testimonial Company Logo',
    originalFilename: 'test-logo-1.png',
    relativePath: '/assets/img/home-08/testimonial/test-logo-1.png',
    absolutePath: '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/testimonial/test-logo-1.png',
    usage: 'Testimonial company logo',
    displayOrder: 2,
    componentImport: 'import logo from "@/assets/img/home-08/testimonial/test-logo-1.png";'
  }
];

async function checkImageExists(imagePath) {
  try {
    await fs.access(imagePath);
    return true;
  } catch {
    return false;
  }
}

async function uploadImageToSanity(imagePath) {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const filename = path.basename(imagePath);
    
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
    });
    
    return asset;
  } catch (error) {
    console.error(`❌ Error uploading ${imagePath}:`, error.message);
    return null;
  }
}

async function createHomepageImageDocument(imageConfig, assetId) {
  try {
    const document = {
      _type: 'homepageImage',
      title: imageConfig.title,
      category: imageConfig.category,
      placement: imageConfig.placement,
      displayOrder: imageConfig.displayOrder,
      isActive: true,
      deviceVisibility: ['desktop', 'tablet', 'mobile'],
      originalFilename: imageConfig.originalFilename,
      usage: imageConfig.usage,
      notes: imageConfig.notes || `Static decorative image from Channels page - ${imageConfig.componentImport}`,
      lastUpdated: new Date().toISOString(),
      image: [
        {
          _type: 'imageWithCaption',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: assetId
            }
          },
          alt: imageConfig.title,
          caption: `${imageConfig.title} - Used in ${imageConfig.placement}`
        }
      ]
    };

    const result = await client.create(document);
    return result;
  } catch (error) {
    console.error(`❌ Error creating homepage image document:`, error.message);
    return null;
  }
}

async function uploadAllChannelImages() {
  console.log('🚀 Starting Channels Page Images Upload to Homepage Images Collection');
  console.log('==================================================================\\n');

  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const imageConfig of channelImages) {
    console.log(`📷 Processing: ${imageConfig.title}`);
    console.log(`   📁 Category: ${imageConfig.category}`);
    console.log(`   📍 Placement: ${imageConfig.placement}`);
    console.log(`   📄 File: ${imageConfig.originalFilename}`);
    console.log(`   🎯 Usage: ${imageConfig.usage}`);

    // Check if image file exists
    const imageExists = await checkImageExists(imageConfig.absolutePath);
    if (!imageExists) {
      console.log(`   ⚠️  File not found: ${imageConfig.absolutePath}`);
      console.log(`   ⏭️  SKIPPING...\\n`);
      totalSkipped++;
      continue;
    }

    try {
      // Upload image to Sanity
      console.log(`   ⬆️  Uploading image to Sanity...`);
      const asset = await uploadImageToSanity(imageConfig.absolutePath);
      
      if (!asset) {
        totalErrors++;
        console.log(`   ❌ Upload failed\\n`);
        continue;
      }

      console.log(`   ✅ Image uploaded - Asset ID: ${asset._id}`);

      // Create homepage image document
      console.log(`   📝 Creating homepage image document...`);
      const document = await createHomepageImageDocument(imageConfig, asset._id);
      
      if (!document) {
        totalErrors++;
        console.log(`   ❌ Document creation failed\\n`);
        continue;
      }

      console.log(`   ✅ Homepage image document created - ID: ${document._id}`);
      console.log(`   🔗 Document URL: https://studio-vonas-media-core.sanity.studio/studio/desk/homepageImage;${document._id}`);
      
      totalUploaded++;

    } catch (error) {
      console.error(`   ❌ Error processing ${imageConfig.title}:`, error.message);
      totalErrors++;
    }

    console.log('');
  }

  console.log('\\n📊 **UPLOAD SUMMARY**');
  console.log('==================');
  console.log(`✅ Successfully uploaded: ${totalUploaded} images`);
  console.log(`⏭️  Skipped (file not found): ${totalSkipped} images`);
  console.log(`❌ Errors: ${totalErrors} images`);
  console.log(`📁 Total processed: ${channelImages.length} images`);

  if (totalUploaded > 0) {
    console.log('\\n🎯 **NEXT STEPS:**');
    console.log('1. Verify uploads in Sanity Studio');
    console.log('2. Update Next.js components to use CMS images');
    console.log('3. Test image rendering on Channels page');
    console.log('4. Connect CMS collections for dynamic content');
  }
}

async function listChannelsPageCategories() {
  console.log('📂 **CHANNELS PAGE IMAGE CATEGORIES**\\n');
  
  const categories = [...new Set(channelImages.map(img => img.category))];
  
  categories.forEach(category => {
    const categoryImages = channelImages.filter(img => img.category === category);
    console.log(`📁 ${category.toUpperCase()} (${categoryImages.length} images)`);
    
    categoryImages.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img.title}`);
      console.log(`      📍 ${img.placement}`);
      console.log(`      📄 ${img.originalFilename}`);
    });
    console.log('');
  });
}

async function checkImageFiles() {
  console.log('🔍 **CHECKING IMAGE FILE AVAILABILITY**\\n');
  
  let foundCount = 0;
  let missingCount = 0;
  
  for (const imageConfig of channelImages) {
    const exists = await checkImageExists(imageConfig.absolutePath);
    const status = exists ? '✅ Found' : '❌ Missing';
    
    console.log(`${status} ${imageConfig.originalFilename}`);
    console.log(`   📁 ${imageConfig.absolutePath}`);
    
    if (exists) {
      foundCount++;
    } else {
      missingCount++;
    }
    
    console.log('');
  }
  
  console.log(`📊 SUMMARY: ${foundCount} found, ${missingCount} missing`);
}

// CLI Interface
const command = process.argv[2];

switch (command) {
  case 'upload':
    uploadAllChannelImages();
    break;
  case 'list':
    listChannelsPageCategories();
    break;
  case 'check':
    checkImageFiles();
    break;
  default:
    console.log('🔧 Channels Page Images Upload Tool');
    console.log('=====================================\\n');
    console.log('Available commands:');
    console.log('  upload       - Upload all channels page images to Homepage Images collection');
    console.log('  list         - List all categories and images to be uploaded');
    console.log('  check        - Check if all image files exist');
    console.log('\\nExamples:');
    console.log('  node upload-channels-page-images.js check');
    console.log('  node upload-channels-page-images.js list');
    console.log('  node upload-channels-page-images.js upload');
    console.log('');
}

// Environment check
if (!process.env.SANITY_API_TOKEN && command) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  console.log('💡 Make sure to set your Sanity API token in .env.local');
  process.exit(1);
}
