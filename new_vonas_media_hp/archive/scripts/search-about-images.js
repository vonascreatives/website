// Search for ALL possible About Us images in Sanity
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function searchAllAboutImages() {
  console.log('🔍 SEARCHING FOR ALL ABOUT US IMAGES IN SANITY');
  console.log('='.repeat(60));
  
  try {
    console.log('1️⃣ CHECKING FOR aboutUsImages DOCUMENT TYPE');
    console.log('-'.repeat(40));
    
    const aboutUsImagesCheck = await client.fetch(`*[_type == "aboutUsImages"]{
      _id,
      _type,
      heroImage,
      galleryImages,
      backgroundShapes,
      brandLogos
    }`);
    
    console.log(`Found ${aboutUsImagesCheck.length} aboutUsImages documents`);
    if (aboutUsImagesCheck.length > 0) {
      console.log('aboutUsImages structure:', JSON.stringify(aboutUsImagesCheck[0], null, 2));
    }
    
    console.log('\n2️⃣ SEARCHING homepageImage FOR ABOUT-RELATED IMAGES');
    console.log('-'.repeat(40));
    
    const aboutHomepageImages = await client.fetch(`*[_type == "homepageImage" && (
      title match "*about*" || 
      title match "*About*" || 
      category match "*about*" || 
      category match "*About*" ||
      folder match "*about*" ||
      folder match "*About*"
    )]{
      _id,
      title,
      category,
      folder,
      "url": image[0].image.asset->url,
      "alt": image[0].alt,
      displayOrder,
      placement
    }`);
    
    console.log(`Found ${aboutHomepageImages.length} About-related homepageImage documents:`);
    aboutHomepageImages.forEach((img, i) => {
      console.log(`${i + 1}. Title: ${img.title}`);
      console.log(`   Category: ${img.category}`);
      console.log(`   Folder: ${img.folder}`);
      console.log(`   URL: ${img.url}`);
      console.log('');
    });
    
    console.log('\n3️⃣ SEARCHING ALL IMAGES WITH "hero" IN TITLE/CATEGORY');
    console.log('-'.repeat(40));
    
    const heroImages = await client.fetch(`*[_type == "homepageImage" && (
      title match "*hero*" || 
      title match "*Hero*" || 
      category match "*hero*" || 
      category match "*Hero*"
    )]{
      _id,
      title,
      category,
      folder,
      "url": image[0].image.asset->url,
      "alt": image[0].alt,
      displayOrder
    }`);
    
    console.log(`Found ${heroImages.length} Hero images:`);
    heroImages.forEach((img, i) => {
      console.log(`${i + 1}. ${img.title} (Category: ${img.category})`);
      console.log(`   URL: ${img.url}`);
    });
    
    console.log('\n4️⃣ SEARCHING FOR "Hero Section" CATEGORY');
    console.log('-'.repeat(40));
    
    const heroSectionImages = await client.fetch(`*[_type == "homepageImage" && category == "Hero Section"]{
      _id,
      title,
      category,
      folder,
      "url": image[0].image.asset->url,
      "alt": image[0].alt,
      displayOrder
    }`);
    
    console.log(`Found ${heroSectionImages.length} "Hero Section" images:`);
    heroSectionImages.forEach((img, i) => {
      console.log(`${i + 1}. ${img.title}`);
      console.log(`   URL: ${img.url}`);
    });
    
    console.log('\n5️⃣ SEARCHING FOR "Gallery Section" CATEGORY');
    console.log('-'.repeat(40));
    
    const gallerySectionImages = await client.fetch(`*[_type == "homepageImage" && category == "Gallery Section"]{
      _id,
      title,
      category,
      folder,
      "url": image[0].image.asset->url,
      "alt": image[0].alt,
      displayOrder
    }`);
    
    console.log(`Found ${gallerySectionImages.length} "Gallery Section" images:`);
    gallerySectionImages.forEach((img, i) => {
      console.log(`${i + 1}. ${img.title}`);
      console.log(`   URL: ${img.url}`);
    });
    
    console.log('\n6️⃣ SEARCHING FOR "Brand Section" CATEGORY');
    console.log('-'.repeat(40));
    
    const brandSectionImages = await client.fetch(`*[_type == "homepageImage" && category == "Brand Section"]{
      _id,
      title,
      category,
      folder,
      "url": image[0].image.asset->url,
      "alt": image[0].alt,
      displayOrder
    }`);
    
    console.log(`Found ${brandSectionImages.length} "Brand Section" images:`);
    brandSectionImages.forEach((img, i) => {
      console.log(`${i + 1}. ${img.title}`);
      console.log(`   URL: ${img.url}`);
    });
    
    console.log('\n7️⃣ SEARCHING FOR "Background Images" CATEGORY');
    console.log('-'.repeat(40));
    
    const backgroundImages = await client.fetch(`*[_type == "homepageImage" && category == "Background Images"]{
      _id,
      title,
      category,
      folder,
      "url": image[0].image.asset->url,
      "alt": image[0].alt,
      displayOrder
    }`);
    
    console.log(`Found ${backgroundImages.length} "Background Images":`);
    backgroundImages.forEach((img, i) => {
      console.log(`${i + 1}. ${img.title}`);
      console.log(`   URL: ${img.url}`);
    });
    
    console.log('\n🎯 RECOMMENDATION:');
    console.log('='.repeat(60));
    
    if (aboutUsImagesCheck.length > 0) {
      console.log('✅ Use aboutUsImages document type');
    } else if (aboutHomepageImages.length > 0) {
      console.log('✅ Use About-related homepageImage documents');
    } else {
      console.log('✅ Use Hero Section, Gallery Section, Brand Section, Background Images');
      console.log('   - Hero: Hero Section category');
      console.log('   - Gallery: Gallery Section category');
      console.log('   - Brand logos: Brand Section category');
      console.log('   - Background: Background Images category');
    }
    
  } catch (error) {
    console.error('❌ Error searching images:', error);
  }
}

searchAllAboutImages();
