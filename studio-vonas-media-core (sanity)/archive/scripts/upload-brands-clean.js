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

async function uploadBrandLogos() {
  try {
    console.log('📤 Uploading About Us Brand Logos');
    console.log('='.repeat(40));
    
    const basePath = '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img';
    const brandFiles = [
      'inner-about/brand/brand-1.png',
      'inner-about/brand/brand-2.png', 
      'inner-about/brand/brand-3.png',
      'inner-about/brand/brand-4.png',
      'inner-about/brand/brand-5.png'
    ];
    
    console.log(`📋 Uploading ${brandFiles.length} brand logos`);
    
    for (let i = 0; i < brandFiles.length; i++) {
      const relativePath = brandFiles[i];
      const fullPath = path.join(basePath, relativePath);
      const filename = path.basename(relativePath);
      const brandNum = i + 1;
      
      console.log(`\n🔄 ${brandNum}/5: ${filename}`);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`   ❌ Not found: ${fullPath}`);
        continue;
      }
      
      try {
        // Upload asset
        const buffer = fs.readFileSync(fullPath);
        const asset = await client.assets.upload('image', buffer, {
          filename: filename,
          contentType: 'image/png',
        });
        console.log(`   ✅ Asset: ${asset._id}`);
        
        // Create document
        const document = {
          _type: 'homepageImage',
          title: `About Brand Logo ${brandNum}`,
          slug: {
            _type: 'slug',
            current: `about-brand-logo-${brandNum}`
          },
          image: [{
            _type: 'imageWithAlt',
            _key: `brand-${brandNum}-${Date.now()}`,
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            },
            alt: `About page client brand logo ${brandNum}`,
            caption: 'Client brand logo for About page'
          }],
          category: 'Brand Section',
          page: 'About Us',
          folder: 'About Us/images',
          placement: `About page brand showcase ${brandNum}`,
          displayOrder: brandNum,
          isActive: true,
          deviceVisibility: ['desktop', 'tablet', 'mobile'],
          dimensions: { width: 200, height: 100, aspectRatio: '2:1' },
          originalFilename: filename,
          originalPath: `assets/img/${relativePath}`,
          priority: 'Medium',
          usage: 'content',
          notes: 'Client brand logo for About page brand section',
          lastUpdated: new Date().toISOString()
        };
        
        const result = await client.create(document);
        console.log(`   ✅ Doc: ${result._id}`);
        
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Check final state
    const aboutImages = await client.fetch(`*[_type == "homepageImage" && page == "About Us"] | order(category asc, displayOrder asc){
      title, category, displayOrder, originalFilename
    }`);
    
    console.log(`\n✅ About Us now has ${aboutImages.length} images:`);
    
    const byCategory = {};
    aboutImages.forEach(img => {
      if (!byCategory[img.category]) byCategory[img.category] = [];
      byCategory[img.category].push(img);
    });
    
    Object.entries(byCategory).forEach(([cat, imgs]) => {
      console.log(`\n📁 ${cat} (${imgs.length}):`);
      imgs.forEach(img => {
        console.log(`   ${img.originalFilename || 'N/A'} [${img.displayOrder}]`);
      });
    });
    
    console.log('\n🎉 Upload completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN required');
  process.exit(1);
}

uploadBrandLogos();
