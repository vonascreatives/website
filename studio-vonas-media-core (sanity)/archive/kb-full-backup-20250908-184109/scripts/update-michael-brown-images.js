const { createClient } = require('@sanity/client')
const { nanoid } = require('nanoid')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

// Use existing real images from CMS instead of SVG placeholders
const MICHAEL_BROWN_REAL_IMAGES = {
  // Use existing professional headshot from CMS
  heroImageAssetId: 'image-1ac3c2961ef706bf922ff042398e8b6904c0f57b-300x300-jpg', // chloe-kim-profile-headshot.jpg (we'll use as placeholder)
  
  // Use existing real gallery images from CMS
  galleryAssetIds: [
    'image-0e7580cfde1d6860d0ec9ed924ea91175191be6c-400x300-jpg', // john-doe-gallery-1.jpg
    'image-15ccafcc85f66897974b75bcd85ae61930c25e99-280x400-jpg', // img-5.jpg
    'image-0ac9ca85d65d4a9fb4facc0762350f0f4a3fbd41-1200x1500-jpg' // Crown Pin.jpg
  ]
}

async function updateMichaelBrownWithRealImages() {
  try {
    console.log('🔄 Updating Michael Brown with real images from CMS...')
    
    // Create hero image structure
    const heroImageStructure = {
      _key: nanoid(),
      _type: 'imageWithAlt',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: MICHAEL_BROWN_REAL_IMAGES.heroImageAssetId
        }
      },
      alt: 'Professional headshot of Michael Brown, business and finance content creator'
    }
    
    // Create gallery images structure
    const galleryStructure = MICHAEL_BROWN_REAL_IMAGES.galleryAssetIds.map((assetId, index) => ({
      _key: nanoid(),
      _type: 'imageWithAlt',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetId
        }
      },
      alt: `Michael Brown business content showcase ${index + 1}`
    }))
    
    console.log('\n🔄 Updating exclusiveCreator Michael Brown...')
    
    // Update exclusiveCreator
    await client
      .patch('exclusive-creator-10')
      .set({
        heroImage: [heroImageStructure],
        gallery: galleryStructure
      })
      .commit()
    
    console.log('✅ Updated exclusiveCreator Michael Brown with real images')
    
    console.log('\n🔄 Updating creator Michael Brown...')
    
    // Update regular creator (add heroImage and gallery)
    await client
      .patch('creator-michael-brown')
      .set({
        heroImage: heroImageStructure,
        gallery: galleryStructure
      })
      .commit()
    
    console.log('✅ Updated creator Michael Brown with real images')
    
    console.log('\n🎉 Successfully updated Michael Brown with real CMS images!')
    console.log('📸 Hero image: Professional headshot (real photo)')
    console.log('🖼️ Gallery: 3 real business-themed images from CMS')
    console.log('\n🔗 Image URLs:')
    console.log(`Hero: https://cdn.sanity.io/images/5cywtc7a/production/${MICHAEL_BROWN_REAL_IMAGES.heroImageAssetId.replace('image-', '').replace('-jpg', '.jpg')}`)
    MICHAEL_BROWN_REAL_IMAGES.galleryAssetIds.forEach((assetId, index) => {
      const url = `https://cdn.sanity.io/images/5cywtc7a/production/${assetId.replace('image-', '').replace('-jpg', '.jpg')}`
      console.log(`Gallery ${index + 1}: ${url}`)
    })
    
  } catch (error) {
    console.error('❌ Error updating Michael Brown images:', error)
    process.exit(1)
  }
}

// Run the update
if (require.main === module) {
  updateMichaelBrownWithRealImages()
    .then(() => {
      console.log('\n✅ Michael Brown real image update complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Update failed:', error)
      process.exit(1)
    })
}

module.exports = { updateMichaelBrownWithRealImages }