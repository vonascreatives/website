const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'y26nx8w9',
  dataset: 'production', 
  useCdn: false,
  token: process.env.SANITY_TOKEN || 'skOwzCMoP0MWo0v3aLa5QiCfbPmY4ISwWYHOOFdT8Eef8eG2a4hVaSDJRAI7r7jMQ8X6QVJfOKJTk3w4xqmyZN1I8cDBZ5jBK4KAJLKjy1g8t2AXZH8V8oqz5DJP45KAVhGV99LD5NSSGS14rNT7J4AKAoq3XHSFA5k3bBWvhC3EqYVIKR8m'
});

const FRONTEND_PATH = '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp';

// All missing homepage images that need to be uploaded
const missingImages = [
  // Hero Section SVG
  {
    localPath: 'public/assets/img/home-01/hero/hero-bg-shape-1-1.svg',
    title: 'Hero Background Shape SVG',
    category: 'Hero Section',
    priority: 'High'
  },
  {
    localPath: 'public/assets/img/home-01/hero/hero-shape-1-1.png',
    title: 'Hero Small Shape',
    category: 'Hero Section', 
    priority: 'High'
  },
  
  // Additional Brand Logos
  {
    localPath: 'src/assets/img/home-01/brand/brand-3.png',
    title: 'Brand Logo 3',
    category: 'Brand Section',
    priority: 'Low'
  },
  {
    localPath: 'src/assets/img/home-01/brand/brand-4.png',
    title: 'Brand Logo 4', 
    category: 'Brand Section',
    priority: 'Low'
  },
  {
    localPath: 'src/assets/img/home-01/brand/brand-5.png',
    title: 'Brand Logo 5',
    category: 'Brand Section',
    priority: 'Low'
  },
  {
    localPath: 'src/assets/img/home-01/brand/brand-6.png',
    title: 'Brand Logo 6',
    category: 'Brand Section',
    priority: 'Low'
  },
  {
    localPath: 'src/assets/img/home-01/brand/brand-7.png',
    title: 'Brand Logo 7',
    category: 'Brand Section',
    priority: 'Low'
  },
  
  // Service Icons
  {
    localPath: 'src/assets/img/home-01/service/service-icon-3.png',
    title: 'Format Design Icon',
    category: 'Service Section',
    priority: 'High'
  },
  {
    localPath: 'src/assets/img/home-01/service/service-icon-4.png',
    title: 'Brand Stories Icon',
    category: 'Service Section', 
    priority: 'High'
  },
  
  // Project Images
  {
    localPath: 'src/assets/img/home-01/project/project-1-4.jpg',
    title: 'Project Image 4',
    category: 'Project Section',
    priority: 'Low'
  },
  {
    localPath: 'src/assets/img/home-01/project/project-1-5.jpg',
    title: 'Project Image 5',
    category: 'Project Section',
    priority: 'Low'
  },
  {
    localPath: 'src/assets/img/home-01/project/project-1-6.jpg',
    title: 'Project Image 6',
    category: 'Project Section',
    priority: 'Low'
  },
  {
    localPath: 'src/assets/img/home-01/project/project-shape-1-1.png',
    title: 'Project Text Shape',
    category: 'Project Section',
    priority: 'Medium'
  },
  
  // Background Image
  {
    localPath: 'public/assets/img/inner-service/hero/hero-1-2.jpg',
    title: 'Project Background Image',
    category: 'Background Images',
    priority: 'Medium'
  },
  
  // Award Images
  {
    localPath: 'src/assets/img/home-01/award/award-2.png',
    title: 'Awwwards Award',
    category: 'Award Section',
    priority: 'Medium'
  },
  {
    localPath: 'src/assets/img/home-01/award/award-3.png',
    title: 'Loki Award',
    category: 'Award Section',
    priority: 'Medium'
  },
  {
    localPath: 'src/assets/img/home-01/award/award-4.png',
    title: 'Liko Award',
    category: 'Award Section',
    priority: 'Medium'
  },
  {
    localPath: 'src/assets/img/home-01/award/award-5.png',
    title: 'Digital Agencies Award',
    category: 'Award Section',
    priority: 'Medium'
  },
  {
    localPath: 'src/assets/img/home-01/award/award-6.png',
    title: 'FWA Award Second',
    category: 'Award Section',
    priority: 'Medium'
  },
  
  // Footer Elements
  {
    localPath: 'src/assets/img/logo/logo-white.png',
    title: 'Footer White Logo',
    category: 'Footer Section',
    priority: 'High'
  },
  {
    localPath: 'src/assets/img/home-01/footer/footer-circle-shape-1.png',
    title: 'Footer Shape 1',
    category: 'Footer Section',
    priority: 'High'
  },
  {
    localPath: 'src/assets/img/home-01/footer/footer-circle-shape-2.png',
    title: 'Footer Shape 2',
    category: 'Footer Section',
    priority: 'High'
  }
];

async function uploadImage(imageData) {
  try {
    const fullPath = path.join(FRONTEND_PATH, imageData.localPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${imageData.localPath}`);
      return false;
    }

    console.log(`📤 Uploading: ${imageData.title}...`);
    
    const imageAsset = await client.assets.upload('image', fs.createReadStream(fullPath), {
      filename: path.basename(fullPath),
    });

    const homepageImage = await client.create({
      _type: 'homepageImage',
      title: imageData.title,
      description: `${imageData.title} for homepage ${imageData.category}`,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        }
      },
      alt: imageData.title,
      category: imageData.category,
      priority: imageData.priority,
      page: 'Homepage',
      folder: 'Section 1 Page 1',
      originalPath: imageData.localPath,
    });

    console.log(`✅ Uploaded: ${imageData.title} (${homepageImage._id})`);
    return true;

  } catch (error) {
    console.error(`❌ Error uploading ${imageData.title}:`, error.message);
    return false;
  }
}

async function uploadAll() {
  console.log('🚀 Starting complete homepage image upload...');
  console.log(`📊 Total images to upload: ${missingImages.length}\n`);
  
  let successful = 0;
  let failed = 0;

  for (const imageData of missingImages) {
    const result = await uploadImage(imageData);
    
    if (result) {
      successful++;
    } else {
      failed++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n🎉 Upload Complete!');
  console.log(`✅ Successful: ${successful}/${missingImages.length}`);
  console.log(`❌ Failed: ${failed}/${missingImages.length}`);
  
  if (failed === 0) {
    console.log('\n🎯 Perfect! All homepage images are now in Sanity!');
    console.log('📝 Ready for Step 3: Update components to use Sanity URLs');
  }
}

uploadAll().catch(console.error);
