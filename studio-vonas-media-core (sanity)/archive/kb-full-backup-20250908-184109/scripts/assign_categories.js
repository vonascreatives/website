/*
  Assigns categories to kbItems that are missing them based on title patterns.

  Run with:
  npx sanity exec scripts/assign_categories.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')

const apiVersion = '2023-05-03'
const client = getCliClient({apiVersion})

const categoryMappings = {
  'company-foundation': [
    'Vision, Mission & Values',
    '🏢 Company Foundation'
  ],
  'team-operations': [
    'Team Structure & Roles',
    'Freelancer Coordination', 
    'Internal Communications',
    'Onboarding Process',
    'Time Off & PTO Policy',
    '👥 Team & Operations'
  ],
  'production-workflows': [
    'Pre production Guidelines',
    'Shooting Guidelines',
    'Editing Guidelines',
    'Post production Guidelines',
    'Post-Production Guidelines',
    'Video Production Process',
    'Distribution Guidelines',
    'Guest Management Process',
    '🎬 Production Workflows'
  ],
  'youtube-shows': [
    '📺 YouTube Shows'
  ],
  'tools-systems': [
    'Automation Tools',
    'Database Management',
    'Video Editing Software',
    '🛠️ Tools & Systems'
  ],
  'external-partnerships': [
    'Brand Partnerships',
    'Social Media Strategy',
    '🤝 External Partnerships'
  ],
  'policies-procedures': [
    'Standard Operating Procedures',
    '📋 Policies & Procedures'
  ]
}

async function getCategoryIdBySlug(slug) {
  const doc = await client.fetch(`*[_type=="kbCategory" && slug.current==$slug][0]{_id}`, {slug})
  return doc?._id || null
}

async function main() {
  console.log('\nAssigning categories to uncategorized kbItems...')
  
  const uncategorizedItems = await client.fetch(
    `*[_type=="kbItem" && !defined(category._ref)]{_id, title}`
  )
  
  let assigned = 0
  
  for (const item of uncategorizedItems) {
    let categorySlug = null
    
    // Find matching category based on title
    for (const [slug, titles] of Object.entries(categoryMappings)) {
      if (titles.some(title => item.title.includes(title) || title.includes(item.title))) {
        categorySlug = slug
        break
      }
    }
    
    if (categorySlug) {
      const categoryId = await getCategoryIdBySlug(categorySlug)
      if (categoryId) {
        await client.patch(item._id).set({
          category: {_type: 'reference', _ref: categoryId}
        }).commit()
        
        console.log(`✓ "${item.title}" → ${categorySlug}`)
        assigned++
      }
    } else {
      console.log(`? "${item.title}" → no match found`)
    }
  }
  
  console.log(`\n✓ Assigned categories to ${assigned} items`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
