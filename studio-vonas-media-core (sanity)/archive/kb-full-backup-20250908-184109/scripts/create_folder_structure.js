/*
  Creates a hierarchical folder structure for the Knowledge Base with unique naming.
  Example: 📺 YouTube Shows -> Off the Record -> Post-Production -> Social Media -> TikTok

  Run with:
  npx sanity exec scripts/create_folder_structure.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')

const apiVersion = '2023-05-03'
const client = getCliClient({apiVersion})

function slugify(input = '') {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-/]/g, '')
    .replace(/[\s/]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Helper to create unique document IDs based on full path
function createUniqueId(pathSegments) {
  const pathString = pathSegments.map(s => slugify(s)).join('.')
  return `kbItem.${pathString}`
}

// Helper to create folder documents
async function createFolder(title, parentId, categoryId, youtubeShowId, pathSegments) {
  const _id = createUniqueId(pathSegments)
  const slug = slugify(title)
  
  const doc = {
    _id,
    _type: 'kbItem',
    title,
    slug: {current: slug, _type: 'slug'},
    itemType: 'folder',
    parent: parentId ? {_type: 'reference', _ref: parentId} : undefined,
    category: {_type: 'reference', _ref: categoryId},
    youtubeShow: youtubeShowId ? {_type: 'reference', _ref: youtubeShowId} : undefined,
    status: 'published',
    order: 1
  }
  
  // Remove undefined fields
  Object.keys(doc).forEach(key => doc[key] === undefined && delete doc[key])
  
  return client
    .transaction()
    .createIfNotExists(doc)
    .patch(doc._id, (p) => p.set(doc))
    .commit()
}

// Helper to get category/show IDs
async function getCategoryId(slug) {
  const doc = await client.fetch(`*[_type=="kbCategory" && slug.current==$slug][0]{_id}`, {slug})
  return doc?._id
}

async function getShowId(slug) {
  const doc = await client.fetch(`*[_type=="youtubeShow" && slug.current==$slug][0]{_id}`, {slug})
  return doc?._id
}

async function main() {
  console.log('Creating hierarchical folder structure...')
  
  // Get category and show IDs
  const ytCategoryId = await getCategoryId('youtube-shows')
  const prodCategoryId = await getCategoryId('production-workflows')
  const toolsCategoryId = await getCategoryId('tools-systems')
  const teamCategoryId = await getCategoryId('team-operations')
  
  const offTheRecordId = await getShowId('off-the-record')
  const passionsId = await getShowId('passions')
  const skylineId = await getShowId('skyline')
  const tatakId = await getShowId('tatak')
  const backdoorId = await getShowId('at-the-backdoor')
  
  // 1. Create main YouTube Shows folders (under YouTube Shows category)
  const showFolders = [
    {title: 'Off the Record', showId: offTheRecordId, path: ['youtube-shows', 'off-the-record']},
    {title: 'Passions', showId: passionsId, path: ['youtube-shows', 'passions']},
    {title: 'Skyline', showId: skylineId, path: ['youtube-shows', 'skyline']},
    {title: 'Tatak', showId: tatakId, path: ['youtube-shows', 'tatak']},
    {title: 'At the Backdoor', showId: backdoorId, path: ['youtube-shows', 'at-the-backdoor']}
  ]
  
  const showFolderIds = {}
  for (const show of showFolders) {
    await createFolder(show.title, null, ytCategoryId, show.showId, show.path)
    showFolderIds[show.showId] = createUniqueId(show.path)
    console.log(`✓ Created show folder: ${show.title}`)
  }
  
  // 2. Create production workflow folders under each show
  const productionStages = [
    'Pre-Production',
    'Shooting', 
    'Post-Production',
    'Distribution'
  ]
  
  const stageFolderIds = {}
  for (const [showId, showFolderId] of Object.entries(showFolderIds)) {
    const showName = showFolders.find(s => s.showId === showId)?.title || 'unknown'
    const showSlug = slugify(showName)
    
    stageFolderIds[showId] = {}
    for (const stage of productionStages) {
      const stageSlug = slugify(stage)
      const path = ['youtube-shows', showSlug, stageSlug]
      const stageId = createUniqueId(path)
      
      await createFolder(stage, showFolderId, ytCategoryId, showId, path)
      stageFolderIds[showId][stageSlug] = stageId
      console.log(`✓ Created ${showName} -> ${stage}`)
    }
  }
  
  // 3. Create common subfolders under Post-Production for each show
  const postProdSubfolders = [
    'Social Media',
    'Thumbnails', 
    'Analytics',
    'SEO Optimization'
  ]
  
  for (const [showId, stages] of Object.entries(stageFolderIds)) {
    const showName = showFolders.find(s => s.showId === showId)?.title || 'unknown'
    const showSlug = slugify(showName)
    const postProdId = stages['post-production']
    
    if (postProdId) {
      for (const subfolder of postProdSubfolders) {
        const subfolderSlug = slugify(subfolder)
        const path = ['youtube-shows', showSlug, 'post-production', subfolderSlug]
        
        await createFolder(subfolder, postProdId, ytCategoryId, showId, path)
        console.log(`✓ Created ${showName} -> Post-Production -> ${subfolder}`)
      }
    }
  }
  
  // 4. Create platform-specific folders under Social Media
  const socialPlatforms = ['TikTok', 'Instagram', 'YouTube Shorts', 'Twitter']
  
  for (const [showId, stages] of Object.entries(stageFolderIds)) {
    const showName = showFolders.find(s => s.showId === showId)?.title || 'unknown'
    const showSlug = slugify(showName)
    const socialMediaPath = ['youtube-shows', showSlug, 'post-production', 'social-media']
    const socialMediaId = createUniqueId(socialMediaPath)
    
    for (const platform of socialPlatforms) {
      const platformSlug = slugify(platform)
      const path = ['youtube-shows', showSlug, 'post-production', 'social-media', platformSlug]
      
      await createFolder(platform, socialMediaId, ytCategoryId, showId, path)
      console.log(`✓ Created ${showName} -> Post-Production -> Social Media -> ${platform}`)
    }
  }
  
  // 5. Create some example content in different locations to show uniqueness
  const exampleDocs = [
    {
      title: 'Content Calendar',
      path: ['youtube-shows', 'off-the-record', 'post-production', 'social-media', 'tiktok'],
      parentPath: ['youtube-shows', 'off-the-record', 'post-production', 'social-media', 'tiktok']
    },
    {
      title: 'Content Calendar', // Same name, different location
      path: ['youtube-shows', 'passions', 'post-production', 'social-media', 'instagram'],
      parentPath: ['youtube-shows', 'passions', 'post-production', 'social-media', 'instagram']
    }
  ]
  
  for (const doc of exampleDocs) {
    const docId = createUniqueId(doc.path.concat([slugify(doc.title)]))
    const parentId = createUniqueId(doc.parentPath)
    
    const docData = {
      _id: docId,
      _type: 'kbItem',
      title: doc.title,
      slug: {current: slugify(doc.title), _type: 'slug'},
      itemType: 'document',
      parent: {_type: 'reference', _ref: parentId},
      category: {_type: 'reference', _ref: ytCategoryId},
      youtubeShow: {_type: 'reference', _ref: doc.path.includes('off-the-record') ? offTheRecordId : passionsId},
      status: 'draft',
      tags: ['Example'],
      content: [{
        _type: 'block',
        children: [{_type: 'span', text: `This is an example ${doc.title} document for the ${doc.path.join(' -> ')} folder.`}]
      }]
    }
    
    await client
      .transaction()
      .createIfNotExists(docData)
      .commit()
    
    console.log(`✓ Created example: ${doc.path.join(' -> ')} -> ${doc.title}`)
  }
  
  console.log('\n🎉 Hierarchical folder structure created!')
  console.log('\n📁 Structure created:')
  console.log('📺 YouTube Shows')
  console.log('  ├── Off the Record')
  console.log('  │   ├── Pre-Production')
  console.log('  │   ├── Shooting')
  console.log('  │   ├── Post-Production')
  console.log('  │   │   ├── Social Media')
  console.log('  │   │   │   ├── TikTok')
  console.log('  │   │   │   │   └── Content Calendar (example doc)')
  console.log('  │   │   │   ├── Instagram')
  console.log('  │   │   │   ├── YouTube Shorts')
  console.log('  │   │   │   └── Twitter')
  console.log('  │   │   ├── Thumbnails')
  console.log('  │   │   ├── Analytics')
  console.log('  │   │   └── SEO Optimization')
  console.log('  │   └── Distribution')
  console.log('  ├── Passions (same structure)')
  console.log('  ├── Skyline (same structure)')
  console.log('  ├── Tatak (same structure)')
  console.log('  └── At the Backdoor (same structure)')
  console.log('\n💡 Each document has a unique ID based on its full path')
  console.log('💡 Documents with same names in different locations are unique')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
