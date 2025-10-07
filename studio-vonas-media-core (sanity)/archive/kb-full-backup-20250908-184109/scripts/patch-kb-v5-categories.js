/*
  Patch existing v5 kbCategory docs to set title and order correctly.

  Run:
  npx sanity exec scripts/patch-kb-v5-categories.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')
const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

const categories = [
  {id: 'kbCategory.v5.company', title: 'Company', slug: 'company', order: 1},
  {id: 'kbCategory.v5.production', title: 'Production', slug: 'production', order: 2},
  {id: 'kbCategory.v5.shows', title: 'Shows', slug: 'shows', order: 3},
  {id: 'kbCategory.v5.tools', title: 'Tools', slug: 'tools', order: 4},
  {id: 'kbCategory.v5.partners', title: 'Partners', slug: 'partners', order: 5},
]

async function main(){
  for (const c of categories) {
    try {
      await client.patch(c.id)
        .set({
          title: c.title,
          slug: {current: c.slug, _type: 'slug'},
          order: c.order,
        })
        .commit({autoGenerateArrayKeys: true})
      console.log(`✓ Patched ${c.id} -> ${c.title}`)
    } catch (e) {
      console.log(`⚠️  Could not patch ${c.id}:`, e.message)
    }
  }
}

main().catch((err)=>{ console.error(err); process.exit(1) })

