#!/usr/bin/env node

const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-09-03'
})

async function batchDeleteArtifacts() {
  console.log('🔍 Finding hidden KB artifacts...\n')
  
  // Find all problematic documents
  const categories = await client.fetch('*[_type == "kbCategory"]{ _id, title }')
  const emptyTags = await client.fetch('*[_type == "kbTag" && title == null]{ _id }')
  const orphanedItems = await client.fetch('*[_type == "kbItem" && !defined(parent)]{ _id, title }')
  
  console.log(`Found:`)
  console.log(`- ${categories.length} kbCategory documents`)
  console.log(`- ${emptyTags.length} empty kbTag documents`)
  console.log(`- ${orphanedItems.length} orphaned kbItem documents`)
  console.log(`\nTotal: ${categories.length + emptyTags.length + orphanedItems.length} artifacts to delete\n`)
  
  if (categories.length + emptyTags.length + orphanedItems.length === 0) {
    console.log('✅ No artifacts found - dataset is clean!')
    return
  }

  // Batch delete categories
  if (categories.length > 0) {
    console.log('🗑️ Deleting kbCategory documents...')
    const transaction = client.transaction()
    categories.forEach(cat => transaction.delete(cat._id))
    
    try {
      await transaction.commit()
      console.log(`✅ Deleted ${categories.length} kbCategory documents`)
    } catch (error) {
      console.log(`❌ Error deleting categories: ${error.message}`)
    }
  }
  
  // Batch delete empty tags
  if (emptyTags.length > 0) {
    console.log('🗑️ Deleting empty kbTag documents...')
    const transaction = client.transaction()
    emptyTags.forEach(tag => transaction.delete(tag._id))
    
    try {
      await transaction.commit()
      console.log(`✅ Deleted ${emptyTags.length} empty kbTag documents`)
    } catch (error) {
      console.log(`❌ Error deleting tags: ${error.message}`)
    }
  }

  // Handle orphaned items carefully (these might be your real documents)
  if (orphanedItems.length > 0) {
    console.log('⚠️  Found orphaned kbItem documents:')
    orphanedItems.forEach(item => {
      console.log(`  - ${item._id}: "${item.title}"`)
    })
    console.log('\n🤔 These might be real documents. Skipping for safety.')
    console.log('   (Manual review recommended)')
  }

  console.log('\n✅ Batch cleanup complete!')
}

async function showCurrentStats() {
  const stats = await client.fetch(`{
    "kbCategories": count(*[_type == "kbCategory"]),
    "kbItems": count(*[_type == "kbItem"]),
    "kbTags": count(*[_type == "kbTag"]),
    "emptyTags": count(*[_type == "kbTag" && title == null])
  }`)
  
  console.log('📊 Current KB Document Stats:')
  console.log(`   kbCategory: ${stats.kbCategories}`)
  console.log(`   kbItem: ${stats.kbItems}`)
  console.log(`   kbTag: ${stats.kbTags} (${stats.emptyTags} empty)`)
  console.log('')
}

async function main() {
  console.log('🚀 KB Artifact Cleanup Tool\n')
  
  try {
    await showCurrentStats()
    await batchDeleteArtifacts()
    console.log('')
    await showCurrentStats()
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

main()
