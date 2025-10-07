const { createClient } = require('@sanity/client')

// Initialize Sanity client
const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Using the token from .env.mcp
  apiVersion: '2024-01-01'
})

// Documents to keep (the 6 valuable documents)
const documentsToKeep = [
  'kbItem.new.about-vonas-media-complete',
  'kbItem.v5.slack-team-communication', 
  'kbItem.v5.smartsuite-comprehensive-guide',
  'kbItem.v5.time-off-policy',
  'kbItem.v5.tools-systems-faqs',
  'kbItem.v5.vision-mission-purpose'
]

async function bulkDeleteDocuments() {
  try {
    console.log('🔍 Finding documents to delete...')
    
    // Get all kbItem documents except the ones we want to keep
    const documentsToDelete = await client.fetch(`
      *[_type == "kbItem" && !(_id in $keepIds)] {
        _id,
        title,
        _type
      }
    `, { keepIds: documentsToKeep })

    console.log(`📊 Found ${documentsToDelete.length} documents to delete`)
    console.log(`✅ Keeping ${documentsToKeep.length} valuable documents`)

    if (documentsToDelete.length === 0) {
      console.log('✨ No documents to delete!')
      return
    }

    // Show sample of documents that will be deleted
    console.log('\n📋 Sample documents to delete:')
    documentsToDelete.slice(0, 10).forEach((doc, i) => {
      console.log(`${i + 1}. ${doc._id} - "${doc.title || '(empty title)'}"`)
    })
    
    if (documentsToDelete.length > 10) {
      console.log(`... and ${documentsToDelete.length - 10} more`)
    }

    // Confirm deletion
    console.log(`\n⚠️  About to delete ${documentsToDelete.length} documents`)
    console.log('This will keep only these 6 valuable documents:')
    documentsToKeep.forEach((id, i) => {
      console.log(`${i + 1}. ${id}`)
    })

    // Delete documents in batches to avoid overwhelming the API
    const batchSize = 50
    let deletedCount = 0

    for (let i = 0; i < documentsToDelete.length; i += batchSize) {
      const batch = documentsToDelete.slice(i, i + batchSize)
      
      console.log(`\n🗑️  Deleting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(documentsToDelete.length/batchSize)} (${batch.length} documents)...`)

      // Delete each document in the batch
      for (const doc of batch) {
        try {
          // Try to delete the published version first
          await client.delete(doc._id)
          console.log(`✅ Deleted: ${doc._id}`)
          deletedCount++
        } catch (error) {
          // If published deletion fails, try draft version
          try {
            await client.delete(`drafts.${doc._id}`)
            console.log(`✅ Deleted draft: ${doc._id}`)
            deletedCount++
          } catch (draftError) {
            console.log(`❌ Failed to delete: ${doc._id} - ${error.message}`)
          }
        }
      }

      // Add a small delay between batches to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`\n🎉 Cleanup complete!`)
    console.log(`📊 Deleted: ${deletedCount} documents`)
    console.log(`✅ Kept: ${documentsToKeep.length} valuable documents`)

    // Verify final state
    const remainingDocs = await client.fetch(`count(*[_type == "kbItem"])`)
    console.log(`📈 Total kbItem documents remaining: ${remainingDocs}`)

  } catch (error) {
    console.error('❌ Error during bulk deletion:', error)
  }
}

// Run the cleanup
bulkDeleteDocuments()
