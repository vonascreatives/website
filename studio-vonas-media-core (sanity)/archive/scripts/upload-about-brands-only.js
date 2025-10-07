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

async function uploadAboutBrandLogos() {
  try {
    console.log('📤 Uploading About Us Brand Logos Only');
    console.log('='.repeat(40));
    
    const basePath = '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img';
    const brandFiles = [
      { file: 'inner-about/brand/brand-1.png', title: 'About Us Brand Logo 1' },
      { file: 'inner-about/brand/brand-2.png', title: 'About Us Brand Logo 2' },
      { file: 'inner-about/brand/brand-3.png', title: 'About Us Brand Logo 3' },
      { file: 'inner-about/brand/brand-4.png', title: 'About Us Brand Logo 4' },
      { file: 'inner-about/brand/brand-5.png', title: 'About Us Brand Logo 5' }
    ];
    
    for (let i = 0; i < brandFiles.length; i++) {
      const { file, title } = brandFiles[i];
      const fullPath = path.join(basePath, file);
      const filename = path.basename(file);
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
        
        // Create document specifically for About Us
        const document = {
          _type: 'homepageImage',
          title: title,
          slug: {
            _type: 'slug',
            current: `about-us-brand-logo-${brandNum}`
          },
          image: [{
            _type: 'imageWithAlt',
            _key: `about-brand-${brandNum}-${Date.now()}`,
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            },
            alt: `About Us page client brand logo ${brandNum}`,
            caption: `Client brand logo ${brandNum} for About Us page`
          }],
          category: 'Brand Section',
          page: 'About Us',  // Explicitly About Us
          folder: 'About Us/images',
          placement: `About Us brand showcase position ${brandNum}`,
          displayOrder: brandNum,
          isActive: true,
          deviceVisibility: ['desktop', 'tablet', 'mobile'],
          dimensions: { width: 150, height: 50, aspectRatio: '3:1' },
          originalFilename: filename,
          originalPath: `assets/img/${file}`,
          priority: 'Medium',
          usage: 'brand-logo',
          notes: `Brand logo ${brandNum} specifically for About Us page brand showcase`,
          lastUpdated: new Date().toISOString()
        };
        
        const result = await client.create(document);
        console.log(`   ✅ Doc: ${result._id} (${result.title})`);
        
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n🎉 About Us brand logos uploaded!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN required');
  process.exit(1);
}

uploadAboutBrandLogos();
