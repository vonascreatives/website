const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function fixAboutHeroImages() {
  try {
    console.log('🔧 Fixing About Us Hero Section Images...');
    
    // Find the actual hero image (hero-1.jpg) and update its category
    const heroImage = await client.fetch(`*[_type == "homepageImage" && page == "About Us" && (
      originalFilename == "hero-1.jpg" || 
      title match "*Hero hero*"
    )][0]{
      _id, title, category, originalFilename
    }`);
    
    if (heroImage) {
      console.log(`📸 Found hero image: ${heroImage.title}`);
      console.log(`   Current category: ${heroImage.category}`);
      
      if (heroImage.category !== 'Hero Section') {
        console.log('🔄 Updating to Hero Section category...');
        await client.patch(heroImage._id).set({
          category: 'Hero Section',
          placement: 'About page hero background',
          displayOrder: 1
        }).commit();
        console.log('✅ Updated hero image category!');
      } else {
        console.log('✅ Hero image already correctly categorized!');
      }
    } else {
      console.log('❌ No hero image found to fix');
    }
    
    // Test the query again
    console.log('\n🧪 Testing hero images query...');
    const testHero = await client.fetch(`*[_type == "homepageImage" && page == "About Us" && category == "Hero Section" && isActive == true]{
      _id, title, category, displayOrder
    }`);
    
    console.log(`✅ Hero Section images now: ${testHero.length}`);
    testHero.forEach(img => {
      console.log(`   - ${img.title} (Order: ${img.displayOrder})`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing hero images:', error);
  }
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

fixAboutHeroImages();
