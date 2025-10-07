// Test the existing getAboutPageImages function
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

async function testExistingFunction() {
  try {
    console.log('🔍 Testing existing getAboutPageImages query structure');
    console.log('='.repeat(50));
    
    // Use the exact query from getAboutPageImages
    const query = `{
      "heroImages": *[_type == "homepageImage" && page == "About Us" && category == "Hero Section" && isActive == true] | order(displayOrder asc){
        _id,
        title,
        "url": image[0].image.asset->url,
        "alt": image[0].alt,
        originalPath,
        folder,
        priority,
        placement,
        displayOrder
      },
      "aboutSectionImages": *[_type == "homepageImage" && page == "About Us" && (category == "Gallery Section" || category == "about") && isActive == true] | order(displayOrder asc){
        _id,
        title,
        "url": image[0].image.asset->url,
        "alt": image[0].alt,
        originalPath,
        folder,
        placement,
        notes,
        displayOrder
      },
      "backgroundShapes": *[_type == "homepageImage" && page == "About Us" && (category == "Background Images" || title match "*shape*" || title match "*bg*") && isActive == true] | order(displayOrder asc){
        _id,
        title,
        "url": image[0].image.asset->url,
        "alt": image[0].alt,
        originalPath,
        folder,
        placement
      }
    }`;
    
    const result = await client.fetch(query);
    
    console.log('📊 Results from existing function query:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n🎯 Hero Image Check:');
    if (result.heroImages && result.heroImages.length > 0) {
      console.log('✅ Hero image found:', result.heroImages[0].url);
      console.log('✅ Alt text:', result.heroImages[0].alt);
      console.log('✅ Title:', result.heroImages[0].title);
    } else {
      console.log('❌ No hero images found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testExistingFunction();
