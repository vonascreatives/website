/*
  Shows the complete hierarchical folder structure that was created

  Run with:
  npx sanity exec scripts/show_structure.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')

const apiVersion = '2023-05-03'
const client = getCliClient({apiVersion})

async function buildTree(items, parentId = null, level = 0) {
  const children = items.filter(item => {
    const itemParentId = item.parent?._ref || null
    return itemParentId === parentId
  })
  
  const sortedChildren = children.sort((a, b) => {
    // Folders first, then by order, then by title
    if (a.itemType === 'folder' && b.itemType !== 'folder') return -1
    if (a.itemType !== 'folder' && b.itemType === 'folder') return 1
    if (a.order !== b.order) return (a.order || 999) - (b.order || 999)
    return (a.title || '').localeCompare(b.title || '')
  })
  
  let result = ''
  for (let i = 0; i < sortedChildren.length; i++) {
    const child = sortedChildren[i]
    const isLast = i === sortedChildren.length - 1
    const prefix = level === 0 ? '' : '  '.repeat(level - 1) + (isLast ? '└── ' : '├── ')
    
    const icon = child.itemType === 'folder' ? '📁' : '📄'
    const showInfo = child.youtubeShow?.title ? ` (${child.youtubeShow.title})` : ''
    
    result += `${prefix}${icon} ${child.title}${showInfo}\n`
    
    // Recursively add children
    const childTree = await buildTree(items, child._id, level + 1)
    result += childTree
  }
  
  return result
}

async function main() {
  console.log('\n🏢 VONAS MEDIA KNOWLEDGE BASE STRUCTURE')
  console.log('='.repeat(50))
  
  // Get all kbItems with parent and show info
  const items = await client.fetch(`
    *[_type == "kbItem"] {
      _id,
      title,
      itemType,
      parent,
      order,
      category->{ title },
      youtubeShow->{ title },
      tags
    }
  `)
  
  console.log(`\n📊 OVERVIEW:`)
  console.log(`Total items: ${items.length}`)
  console.log(`Folders: ${items.filter(i => i.itemType === 'folder').length}`)
  console.log(`Documents: ${items.filter(i => i.itemType === 'document').length}`)
  console.log(`YouTube Shows: ${items.filter(i => i.itemType === 'youtube-show').length}`)
  
  console.log(`\n🌲 HIERARCHICAL STRUCTURE:`)
  console.log('\n' + await buildTree(items))
  
  console.log(`\n📺 YOUTUBE SHOWS WITH THEIR FOLDER STRUCTURE:`)
  const showItems = items.filter(i => i.youtubeShow?.title)
  const shows = [...new Set(showItems.map(i => i.youtubeShow.title))]
  
  for (const show of shows.sort()) {
    console.log(`\n📺 ${show}:`)
    const showTree = await buildTree(showItems.filter(i => i.youtubeShow.title === show))
    console.log(showTree || '  (no items)')
  }
  
  console.log(`\n🔍 UNIQUE ID EXAMPLES (showing how conflicts are avoided):`)
  const exampleItems = items.filter(i => 
    i.title === 'Content Calendar' || 
    i.title === 'Social Media' ||
    i.title === 'TikTok'
  ).slice(0, 6)
  
  for (const item of exampleItems) {
    console.log(`🏷️ ${item._id} -> "${item.title}" (${item.itemType})`)
  }
  
  console.log(`\n✨ FEATURES AVAILABLE IN STUDIO:`)
  console.log('📁 Navigate via "Knowledge Base > 🌲 Nested Columns (Unlimited)"')
  console.log('🏷️ Browse by "Knowledge Base > 🧭 By Category (7 High-level)"')
  console.log('📺 Filter by "Knowledge Base > 📺 By YouTube Show"')
  console.log('🔍 Quick research via "Knowledge Base > 🔍 Research Items"')
  console.log('➕ Create nested items with "Create KB Item (with parent)" template')
  console.log('📝 Auto-slugs with "Publish & Update" action')
  
  console.log(`\n🚀 Ready to use at: http://localhost:3333`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
