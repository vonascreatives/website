const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

// Simple, reliable logo placeholder URLs - using lorem picsum for consistency
const brandLogos = {
  'FitCore': 'https://picsum.photos/200/200?random=1',
  'TechFlow': 'https://picsum.photos/200/200?random=2', 
  'GameZone': 'https://picsum.photos/200/200?random=3',
  'TravelEase': 'https://picsum.photos/200/200?random=4',
  'StyleHub': 'https://picsum.photos/200/200?random=5',
  'EcoGreen': 'https://picsum.photos/200/200?random=6',
  'BeautyBloom': 'https://picsum.photos/200/200?random=7',
  'Apple': 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png',
  'Nike': 'https://logoeps.com/wp-content/uploads/2013/03/nike-vector-logo.png',
  'PetCare Plus': 'https://picsum.photos/200/200?random=8',
  'AutoTech': 'https://picsum.photos/200/200?random=9',
  'CookMaster': 'https://picsum.photos/200/200?random=10'
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
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log(`   🔄 Following redirect to: ${res.headers.location}`);
          uploadImageFromUrl(res.headers.location, filename).then(resolve).catch(reject);
          return;
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP error! status: ${res.statusCode}`));
          return;
        }
        
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            const contentType = res.headers['content-type'] || 'image/jpeg';
            
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
      
      req.setTimeout(15000, () => {
        req.abort();
        reject(new Error('Request timeout'));
      });
    });
  } catch (error) {
    console.error(`❌ Failed to upload image from ${imageUrl}:`, error.message);
    return null;
  }
}

async function upsertBrandLogos() {
  try {
    console.log('🔄 Fetching existing brand collaborations...');
    
    const brands = await client.fetch(`*[_type == "brandCollaboration"]{
      _id, 
      brandName, 
      logo,
      status
    }`);
    
    if (brands.length === 0) {
      console.log('❌ No brand collaborations found.');
      return;
    }
    
    console.log(`📊 Found ${brands.length} brand collaborations`);
    
    // Filter out brands that already have logos
    const brandsNeedingLogos = brands.filter(brand => !brand.logo || brand.logo.length === 0);
    
    console.log(`🎯 ${brandsNeedingLogos.length} brands need logos`);
    console.log('🔄 Starting logo upload and update process...\\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < brandsNeedingLogos.length; i++) {
      const brand = brandsNeedingLogos[i];
      console.log(`📝 Processing ${i + 1}/${brandsNeedingLogos.length}: ${brand.brandName}`);
      
      // Get logo URL for this brand
      const logoUrl = brandLogos[brand.brandName];
      
      if (!logoUrl) {
        console.log(`   ⚠️ No logo URL configured for ${brand.brandName}`);
        errorCount++;
        continue;
      }
      
      try {
        // Upload image to Sanity
        console.log(`   🔄 Uploading logo from: ${logoUrl.substring(0, 60)}...`);
        const uploadedAsset = await uploadImageFromUrl(logoUrl, `${brand.brandName.toLowerCase().replace(/\\s+/g, '-')}-logo`);
        
        if (!uploadedAsset) {
          console.log(`   ❌ Failed to upload logo for ${brand.brandName}`);
          errorCount++;
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
        successCount++;
        
        // Add a small delay to avoid overwhelming the servers
        if (i < brandsNeedingLogos.length - 1) {
          console.log(`   ⏱️ Waiting 2 seconds before next upload...\\n`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`   ❌ Error processing ${brand.brandName}:`, error.message);
        errorCount++;
        continue;
      }
    }
    
    console.log('\\n🎉 Brand logo upsert process completed!');
    
    // Final summary
    const updatedBrands = await client.fetch(`*[_type == "brandCollaboration"]{
      _id, 
      brandName, 
      logo
    }`);
    
    const withLogos = updatedBrands.filter(b => b.logo && b.logo.length > 0).length;
    const withoutLogos = updatedBrands.length - withLogos;
    
    console.log('\\n📊 Final Summary:');
    console.log('==================');
    console.log(`✅ Brands with logos: ${withLogos}`);
    console.log(`❌ Brands without logos: ${withoutLogos}`);
    console.log(`📈 Total brands: ${updatedBrands.length}`);
    console.log(`\\n🎯 This session:`)
    console.log(`✅ Successfully processed: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Error during upsert process:', error);
  }
}

// Check if we have the required environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  console.log('💡 Make sure to set the SANITY_API_TOKEN environment variable');
  process.exit(1);
}

console.log('🚀 Starting improved brand logo upsert process...');
upsertBrandLogos();
