const { createClient } = require('@sanity/client')

// Initialize Sanity client
const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01'
})

// Documents to KEEP:
// System 1: kb.* pattern (NEW V5 SYSTEM) - proper titles
// System 5: Individual articles (6 valuable documents)
const documentsToKeep = [
  // System 5: Individual valuable documents
  'kbItem.new.about-vonas-media-complete',
  'kbItem.v5.slack-team-communication', 
  'kbItem.v5.smartsuite-comprehensive-guide',
  'kbItem.v5.time-off-policy',
  'kbItem.v5.tools-systems-faqs',
  'kbItem.v5.vision-mission-purpose'
  // System 1: kb.* pattern will be handled in the query
]

async function bulkDeleteDocuments() {
  try {
    console.log('🔍 Finding documents to delete...')
    
    // Get documents to DELETE:
    // - System 2: kbItem.v5.* pattern (empty titles)
    // - System 3: kbItem.v5.*****.page.***** pattern (empty titles)  
    // - System 4: Old category system (emoji categories)
    const documentsToDelete = await client.fetch(`
      *[_type == "kbItem" 
        && (
          // System 2: kbItem.v5.* pattern with empty titles
          (_id match "kbItem.v5.*" && (title == null || title == ""))
          ||
          // System 4: Old category system with emoji patterns
          (_id match "kbItem.company-*" 
            || _id match "kbItem.external-*" 
            || _id match "kbItem.team-*" 
            || _id match "kbItem.production-*" 
            || _id match "kbItem.youtube-*" 
            || _id match "kbItem.tools-*" 
            || _id match "kbItem.policies-*")
        )
        && !(_id in $keepIds)
        && !(_id match "kb.*")] {
        _id,
        title,
        _type
      }
    `, { keepIds: documentsToKeep })

    console.log(`📊 Found ${documentsToDelete.length} documents to delete`)

    if (documentsToDelete.length === 0) {
      console.log('✨ No documents to delete!')
      return
    }

    // Show what we're keeping
    console.log('\n✅ KEEPING:')
    console.log('- System 1: kb.* pattern (NEW V5 SYSTEM)')
    const kbDocs = await client.fetch(`*[_type == "kbItem" && _id match "kb.*"] | order(_id) {_id, title}`)
    console.log(`  Found ${kbDocs.length} kb.* documents:`)
    kbDocs.slice(0, 5).forEach(doc => {
      console.log(`    ${doc._id} - "${doc.title}"`)
    })
    if (kbDocs.length > 5) console.log(`    ... and ${kbDocs.length - 5} more kb.* documents`)

    console.log('\n- System 5: Individual articles (6 valuable documents):')
    documentsToKeep.forEach((id, i) => {
      console.log(`  ${i + 1}. ${id}`)
    })

    // Show sample of documents that will be deleted
    console.log('\n❌ DELETING:')
    console.log('- System 2: kbItem.v5.* pattern (empty titles)')
    console.log('- System 3: kbItem.v5.*****.page.***** pattern (empty titles)')
    console.log('- System 4: Old category system (emoji categories)')
    console.log('\n📋 Sample documents to delete:')
    documentsToDelete.slice(0, 10).forEach((doc, i) => {
      console.log(`${i + 1}. ${doc._id} - "${doc.title || '(empty title)'}"`)
    })
    
    if (documentsToDelete.length > 10) {
      console.log(`... and ${documentsToDelete.length - 10} more`)
    }

    console.log(`\n⚠️  About to delete ${documentsToDelete.length} documents`)

    // Delete documents in batches
    const batchSize = 50
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

      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`\n🎉 Cleanup complete!`)
    console.log(`📊 Deleted: ${deletedCount} documents`)

    // Verify final state
    const remainingDocs = await client.fetch(`count(*[_type == "kbItem"])`)
    const kbDocsCount = await client.fetch(`count(*[_type == "kbItem" && _id match "kb.*"])`)
    console.log(`📈 Total kbItem documents remaining: ${remainingDocs}`)
    console.log(`✅ NEW V5 SYSTEM (kb.*): ${kbDocsCount} documents`)
    console.log(`✅ Individual articles: ${documentsToKeep.length} documents`)

  } catch (error) {
    console.error('❌ Error during bulk deletion:', error)
  }
}

bulkDeleteDocuments()
