const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01'
})

async function restoreKBStructure() {
  try {
    const ndjsonPath = path.join(__dirname, 'kb-exact-structure.ndjson')
    console.log('🔍 Reading KB structure from:', ndjsonPath)
    
    // Read the NDJSON file
    const ndjsonContent = fs.readFileSync(ndjsonPath, 'utf8')
    const documents = ndjsonContent.trim().split('\n').map(line => {
      try {
        return JSON.parse(line)
      } catch (error) {
        console.error('Error parsing line:', line)
        return null
      }
    }).filter(Boolean)

    console.log(`📊 Found ${documents.length} KB structure documents to import`)

    // Show sample of what will be imported
    console.log('\n📋 Sample documents to import:')
    documents.slice(0, 10).forEach((doc, i) => {
      console.log(`${i + 1}. ${doc._id} - "${doc.title}" (${doc.kind})`)
    })
    
    if (documents.length > 10) {
      console.log(`... and ${documents.length - 10} more`)
    }

    console.log(`\n✨ Importing ${documents.length} KB structure documents...`)

    // Import in batches
    const batchSize = 20
    let importedCount = 0

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      
      console.log(`\n📥 Importing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(documents.length/batchSize)} (${batch.length} documents)...`)

      // Use transactions for each batch
      const transaction = client.transaction()
      
      batch.forEach(doc => {
        // Ensure the document has the required fields
        const sanitizedDoc = {
          ...doc,
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString()
        }
        
        transaction.createOrReplace(sanitizedDoc)
      })

      try {
        await transaction.commit()
        console.log(`✅ Imported batch of ${batch.length} documents`)
        importedCount += batch.length
      } catch (error) {
        console.error(`❌ Failed to import batch:`, error.message)
        
        // Try importing individually if batch fails
        for (const doc of batch) {
          try {
            await client.createOrReplace(doc)
            console.log(`✅ Imported individually: ${doc._id}`)
            importedCount++
          } catch (individualError) {
            console.error(`❌ Failed to import: ${doc._id} - ${individualError.message}`)
          }
        }
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log(`\n🎉 Import complete!`)
    console.log(`📊 Imported: ${importedCount}/${documents.length} documents`)

    // Verify the import
    const importedDocs = await client.fetch(`count(*[_type == "kbItem" && _id match "kb.*"])`)
    console.log(`📈 Total kb.* documents in database: ${importedDocs}`)

    // Show the structure
    const topLevel = await client.fetch(`
      *[_type == "kbItem" && _id match "kb.*" && !defined(parent)] | order(order asc) {
        _id, title, kind, order
      }
    `)
    
    console.log('\n📁 Top-level structure restored:')
    topLevel.forEach((doc, i) => {
      console.log(`  ${i + 1}. ${doc.title} (${doc._id})`)
    })

    console.log('\n✅ KB structure restoration complete!')
    console.log('🚀 Your Knowledge Base now has the proper kb.* structure with all folders and sections.')

  } catch (error) {
    console.error('❌ Error during restoration:', error)
  }
}

restoreKBStructure()
