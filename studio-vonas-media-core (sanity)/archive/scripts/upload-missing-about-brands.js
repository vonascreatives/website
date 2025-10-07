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

async function uploadMissingBrandLogos() {
  try {
    console.log('📤 Uploading Missing About Us Brand Logos');
    console.log('=' .repeat(50));
    
    const imageBasePath = '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img';
    
    const missingBrandFiles = [
      'inner-about/brand/brand-1.png',
      'inner-about/brand/brand-2.png', 
      'inner-about/brand/brand-3.png',
      'inner-about/brand/brand-4.png',
      'inner-about/brand/brand-5.png'
    ];
    
    console.log(`📋 Need to upload ${missingBrandFiles.length} brand logos`);
    
    let successCount = 0;
    
    for (let i = 0; i < missingBrandFiles.length; i++) {
      const relativePath = missingBrandFiles[i];
      const fullPath = path.join(imageBasePath, relativePath);
      const filename = path.basename(relativePath);
      const brandNumber = i + 1;
      
      console.log(`\n🔄 [${i + 1}/${missingBrandFiles.length}] ${filename}`);
      
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        console.log(`   ❌ File not found: ${fullPath}`);\n        continue;\n      }\n      \n      try {\n        // Upload image asset\n        const buffer = fs.readFileSync(fullPath);\n        const asset = await client.assets.upload('image', buffer, {\n          filename: filename,\n          contentType: 'image/png',\n        });\n        \n        console.log(`   ✅ Asset uploaded: ${asset._id}`);\n        \n        // Create homepage image document\n        const imageWithAlt = {\n          _type: 'imageWithAlt',\n          _key: `brand-${brandNumber}-${Date.now()}`,\n          image: {\n            _type: 'image',\n            asset: {\n              _type: 'reference',\n              _ref: asset._id\n            }\n          },\n          alt: `About page client brand logo ${brandNumber}`,\n          caption: `Client brand logo for About page`\n        };\n        \n        const document = {\n          _type: 'homepageImage',\n          title: `About Brand Logo ${brandNumber}`,\n          slug: {\n            _type: 'slug',\n            current: `about-brand-logo-${brandNumber}`\n          },\n          image: [imageWithAlt],\n          category: 'Brand Section',\n          page: 'About Us',\n          folder: 'About Us/images',\n          placement: `About page brand showcase ${brandNumber}`,\n          displayOrder: brandNumber,\n          isActive: true,\n          deviceVisibility: ['desktop', 'tablet', 'mobile'],\n          dimensions: { width: 200, height: 100, aspectRatio: '2:1' },\n          originalPath: `assets/img/${relativePath}`,\n          priority: 'Medium',\n          usage: 'content',\n          notes: `Client brand logo for About page brand section`,\n          lastUpdated: new Date().toISOString()\n        };\n        \n        const result = await client.create(document);\n        console.log(`   ✅ Document created: ${result._id}`);\n        \n        successCount++;\n        \n      } catch (error) {\n        console.error(`   ❌ Error uploading ${filename}:`, error.message);\n      }\n    }\n    \n    console.log(`\n🎉 Upload completed! Successfully uploaded ${successCount}/${missingBrandFiles.length} brand logos`);\n    \n    // Verify final state\n    const final = await client.fetch(`*[_type == \"homepageImage\" && page == \"About Us\"] | order(category asc, displayOrder asc){\n      _id, title, category, displayOrder, originalFilename\n    }`);\n    \n    console.log(`\\n📊 About Us page now has ${final.length} total images`);\n    \n    const grouped = {};\n    final.forEach(img => {\n      if (!grouped[img.category]) grouped[img.category] = [];\n      grouped[img.category].push(img);\n    });\n    \n    Object.entries(grouped).forEach(([cat, imgs]) => {\n      console.log(`\\n📁 ${cat} (${imgs.length}):`);\n      imgs.forEach(img => {\n        console.log(`   ${img.originalFilename || 'N/A'} - ${img.title} [${img.displayOrder}]`);\n      });\n    });\n    \n  } catch (error) {\n    console.error('❌ Upload error:', error);\n  }\n}\n\nif (!process.env.SANITY_API_TOKEN) {\n  console.error('❌ SANITY_API_TOKEN required');\n  process.exit(1);\n}\n\nuploadMissingBrandLogos();
