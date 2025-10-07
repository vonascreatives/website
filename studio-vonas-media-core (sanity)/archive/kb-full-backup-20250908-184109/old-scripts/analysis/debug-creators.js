const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

async function debugCreators() {
  try {
    console.log('🔍 Checking what creator data exists in Sanity...')
    
    // Check for exclusiveCreator documents
    const exclusiveCreators = await client.fetch(`*[_type == "exclusiveCreator"]{ _id, name, niche }`)
    console.log('\n📋 exclusiveCreator documents:', exclusiveCreators.length)
    exclusiveCreators.forEach(creator => {
      console.log(`  - ${creator.name} (${creator.niche}) [ID: ${creator._id}]`)
    })
    
    // Check for creator documents
    const creators = await client.fetch(`*[_type == "creator"]{ _id, name, mainCategory }`)
    console.log('\n📋 creator documents:', creators.length)
    creators.forEach(creator => {
      console.log(`  - ${creator.name} (${creator.mainCategory}) [ID: ${creator._id}]`)
    })
    
    // Specifically check Michael Brown
    console.log('\n🔍 Searching for Michael Brown specifically...')
    const michaelBrown = await client.fetch(`*[_type in ["creator", "exclusiveCreator"] && name match "Michael Brown*"]{
      _id,
      _type,
      name,
      slug,
      headline,
      bio,
      niche,
      mainCategory
    }`)
    
    console.log('Michael Brown results:', michaelBrown.length)
    michaelBrown.forEach(creator => {
      console.log('\n📄 Michael Brown data:')
      console.log(`  Type: ${creator._type}`)
      console.log(`  ID: ${creator._id}`)
      console.log(`  Name: ${creator.name}`)
      console.log(`  Slug: ${creator.slug?.current || 'No slug'}`)
      console.log(`  Headline: ${creator.headline || 'No headline'}`)
      console.log(`  Bio: ${creator.bio ? (Array.isArray(creator.bio) ? creator.bio[0]?.children?.[0]?.text : creator.bio) : 'No bio'}`)
      console.log(`  Niche: ${creator.niche || 'No niche'}`)
      console.log(`  Main Category: ${creator.mainCategory || 'No main category'}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

debugCreators()