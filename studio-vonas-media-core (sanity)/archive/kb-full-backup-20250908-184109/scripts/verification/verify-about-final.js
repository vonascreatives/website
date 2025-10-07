const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function verifyAboutUsImages() {
  try {
    console.log('🔍 About Us Images - Final Verification');
    console.log('='.repeat(40));
    
    // Get About Us images
    const aboutImages = await client.fetch(`*[_type == "homepageImage" && page == "About Us"] | order(category asc, displayOrder asc){
      title, category, displayOrder, originalFilename, folder
    }`);
    
    console.log(`📊 Total About Us images: ${aboutImages.length}`);
    
    const byCategory = {};
    aboutImages.forEach(img => {
      if (!byCategory[img.category]) byCategory[img.category] = [];
      byCategory[img.category].push(img);
    });
    
    console.log('\n📁 Images by Category:');
    Object.entries(byCategory).forEach(([cat, imgs]) => {
      console.log(`\n   ${cat} (${imgs.length}):`);
      imgs.forEach((img, i) => {
        console.log(`     ${i + 1}. ${img.originalFilename || 'N/A'} [order: ${img.displayOrder || 'N/A'}]`);
      });
    });
    
    // Quick summary for component needs
    console.log('\n🎯 Component Requirements Check:');
    console.log(`   Hero Images: ${byCategory['Hero Section']?.length || 0} (need: 1+)`);
    console.log(`   Gallery Images: ${byCategory['Gallery Section']?.length || 0} (need: 4+)`);
    console.log(`   Brand Logos: ${byCategory['Brand Section']?.length || 0} (need: 5)`);
    console.log(`   Background Shapes: ${byCategory['Background Images']?.length || 0} (need: 1+)`);
    
    const heroOk = (byCategory['Hero Section']?.length || 0) >= 1;
    const galleryOk = (byCategory['Gallery Section']?.length || 0) >= 4;  
    const brandOk = (byCategory['Brand Section']?.length || 0) === 5;
    const bgOk = (byCategory['Background Images']?.length || 0) >= 1;
    
    console.log('\n✅ Status:');
    console.log(`   Hero: ${heroOk ? '✅' : '❌'}`);
    console.log(`   Gallery: ${galleryOk ? '✅' : '❌'}`);
    console.log(`   Brands: ${brandOk ? '✅' : '❌'}`);
    console.log(`   Background: ${bgOk ? '✅' : '❌'}`);
    
    if (heroOk && galleryOk && brandOk && bgOk) {
      console.log('\n🎉 About Us page is ready for production!');
    } else {
      console.log('\n⚠️  Some image requirements not met');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN required');
  process.exit(1);
}

verifyAboutUsImages();
