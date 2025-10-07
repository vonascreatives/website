/*
  Seed example Docs Sections (pages) and Docs Pages, so HomePage Content area has folders per page.
  Run: npx sanity exec scripts/seed-homepage-docs.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')
const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

function slugify(str=''){
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-/&]/g,'')
    .replace(/[&]/g,'and')
    .replace(/[\s/]+/g,'-')
    .replace(/^-+|-+$/g,'')
}

function id(type, ...parts){
  return `${type}.v5.${parts.map(slugify).filter(Boolean).join('.')}`
}

async function upsertSection(title, parentId=null){
  const _id = id('docsSection', title)
  const doc = {
    _id,
    _type: 'docsSection',
    title,
    slug: {current: slugify(title), _type: 'slug'},
    parent: parentId ? {_type: 'reference', _ref: parentId} : undefined,
    order: 0,
  }
  Object.keys(doc).forEach(k=>doc[k]===undefined && delete doc[k])
  await client.createIfNotExists(doc)
  return _id
}

async function upsertPage(title, sectionTitle){
  const sectionId = id('docsSection', sectionTitle)
  const _id = id('docsPage', sectionTitle, title)
  const doc = {
    _id,
    _type: 'docsPage',
    title,
    slug: {current: slugify(title), _type: 'slug'},
    section: {_type: 'reference', _ref: sectionId},
    order: 0,
    isPublished: true,
    body: []
  }
  await client.createIfNotExists(doc)
  return _id
}

async function main(){
  const sections = ['Home','About','Services','Projects','Contact']
  for(const s of sections){
    await upsertSection(s)
  }

  // A few sample pages under Home
  await upsertPage('Hero Copy', 'Home')
  await upsertPage('Brand Slider Notes', 'Home')
  await upsertPage('CTA Footer', 'Home')

  // One example page under About / Contact
  await upsertPage('About Intro', 'About')
  await upsertPage('Contact Methods', 'Contact')

  console.log('✓ Seeded docs sections/pages')
}

main().catch((e)=>{ console.error(e); process.exit(1) })

