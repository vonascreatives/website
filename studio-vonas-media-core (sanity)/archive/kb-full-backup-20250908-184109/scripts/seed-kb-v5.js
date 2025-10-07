/*
  Seed KB v5 structure (short names, no emojis, flat model with parent)

  What this script does:
  - Upserts kbCategory docs: company, production, shows, tools, partners
  - Upserts youtubeShow docs: Off the Record, Skyline
  - Upserts kbItem sections using parent references and kind='section'
  - Uses deterministic IDs for idempotent runs

  Run:
  npx sanity exec scripts/seed-kb-v5.js --with-user-token
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

function idFromPath(type, pathSegments) {
  const path = pathSegments.map(slugify).filter(Boolean).join('.')
  return `${type}.v5.${path}`
}

async function upsert(doc) {
  // createIfNotExists requires _id to be set
  if (!doc._id) throw new Error('createIfNotExists requires _id')
  return client.createIfNotExists(doc)
}

async function upsertCategory({title, slug, order = 100}) {
  const _id = idFromPath('kbCategory', [slug])
  return upsert({
    _id,
    _type: 'kbCategory',
    title,
    slug: {current: slug, _type: 'slug'},
    order,
  })
}

async function upsertShow({title, slug, order = 1}) {
  const _id = idFromPath('youtubeShow', [slug])
  return upsert({
    _id,
    _type: 'youtubeShow',
    title,
    slug: {current: slug, _type: 'slug'},
    order,
  })
}

async function getIdBy(type, slug) {
  const field = type === 'kbCategory' ? 'slug.current' : 'slug.current'
  const q = `*[_type=="${type}" && ${field}==$slug][0]{_id}`
  const res = await client.fetch(q, {slug})
  return res?._id
}

async function upsertSection({title, categorySlug, pathSegments, parentId = null, youtubeShowSlug = null, order = 100}) {
  const _id = idFromPath('kbItem', pathSegments)
  const categoryId = categorySlug ? await getIdBy('kbCategory', categorySlug) : null
  const youtubeShowId = youtubeShowSlug ? await getIdBy('youtubeShow', youtubeShowSlug) : null

  const doc = {
    _id,
    _type: 'kbItem',
    title,
    slug: {current: slugify(title), _type: 'slug'},
    kind: 'section',
    order,
    hidden: false,
    status: 'published',
    category: categoryId ? {_type: 'reference', _ref: categoryId} : undefined,
    parent: parentId ? {_type: 'reference', _ref: parentId} : undefined,
    youtubeShow: youtubeShowId ? {_type: 'reference', _ref: youtubeShowId} : undefined,
  }
  Object.keys(doc).forEach((k)=>doc[k]===undefined && delete doc[k])
  await upsert(doc)
  return _id
}

async function seedCategories() {
  const categories = [
    {title: 'Company', slug: 'company', order: 1},
    {title: 'Production', slug: 'production', order: 2},
    {title: 'Shows', slug: 'shows', order: 3},
    {title: 'Tools', slug: 'tools', order: 4},
    {title: 'Partners', slug: 'partners', order: 5},
  ]
  for (const c of categories) {
    await upsertCategory(c)
    console.log(`✓ Category: ${c.title}`)
  }
}

async function seedShows() {
  const shows = [
    {title: 'Off the Record', slug: 'off-the-record', order: 1},
    {title: 'Skyline', slug: 'skyline', order: 2},
  ]
  for (const s of shows) {
    await upsertShow(s)
    console.log(`✓ Show: ${s.title}`)
  }
}

async function seedCompanyTree() {
  const category = 'company'
  const companyRoot = await upsertSection({title: 'Company', categorySlug: category, pathSegments: ['company']})
  // Vonas Media
  const vonas = await upsertSection({title: 'Vonas Media', categorySlug: category, parentId: companyRoot, pathSegments: ['company','vonas-media'], order: 1})
  await upsertSection({title: 'Policies', categorySlug: category, parentId: vonas, pathSegments: ['company','vonas-media','policies'], order: 1})
  await upsertSection({title: 'SOPs', categorySlug: category, parentId: vonas, pathSegments: ['company','vonas-media','sops'], order: 2})
  await upsertSection({title: 'HR & Finance', categorySlug: category, parentId: vonas, pathSegments: ['company','vonas-media','hr-and-finance'], order: 3})
  await upsertSection({title: 'Meetings & Docs', categorySlug: category, parentId: vonas, pathSegments: ['company','vonas-media','meetings-and-docs'], order: 4})
  // Interns
  const interns = await upsertSection({title: 'Interns', categorySlug: category, parentId: companyRoot, pathSegments: ['company','interns'], order: 2})
  await upsertSection({title: 'Onboarding', categorySlug: category, parentId: interns, pathSegments: ['company','interns','onboarding'], order: 1})
  await upsertSection({title: 'Training & Tasks', categorySlug: category, parentId: interns, pathSegments: ['company','interns','training-and-tasks'], order: 2})
  await upsertSection({title: 'Templates & Forms', categorySlug: category, parentId: interns, pathSegments: ['company','interns','templates-and-forms'], order: 3})
  // Freelancers
  const freelancers = await upsertSection({title: 'Freelancers', categorySlug: category, parentId: companyRoot, pathSegments: ['company','freelancers'], order: 3})
  await upsertSection({title: 'Onboarding', categorySlug: category, parentId: freelancers, pathSegments: ['company','freelancers','onboarding'], order: 1})
  await upsertSection({title: 'Contracts & Rates', categorySlug: category, parentId: freelancers, pathSegments: ['company','freelancers','contracts-and-rates'], order: 2})
  await upsertSection({title: 'Briefs & Deliverables', categorySlug: category, parentId: freelancers, pathSegments: ['company','freelancers','briefs-and-deliverables'], order: 3})
}

async function seedProductionTree() {
  const category = 'production'
  const prodRoot = await upsertSection({title: 'Production', categorySlug: category, pathSegments: ['production']})
  // Pre-Production
  const pre = await upsertSection({title: 'Pre-Production', categorySlug: category, parentId: prodRoot, pathSegments: ['production','pre-production'], order: 1})
  await upsertSection({title: 'Checklists & Templates', categorySlug: category, parentId: pre, pathSegments: ['production','pre-production','checklists-and-templates'], order: 1})
  await upsertSection({title: 'Schedules & Call Sheets', categorySlug: category, parentId: pre, pathSegments: ['production','pre-production','schedules-and-call-sheets'], order: 2})
  await upsertSection({title: 'Casting & Outreach', categorySlug: category, parentId: pre, pathSegments: ['production','pre-production','casting-and-outreach'], order: 3})
  // Production (Shoots)
  const shoots = await upsertSection({title: 'Production (Shoots)', categorySlug: category, parentId: prodRoot, pathSegments: ['production','shoots'], order: 2})
  await upsertSection({title: 'Protocols & Safety', categorySlug: category, parentId: shoots, pathSegments: ['production','shoots','protocols-and-safety'], order: 1})
  await upsertSection({title: 'Gear Lists & Rentals', categorySlug: category, parentId: shoots, pathSegments: ['production','shoots','gear-lists-and-rentals'], order: 2})
  await upsertSection({title: 'Locations & Permits', categorySlug: category, parentId: shoots, pathSegments: ['production','shoots','locations-and-permits'], order: 3})
  // Post-Production
  const post = await upsertSection({title: 'Post-Production', categorySlug: category, parentId: prodRoot, pathSegments: ['production','post-production'], order: 3})
  await upsertSection({title: 'Editing & Color', categorySlug: category, parentId: post, pathSegments: ['production','post-production','editing-and-color'], order: 1})
  await upsertSection({title: 'Audio & Music', categorySlug: category, parentId: post, pathSegments: ['production','post-production','audio-and-music'], order: 2})
  await upsertSection({title: 'Deliverables & QC', categorySlug: category, parentId: post, pathSegments: ['production','post-production','deliverables-and-qc'], order: 3})
}

async function seedShowsTree() {
  const category = 'shows'
  const showsRoot = await upsertSection({title: 'Shows', categorySlug: category, pathSegments: ['shows']})
  // Off the Record
  const otr = await upsertSection({title: 'Off the Record', categorySlug: category, parentId: showsRoot, pathSegments: ['shows','off-the-record'], youtubeShowSlug: 'off-the-record', order: 1})
  for (const sec of ['Pre-Production','Production','Post-Production','Distribution','Visual Identity']) {
    await upsertSection({title: sec, categorySlug: category, parentId: otr, pathSegments: ['shows','off-the-record', slugify(sec)], youtubeShowSlug: 'off-the-record'})
  }
  // Skyline
  const skyline = await upsertSection({title: 'Skyline', categorySlug: category, parentId: showsRoot, pathSegments: ['shows','skyline'], youtubeShowSlug: 'skyline', order: 2})
  for (const sec of ['Pre-Production','Production','Post-Production','Distribution','Visual Identity']) {
    await upsertSection({title: sec, categorySlug: category, parentId: skyline, pathSegments: ['shows','skyline', slugify(sec)], youtubeShowSlug: 'skyline'})
  }
}

async function seedToolsTree() {
  const category = 'tools'
  const toolsRoot = await upsertSection({title: 'Tools', categorySlug: category, pathSegments: ['tools']})
  const editing = await upsertSection({title: 'Editing & Design', categorySlug: category, parentId: toolsRoot, pathSegments: ['tools','editing-and-design'], order: 1})
  await upsertSection({title: 'Premiere Pro / DaVinci', categorySlug: category, parentId: editing, pathSegments: ['tools','editing-and-design','premiere-pro-davinci'], order: 1})
  await upsertSection({title: 'After Effects / Figma', categorySlug: category, parentId: editing, pathSegments: ['tools','editing-and-design','after-effects-figma'], order: 2})
  await upsertSection({title: 'Photoshop / Illustrator', categorySlug: category, parentId: editing, pathSegments: ['tools','editing-and-design','photoshop-illustrator'], order: 3})

  const automation = await upsertSection({title: 'Automation & Data', categorySlug: category, parentId: toolsRoot, pathSegments: ['tools','automation-and-data'], order: 2})
  await upsertSection({title: 'Airtable / Notion', categorySlug: category, parentId: automation, pathSegments: ['tools','automation-and-data','airtable-notion'], order: 1})
  await upsertSection({title: 'n8n / Windmill', categorySlug: category, parentId: automation, pathSegments: ['tools','automation-and-data','n8n-windmill'], order: 2})
  await upsertSection({title: 'Weaviate / Qdrant', categorySlug: category, parentId: automation, pathSegments: ['tools','automation-and-data','weaviate-qdrant'], order: 3})

  const comms = await upsertSection({title: 'Comms & Ops', categorySlug: category, parentId: toolsRoot, pathSegments: ['tools','comms-and-ops'], order: 3})
  await upsertSection({title: 'Slack / Sessions', categorySlug: category, parentId: comms, pathSegments: ['tools','comms-and-ops','slack-sessions'], order: 1})
  await upsertSection({title: 'GitBook / ClickUp', categorySlug: category, parentId: comms, pathSegments: ['tools','comms-and-ops','gitbook-clickup'], order: 2})
  await upsertSection({title: 'Email & SMS', categorySlug: category, parentId: comms, pathSegments: ['tools','comms-and-ops','email-sms'], order: 3})
}

async function seedPartnersTree() {
  const category = 'partners'
  const partnersRoot = await upsertSection({title: 'Partners', categorySlug: category, pathSegments: ['partners']})
  const influencers = await upsertSection({title: 'Influencers', categorySlug: category, parentId: partnersRoot, pathSegments: ['partners','influencers'], order: 1})
  await upsertSection({title: 'Pipeline & Outreach', categorySlug: category, parentId: influencers, pathSegments: ['partners','influencers','pipeline-and-outreach'], order: 1})
  await upsertSection({title: 'Agreements & Rates', categorySlug: category, parentId: influencers, pathSegments: ['partners','influencers','agreements-and-rates'], order: 2})
  await upsertSection({title: 'Assets & Collabs', categorySlug: category, parentId: influencers, pathSegments: ['partners','influencers','assets-and-collabs'], order: 3})

  const brands = await upsertSection({title: 'Brands', categorySlug: category, parentId: partnersRoot, pathSegments: ['partners','brands'], order: 2})
  await upsertSection({title: 'Pipeline & Outreach', categorySlug: category, parentId: brands, pathSegments: ['partners','brands','pipeline-and-outreach'], order: 1})
  await upsertSection({title: 'Agreements & Rates', categorySlug: category, parentId: brands, pathSegments: ['partners','brands','agreements-and-rates'], order: 2})
  await upsertSection({title: 'Brand Kits & Guidelines', categorySlug: category, parentId: brands, pathSegments: ['partners','brands','brand-kits-and-guidelines'], order: 3})

  const creators = await upsertSection({title: 'Content Creators', categorySlug: category, parentId: partnersRoot, pathSegments: ['partners','content-creators'], order: 3})
  await upsertSection({title: 'Pipeline & Outreach', categorySlug: category, parentId: creators, pathSegments: ['partners','content-creators','pipeline-and-outreach'], order: 1})
  await upsertSection({title: 'Collab Formats', categorySlug: category, parentId: creators, pathSegments: ['partners','content-creators','collab-formats'], order: 2})
  await upsertSection({title: 'Agreements & Rev Share', categorySlug: category, parentId: creators, pathSegments: ['partners','content-creators','agreements-and-rev-share'], order: 3})
}

async function main() {
  console.log('Seeding KB v5: categories...')
  await seedCategories()
  console.log('Seeding KB v5: shows...')
  await seedShows()
  console.log('Seeding KB v5: Company tree...')
  await seedCompanyTree()
  console.log('Seeding KB v5: Production tree...')
  await seedProductionTree()
  console.log('Seeding KB v5: Shows tree...')
  await seedShowsTree()
  console.log('Seeding KB v5: Tools tree...')
  await seedToolsTree()
  console.log('Seeding KB v5: Partners tree...')
  await seedPartnersTree()
  console.log('\n✅ KB v5 seeding complete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

