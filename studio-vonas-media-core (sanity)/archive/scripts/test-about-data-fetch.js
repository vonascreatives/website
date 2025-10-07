const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function testAboutDataFetch() {
  try {
    console.log('🔍 Testing About Us Data Fetch (for debugging)');
    console.log('='.repeat(50));
    
    // Same query as the app router
    const rawData = await client.fetch(`{
      "heroImages": *[_type == "homepageImage" && page == "About Us" && category == "Hero Section"] | order(displayOrder asc) {
        _id,
        title,
        image[0] {
          image {
            asset-> {
              _id,
              url
            }
          },
          alt,
          caption
        },
        displayOrder,
        placement
      },
      "aboutSectionImages": *[_type == "homepageImage" && page == "About Us" && category == "Gallery Section"] | order(displayOrder asc) {
        _id,
        title,
        image[0] {
          image {
            asset-> {
              _id,
              url
            }
          },
          alt,
          caption
        },
        displayOrder
      },
      "backgroundShapes": *[_type == "homepageImage" && page == "About Us" && category == "Background Images"] | order(displayOrder asc) {
        _id,
        title,
        image[0] {
          image {
            asset-> {
              _id,
              url
            }
          },
          alt,
          caption
        },
        displayOrder
      }
    }`);

    console.log('📊 Raw Sanity Data:');
    console.log(JSON.stringify(rawData, null, 2));
    
    // Transform like the component expects
    const transformedData = {
      heroImages: rawData.heroImages.map(img => ({
        _id: img._id,
        title: img.title,
        url: img.image?.image?.asset?.url,
        alt: img.image?.alt || img.title,
        placement: img.placement,
        displayOrder: img.displayOrder
      })),
      aboutSectionImages: rawData.aboutSectionImages.map(img => ({
        _id: img._id,
        title: img.title,
        url: img.image?.image?.asset?.url,
        alt: img.image?.alt || img.title,
        displayOrder: img.displayOrder
      })),
      backgroundShapes: rawData.backgroundShapes.map(img => ({
        _id: img._id,
        title: img.title,
        url: img.image?.image?.asset?.url,
        alt: img.image?.alt || img.title,
        displayOrder: img.displayOrder
      }))
    };

    console.log('\n🔄 Transformed Data for Components:');
    console.log(JSON.stringify(transformedData, null, 2));
    
    console.log('\n✅ Hero Image URL:', transformedData.heroImages[0]?.url || 'NOT FOUND');
    console.log('✅ Gallery Images:', transformedData.aboutSectionImages.length);
    console.log('✅ Background Shapes:', transformedData.backgroundShapes.length);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN required');
  process.exit(1);
}

testAboutDataFetch();
