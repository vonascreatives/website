// Test current About Us page data structure
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

// Copy the current getAboutPageImages function
async function getCurrentAboutPageImages() {
  // Since aboutUsImages doesn't exist in Sanity, return fallback directly
  const query = null;
  
  const fallback = {
    heroImages: [
      {
        _id: 'fallback-about-hero',
        title: 'About Hero Background',
        url: '/assets/img/inner-about/hero/hero-1.jpg',
        alt: 'About page hero background',
        originalPath: 'assets/img/inner-about/hero/hero-1.jpg',
        placement: 'Hero background',
        displayOrder: 1
      }
    ],
    aboutSectionImages: [
      {
        _id: 'fallback-about-shape',
        title: 'About Shape Decoration',
        url: '/assets/img/inner-about/about/shape-1.png',
        alt: 'About section decorative shape',
        originalPath: 'assets/img/inner-about/about/shape-1.png',
        placement: 'Decorative shape',
        displayOrder: 1
      },
      {
        _id: 'fallback-about-1',
        title: 'About Image 1',
        url: '/assets/img/inner-about/about/about-1.jpg',
        alt: 'About section main image',
        originalPath: 'assets/img/inner-about/about/about-1.jpg',
        placement: 'Main content image',
        displayOrder: 2
      },
      {
        _id: 'fallback-about-2',
        title: 'About Image 2', 
        url: '/assets/img/inner-about/about/about-2.jpg',
        alt: 'About section secondary image',
        originalPath: 'assets/img/inner-about/about/about-2.jpg',
        placement: 'Secondary image',
        displayOrder: 3
      },
      {
        _id: 'fallback-about-3',
        title: 'About Image 3',
        url: '/assets/img/inner-about/about/about-3.jpg',
        alt: 'About section tertiary image',
        originalPath: 'assets/img/inner-about/about/about-3.jpg',
        placement: 'Tertiary image',
        displayOrder: 4
      }
    ],
    backgroundShapes: [
      {
        _id: 'fallback-bg-shape',
        title: 'Brand Background Shape',
        url: '/assets/img/inner-about/brand/brand-bg-shape.png',
        alt: 'Brand section background shape',
        originalPath: 'assets/img/inner-about/brand/brand-bg-shape.png',
        placement: 'Background decoration'
      }
    ]
  };
  
  return fallback; // Always returns fallback since query is null
}

async function testCurrentAboutUs() {
  console.log('🧪 TESTING CURRENT ABOUT US DATA');
  console.log('='.repeat(50));
  
  const aboutPageImages = await getCurrentAboutPageImages();
  
  console.log('📋 CURRENT ABOUT PAGE IMAGES STRUCTURE:');
  console.log(JSON.stringify(aboutPageImages, null, 2));
  
  console.log('\n🔍 COMPONENT EXPECTATIONS:');
  console.log('1. AboutUsHero expects: heroImages array');
  console.log('2. AboutUsArea expects: aboutSectionImages array with displayOrder 1-4');
  console.log('3. BrandFive expects: backgroundShapes array');
  
  console.log('\n✅ WHAT WE HAVE:');
  console.log(`   heroImages: ${aboutPageImages.heroImages?.length || 0} items`);
  console.log(`   aboutSectionImages: ${aboutPageImages.aboutSectionImages?.length || 0} items`);
  console.log(`   backgroundShapes: ${aboutPageImages.backgroundShapes?.length || 0} items`);
  
  console.log('\n❌ PROBLEM: All images are static fallback paths, not from Sanity CMS!');
  
  return aboutPageImages;
}

testCurrentAboutUs();
