const { createClient } = require('@sanity/client');

// Create Sanity client
const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skZQcAQ9gbAHpg7hhIfcStbr6KWOZOp9hUSGhOJWkg4aWejVrns4JZYbN4zyINFzsGl0wPVEdWFHu48jn'
});

// Available image assets from the fix-missing-images.js script
const imageAssets = [
  'image-4f8e8b4c5a6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f-1920x1080-jpg', // Professional headshot
  'image-5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b-1920x1080-jpg', // Creative workspace
  'image-6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c-1920x1080-jpg', // Content creation setup
  'image-7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d-1920x1080-jpg', // Behind the scenes
  'image-8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e-1920x1080-jpg'  // Professional portrait
];

// Helper function to create imageWithAlt object
function createImageWithAlt(assetId, altText) {
  return {
    _type: 'imageWithAlt',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: assetId
      }
    },
    alt: altText
  };
}

async function fixMichaelBrown() {
  try {
    console.log('🔍 Finding Michael Brown creator...');
    
    // Find Michael Brown
    const michaelBrown = await client.fetch(`
      *[_type == "exclusiveCreator" && name match "Michael Brown*"][0]{
        _id,
        name,
        heroImage,
        gallery
      }
    `);
    
    if (!michaelBrown) {
      console.log('❌ Michael Brown not found');
      return;
    }
    
    console.log('✅ Found Michael Brown:', michaelBrown.name);
    console.log('   Current heroImage:', michaelBrown.heroImage);
    console.log('   Current gallery:', michaelBrown.gallery);
    
    // Create hero image and gallery
    const heroImage = [
      createImageWithAlt(
        imageAssets[0], // Professional headshot
        'Michael Brown - Professional Content Creator Portrait'
      )
    ];
    
    const gallery = [
      createImageWithAlt(
        imageAssets[0], // Professional headshot (same as hero)
        'Michael Brown - Professional Portrait'
      ),
      createImageWithAlt(
        imageAssets[1], // Creative workspace
        'Michael Brown - Creative Workspace Setup'
      ),
      createImageWithAlt(
        imageAssets[2], // Content creation setup
        'Michael Brown - Content Creation Behind the Scenes'
      ),
      createImageWithAlt(
        imageAssets[3], // Behind the scenes
        'Michael Brown - Professional Content Creator at Work'
      )
    ];
    
    console.log('🔧 Updating Michael Brown with images...');
    
    // Update the creator
    const result = await client
      .patch(michaelBrown._id)
      .set({
        heroImage: heroImage,
        gallery: gallery
      })
      .commit();
    
    console.log('✅ Successfully updated Michael Brown!');
    console.log('   Updated document ID:', result._id);
    console.log('   Hero image added:', result.heroImage ? 'Yes' : 'No');
    console.log('   Gallery images added:', result.gallery ? result.gallery.length : 0);
    
  } catch (error) {
    console.error('❌ Error updating Michael Brown:', error.message);
    if (error.statusCode === 401) {
      console.error('   Authentication failed. Please check your SANITY_API_TOKEN.');
    }
  }
}

// Run the fix
fixMichaelBrown();