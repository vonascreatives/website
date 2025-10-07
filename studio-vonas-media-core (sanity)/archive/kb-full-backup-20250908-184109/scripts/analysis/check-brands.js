const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function fetchBrandCollabs() {
  try {
    const brands = await client.fetch(`*[_type == "brandCollaboration"]{
      _id, 
      brandName, 
      logo,
      status,
      slug
    }`);
    
    console.log('📊 Current Brand Collaborations:');
    console.log('=====================================');
    
    if (brands.length === 0) {
      console.log('No brand collaborations found.');
      return [];
    }
    
    brands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.brandName}`);
      console.log(`   ID: ${brand._id}`);
      console.log(`   Status: ${brand.status}`);
      console.log(`   Slug: ${brand.slug?.current || 'No slug'}`);
      console.log(`   Has Logo: ${brand.logo && brand.logo.length > 0 ? '✅ Yes' : '❌ No'}`);
      console.log('   ---');
    });
    
    console.log(`\n📈 Total: ${brands.length} brand collaborations`);
    
    const withLogos = brands.filter(b => b.logo && b.logo.length > 0).length;
    const withoutLogos = brands.length - withLogos;
    
    console.log(`✅ With logos: ${withLogos}`);
    console.log(`❌ Without logos: ${withoutLogos}`);
    
    return brands;
  } catch (error) {
    console.error('❌ Error fetching brands:', error);
    return [];
  }
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

fetchBrandCollabs();
