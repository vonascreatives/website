const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

// Alternative logo sources for the remaining brands
const remainingBrandLogos = {
  'TechFlow': 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=TechFlow',
  'GameZone': 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=GameZone'
};

async function uploadImageFromUrl(imageUrl, filename) {
  try {
    const https = require('https');
    const http = require('http');
    const url = require('url');
    
    return new Promise((resolve, reject) => {
      const parsedUrl = url.parse(imageUrl);
      const httpClient = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = httpClient.get(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }, (res) => {        
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP error! status: ${res.statusCode}`));
          return;
        }
        
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            const contentType = res.headers['content-type'] || 'image/png';
            
            console.log(`   📦 Downloaded ${buffer.length} bytes, content-type: ${contentType}`);
            
            const asset = await client.assets.upload('image', buffer, {
              filename: filename,
              contentType: contentType,
            });
            
            resolve(asset);
          } catch (uploadError) {
            console.error(`   ❌ Upload error:`, uploadError.message);
            reject(uploadError);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error(`   ❌ Request error:`, error.message);
        reject(error);
      });
      
      req.setTimeout(10000, () => {
        req.abort();
        reject(new Error('Request timeout'));
      });
    });
  } catch (error) {
    console.error(`❌ Failed to upload image from ${imageUrl}:`, error.message);
    return null;
  }
}

async function finishBrandLogos() {
  try {
    console.log('🎯 Finishing brand logos for remaining brands...');
    
    const brands = await client.fetch(`*[_type == "brandCollaboration" && (!defined(logo) || length(logo) == 0)]{
      _id, 
      brandName, 
      status
    }`);
    
    if (brands.length === 0) {
      console.log('🎉 All brand collaborations already have logos!');
      return;
    }
    
    console.log(`📊 Found ${brands.length} brands still needing logos`);
    
    for (const brand of brands) {
      console.log(`\\n📝 Processing: ${brand.brandName}`);
      
      const logoUrl = remainingBrandLogos[brand.brandName];
      
      if (!logoUrl) {
        console.log(`   ⚠️ No logo URL configured for ${brand.brandName}`);
        continue;
      }
      
      try {
        console.log(`   🔄 Uploading logo: ${logoUrl}`);
        const uploadedAsset = await uploadImageFromUrl(logoUrl, `${brand.brandName.toLowerCase().replace(/\\s+/g, '-')}-logo`);
        
        if (!uploadedAsset) {
          console.log(`   ❌ Failed to upload logo for ${brand.brandName}`);
          continue;
        }
        
        console.log(`   ✅ Logo uploaded: ${uploadedAsset._id}`);
        
        // Create imageWithAlt object
        const logoObject = [{
          _type: 'imageWithAlt',
          _key: `logo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedAsset._id
            }
          },
          alt: `${brand.brandName} logo`,
          caption: `Official ${brand.brandName} brand logo`
        }];
        
        // Update the brand document with the logo
        await client
          .patch(brand._id)
          .set({
            logo: logoObject
          })
          .commit();
        
        console.log(`   ✅ Updated ${brand.brandName} with new logo`);
        
      } catch (error) {
        console.error(`   ❌ Error processing ${brand.brandName}:`, error.message);
        continue;
      }
    }
    
    // Final check
    const allBrands = await client.fetch(`*[_type == "brandCollaboration"]{
      _id, 
      brandName, 
      logo
    }`);
    
    const withLogos = allBrands.filter(b => b.logo && b.logo.length > 0).length;
    const withoutLogos = allBrands.length - withLogos;
    
    console.log('\\n🎉 Final Results:');
    console.log('==================');
    console.log(`✅ Brands with logos: ${withLogos}/${allBrands.length}`);
    console.log(`❌ Brands without logos: ${withoutLogos}`);
    
    if (withoutLogos === 0) {
      console.log('\\n🎊 SUCCESS: All brand collaborations now have logos!');
    }
    
  } catch (error) {
    console.error('❌ Error during final logo process:', error);
  }
}

// Check if we have the required environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

finishBrandLogos();
