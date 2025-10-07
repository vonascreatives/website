/*
  Add more sample pages across folders to make judging easier.
  Run: npx sanity exec scripts/seed-kb-more-pages-v5.js --with-user-token
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
  console.log(`✓ Page: ${title} -> ${parentPath.join(' / ')} [${section}]`)
}

async function main(){
  // Company -> Interns
  await upsertPage({title: 'Intern Onboarding Guide', categorySlug: 'company', parentPath: ['company','interns'], section: 'Onboarding', order: 10})
  await upsertPage({title: 'Training Checklist', categorySlug: 'company', parentPath: ['company','interns'], section: 'Training & Tasks', order: 20})
  await upsertPage({title: 'Templates Index', categorySlug: 'company', parentPath: ['company','interns'], section: 'Templates & Forms', order: 30})

  // Company -> Freelancers
  await upsertPage({title: 'Freelancer Onboarding', categorySlug: 'company', parentPath: ['company','freelancers'], section: 'Onboarding', order: 10})
  await upsertPage({title: 'Contracts & Rates Overview', categorySlug: 'company', parentPath: ['company','freelancers'], section: 'Contracts & Rates', order: 20})
  await upsertPage({title: 'Briefs & Deliverables Template', categorySlug: 'company', parentPath: ['company','freelancers'], section: 'Briefs & Deliverables', order: 30})

  // Production pages grouped by section label
  await upsertPage({title: 'Call Sheet Template', categorySlug: 'production', parentPath: ['production'], section: 'Pre-Production', order: 15})
  await upsertPage({title: 'Casting & Outreach Guide', categorySlug: 'production', parentPath: ['production'], section: 'Pre-Production', order: 16})
  await upsertPage({title: 'Locations & Permits Overview', categorySlug: 'production', parentPath: ['production'], section: 'Production', order: 25})
  await upsertPage({title: 'Audio & Music Basics', categorySlug: 'production', parentPath: ['production'], section: 'Post-Production', order: 35})
  await upsertPage({title: 'Deliverables & QC Checklist', categorySlug: 'production', parentPath: ['production'], section: 'Post-Production', order: 36})

  // Shows -> Off the Record additional
  await upsertPage({title: 'Guest Outreach Email Templates', categorySlug: 'shows', parentPath: ['shows','off-the-record'], section: 'Pre-Production', order: 11})
  await upsertPage({title: 'Visual Identity Guidelines', categorySlug: 'shows', parentPath: ['shows','off-the-record'], section: 'Visual Identity', order: 40})

  // Shows -> Skyline
  await upsertPage({title: 'Skyline Pre-Pro Checklist', categorySlug: 'shows', parentPath: ['shows','skyline'], section: 'Pre-Production', order: 10})
  await upsertPage({title: 'Skyline Shooting Protocols', categorySlug: 'shows', parentPath: ['shows','skyline'], section: 'Production', order: 20})
  await upsertPage({title: 'Skyline Editing Workflow', categorySlug: 'shows', parentPath: ['shows','skyline'], section: 'Post-Production', order: 30})

  // Tools -> Editing & Design
  await upsertPage({title: 'Premiere Pro / DaVinci', categorySlug: 'tools', parentPath: ['tools','editing-and-design'], section: 'Editing & Design', order: 10})
  await upsertPage({title: 'After Effects / Figma', categorySlug: 'tools', parentPath: ['tools','editing-and-design'], section: 'Editing & Design', order: 20})
  await upsertPage({title: 'Photoshop / Illustrator', categorySlug: 'tools', parentPath: ['tools','editing-and-design'], section: 'Editing & Design', order: 30})

  // Tools -> Automation & Data
  await upsertPage({title: 'Airtable / Notion Integration', categorySlug: 'tools', parentPath: ['tools','automation-and-data'], section: 'Automation & Data', order: 10})
  await upsertPage({title: 'n8n / Windmill Flows', categorySlug: 'tools', parentPath: ['tools','automation-and-data'], section: 'Automation & Data', order: 20})
  await upsertPage({title: 'Weaviate / Qdrant Notes', categorySlug: 'tools', parentPath: ['tools','automation-and-data'], section: 'Automation & Data', order: 30})

  // Tools -> Comms & Ops
  await upsertPage({title: 'Slack / Sessions Playbook', categorySlug: 'tools', parentPath: ['tools','comms-and-ops'], section: 'Comms & Ops', order: 10})
  await upsertPage({title: 'GitBook / ClickUp Setup', categorySlug: 'tools', parentPath: ['tools','comms-and-ops'], section: 'Comms & Ops', order: 20})
  await upsertPage({title: 'Email & SMS Patterns', categorySlug: 'tools', parentPath: ['tools','comms-and-ops'], section: 'Comms & Ops', order: 30})

  // Partners -> Influencers
  await upsertPage({title: 'Influencer Pipeline & Outreach', categorySlug: 'partners', parentPath: ['partners','influencers'], section: 'Pipeline & Outreach', order: 10})
  await upsertPage({title: 'Influencer Agreements & Rates', categorySlug: 'partners', parentPath: ['partners','influencers'], section: 'Agreements & Rates', order: 20})
  await upsertPage({title: 'Influencer Assets & Collabs', categorySlug: 'partners', parentPath: ['partners','influencers'], section: 'Assets & Collabs', order: 30})

  // Partners -> Brands
  await upsertPage({title: 'Brand Pipeline & Outreach', categorySlug: 'partners', parentPath: ['partners','brands'], section: 'Pipeline & Outreach', order: 10})
  await upsertPage({title: 'Brand Agreements & Rates', categorySlug: 'partners', parentPath: ['partners','brands'], section: 'Agreements & Rates', order: 20})
  await upsertPage({title: 'Brand Kits & Guidelines', categorySlug: 'partners', parentPath: ['partners','brands'], section: 'Brand Kits & Guidelines', order: 30})

  // Partners -> Content Creators
  await upsertPage({title: 'Creator Pipeline & Outreach', categorySlug: 'partners', parentPath: ['partners','content-creators'], section: 'Pipeline & Outreach', order: 10})
  await upsertPage({title: 'Collab Formats', categorySlug: 'partners', parentPath: ['partners','content-creators'], section: 'Collab Formats', order: 20})
  await upsertPage({title: 'Agreements & Rev Share', categorySlug: 'partners', parentPath: ['partners','content-creators'], section: 'Agreements & Rev Share', order: 30})
}

main().catch((err)=>{ console.error(err); process.exit(1) })

