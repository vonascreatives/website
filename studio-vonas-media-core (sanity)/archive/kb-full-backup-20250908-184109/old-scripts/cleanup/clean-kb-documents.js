const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01'
})

async function cleanKBDocuments() {
  try {
    console.log('🔍 Finding all KB documents (excluding folders)...')
    
    // Get all kbItem documents that are NOT folder types
    // Folders typically have kind: "folder" or no content/body
    const documentsToDelete = await client.fetch(`
      *[_type == "kbItem" && (
        // Documents with content (not folders)
        defined(body) || 
        defined(summary) ||
        defined(content) ||
        // Any document that is clearly not a structural folder
        !(kind == "folder" || docType == "folder")
      )] {
        _id,
        title,
        kind,
        docType,
        _type
      } | order(_id)
    `)

    console.log(`📊 Found ${documentsToDelete.length} KB documents to clean`)

    if (documentsToDelete.length === 0) {
      console.log('✨ No documents to delete!')
      return
    }

    // Show sample of what will be deleted
    console.log('\n📋 Sample documents to delete:')
    documentsToDelete.slice(0, 10).forEach((doc, i) => {
      console.log(`${i + 1}. ${doc._id} - "${doc.title || '(no title)'}" (${doc.kind || doc.docType || 'document'})`)
    })
    
    if (documentsToDelete.length > 10) {
      console.log(`... and ${documentsToDelete.length - 10} more`)
    }

    console.log(`\n⚠️  About to delete ${documentsToDelete.length} KB documents`)
    console.log('This will preserve folder structure but clean all content documents')

    // Delete in batches
    const batchSize = 50
    let deletedCount = 0

    for (let i = 0; i < documentsToDelete.length; i += batchSize) {
      const batch = documentsToDelete.slice(i, i + batchSize)
      
      console.log(`\n🗑️  Cleaning batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(documentsToDelete.length/batchSize)} (${batch.length} documents)...`)

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

    // Check what's left
    const remainingDocs = await client.fetch(`count(*[_type == "kbItem"])`)
    const folders = await client.fetch(`*[_type == "kbItem"] | order(_id) {_id, title, kind, docType}[0..10]`)
    
    console.log(`📈 Total kbItem documents remaining: ${remainingDocs}`)
    console.log('\n📁 Remaining structure:')
    folders.forEach(doc => {
      console.log(`  ${doc._id} - "${doc.title || '(no title)'}" (${doc.kind || doc.docType || 'unknown'})`)
    })

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

cleanKBDocuments()
