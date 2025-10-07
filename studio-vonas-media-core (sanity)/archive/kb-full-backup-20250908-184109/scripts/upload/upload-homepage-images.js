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

// Base path to the Next.js homepage project
const BASE_PATH = '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img';

// Content images that should be managed through Sanity (editable by content team)
const CONTENT_IMAGES = [
  // Hero Section Images
  {
    category: 'hero',
    placement: 'Primary Hero Background',
    displayOrder: 1,
    relativePath: '/home-01/hero/hero-1-2.jpg',
    title: 'Homepage Hero Background',
    description: 'Main background image for the homepage hero section',
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' }
  },
  {
    category: 'hero', 
    placement: 'Hero Profile Image',
    displayOrder: 2,
    relativePath: '/home-01/hero/hero-1-1.png',
    title: 'Hero Profile Picture',
    description: 'Profile/portrait image displayed in the hero section',
    dimensions: { width: 500, height: 500, aspectRatio: '1:1' }
  },

  // About Section Images
  {
    category: 'about',
    placement: 'About Main Image',
    displayOrder: 1,
    relativePath: '/home-02/about/ab-1.jpg',
    title: 'About Section Main Image',
    description: 'Primary image for the about section',
    dimensions: { width: 600, height: 400, aspectRatio: '3:2' }
  },
  {
    category: 'about',
    placement: 'About Secondary Image',
    displayOrder: 2,
    relativePath: '/home-02/about/ab-2.jpg',
    title: 'About Section Secondary Image',
    description: 'Secondary supporting image in about section',
    dimensions: { width: 400, height: 300, aspectRatio: '4:3' }
  },

  // Team Section Images
  {
    category: 'team',
    placement: 'Team Member 1',
    displayOrder: 1,
    relativePath: '/home-01/team/team-1-1.jpg',
    title: 'Team Member 1 Photo',
    description: 'Profile photo for the first team member',
    dimensions: { width: 300, height: 400, aspectRatio: '3:4' }
  },
  {
    category: 'team',
    placement: 'Team Member 2', 
    displayOrder: 2,
    relativePath: '/home-01/team/team-1-2.jpg',
    title: 'Team Member 2 Photo',
    description: 'Profile photo for the second team member',
    dimensions: { width: 300, height: 400, aspectRatio: '3:4' }
  },
  {
    category: 'team',
    placement: 'Team Member 3',
    displayOrder: 3,
    relativePath: '/home-01/team/team-1-3.jpg',
    title: 'Team Member 3 Photo',
    description: 'Profile photo for the third team member',
    dimensions: { width: 300, height: 400, aspectRatio: '3:4' }
  },

  // Portfolio Section Images
  {
    category: 'portfolio',
    placement: 'Portfolio Item 1',
    displayOrder: 1,
    relativePath: '/home-01/project/project-1-1.jpg',
    title: 'Portfolio Project 1',
    description: 'Featured portfolio project showcase image',
    dimensions: { width: 600, height: 400, aspectRatio: '3:2' }
  },
  {
    category: 'portfolio',
    placement: 'Portfolio Item 2',
    displayOrder: 2,
    relativePath: '/home-01/project/project-1-2.jpg',
    title: 'Portfolio Project 2',
    description: 'Featured portfolio project showcase image',
    dimensions: { width: 600, height: 400, aspectRatio: '3:2' }
  },
  {
    category: 'portfolio',
    placement: 'Portfolio Item 3',
    displayOrder: 3,
    relativePath: '/home-01/project/project-1-3.jpg',
    title: 'Portfolio Project 3',
    description: 'Featured portfolio project showcase image',
    dimensions: { width: 600, height: 400, aspectRatio: '3:2' }
  },

  // Service Section Images
  {
    category: 'services',
    placement: 'Service Icon 1',
    displayOrder: 1,
    relativePath: '/home-01/service/service-icon-1.png',
    title: 'Service 1 Icon',
    description: 'Icon representing the first service offering',
    dimensions: { width: 100, height: 100, aspectRatio: '1:1' }
  },
  {
    category: 'services',
    placement: 'Service Icon 2',
    displayOrder: 2,
    relativePath: '/home-01/service/service-icon-2.png',
    title: 'Service 2 Icon',
    description: 'Icon representing the second service offering',
    dimensions: { width: 100, height: 100, aspectRatio: '1:1' }
  },
  {
    category: 'services',
    placement: 'Service Icon 3',
    displayOrder: 3,
    relativePath: '/home-01/service/service-icon-3.png',
    title: 'Service 3 Icon',
    description: 'Icon representing the third service offering',
    dimensions: { width: 100, height: 100, aspectRatio: '1:1' }
  },

  // Brand/Partner Logos
  {
    category: 'gallery',
    placement: 'Brand Logo 1',
    displayOrder: 1,
    relativePath: '/home-01/brand/brand-1.png',
    title: 'Partner Brand 1',
    description: 'Logo of partner/client brand for homepage showcase',
    dimensions: { width: 200, height: 100, aspectRatio: '2:1' }
  },
  {
    category: 'gallery',
    placement: 'Brand Logo 2',
    displayOrder: 2,
    relativePath: '/home-01/brand/brand-2.png',
    title: 'Partner Brand 2',
    description: 'Logo of partner/client brand for homepage showcase',
    dimensions: { width: 200, height: 100, aspectRatio: '2:1' }
  },

  // Testimonial/Awards
  {
    category: 'testimonials',
    placement: 'Award 1',
    displayOrder: 1,
    relativePath: '/home-01/award/award-1.png',
    title: 'Award Badge 1',
    description: 'Award or achievement badge for testimonials section',
    dimensions: { width: 150, height: 150, aspectRatio: '1:1' }
  }
];

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

    console.log(`   📦 Uploading ${buffer.length} bytes, type: ${contentType}`);

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

async function uploadHomepageImages() {
  try {
    console.log('🖼️ Starting homepage image upload process...');
    console.log(`📂 Base path: ${BASE_PATH}`);
    console.log(`📊 Processing ${CONTENT_IMAGES.length} content images\n`);

    let successCount = 0;
    let errorCount = 0;
    const processedImages = [];

    for (let i = 0; i < CONTENT_IMAGES.length; i++) {
      const imageConfig = CONTENT_IMAGES[i];
      console.log(`📝 Processing ${i + 1}/${CONTENT_IMAGES.length}: ${imageConfig.title}`);

      try {
        const fullPath = path.join(BASE_PATH, imageConfig.relativePath);
        const filename = path.basename(imageConfig.relativePath);
        
        console.log(`   🔄 Uploading from: ${imageConfig.relativePath}`);
        
        // Upload image to Sanity
        const uploadedAsset = await uploadImageFile(fullPath, filename);
        
        if (!uploadedAsset) {
          console.log(`   ❌ Failed to upload ${imageConfig.title}`);
          errorCount++;
          continue;
        }

        console.log(`   ✅ Image uploaded: ${uploadedAsset._id}`);

        // Create imageWithAlt object
        const imageWithAlt = {
          _type: 'imageWithAlt',
          _key: `homepage-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedAsset._id
            }
          },
          alt: `${imageConfig.title} - ${imageConfig.description}`,
          caption: imageConfig.description
        };

        // Create homepage image document
        const homepageImageDoc = {
          _type: 'homepageImage',
          title: imageConfig.title,
          slug: {
            _type: 'slug',
            current: generateSlug(imageConfig.title)
          },
          image: [imageWithAlt],
          category: imageConfig.category,
          placement: imageConfig.placement,
          displayOrder: imageConfig.displayOrder,
          isActive: true,
          deviceVisibility: ['desktop', 'tablet', 'mobile'],
          dimensions: imageConfig.dimensions,
          originalFilename: filename,
          usage: 'content',
          notes: imageConfig.description,
          lastUpdated: new Date().toISOString()
        };

        // Save to Sanity
        const result = await client.create(homepageImageDoc);
        console.log(`   ✅ Document created: ${result._id}`);
        
        processedImages.push({
          title: imageConfig.title,
          category: imageConfig.category,
          placement: imageConfig.placement,
          documentId: result._id,
          assetId: uploadedAsset._id
        });

        successCount++;
        
        // Small delay to avoid overwhelming the server
        if (i < CONTENT_IMAGES.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`   ❌ Error processing ${imageConfig.title}:`, error.message);
        errorCount++;
        continue;
      }

      console.log(''); // Empty line for readability
    }

    console.log('🎉 Homepage image upload process completed!\n');

    // Summary by category
    const categories = {};
    processedImages.forEach(img => {
      if (!categories[img.category]) categories[img.category] = [];
      categories[img.category].push(img);
    });

    console.log('📊 Summary by Category:');
    console.log('========================');
    Object.entries(categories).forEach(([category, images]) => {
      console.log(`📁 ${category.charAt(0).toUpperCase() + category.slice(1)}: ${images.length} images`);
      images.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.title} (${img.placement})`);
      });
    });

    console.log(`\n🎯 Final Results:`);
    console.log(`✅ Successfully processed: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📈 Total processed: ${successCount + errorCount}`);

    return processedImages;

  } catch (error) {
    console.error('❌ Error during homepage image upload:', error);
  }
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

console.log('🚀 Starting Homepage Image Upload to Sanity CMS');
console.log('================================================');
uploadHomepageImages();
