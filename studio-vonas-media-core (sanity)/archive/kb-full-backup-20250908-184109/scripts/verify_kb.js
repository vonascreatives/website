/*
  Verifies that the kbCategory and youtubeShow docs were seeded correctly,
  and lists kbItem data to confirm migration worked.

  Run with:
  npx sanity exec scripts/verify_kb.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')

const apiVersion = '2023-05-03'
const client = getCliClient({apiVersion})

async function main() {
  console.log('\n=== KB CATEGORIES ===')
  const categories = await client.fetch(`*[_type=="kbCategory"] | order(order asc) {_id, title, slug}`)
  console.log(`Found ${categories.length} categories:`)  
  categories.forEach(c => console.log(`  - ${c.title} (${c.slug.current})`))

  console.log('\n=== YOUTUBE SHOWS ===')
  const shows = await client.fetch(`*[_type=="youtubeShow"] | order(title asc) {_id, title, slug}`)
  console.log(`Found ${shows.length} shows:`)  
  shows.forEach(s => console.log(`  - ${s.title} (${s.slug.current})`))

  console.log('\n=== KB ITEMS ===')
  const items = await client.fetch(`*[_type=="kbItem"] | order(title asc) {_id, title, category, youtubeShow, slug}`)
  console.log(`Found ${items.length} kbItems:`)  
  items.forEach(item => {
    const cat = item.category?._ref ? '✓ categorized' : '❌ missing category'
    const show = item.youtubeShow?._ref ? '✓ has show' : '○ no show'
    console.log(`  - "${item.title}" → ${cat}, ${show}`)  
  })

  console.log('\n=== MIGRATION STATUS ===')
  const strYT = await client.fetch(`*[_type=="kbItem" && defined(youtubeShow) && !defined(youtubeShow._ref)]`)
  const refYT = await client.fetch(`*[_type=="kbItem" && defined(youtubeShow._ref)]`)
  const missingCat = await client.fetch(`*[_type=="kbItem" && !defined(category._ref)]`)

  console.log(`Items with string youtubeShow: ${strYT.length} (should be 0)`)
  console.log(`Items with reference youtubeShow: ${refYT.length}`)
  console.log(`Items missing category: ${missingCat.length}`)
  console.log('\n✅ Setup complete!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
