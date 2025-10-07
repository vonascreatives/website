/*
  Seeds kbCategory + youtubeShow documents and migrates kbItem.youtubeShow (string) -> reference.
  Also assigns kbItem.category to the "📺 YouTube Shows" category if youtubeShow is set and category is missing.

  Run with:
  npx sanity exec scripts/migrate_kb.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')

const apiVersion = '2023-05-03'
const client = getCliClient({apiVersion})

const categories = [
  {title: '1. 🏢 Company Foundation', slug: 'company-foundation', icon: '🏢', order: 1},
  {title: '2. 👥 Team & Operations', slug: 'team-operations', icon: '👥', order: 2},
  {title: '3. 🎬 Production Workflows', slug: 'production-workflows', icon: '🎬', order: 3},
  {title: '4. 📺 YouTube Shows', slug: 'youtube-shows', icon: '📺', order: 4},
  {title: '5. 🛠️ Tools & Systems', slug: 'tools-systems', icon: '🛠️', order: 5},
  {title: '6. 🤝 External Partnerships', slug: 'external-partnerships', icon: '🤝', order: 6},
  {title: '7. 📋 Policies & Procedures', slug: 'policies-procedures', icon: '📋', order: 7},
]

const shows = [
  {title: 'Off the Record', slug: 'off-the-record'},
  {title: 'Passions', slug: 'passions'},
  {title: 'Skyline', slug: 'skyline'},
  {title: 'Tatak', slug: 'tatak'},
  {title: 'At the Backdoor', slug: 'at-the-backdoor'},
]

function slugify(input = '') {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-/]/g, '')
    .replace(/[\s/]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function upsertDoc(doc) {
  return client
    .transaction()
    .createIfNotExists(doc)
    .patch(doc._id, (p) => p.set(doc))
    .commit()
}

async function ensureCategories() {
  for (const c of categories) {
    const _id = `kbCategory.${c.slug}`
    const doc = {
      _id,
      _type: 'kbCategory',
      title: c.title,
      slug: {current: c.slug, _type: 'slug'},
      icon: c.icon,
      order: c.order,
    }
    await upsertDoc(doc)
  }
}

async function ensureShows() {
  for (const s of shows) {
    const _id = `youtubeShow.${s.slug}`
    const doc = {
      _id,
      _type: 'youtubeShow',
      title: s.title,
      slug: {current: s.slug, _type: 'slug'},
    }
    await upsertDoc(doc)
  }
}

async function getCategoryIdBySlug(slug) {
  const doc = await client.fetch(`*[_type=="kbCategory" && slug.current==$slug][0]{_id}`, {slug})
  return doc?._id || null
}

async function getShowIdBySlug(slug) {
  const doc = await client.fetch(`*[_type=="youtubeShow" && slug.current==$slug][0]{_id}`, {slug})
  return doc?._id || null
}

async function migrateYouTubeShowRefs() {
  // Find kbItems where youtubeShow is defined but not a reference
  const items = await client.fetch(
    `*[_type=="kbItem" && defined(youtubeShow) && !defined(youtubeShow._ref)]{_id, youtubeShow, category}`
  )
  if (!items.length) return {updated: 0}

  const ytCategoryId = await getCategoryIdBySlug('youtube-shows')
  let updated = 0

  for (const item of items) {
    const val = item.youtubeShow
    let showSlug
    if (typeof val === 'string') {
      showSlug = slugify(val)
    } else if (val && typeof val === 'object' && val.current) {
      showSlug = slugify(val.current)
    }
    if (!showSlug) continue

    const showId = await getShowIdBySlug(showSlug)
    if (!showId) continue

    const patch = client.patch(item._id).set({youtubeShow: {_type: 'reference', _ref: showId}})
    // If category missing, set to YouTube Shows
    if (!item.category?._ref && ytCategoryId) {
      patch.set({category: {_type: 'reference', _ref: ytCategoryId}})
    }
    await patch.commit()
    updated++
  }
  return {updated}
}

async function main() {
  console.log('Seeding categories…')
  await ensureCategories()
  console.log('Seeding shows…')
  await ensureShows()
  console.log('Migrating kbItem.youtubeShow strings to references…')
  const res = await migrateYouTubeShowRefs()
  console.log(`Migration done. Updated ${res.updated} items.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
