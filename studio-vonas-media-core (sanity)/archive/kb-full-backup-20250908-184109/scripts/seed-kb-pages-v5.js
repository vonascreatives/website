/*
  Seed a few sample pages to demonstrate Option A (Folder -> Pages with section label)

  Run:
  npx sanity exec scripts/seed-kb-pages-v5.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')
const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

function slugify(input = '') {
  return input.toLowerCase().trim()
    .replace(/[^a-z0-9\s-/&]/g, '')
    .replace(/[&]/g, 'and')
    .replace(/[\s/]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function idFromPath(type, pathSegments) {
  const path = pathSegments.map(slugify).filter(Boolean).join('.')
  return `${type}.v5.${path}`
}

async function getIdBy(type, slug) {
  const q = `*[_type=="${type}" && slug.current==$slug][0]{_id}`
  const doc = await client.fetch(q, {slug})
  return doc?._id
}

async function upsertPage({title, categorySlug, parentPath, section, order = 100}) {
  const parentId = idFromPath('kbItem', parentPath)
  const categoryId = categorySlug ? await getIdBy('kbCategory', categorySlug) : null
  const _id = idFromPath('kbItem', [...parentPath, 'page', slugify(title)])

  const doc = {
    _id,
    _type: 'kbItem',
    title,
    slug: {current: slugify(title), _type: 'slug'},
    kind: 'page',
    section,
    order,
    hidden: false,
    status: 'published',
    category: categoryId ? {_type: 'reference', _ref: categoryId} : undefined,
    parent: {_type: 'reference', _ref: parentId},
  }
  Object.keys(doc).forEach((k)=>doc[k]===undefined && delete doc[k])
  await client.createIfNotExists(doc)
  console.log(`✓ Page: ${title} (section: ${section}) under ${parentPath.join(' / ')}`)
}

async function main(){
  // Off the Record folder
  await upsertPage({
    title: 'Shooting Protocols',
    categorySlug: 'shows',
    parentPath: ['shows','off-the-record'],
    section: 'Production',
    order: 10,
  })
  await upsertPage({
    title: 'Editing Workflow',
    categorySlug: 'shows',
    parentPath: ['shows','off-the-record'],
    section: 'Post-Production',
    order: 20,
  })
  await upsertPage({
    title: 'Distribution Checklist',
    categorySlug: 'shows',
    parentPath: ['shows','off-the-record'],
    section: 'Distribution',
    order: 30,
  })

  // Production folder
  await upsertPage({
    title: 'Pre-Production Checklist',
    categorySlug: 'production',
    parentPath: ['production'],
    section: 'Pre-Production',
    order: 10,
  })
  await upsertPage({
    title: 'Camera Setup Guide',
    categorySlug: 'production',
    parentPath: ['production'],
    section: 'Production',
    order: 20,
  })
  await upsertPage({
    title: 'Editing & Color Guide',
    categorySlug: 'production',
    parentPath: ['production'],
    section: 'Post-Production',
    order: 30,
  })

  // Company -> Vonas Media
  await upsertPage({
    title: 'Security Policy Overview',
    categorySlug: 'company',
    parentPath: ['company','vonas-media'],
    section: 'Policies',
    order: 10,
  })
}

main().catch((err)=>{ console.error(err); process.exit(1) })

