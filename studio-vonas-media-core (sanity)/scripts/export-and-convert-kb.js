import {createClient} from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'fs'

// Load environment variables
dotenv.config()

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

async function exportAndConvertKbItems() {
  try {
    console.log('🔍 Exporting all kbItem documents...')
    
    // Get all kbItem documents
    const kbItems = await client.fetch(`
      *[_type == "kbItem"]{
        _id,
        _createdAt,
        _updatedAt,
        ...
      }
    `)
    
    console.log(`Found ${kbItems.length} kbItem documents`)
    
    if (kbItems.length === 0) {
      console.log('No kbItem documents found.')
      return
    }

    // Convert to kb documents
    const kbDocuments = kbItems.map(doc => ({
      ...doc,
      _type: 'kb',
      _id: doc._id // Keep the same ID
    }))

    // Save to NDJSON file
    const ndjsonContent = kbDocuments.map(doc => JSON.stringify(doc)).join('\n')
    fs.writeFileSync('./kb-documents-export.ndjson', ndjsonContent)
    
    console.log('✅ Exported documents to kb-documents-export.ndjson')
    console.log('📝 Sample document structure:')
    console.log(JSON.stringify(kbDocuments[0], null, 2))
    
    return kbDocuments
    
  } catch (error) {
    console.error('💥 Export failed:', error)
  }
}

async function deleteAllKbItems() {
  try {
    console.log('🗑️ Deleting all kbItem documents...')
    
    // Get all kbItem document IDs
    const kbItemIds = await client.fetch(`*[_type == "kbItem"]._id`)
    
    console.log(`Found ${kbItemIds.length} kbItem documents to delete`)
    
    let deleted = 0
    let failed = 0
    
    for (const id of kbItemIds) {
      try {
        await client.delete(id)
        console.log(`  ✅ Deleted: ${id}`)
        deleted++
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        console.error(`  ❌ Failed to delete ${id}: ${error.message}`)
        failed++
      }
    }
    
    console.log(`\n🎉 Deletion Summary:`)
    console.log(`  Successfully deleted: ${deleted}`)
    console.log(`  Failed to delete: ${failed}`)
    
  } catch (error) {
    console.error('💥 Deletion failed:', error)
  }
}

async function main() {
  console.log('🚀 Starting kbItem export and conversion...')
  console.log('Project ID: 5cywtc7a')
  console.log('Dataset: production')
  console.log('---\n')
  
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is required')
    process.exit(1)
  }
  
  // Step 1: Export documents
  const kbDocuments = await exportAndConvertKbItems()
  
  if (!kbDocuments || kbDocuments.length === 0) {
    console.log('No documents to process.')
    return
  }
  
  // Step 2: Delete original kbItem documents
  console.log('\n' + '='.repeat(50))
  await deleteAllKbItems()
  
  // Step 3: Instructions for import
  console.log('\n' + '='.repeat(50))
  console.log('🎯 Next Steps:')
  console.log('1. Review the exported file: kb-documents-export.ndjson')
  console.log('2. Import the documents using: npx sanity dataset import kb-documents-export.ndjson production')
  console.log('3. Verify the documents appear correctly in Studio')
  
}

main().catch(console.error)
