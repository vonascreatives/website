/*
  Import FAQs from OLD KB(Messy)/03_FAQ_COLLECTION/master_faq_list.md
  Maps FAQ groups to our faqSimple categories

  Run with:
  npx sanity exec scripts/import-faqs-from-markdown.js --with-user-token
*/

const fs = require('fs')
const path = require('path')
const {getCliClient} = require('sanity/cli')

const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

const SOURCE = path.resolve('OLD KB(Messy)/03_FAQ_COLLECTION/master_faq_list.md')

const groupToCategory = (groupTitle) => {
  const t = groupTitle.toLowerCase()
  if (t.includes('company foundation')) return 'company-foundation'
  if (t.includes('team') || t.includes('organization')) return 'team-management'
  if (t.includes('content production')) return 'content-production'
  if (t.includes('show')) return 'show-specific'
  if (t.includes('tools') || t.includes('technology')) return 'tools-systems'
  if (t.includes('external')) return 'external-collaboration'
  if (t.includes('policies')) return 'policies-procedures'
  if (t.includes('intern')) return 'team-management'
  return 'general'
}

function parseFaqs(markdown) {
  const lines = markdown.split(/\r?\n/)
  let currentGroup = 'general'
  const faqs = []
  let cur = null

  for (let i=0;i<lines.length;i++) {
    const line = lines[i].trim()
    const groupMatch = line.match(/^##\s+(.+?)FAQs/i)
    if (groupMatch) {
      currentGroup = groupMatch[1]
      continue
    }
    const faqHeader = line.match(/^###\s*(FAQ-(\d{3})):\s*(.+)$/)
    if (faqHeader) {
      if (cur) faqs.push(cur)
      cur = {
        faqId: faqHeader[1],
        question: faqHeader[3].trim(),
        category: groupToCategory(currentGroup),
        answer: '',
        tags: []
      }
      continue
    }
    if (!cur) continue

    const qMatch = line.match(/^\*\*Question\*\*:\s*(.+)$/i)
    if (qMatch) { cur.question = qMatch[1].trim(); continue }

    const aMatch = line.match(/^\*\*Answer\*\*:\s*(.+)$/i)
    if (aMatch) { cur.answer = aMatch[1].trim(); continue }

    const tagsMatch = line.match(/^\*\*Tags\*\*:\s*(.+)$/i)
    if (tagsMatch) { cur.tags = tagsMatch[1].split(/[,\s]+/).filter(Boolean); continue }
  }
  if (cur) faqs.push(cur)
  return faqs
}

async function upsertFaq(f) {
  const _id = f.faqId.toLowerCase()
  const doc = {
    _id,
    _type: 'faq',
    faqId: f.faqId,
    question: f.question,
    answer: f.answer || 'To be populated.',
    category: f.category,
    tags: (f.tags||[]).map(tag=>({tag})),
    order: parseInt(f.faqId.replace('FAQ-',''),10) || 100,
    isActive: true,
  }
  await client.createOrReplace(doc)
}

async function main(){
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`)
    process.exit(1)
  }
  const markdown = fs.readFileSync(SOURCE, 'utf8')
  const faqs = parseFaqs(markdown)
  console.log(`Parsed ${faqs.length} FAQs`)

  let created = 0
  for (const f of faqs) {
    await upsertFaq(f)
    created++
  }
  console.log(`✅ Upserted ${created} FAQ documents`)
}

main().catch((err)=>{
  console.error(err)
  process.exit(1)
})
