/*
  Build a deeper, standardized hierarchical folder structure for the Knowledge Base
  - Creates subfolders for all 7 categories
  - Creates per-show structures with consistent production stages and social platforms

  Run with:
  npx sanity exec scripts/build-better-kb-structure.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')

const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

function slugify(input = '') {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-/&]/g, '')
    .replace(/[&]/g, 'and')
    .replace(/[\s/]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function idFromPath(pathSegments) {
  const path = pathSegments.map(slugify).filter(Boolean).join('.')
  return `kbItem.${path}`
}

async function getCategoryId(slug) {
  const doc = await client.fetch(`*[_type=="kbCategory" && slug.current==$slug][0]{_id}`, {slug})
  return doc?._id
}

async function getShowId(slug) {
  const doc = await client.fetch(`*[_type=="youtubeShow" && slug.current==$slug][0]{_id}`, {slug})
  return doc?._id
}

async function upsertFolder({title, parentId, categoryId, youtubeShowId, path}) {
  const _id = idFromPath(path)
  const doc = {
    _id,
    _type: 'kbItem',
    title,
    slug: {current: slugify(title), _type: 'slug'},
    itemType: 'folder',
    order: 1,
    status: 'published',
    category: categoryId ? {_type: 'reference', _ref: categoryId} : undefined,
    parent: parentId ? {_type: 'reference', _ref: parentId} : undefined,
    youtubeShow: youtubeShowId ? {_type: 'reference', _ref: youtubeShowId} : undefined,
  }
  Object.keys(doc).forEach((k)=>doc[k]===undefined && delete doc[k])
  await client.createIfNotExists(doc)
  return _id
}

async function buildCategoryTree() {
  const cats = {
    'company-foundation': {
      title: 'Company Foundation',
      sub: [
        'About',
        'Vision, Mission & Values',
        'Company Values',
        'Brand & Identity',
        'Company Information',
      ]
    },
    'team-operations': {
      title: 'Team & Operations',
      sub: [
        'Team Structure & Roles',
        'Onboarding',
        'Internal Communications',
        'Documentation',
      ]
    },
    'production-workflows': {
      title: 'Production Workflows',
      subTree: {
        'Pre-Production': ['Guest Research & Booking', 'Scripting & Prep', 'Logistics'],
        'Shooting': ['Equipment & Setup', 'Interview', 'Field Guidelines'],
        'Post-Production': [
          'Editing',
          'Thumbnails',
          'SEO Optimization',
          'Distribution',
          { 'Social Media': ['Content Calendar', 'TikTok', 'Instagram', 'YouTube Shorts', 'Twitter / X'] },
          'Analytics',
        ],
      }
    },
    'tools-systems': {
      title: 'Tools & Systems',
      subTree: {
        'Content Creation Tools': ['Descript', 'DaVinci Resolve', 'Klap', 'Opus Clip'],
        'Databases': ['SmartSuite', 'Airtable'],
        'Automation': ['Bardeen', 'ClickConnector'],
        'Communication': ['Slack'],
        'Guides & Tutorials': []
      }
    },
    'external-partnerships': {
      title: 'External Partnerships',
      subTree: {
        'Freelancers': ['Guidelines', 'Rates & Payments'],
        'Brand Outreach & CRM': [],
      }
    },
    'policies-procedures': {
      title: 'Policies & Procedures',
      sub: ['PTO & Time Management', 'Security & Access', 'Compliance', 'SOPs']
    },
    'youtube-shows': { title: 'YouTube Shows', sub: [] },
  }

  for (const slug of Object.keys(cats)) {
    const categoryId = await getCategoryId(slug)
    if (!categoryId) {
      console.log(`⚠️ Missing kbCategory: ${slug}. Please seed categories first.`)
      continue
    }
    const baseId = await upsertFolder({
      title: cats[slug].title,
      categoryId,
      path: [slug],
    })

    // Simple subfolders
    if (Array.isArray(cats[slug].sub)) {
      for (const sub of cats[slug].sub) {
        await upsertFolder({
          title: sub,
          parentId: baseId,
          categoryId,
          path: [slug, slugify(sub)],
        })
        console.log(`✓ ${cats[slug].title} -> ${sub}`)
      }
    }

    // Tree with deeper levels
    if (cats[slug].subTree) {
      for (const [lvl1, lvl2Arr] of Object.entries(cats[slug].subTree)) {
        const lvl1Id = await upsertFolder({
          title: lvl1,
          parentId: baseId,
          categoryId,
          path: [slug, slugify(lvl1)],
        })
        console.log(`✓ ${cats[slug].title} -> ${lvl1}`)

        for (const lvl2 of lvl2Arr) {
          if (typeof lvl2 === 'string') {
            await upsertFolder({
              title: lvl2,
              parentId: lvl1Id,
              categoryId,
              path: [slug, slugify(lvl1), slugify(lvl2)],
            })
            console.log(`  ✓ ${lvl1} -> ${lvl2}`)
          } else if (typeof lvl2 === 'object') {
            // one nested object like { 'Social Media': ['Content Calendar', ...] }
            const [lvl2Key, lvl3Arr] = Object.entries(lvl2)[0]
            const lvl2Id = await upsertFolder({
              title: lvl2Key,
              parentId: lvl1Id,
              categoryId,
              path: [slug, slugify(lvl1), slugify(lvl2Key)],
            })
            console.log(`  ✓ ${lvl1} -> ${lvl2Key}`)
            for (const lvl3 of lvl3Arr) {
              await upsertFolder({
                title: lvl3,
                parentId: lvl2Id,
                categoryId,
                path: [slug, slugify(lvl1), slugify(lvl2Key), slugify(lvl3)],
              })
              console.log(`    ✓ ${lvl1} -> ${lvl2Key} -> ${lvl3}`)
            }
          }
        }
      }
    }
  }
}

async function buildPerShowTrees() {
  const ytCategoryId = await getCategoryId('youtube-shows')
  const shows = [
    'off-the-record', 'passions', 'skyline', 'tatak', 'at-the-backdoor'
  ]
  const stages = ['Pre-Production','Shooting','Post-Production','Distribution']
  const postSub = [
    'Editing', 'Thumbnails', 'SEO Optimization', 'Analytics',
    { 'Social Media': ['Content Calendar','TikTok','Instagram','YouTube Shorts','Twitter / X'] }
  ]

  for (const showSlug of shows) {
    const showId = await getShowId(showSlug)
    if (!showId) {
      console.log(`⚠️ Missing youtubeShow: ${showSlug}.`)
      continue
    }
    const showRootId = await upsertFolder({
      title: showSlug.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase()),
      categoryId: ytCategoryId,
      youtubeShowId: showId,
      path: ['youtube-shows', showSlug],
    })

    // Stages
    const stageIds = {}
    for (const stage of stages) {
      const stageId = await upsertFolder({
        title: stage,
        parentId: showRootId,
        categoryId: ytCategoryId,
        youtubeShowId: showId,
        path: ['youtube-shows', showSlug, slugify(stage)],
      })
      stageIds[stage] = stageId
      console.log(`✓ ${showSlug} -> ${stage}`)
    }

    // Post-Production subfolders
    const postId = stageIds['Post-Production']
    for (const sub of postSub) {
      if (typeof sub === 'string') {
        await upsertFolder({
          title: sub,
          parentId: postId,
          categoryId: ytCategoryId,
          youtubeShowId: showId,
          path: ['youtube-shows', showSlug, 'post-production', slugify(sub)],
        })
        console.log(`  ✓ ${showSlug} -> Post-Production -> ${sub}`)
      } else {
        const [key, arr] = Object.entries(sub)[0]
        const keyId = await upsertFolder({
          title: key,
          parentId: postId,
          categoryId: ytCategoryId,
          youtubeShowId: showId,
          path: ['youtube-shows', showSlug, 'post-production', slugify(key)],
        })
        console.log(`  ✓ ${showSlug} -> Post-Production -> ${key}`)
        for (const leaf of arr) {
          await upsertFolder({
            title: leaf,
            parentId: keyId,
            categoryId: ytCategoryId,
            youtubeShowId: showId,
            path: ['youtube-shows', showSlug, 'post-production', slugify(key), slugify(leaf)],
          })
          console.log(`    ✓ ${showSlug} -> Post-Production -> ${key} -> ${leaf}`)
        }
      }
    }
  }
}

async function main(){
  console.log('📁 Building category trees...')
  await buildCategoryTree()
  console.log('📺 Building per-show trees...')
  await buildPerShowTrees()
  console.log('\n🎉 Folder structure updated.')
}

main().catch((err)=>{
  console.error(err)
  process.exit(1)
})
