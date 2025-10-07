const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

function createSimpleLogoBuffer(brandName, color = '#4F46E5') {
  // Create a simple SVG logo
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${color}"/>
    <text x="100" y="110" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${brandName}</text>
  </svg>`;
  
  return Buffer.from(svg, 'utf8');
}

async function createRemainingLogos() {
  try {
    console.log('🎨 Creating simple logos for remaining brands...');
    
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
    
    const brandColors = {
      'TechFlow': '#4F46E5',  // Blue
      'GameZone': '#F59E0B'   // Amber
    };
    
    for (const brand of brands) {
      console.log(`\n📝 Creating logo for: ${brand.brandName}`);
      
      try {
        const color = brandColors[brand.brandName] || '#6B7280';
        const logoBuffer = createSimpleLogoBuffer(brand.brandName, color);
        
        console.log(`   🔄 Uploading SVG logo...`);
        const uploadedAsset = await client.assets.upload('image', logoBuffer, {
          filename: `${brand.brandName.toLowerCase().replace(/\s+/g, '-')}-logo.svg`,
          contentType: 'image/svg+xml',
        });
        
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
    
    console.log('\n🎉 Final Results:');
    console.log('==================');
    console.log(`✅ Brands with logos: ${withLogos}/${allBrands.length}`);
    console.log(`❌ Brands without logos: ${withoutLogos}`);
    
    if (withoutLogos === 0) {
      console.log('\n🎊 SUCCESS: All brand collaborations now have logos!');
      console.log('\n📋 Brand Logo Summary:');
      allBrands.forEach((brand, index) => {
        console.log(`${index + 1}. ${brand.brandName} - ✅`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during logo creation process:', error);
  }
}

// Check if we have the required environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

createRemainingLogos();
