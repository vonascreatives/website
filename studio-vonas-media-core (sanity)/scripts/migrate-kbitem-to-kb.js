import {createClient} from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

// Mapping from old kbItem IDs to new kb IDs
const idMapping = {}

// Helper function to generate new ID based on old ID
function generateNewId(oldId) {
  // Remove "drafts." prefix if present
  const baseId = oldId.startsWith('drafts.') ? oldId.substring(7) : oldId
  
  // If it already starts with "kb.", keep it the same but ensure it's marked as kb type
  if (baseId.startsWith('kb.')) {
    return baseId
  }
  
  // For other IDs, keep them as-is since they're UUIDs or custom IDs
  return baseId
}

// Step 1: Create new kb documents
async function createNewKbDocuments() {
  console.log('🔍 Step 1: Fetching all kbItem documents...')
  
  const kbItems = await client.fetch(`
    *[_type == "kbItem"]{
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      ...
    }
  `)
  
  console.log(`Found ${kbItems.length} kbItem documents to migrate`)
  
  if (kbItems.length === 0) {
    console.log('No kbItem documents found. Migration complete!')
    return
  }
  
  let totalProcessed = 0
  let totalErrors = 0
  
  console.log('🔄 Creating new kb documents...')
  
  for (const doc of kbItems) {
    try {
      const oldId = doc._id
      const newId = generateNewId(oldId)
      const isDraft = oldId.startsWith('drafts.')
      const finalNewId = isDraft ? `drafts.${newId}` : newId
      
      // Store mapping for reference updates later
      idMapping[oldId] = finalNewId
      
      console.log(`  🔄 Creating: ${oldId} -> ${finalNewId}`)
      
      // Create new kb document
      const newDoc = {
        ...doc,
        _id: finalNewId,
        _type: 'kb'
      }
      
      // Remove system fields that shouldn't be copied
      delete newDoc._createdAt
      delete newDoc._updatedAt
      delete newDoc._rev
      
      // Check if document already exists
      const exists = await client.fetch(`*[_id == $id][0]`, { id: finalNewId })
      
      if (exists && exists._type === 'kb') {
        console.log(`    ℹ️ Document ${finalNewId} already exists as kb type, skipping`)
        totalProcessed++
        continue
      }
      
      // Use createOrReplace to overwrite existing kbItem documents
      await client.createOrReplace(newDoc)
      console.log(`    ✅ Created successfully`)
      totalProcessed++
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`    ❌ Error creating ${doc._id}:`, error.message)
      totalErrors++
    }
  }
  
  console.log(`\n🎉 Step 1 Summary:`)
  console.log(`  Successfully created: ${totalProcessed}`)
  console.log(`  Errors: ${totalErrors}`)
  
  return { totalProcessed, totalErrors }
}

// Step 2: Update references in all documents
async function updateReferences() {
  console.log('\n🔄 Step 2: Updating references to new kb documents...')
  
  // Get all documents that might reference kbItem documents
  const allDocs = await client.fetch(`
    *[references(*[_type == "kbItem"]._id)]{
      _id,
      _type,
      _rev,
      ...
    }
  `)
  
  console.log(`Found ${allDocs.length} documents with references to update`)
  
  let totalUpdated = 0
  let totalErrors = 0
  
  for (const doc of allDocs) {
    try {
      console.log(`  🔄 Updating references in: ${doc._id}`)
      
      // Convert the document to JSON string to find and replace IDs
      let docString = JSON.stringify(doc)
      let hasChanges = false
      
      // Replace all old IDs with new IDs
      for (const [oldId, newId] of Object.entries(idMapping)) {
        if (docString.includes(oldId)) {
          docString = docString.replace(new RegExp(oldId, 'g'), newId)
          hasChanges = true
        }
      }
      
      if (hasChanges) {
        const updatedDoc = JSON.parse(docString)
        await client.createOrReplace(updatedDoc)
        console.log(`    ✅ Updated successfully`)
        totalUpdated++
      } else {
        console.log(`    ℹ️ No changes needed`)
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`    ❌ Error updating ${doc._id}:`, error.message)
      totalErrors++
    }
  }
  
  console.log(`\n🎉 Step 2 Summary:`)
  console.log(`  Successfully updated: ${totalUpdated}`)
  console.log(`  Errors: ${totalErrors}`)
  
  return { totalUpdated, totalErrors }
}

// Step 3: Delete old kbItem documents
async function deleteOldDocuments() {
  console.log('\n🗺️ Step 3: Deleting old kbItem documents...')
  
  const kbItems = await client.fetch(`*[_type == "kbItem"]._id`)
  
  console.log(`Found ${kbItems.length} old kbItem documents to delete`)
  
  let totalDeleted = 0
  let totalErrors = 0
  
  // Delete in batches
  const batchSize = 10
  for (let i = 0; i < kbItems.length; i += batchSize) {
    const batch = kbItems.slice(i, i + batchSize)
    
    try {
      const transaction = client.transaction()
      
      for (const id of batch) {
        transaction.delete(id)
        console.log(`  🗺️ Deleting: ${id}`)
      }
      
      await transaction.commit()
      console.log(`    ✅ Batch deleted successfully`)
      totalDeleted += batch.length
      
      // Delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`    ❌ Error deleting batch:`, error.message)
      totalErrors += batch.length
    }
  }
  
  console.log(`\n🎉 Step 3 Summary:`)
  console.log(`  Successfully deleted: ${totalDeleted}`)
  console.log(`  Errors: ${totalErrors}`)
  
  return { totalDeleted, totalErrors }
}

// Main migration function
async function migrateKbItemToKb() {
  try {
    const step1 = await createNewKbDocuments()
    const step2 = await updateReferences()
    const step3 = await deleteOldDocuments()
    
    console.log('\n🎉 Overall Migration Summary:')
    console.log(`  New kb documents created: ${step1.totalProcessed}`)
    console.log(`  References updated: ${step2.totalUpdated}`)
    console.log(`  Old documents deleted: ${step3.totalDeleted}`)
    console.log(`  Total errors: ${step1.totalErrors + step2.totalErrors + step3.totalErrors}`)
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

// Verification function to check migration results
async function verifyMigration() {
  try {
    console.log('\n🔍 Verifying migration results...')
    
    const [kbItemCount, kbCount] = await Promise.all([
      client.fetch('count(*[_type == "kbItem"])'),
      client.fetch('count(*[_type == "kb"])')
    ])
    
    console.log(`Remaining kbItem documents: ${kbItemCount}`)
    console.log(`New kb documents: ${kbCount}`)
    
    if (kbItemCount === 0 && kbCount > 0) {
      console.log('✅ Migration verification passed!')
      return true
    } else {
      console.log('❌ Migration verification failed!')
      return false
    }
  } catch (error) {
    console.error('Error during verification:', error)
    return false
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting kbItem to kb migration...')
  console.log('Project ID: 5cywtc7a')
  console.log('Dataset: production')
  console.log('---\n')
  
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is required')
    console.log('Please set your Sanity API token in the .env file')
    process.exit(1)
  }
  
  await migrateKbItemToKb()
  await verifyMigration()
}

main().catch(console.error)
