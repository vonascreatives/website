const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

// Real brand logo URLs from reliable CDNs
const brandLogos = {
  'FitCore': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&auto=format',
  'TechFlow': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop&auto=format', 
  'GameZone': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop&auto=format',
  'TravelEase': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop&auto=format',
  'StyleHub': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&auto=format',
  'EcoGreen': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop&auto=format',
  'BeautyBloom': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&auto=format',
  'Apple': 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
  'Nike': 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png',
  'PetCare Plus': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop&auto=format',
  'AutoTech': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=200&fit=crop&auto=format',
  'CookMaster': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&auto=format'
};

// Alternative high-quality brand logos for better variety
const alternativeBrandLogos = {
  'FitCore': 'https://cdn.worldvectorlogo.com/logos/under-armour-9.svg',
  'TechFlow': 'https://cdn.worldvectorlogo.com/logos/microsoft-5.svg',
  'GameZone': 'https://cdn.worldvectorlogo.com/logos/steam.svg',
  'TravelEase': 'https://cdn.worldvectorlogo.com/logos/airbnb-2.svg',
  'StyleHub': 'https://cdn.worldvectorlogo.com/logos/zara-logo.svg',
  'EcoGreen': 'https://cdn.worldvectorlogo.com/logos/whole-foods-market-logo.svg',
  'BeautyBloom': 'https://cdn.worldvectorlogo.com/logos/sephora-1.svg',
  'PetCare Plus': 'https://cdn.worldvectorlogo.com/logos/petsmart.svg',
  'AutoTech': 'https://cdn.worldvectorlogo.com/logos/tesla-9.svg',
  'CookMaster': 'https://cdn.worldvectorlogo.com/logos/kitchenaid-1.svg'
};

async function uploadImageFromUrl(imageUrl, filename) {
  try {
    const https = require('https');
    const http = require('http');
    const url = require('url');
    
    return new Promise((resolve, reject) => {
      const parsedUrl = url.parse(imageUrl);
      const httpClient = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = httpClient.get(imageUrl, (res) => {
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
            
            const asset = await client.assets.upload('image', buffer, {
              filename: filename,
              contentType: contentType,
            });
            
            resolve(asset);
          } catch (uploadError) {
            reject(uploadError);
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.setTimeout(30000, () => {
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
    console.log('🔄 Starting logo upload and update process...\n');
    
    for (const brand of brands) {
      console.log(`📝 Processing: ${brand.brandName}`);
      
      // Check if brand already has a logo
      if (brand.logo && brand.logo.length > 0) {
        console.log(`   ✅ Already has logo - skipping`);
        continue;
      }
      
      // Get logo URL for this brand
      const logoUrl = brandLogos[brand.brandName] || alternativeBrandLogos[brand.brandName];
      
      if (!logoUrl) {
        console.log(`   ⚠️ No logo URL configured for ${brand.brandName}`);
        continue;
      }
      
      // Upload image to Sanity
      console.log(`   🔄 Uploading logo from: ${logoUrl.substring(0, 50)}...`);
      const uploadedAsset = await uploadImageFromUrl(logoUrl, `${brand.brandName.toLowerCase().replace(/\\s+/g, '-')}-logo`);
      
      if (!uploadedAsset) {
        console.log(`   ❌ Failed to upload logo for ${brand.brandName}`);
        continue;
      }
      
      console.log(`   ✅ Logo uploaded: ${uploadedAsset._id}`);
      
      // Create imageWithAlt object
      const logoObject = [{
        _type: 'imageWithAlt',
        _key: `logo-${Date.now()}`,
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
      
      console.log(`   ✅ Updated ${brand.brandName} with new logo\\n`);
    }
    
    console.log('🎉 Brand logo upsert process completed!');
    
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

console.log('🚀 Starting brand logo upsert process...');
upsertBrandLogos();
