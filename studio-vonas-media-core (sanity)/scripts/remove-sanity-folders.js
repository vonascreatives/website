import {createClient} from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.mcp' })

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

// Pass --migrate flag to actually migrate, otherwise dry-run only
const shouldMigrate = process.argv.includes('--migrate')

async function migrateSanityFolders() {
  try {
    console.log('Finding all sanity.folder documents...\n')

    const folders = await client.fetch(`*[_type == "sanity.folder"]`)

    console.log(`Found ${folders.length} sanity.folder document(s)\n`)

    if (folders.length === 0) {
      console.log('No sanity.folder documents found. Nothing to do.')
      return
    }

    for (const folder of folders) {
      console.log(`  - ID: ${folder._id}`)
      console.log(`    Title: ${folder.title || '(no title)'}`)
      console.log(`    Created: ${folder._createdAt}`)
      console.log('')
    }

    if (!shouldMigrate) {
      console.log('--- DRY RUN ---')
      console.log('These documents will be migrated from "sanity.folder" to "vonas.folder".')
      console.log('To run the migration, use the --migrate flag:')
      console.log('  node scripts/remove-sanity-folders.js --migrate')
      return
    }

    console.log('Migrating documents from sanity.folder -> vonas.folder...\n')

    // Step 1: Delete all sanity.folder documents
    const deleteTx = client.transaction()
    for (const folder of folders) {
      deleteTx.delete(folder._id)
    }
    await deleteTx.commit()
    console.log(`Deleted ${folders.length} sanity.folder document(s).\n`)

    // Step 2: Create new vonas.folder documents with same IDs
    const createTx = client.transaction()
    for (const folder of folders) {
      const { _type, _rev, ...rest } = folder
      createTx.create({
        ...rest,
        _type: 'vonas.folder',
      })
    }
    await createTx.commit()

    console.log(`Created ${folders.length} vonas.folder document(s).\n`)

    // Verify
    const remainingOld = await client.fetch(`count(*[_type == "sanity.folder"])`)
    const newCount = await client.fetch(`count(*[_type == "vonas.folder"])`)

    console.log('Verification:')
    console.log(`  sanity.folder documents remaining: ${remainingOld}`)
    console.log(`  vonas.folder documents: ${newCount}`)

    if (remainingOld === 0) {
      console.log('\nMigration complete. All sanity.folder documents have been migrated to vonas.folder.')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

async function main() {
  console.log('=== Migrate sanity.folder -> vonas.folder ===')
  console.log('Project: 5cywtc7a (Vonas Media Core)')
  console.log('Dataset: production')
  console.log(`Mode: ${shouldMigrate ? 'MIGRATE' : 'DRY RUN'}`)
  console.log('---\n')

  if (!process.env.SANITY_API_TOKEN) {
    console.error('SANITY_API_TOKEN environment variable is required')
    process.exit(1)
  }

  await migrateSanityFolders()
}

main().catch(console.error)
