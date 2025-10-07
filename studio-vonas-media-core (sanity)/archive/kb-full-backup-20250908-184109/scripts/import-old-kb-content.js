/*
  Import documents from OLD KB(Messy) into kbItem documents with proper nesting
  - Parses key markdown docs
  - Parses SOP CSV rows into kbItem docs
  - Places content into improved folders created by build-better-kb-structure.js

  Run:
  npx sanity exec scripts/import-old-kb-content.js --with-user-token
*/

const fs = require('fs')
const path = require('path')
const {getCliClient} = require('sanity/cli')
const crypto = require('crypto')

const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

// Paths
const ROOT = path.resolve('OLD KB(Messy)')
const MASTER_STRUCTURE = path.join(ROOT, '02_ORGANIZED_CONTENT/MASTER_KNOWLEDGE_STRUCTURE.md')
const STRATEGY = path.join(ROOT, 'KNOWLEDGE_REORGANIZATION_STRATEGY.md')
const PROJECT_SUMMARY = path.join(ROOT, 'PROJECT_SUMMARY_AND_NEXT_STEPS.md')
const INTERNAL_WIKI = path.join(ROOT, '01_RAW_CONTENT/internal_wiki/raw_content.md')
const CORE_WIKI = path.join(ROOT, '01_RAW_CONTENT/core_team_wiki/raw_content.md')
const CONFLICTS = path.join(ROOT, '04_CONFLICTS_QUESTIONS/content_analysis.md')
const ACCESS = path.join(ROOT, '04_CONFLICTS_QUESTIONS/access_issues.md')
const HEPTA = path.join(ROOT, 'Heptabase Export Sept 2 2025/KB - VONAS- 2025.md')
const SOP_CSV = path.join(ROOT, 'SOP Grid View - Vonas Media.csv')

function slugify(input=''){
  return input.toLowerCase().trim().replace(/[^a-z0-9\s-/&]/g,'').replace(/[&]/g,'and').replace(/[\s/]+/g,'-').replace(/^-+|-+$/g,'')
}
function idFromPath(pathSegments){
  const parts = pathSegments.map(slugify).filter(Boolean)
  const joined = parts.join('.')
  // Sanity IDs must be URL-safe and reasonably sized. Shorten overly long IDs deterministically.
  if (joined.length <= 120) return `kbItem.${joined}`
  const hash = crypto.createHash('sha1').update(joined).digest('hex').slice(0, 10)
  // Keep beginning context + hash + last segment context
  const first = parts.slice(0, 3).join('.').slice(0, 40)
  const last = parts.slice(-1)[0].slice(0, 40)
  return `kbItem.${first}.${hash}.${last}`
}
function block(text){
  return [{_type:'block', style:'normal', markDefs:[], children:[{_type:'span', text:text, marks:[]}]}]
}

async function getCategoryId(slug) {
  const doc = await client.fetch(`*[_type=="kbCategory" && slug.current==$slug][0]{_id}`, {slug})
  return doc?._id
}
async function getShowId(slug) {
  const doc = await client.fetch(`*[_type=="youtubeShow" && slug.current==$slug][0]{_id}`, {slug})
  return doc?._id
}

async function ensureFolder({title, pathSegments, categoryId, parentId, youtubeShowId}){
  const _id = idFromPath(pathSegments)
  const doc = {
    _id,
    _type:'kbItem',
    title,
    slug:{current:slugify(title), _type:'slug'},
    itemType:'folder',
    status:'published',
    category:{_type:'reference', _ref:categoryId},
    parent: parentId?{_type:'reference', _ref:parentId}:undefined,
    youtubeShow: youtubeShowId?{_type:'reference', _ref:youtubeShowId}:undefined,
  }
  Object.keys(doc).forEach((k)=>doc[k]===undefined && delete doc[k])
  await client.createIfNotExists(doc)
  return _id
}

async function upsertDoc({title, content, categorySlug, pathSegments, parentPath, youtubeShowSlug, overviewSteps=[]}){
  const categoryId = await getCategoryId(categorySlug)
  if (!categoryId) throw new Error(`Missing category ${categorySlug}`)
  const youtubeShowId = youtubeShowSlug? await getShowId(youtubeShowSlug) : undefined

  // Ensure parent folders
  let parentId = null
  if (parentPath && parentPath.length) {
    for (let i=0;i<parentPath.length;i++) {
      const segs = parentPath.slice(0, i+1)
      const parentTitle = segs[i]
      parentId = await ensureFolder({
        title: parentTitle,
        pathSegments: segs,
        categoryId,
        parentId: i===0?null:idFromPath(segs.slice(0,i)),
        youtubeShowId,
      })
    }
  }

  const fullPath = [...(parentPath||[]), slugify(title)]
  const _id = idFromPath(fullPath)
  const doc = {
    _id,
    _type:'kbItem',
    title,
    slug:{current:slugify(title), _type:'slug'},
    itemType:'document',
    status:'draft',
    category:{_type:'reference', _ref:categoryId},
    parent: parentId?{_type:'reference', _ref:parentId}:undefined,
    youtubeShow: youtubeShowId?{_type:'reference', _ref:youtubeShowId}:undefined,
    content: Array.isArray(content)?content:block(String(content||'')),
    overviewSteps,
  }
  Object.keys(doc).forEach((k)=>doc[k]===undefined && delete doc[k])
  await client.createOrReplace(doc)
  return _id
}

// --- Parsers ---
function readFileSafe(p){ return fs.existsSync(p) ? fs.readFileSync(p,'utf8') : '' }

async function importMasterStructure(){
  const md = readFileSafe(MASTER_STRUCTURE)
  if (!md) return 0
  const lines = md.split(/\r?\n/)
  let currentCategory = null
  let created = 0
  for (const line of lines){
    const cat = line.match(/^##\s+Category\s+\d+:\s+(.+)$/)
    if (cat){
      const name = cat[1].trim()
      // map category name to slug
      const map = {
        'Company Foundation':'company-foundation',
        'Team Management & Operations':'team-operations',
        'Content Production Workflows':'production-workflows',
        'Show-Specific Documentation':'youtube-shows',
        'Tools and Systems':'tools-systems',
        'External Collaboration':'external-partnerships',
        'Policies and Procedures':'policies-procedures',
      }
      currentCategory = map[name] || 'company-foundation'
      continue
    }
    const sub = line.match(/^###\s+\d+\.\d+\s+(.+)$/)
    if (sub && currentCategory){
      const title = sub[1].trim()
      await upsertDoc({
        title,
        content: `Imported from MASTER_KNOWLEDGE_STRUCTURE.md (Category: ${currentCategory})`,
        categorySlug: currentCategory,
        pathSegments: [currentCategory, slugify(title)],
        parentPath: [currentCategory],
      })
      created++
    }
  }
  return created
}

async function importProjectDocs(){
  let created = 0
  if (fs.existsSync(STRATEGY)){
    await upsertDoc({
      title:'Knowledge Base Reorganization Strategy',
      content: readFileSafe(STRATEGY),
      categorySlug:'company-foundation',
      parentPath:['company-foundation','company-information'],
    })
    created++
  }
  if (fs.existsSync(PROJECT_SUMMARY)){
    await upsertDoc({
      title:'Project Summary & Next Steps',
      content: readFileSafe(PROJECT_SUMMARY),
      categorySlug:'company-foundation',
      parentPath:['company-foundation','company-information'],
    })
    created++
  }
  return created
}

async function importWikiSummaries(){
  let created = 0
  if (fs.existsSync(INTERNAL_WIKI)){
    await upsertDoc({
      title:'Internal Wiki Summary',
      content: readFileSafe(INTERNAL_WIKI),
      categorySlug:'team-operations',
      parentPath:['team-operations','documentation'],
    })
    created++
  }
  if (fs.existsSync(CORE_WIKI)){
    await upsertDoc({
      title:'Core Team Wiki Summary',
      content: readFileSafe(CORE_WIKI),
      categorySlug:'team-operations',
      parentPath:['team-operations','documentation'],
    })
    created++
  }
  return created
}

async function importConflicts(){
  let created = 0
  if (fs.existsSync(CONFLICTS)){
    await upsertDoc({
      title:'Content Analysis',
      content: readFileSafe(CONFLICTS),
      categorySlug:'team-operations',
      parentPath:['team-operations','documentation'],
    })
    created++
  }
  if (fs.existsSync(ACCESS)){
    await upsertDoc({
      title:'Access Issues',
      content: readFileSafe(ACCESS),
      categorySlug:'policies-procedures',
      parentPath:['policies-procedures','security-and-access'],
    })
    created++
  }
  return created
}

function splitHeptaSections(markdown){
  const lines = markdown.split(/\r?\n/)
  const sections = []
  let current = null
  for (const line of lines){
    const h1 = line.match(/^#\s+(.+)/)
    if (h1){
      if (current) sections.push(current)
      current = {title: h1[1].trim(), body: []}
    } else if (current) {
      current.body.push(line)
    }
  }
  if (current) sections.push(current)
  return sections
}

async function importHeptabase(){
  if (!fs.existsSync(HEPTA)) return 0
  const md = readFileSafe(HEPTA)
  const sections = splitHeptaSections(md)
  let created = 0
  const showMap = {
    'Off The Record':'off-the-record',
    'OTR 2.0':'off-the-record',
    'At The Backdoor':'at-the-backdoor',
    'Skyline':'skyline',
    'Skyline Music':'skyline',
    'Skyline Slam':'skyline',
    'Tatak':'tatak',
  }
  for (const s of sections){
    const title = s.title
    const body = s.body.join('\n')
    if (showMap[title]){
      // Show-specific
      const showSlug = showMap[title]
      const parentPath = ['youtube-shows', showSlug, 'pre-production']
      await upsertDoc({
        title: `${title} - Overview`,
        content: body,
        categorySlug: 'youtube-shows',
        parentPath: ['youtube-shows', showSlug],
        youtubeShowSlug: showSlug,
      })
      created++
    } else if (/How to create a good Topic/i.test(title)){
      await upsertDoc({
        title: 'How to Create a Good Topic',
        content: body,
        categorySlug: 'production-workflows',
        parentPath: ['production-workflows','pre-production','scripting-and-prep'],
      })
      created++
    }
  }
  return created
}

function parseCsvLine(line){
  // Basic CSV splitter respecting quotes
  const out=[]; let cur=''; let inQ=false
  for (let i=0;i<line.length;i++){
    const ch = line[i]
    if (ch==='"') { inQ = !inQ; continue }
    if (ch===',' && !inQ){ out.push(cur); cur=''; continue }
    cur+=ch
  }
  out.push(cur)
  return out
}

async function importSOPCsv(){
  if (!fs.existsSync(SOP_CSV)) return 0
  const raw = fs.readFileSync(SOP_CSV, 'utf8')
  const lines = raw.split(/\r?\n/).filter(Boolean)
  if (lines.length<2) return 0
  const header = parseCsvLine(lines[0]).map(h=>h.trim())

  const get = (row, key) => row[header.indexOf(key)] || ''
  let created = 0
  for (let i=1;i<lines.length;i++){
    const row = parseCsvLine(lines[i])
    if (!row.length) continue

    const title = get(row,'How To') || get(row,'Title')
    if (!title) continue

    // Choose category and parent by Department/Category columns
    const dept = (get(row,'Department')||'').toLowerCase()
    let cat = 'production-workflows'
    let parentPath = ['production-workflows','post-production']
    if (dept.includes('client') || dept.includes('business')) { cat='external-partnerships'; parentPath=['external-partnerships'] }
    if (dept.includes('team') || dept.includes('hr')) { cat='team-operations'; parentPath=['team-operations','documentation'] }
    if (title.toLowerCase().includes('tiktok')||title.toLowerCase().includes('instagram')||title.toLowerCase().includes('youtube')) {
      parentPath=['production-workflows','post-production','social-media']
    }

    const steps = (get(row,'Action Steps')||'').split(/\n|;\s?/).filter(s=>s && s.trim())
    const details = get(row,'Detailed SOP') || get(row,'Description')

    const links = []
    const video = get(row,'Video Link'); if (video) links.push(`Video: ${video}`)
    const notion = get(row,'Notion Link'); if (notion) links.push(`Notion: ${notion}`)
    const flow = get(row,'Flowchart Link'); if (flow) links.push(`Flowchart: ${flow}`)

    await upsertDoc({
      title,
      content: [
        ...block(details || get(row,'Transcription') || 'Imported SOP'),
        ...(links.length? block(`Links: \n- ${links.join('\n- ')}`):[]),
      ],
      categorySlug: cat,
      parentPath,
      overviewSteps: steps.slice(0,10),
    })
    created++
  }
  return created
}

async function main(){
  let total=0
  console.log('📥 Importing MASTER_KNOWLEDGE_STRUCTURE...')
  total += await importMasterStructure()
  console.log('📥 Importing project docs...')
  total += await importProjectDocs()
  console.log('📥 Importing wiki summaries...')
  total += await importWikiSummaries()
  console.log('📥 Importing conflicts & access...')
  total += await importConflicts()
  console.log('📥 Importing Heptabase sections...')
  total += await importHeptabase()
  if (process.env.INCLUDE_SOP_CSV === 'true') {
    console.log('📥 Importing SOP CSV rows...')
    total += await importSOPCsv()
  } else {
    console.log('⏭️ Skipping SOP CSV import (set INCLUDE_SOP_CSV=true to enable)')
  }

  console.log(`\n✅ Imported/updated ~${total} kbItem documents`)
}

main().catch((err)=>{
  console.error(err)
  process.exit(1)
})
