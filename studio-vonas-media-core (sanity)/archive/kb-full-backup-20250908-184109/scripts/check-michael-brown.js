const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

async function checkMichaelBrown() {
  try {
    console.log('🔍 Checking Michael Brown current images...')
    
    // Check exclusiveCreator
    const exclusiveCreator = await client.fetch('*[_id == "exclusive-creator-10"]{name, heroImage, gallery}[0]')
    console.log('\n📋 Exclusive Creator Michael Brown:')
    console.log(JSON.stringify(exclusiveCreator, null, 2))
    
    // Check regular creator
    const creator = await client.fetch('*[_id == "creator-michael-brown"]{name, heroImage, gallery}[0]')
    console.log('\n📋 Creator Michael Brown:')
    console.log(JSON.stringify(creator, null, 2))
    
    // Check if images are SVG placeholders
    if (exclusiveCreator?.heroImage?.[0]?.image?.asset?._ref) {
      const heroAssetId = exclusiveCreator.heroImage[0].image.asset._ref
      console.log('\n🖼️ Hero Image Asset ID:', heroAssetId)
      
      if (heroAssetId.includes('svg')) {
        console.log('⚠️ Hero image is SVG placeholder')
      } else {
        console.log('✅ Hero image is real photo')
      }
    }
    
    if (exclusiveCreator?.gallery?.length > 0) {
      console.log('\n🖼️ Gallery Images:')
      exclusiveCreator.gallery.forEach((img, index) => {
        const assetId = img.image?.asset?._ref
        console.log(`Gallery ${index + 1}: ${assetId}`)
        if (assetId?.includes('svg')) {
          console.log(`  ⚠️ Gallery image ${index + 1} is SVG placeholder`)
        } else {
          console.log(`  ✅ Gallery image ${index + 1} is real photo`)
        }
      })
    }
    
  } catch (error) {
    console.error('❌ Error checking Michael Brown:', error)
  }
}

checkMichaelBrown()