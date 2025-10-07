const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-08-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function verifyYouTubeDocs() {
  try {
    console.log('🔍 Checking YouTube documents in Sanity...\n')
    
    // Query for all YouTube ID documents
    const query = `*[_type == "youtubeId"] | order(channel_number asc) {
      _id,
      _type,
      channel_number,
      channel_name,
      category,
      channel,
      "hasTypography": defined(typography),
      "hasColors": defined(colors),
      "hasShareLinks": defined(share_links)
    }`
    
    const results = await client.fetch(query)
    
    console.log(`📊 Found ${results.length} YouTube ID documents:`)
    
    if (results.length === 0) {
      console.log('❌ No YouTube documents found!')
      return
    }
    
    results.forEach((doc, index) => {
      console.log(`\n${index + 1}. ${doc.channel_number}: ${doc.channel_name}`)
      console.log(`   Category: ${doc.category}`)
      console.log(`   Creator: ${doc.channel}`)
      console.log(`   ID: ${doc._id}`)
      console.log(`   Has Typography: ${doc.hasTypography ? '✅' : '❌'}`)
      console.log(`   Has Colors: ${doc.hasColors ? '✅' : '❌'}`)
      console.log(`   Has Share Links: ${doc.hasShareLinks ? '✅' : '❌'}`)
    })
    
    // Also check if the youtubeId schema type is registered
    console.log('\n🔧 Checking schema registration...')
    const schemas = await client.fetch(`*[_type == "sanity.schemaType" && name == "youtubeId"]`)
    
    if (schemas.length > 0) {
      console.log('✅ youtubeId schema is registered')
    } else {
      console.log('❌ youtubeId schema not found in registry')
    }
    
  } catch (error) {
    console.error('❌ Error verifying YouTube docs:', error)
  }
}

verifyYouTubeDocs()
