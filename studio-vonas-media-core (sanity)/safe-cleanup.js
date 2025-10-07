#!/usr/bin/env node

const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-09-03'
})

async function safeCleanup() {
  console.log('🔍 Analyzing KB structure...\n')
  
  // Get all documents with their references
  const allKB = await client.fetch(`{
    "categories": *[_type == "kbCategory"]{ _id, title, "usedBy": count(*[references(^._id)]) },
    "items": *[_type == "kbItem"]{ _id, title, parent, category },
    "tags": *[_type == "kbTag"]{ _id, title, "usedBy": count(*[references(^._id)]) }
  }`)
  
  console.log('📊 Current structure:')
  console.log(`Categories: ${allKB.categories.length}`)
  console.log(`Items: ${allKB.items.length}`)
  console.log(`Tags: ${allKB.tags.length}`)
  
  // Find unused categories
  const unusedCategories = allKB.categories.filter(cat => cat.usedBy === 0)
  const usedCategories = allKB.categories.filter(cat => cat.usedBy > 0)
  
  console.log(`\nUnused categories (${unusedCategories.length}):`)
  unusedCategories.forEach(cat => console.log(`  - ${cat._id}: "${cat.title}"`))
  
  console.log(`\nUsed categories (${usedCategories.length}):`)
  usedCategories.forEach(cat => console.log(`  - ${cat._id}: "${cat.title}" (${cat.usedBy} refs)`))
  
  // Find items without proper parents/categories
  const orphanedItems = allKB.items.filter(item => !item.parent && !item.category)
  const rootItems = allKB.items.filter(item => !item.parent && item.category)
  
  console.log(`\nRoot items with categories (${rootItems.length}): ✅`)
  rootItems.forEach(item => console.log(`  - ${item._id}: "${item.title}"`))
  
  console.log(`\nOrphaned items (${orphanedItems.length}): ⚠️`)
  orphanedItems.forEach(item => console.log(`  - ${item._id}: "${item.title}"`))
  
  // Safe deletions
  if (unusedCategories.length > 0) {
    console.log(`\n🗑️ Safely deleting ${unusedCategories.length} unused categories...`)
    for (const cat of unusedCategories) {
      try {
        await client.delete(cat._id)
        console.log(`✅ Deleted: ${cat._id}`)
      } catch (error) {
        console.log(`❌ Failed to delete ${cat._id}: ${error.message}`)
      }
    }
  }
  
  // Check for duplicate/test items
  const testItems = allKB.items.filter(item => 
    item.title?.toLowerCase().includes('test') || 
    item._id.includes('test') ||
    item._id.length > 50 // UUID-style IDs are usually tests
  )
  
  if (testItems.length > 0) {
    console.log(`\n🧪 Found test items (${testItems.length}):`)
    testItems.forEach(item => console.log(`  - ${item._id}: "${item.title}"`))
    console.log('   ^ These might be safe to delete')
  }
  
  console.log('\n✅ Analysis complete!')
}

async function deleteTestItems() {
  console.log('\n🗑️ Deleting obvious test items...')
  
  const testItems = await client.fetch(`*[_type == "kbItem" && (
    title match "*test*" ||
    title match "*Test*" ||
    _id match "*test*" ||
    length(_id) > 30
  )]{ _id, title }`)
  
  if (testItems.length === 0) {
    console.log('No test items found.')
    return
  }
  
  console.log(`Found ${testItems.length} test items:`)
  testItems.forEach(item => console.log(`  - ${item._id}: "${item.title}"`))
  
  for (const item of testItems) {
    try {
      await client.delete(item._id)
      console.log(`✅ Deleted test item: ${item._id}`)
    } catch (error) {
      console.log(`❌ Failed to delete ${item._id}: ${error.message}`)
    }
  }
}

async function main() {
  console.log('🚀 Safe KB Cleanup Tool\n')
  
  try {
    await safeCleanup()
    await deleteTestItems()
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

main()
