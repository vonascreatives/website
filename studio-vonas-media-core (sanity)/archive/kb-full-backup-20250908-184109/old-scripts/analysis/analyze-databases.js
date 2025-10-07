const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01'
})

async function analyzeAllDatabases() {
  try {
    console.log('🔍 Analyzing all document types in your Sanity database...\n')

    // Get all unique document types
    const documentTypes = await client.fetch(`
      array::unique(*[]._type) | order(@)
    `)

    console.log(`📊 Found ${documentTypes.length} document types\n`)

    const results = []

    for (const type of documentTypes) {
      try {
        // Get count
        const count = await client.fetch(`count(*[_type == "${type}"])`)
        
        // Get sample documents
        const samples = await client.fetch(`
          *[_type == "${type}"] | order(_createdAt desc) [0..2] {
            _id,
            title,
            name,
            _createdAt,
            _type
          }
        `)

        results.push({
          type,
          count,
          samples
        })
      } catch (error) {
        console.error(`❌ Error querying ${type}:`, error.message)
        results.push({
          type,
          count: 0,
          samples: [],
          error: error.message
        })
      }
    }

    // Sort by count (descending)
    results.sort((a, b) => b.count - a.count)

    console.log('📋 DATABASE SUMMARY\n' + '='.repeat(50))

    results.forEach((result, index) => {
      const { type, count, samples, error } = result
      
      console.log(`\n${index + 1}. ${type.toUpperCase()}`)
      console.log(`   📊 Count: ${count} documents`)
      
      if (error) {
        console.log(`   ❌ Error: ${error}`)
      } else if (count > 0) {
        console.log(`   📝 Sample documents:`)
        samples.forEach((sample, i) => {
          const title = sample.title || sample.name || '(no title)'
          const date = sample._createdAt ? new Date(sample._createdAt).toLocaleDateString() : 'no date'
          console.log(`      ${i + 1}. "${title}" (${sample._id}) - ${date}`)
        })
      } else {
        console.log(`   📝 No documents found`)
      }
    })

    console.log('\n' + '='.repeat(50))
    console.log(`🎯 TOTAL: ${results.reduce((sum, r) => sum + r.count, 0)} documents across ${results.length} types`)

    // Show the most populated databases
    console.log('\n📈 TOP 5 MOST POPULATED DATABASES:')
    results.slice(0, 5).forEach((result, index) => {
      if (result.count > 0) {
        console.log(`   ${index + 1}. ${result.type}: ${result.count} documents`)
      }
    })

  } catch (error) {
    console.error('❌ Error during analysis:', error)
  }
}

analyzeAllDatabases()
