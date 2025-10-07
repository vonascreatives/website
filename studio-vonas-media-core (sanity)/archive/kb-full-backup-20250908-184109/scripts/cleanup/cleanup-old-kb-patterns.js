const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01'
})

async function cleanupOldKBPatterns() {
  try {
    console.log('🧹 Cleaning up old KB patterns...\n')
    
    // Find documents to DELETE:
    // 1. kbItem documents with kb- pattern (OLD)
    // 2. kbItem documents with random IDs (JUNK)
    // KEEP: kbItem documents with kb.* pattern (NEW V5 SYSTEM)
    
    const documentsToDelete = await client.fetch(`
      *[_type == "kbItem" && (
        // OLD kb- pattern
        _id match "kb-*"
        ||
        // JUNK - Random IDs (not starting with kb. or kb-)
        (!(_id match "kb.*") && !(_id match "kb-*"))
      )] {
        _id,
        title,
        _type
      } | order(_id)
    `)

    console.log(`📊 Found ${documentsToDelete.length} old KB pattern documents to delete`)

    if (documentsToDelete.length === 0) {
      console.log('✨ No old patterns to clean up!')
      return
    }

    // Show what we're keeping vs deleting
    const keepDocs = await client.fetch(`count(*[_type == "kbItem" && _id match "kb.*"])`)
    console.log(`✅ KEEPING: ${keepDocs} documents with kb.* pattern (NEW V5 SYSTEM)`)
    
    // Show sample of what will be deleted
    console.log(`❌ DELETING: ${documentsToDelete.length} old pattern documents`)
    console.log('\n📋 Sample documents to delete:')
    documentsToDelete.slice(0, 10).forEach((doc, i) => {
      const pattern = doc._id.startsWith('kb-') ? '(kb- pattern)' : '(random ID)'
      console.log(`${i + 1}. ${doc._id} - "${doc.title || '(no title)'}" ${pattern}`)
    })
    
    if (documentsToDelete.length > 10) {
      console.log(`... and ${documentsToDelete.length - 10} more`)
    }

    console.log(`\n🗑️  Proceeding to delete ${documentsToDelete.length} documents...`)

    // Delete in batches
    const batchSize = 20
    let deletedCount = 0

    for (let i = 0; i < documentsToDelete.length; i += batchSize) {
      const batch = documentsToDelete.slice(i, i + batchSize)
      
      console.log(`\n🗑️  Deleting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(documentsToDelete.length/batchSize)} (${batch.length} documents)...`)

      for (const doc of batch) {
        try {
          await client.delete(doc._id)
          console.log(`✅ Deleted: ${doc._id}`)
          deletedCount++
        } catch (error) {
          try {
            await client.delete(`drafts.${doc._id}`)
            console.log(`✅ Deleted draft: ${doc._id}`)
            deletedCount++
          } catch (draftError) {
            console.log(`❌ Failed to delete: ${doc._id} - ${error.message}`)
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log(`\n🎉 Cleanup complete!`)
    console.log(`📊 Deleted: ${deletedCount} old pattern documents`)

    // Verify final state
    const remainingKbItems = await client.fetch(`count(*[_type == "kbItem"])`)
    const properKbDocs = await client.fetch(`count(*[_type == "kbItem" && _id match "kb.*"])`)
    
    console.log(`📈 Total kbItem documents remaining: ${remainingKbItems}`)
    console.log(`✅ Proper kb.* documents: ${properKbDocs}`)
    console.log(`❌ Other patterns remaining: ${remainingKbItems - properKbDocs}`)

    if (remainingKbItems === properKbDocs) {
      console.log('\n🏆 SUCCESS! You now have ONLY the clean kb.* pattern system!')
      
      // Show the clean structure
      const topLevel = await client.fetch(`
        *[_type == "kbItem" && _id match "kb.*" && !defined(parent)] | order(order asc) {
          _id, title
        }
      `)
      
      console.log('\n📁 Your clean KB structure:')
      topLevel.forEach((doc, i) => {
        console.log(`  ${i + 1}. ${doc.title} (${doc._id})`)
      })
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

cleanupOldKBPatterns()
