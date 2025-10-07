const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-01-01'
})

// Available image assets - using professional/business-looking ones for Michael Brown
const professionalImages = [
  'image-5d0064c5acf932ac6b0f2143591d7e2ccefed0e7-800x600-jpg', // photo-1460925895917-afdab827c52f
  'image-785e5c786e1b19b01f30cacf35bcf77978cafa08-800x600-jpg', // photo-1611224923853-80b023f02d71
  'image-bb3871c0f874e8c251174ac6160e8e248b1e2d5e-800x600-jpg', // photo-1611605698335-8b1569810432
  'image-e69eb259e2e904baca50552946eac261bdc0402b-800x600-jpg', // photo-1563013544-824ae1b704d3
  'image-ef5160103a5e623877babfb518d8f8c0fa92d6a0-800x600-jpg', // photo-1551288049-bebda4e38f71
]

function createImageWithAlt(imageRef, altText) {
  return {
    _type: 'imageWithAlt',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageRef
      }
    },
    alt: altText
  }
}

async function fixMichaelBrown() {
  console.log('🔍 Finding Michael Brown creator...')
  
  // Find Michael Brown by slug
  const creator = await client.fetch(`*[_type == "exclusiveCreator" && slug.current == "michael-brown"][0]`)
  
  if (!creator) {
    console.log('❌ Michael Brown not found!')
    return
  }
  
  console.log(`✅ Found creator: ${creator.name}`)
  console.log(`Current heroImage: ${creator.heroImage}`)
  console.log(`Current gallery: ${creator.gallery}`)
  
  const patches = {}
  
  // Add heroImage if missing
  if (!creator.heroImage || creator.heroImage.length === 0) {
    patches.heroImage = [
      createImageWithAlt(
        professionalImages[0], // Use first professional image
        'Michael Brown - Business & Finance Content Creator'
      )
    ]
    console.log('📸 Adding heroImage...')
  }
  
  // Add gallery if missing
  if (!creator.gallery || creator.gallery.length === 0) {
    patches.gallery = [
      createImageWithAlt(
        professionalImages[1],
        'Michael Brown creating financial content'
      ),
      createImageWithAlt(
        professionalImages[2],
        'Michael Brown in professional setting'
      ),
      createImageWithAlt(
        professionalImages[3],
        'Michael Brown business consultation'
      ),
      createImageWithAlt(
        professionalImages[4],
        'Michael Brown content creation setup'
      )
    ]
    console.log('🖼️ Adding gallery images...')
  }
  
  if (Object.keys(patches).length > 0) {
    console.log('🚀 Updating Michael Brown with new images...')
    await client.patch(creator._id).set(patches).commit()
    console.log('✅ Michael Brown updated successfully!')
    
    // Verify the update
    const updatedCreator = await client.fetch(`*[_type == "exclusiveCreator" && slug.current == "michael-brown"][0]{
      _id,
      name,
      heroImage,
      gallery
    }`)
    
    console.log('\n📊 Updated data:')
    console.log(`HeroImage: ${updatedCreator.heroImage ? 'SET' : 'NULL'}`)
    console.log(`Gallery: ${updatedCreator.gallery ? `${updatedCreator.gallery.length} images` : 'NULL'}`)
  } else {
    console.log('ℹ️ Michael Brown already has images, no update needed.')
  }
}

async function main() {
  try {
    console.log('🚀 Starting Michael Brown image fix...')
    await fixMichaelBrown()
    console.log('\n✅ Process completed!')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()