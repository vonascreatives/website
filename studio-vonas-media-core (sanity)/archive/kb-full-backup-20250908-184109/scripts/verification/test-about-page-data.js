const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function testAboutPageData() {
  try {
    console.log('🧪 Testing About Page Data Fetching...');
    console.log('=' .repeat(50));
    
    // Test About Page Images query (matching the lib/sanity.ts query)
    console.log('\n📸 Testing About Page Images Query...');
    const aboutPageImages = await client.fetch(`{
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
    }`);
    
    console.log(`✅ Hero Images: ${aboutPageImages.heroImages.length}`);
    aboutPageImages.heroImages.forEach(img => {
      console.log(`   - ${img.title} (Order: ${img.displayOrder})`);
    });
    
    console.log(`✅ About Section Images: ${aboutPageImages.aboutSectionImages.length}`);
    aboutPageImages.aboutSectionImages.forEach(img => {
      console.log(`   - ${img.title} (Order: ${img.displayOrder})`);
    });
    
    console.log(`✅ Background Shapes: ${aboutPageImages.backgroundShapes.length}`);
    aboutPageImages.backgroundShapes.forEach(img => {
      console.log(`   - ${img.title}`);
    });
    
    // Test Brand Collaboration query
    console.log('\n🏢 Testing Brand Collaboration Query...');
    const brandCollaborations = await client.fetch(`*[_type == "brandCollaboration" && status == "active"]{
      _id,
      brandName,
      "logo": logo[0].image.asset->url,
      "logoAlt": logo[0].alt,
      slug
    } | order(_createdAt desc)`);
    
    console.log(`✅ Active Brand Collaborations: ${brandCollaborations.length}`);
    brandCollaborations.forEach(brand => {
      console.log(`   - ${brand.brandName} (Has logo: ${brand.logo ? '✅' : '❌'})`);
    });
    
    // Test Team Members query
    console.log('\n👥 Testing Team Members Query...');
    const teamMembers = await client.fetch(`*[_type == "teamMember"] | order(order asc){
      _id,
      name,
      role,
      "photo": photo[0].image.asset->url,
      "photoAlt": photo[0].alt,
      order
    }`);
    
    console.log(`✅ Team Members: ${teamMembers.length}`);
    teamMembers.forEach(member => {
      console.log(`   - ${member.name} - ${member.role} (Has photo: ${member.photo ? '✅' : '❌'})`);
    });
    
    console.log('\n🎉 All About Page Data Queries Working!');
    console.log('\n📊 Summary:');
    console.log(`   📸 About Images: ${aboutPageImages.heroImages.length + aboutPageImages.aboutSectionImages.length + aboutPageImages.backgroundShapes.length} total`);
    console.log(`   🏢 Brand Collaborations: ${brandCollaborations.length}`);
    console.log(`   👥 Team Members: ${teamMembers.length}`);
    
    return {
      aboutPageImages,
      brandCollaborations, 
      teamMembers
    };
    
  } catch (error) {
    console.error('❌ Error testing About page data:', error);
  }
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

testAboutPageData();
