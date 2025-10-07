#!/usr/bin/env node

/**
 * Deploy EXACT KB structure as specified
 */

const {createClient} = require('@sanity/client')
require('dotenv').config({path: '.env.local'})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: false,
})

// EXACT structure as requested
const kbStructure = [
  // ============ COMPANY ============
  {_id: 'kb.company', _type: 'kbItem', title: 'Company', kind: 'section', slug: {current: 'company'}, order: 1},
  
  // Company > Vonas Media
  {_id: 'kb.company.vonas-media', _type: 'kbItem', title: 'Company / Vonas Media', kind: 'section', parent: {_ref: 'kb.company', _type: 'reference'}, slug: {current: 'company/vonas-media'}, order: 1},
  
  // Company > Policies
  {_id: 'kb.company.policies', _type: 'kbItem', title: 'Company / Policies', kind: 'section', parent: {_ref: 'kb.company', _type: 'reference'}, slug: {current: 'company/policies'}, order: 2},
  
  // Company > SOPs
  {_id: 'kb.company.sops', _type: 'kbItem', title: 'Company / SOPs', kind: 'section', parent: {_ref: 'kb.company', _type: 'reference'}, slug: {current: 'company/sops'}, order: 3},
  
  // Company > HR & Finance
  {_id: 'kb.company.hr-finance', _type: 'kbItem', title: 'Company / HR & Finance', kind: 'section', parent: {_ref: 'kb.company', _type: 'reference'}, slug: {current: 'company/hr-finance'}, order: 4},
  
  // Company > Meetings & Docs
  {_id: 'kb.company.meetings-docs', _type: 'kbItem', title: 'Company / Meetings & Docs', kind: 'section', parent: {_ref: 'kb.company', _type: 'reference'}, slug: {current: 'company/meetings-docs'}, order: 5},
  
  // Company > Interns
  {_id: 'kb.company.interns', _type: 'kbItem', title: 'Company / Interns', kind: 'section', parent: {_ref: 'kb.company', _type: 'reference'}, slug: {current: 'company/interns'}, order: 6},
  {_id: 'kb.company.interns.onboarding', _type: 'kbItem', title: 'Company / Interns / Onboarding', kind: 'section', parent: {_ref: 'kb.company.interns', _type: 'reference'}, slug: {current: 'company/interns/onboarding'}, order: 1},
  {_id: 'kb.company.interns.training-tasks', _type: 'kbItem', title: 'Company / Interns / Training & Tasks', kind: 'section', parent: {_ref: 'kb.company.interns', _type: 'reference'}, slug: {current: 'company/interns/training-tasks'}, order: 2},
  {_id: 'kb.company.interns.templates-forms', _type: 'kbItem', title: 'Company / Interns / Templates & Forms', kind: 'section', parent: {_ref: 'kb.company.interns', _type: 'reference'}, slug: {current: 'company/interns/templates-forms'}, order: 3},
  
  // Company > Freelancers
  {_id: 'kb.company.freelancers', _type: 'kbItem', title: 'Company / Freelancers', kind: 'section', parent: {_ref: 'kb.company', _type: 'reference'}, slug: {current: 'company/freelancers'}, order: 7},
  {_id: 'kb.company.freelancers.onboarding', _type: 'kbItem', title: 'Company / Freelancers / Onboarding', kind: 'section', parent: {_ref: 'kb.company.freelancers', _type: 'reference'}, slug: {current: 'company/freelancers/onboarding'}, order: 1},
  {_id: 'kb.company.freelancers.contracts-rates', _type: 'kbItem', title: 'Company / Freelancers / Contracts & Rates', kind: 'section', parent: {_ref: 'kb.company.freelancers', _type: 'reference'}, slug: {current: 'company/freelancers/contracts-rates'}, order: 2},
  {_id: 'kb.company.freelancers.briefs-deliverables', _type: 'kbItem', title: 'Company / Freelancers / Briefs & Deliverables', kind: 'section', parent: {_ref: 'kb.company.freelancers', _type: 'reference'}, slug: {current: 'company/freelancers/briefs-deliverables'}, order: 3},

  // ============ PRODUCTION ============
  {_id: 'kb.production', _type: 'kbItem', title: 'Production', kind: 'section', slug: {current: 'production'}, order: 2},
  
  // Production > Pre-Production
  {_id: 'kb.production.pre-production', _type: 'kbItem', title: 'Production / Pre-Production', kind: 'section', parent: {_ref: 'kb.production', _type: 'reference'}, slug: {current: 'production/pre-production'}, order: 1},
  {_id: 'kb.production.pre-production.checklists-templates', _type: 'kbItem', title: 'Production / Pre-Production / Checklists & Templates', kind: 'section', parent: {_ref: 'kb.production.pre-production', _type: 'reference'}, slug: {current: 'production/pre-production/checklists-templates'}, order: 1},
  {_id: 'kb.production.pre-production.schedules-call-sheets', _type: 'kbItem', title: 'Production / Pre-Production / Schedules & Call Sheets', kind: 'section', parent: {_ref: 'kb.production.pre-production', _type: 'reference'}, slug: {current: 'production/pre-production/schedules-call-sheets'}, order: 2},
  {_id: 'kb.production.pre-production.casting-outreach', _type: 'kbItem', title: 'Production / Pre-Production / Casting & Outreach', kind: 'section', parent: {_ref: 'kb.production.pre-production', _type: 'reference'}, slug: {current: 'production/pre-production/casting-outreach'}, order: 3},
  
  // Production > Production (Shoots)
  {_id: 'kb.production.shoots', _type: 'kbItem', title: 'Production / Production (Shoots)', kind: 'section', parent: {_ref: 'kb.production', _type: 'reference'}, slug: {current: 'production/shoots'}, order: 2},
  {_id: 'kb.production.shoots.protocols-safety', _type: 'kbItem', title: 'Production / Production (Shoots) / Protocols & Safety', kind: 'section', parent: {_ref: 'kb.production.shoots', _type: 'reference'}, slug: {current: 'production/shoots/protocols-safety'}, order: 1},
  {_id: 'kb.production.shoots.gear-lists-rentals', _type: 'kbItem', title: 'Production / Production (Shoots) / Gear Lists & Rentals', kind: 'section', parent: {_ref: 'kb.production.shoots', _type: 'reference'}, slug: {current: 'production/shoots/gear-lists-rentals'}, order: 2},
  {_id: 'kb.production.shoots.locations-permits', _type: 'kbItem', title: 'Production / Production (Shoots) / Locations & Permits', kind: 'section', parent: {_ref: 'kb.production.shoots', _type: 'reference'}, slug: {current: 'production/shoots/locations-permits'}, order: 3},
  
  // Production > Post-Production
  {_id: 'kb.production.post-production', _type: 'kbItem', title: 'Production / Post-Production', kind: 'section', parent: {_ref: 'kb.production', _type: 'reference'}, slug: {current: 'production/post-production'}, order: 3},
  {_id: 'kb.production.post-production.editing-color', _type: 'kbItem', title: 'Production / Post-Production / Editing & Color', kind: 'section', parent: {_ref: 'kb.production.post-production', _type: 'reference'}, slug: {current: 'production/post-production/editing-color'}, order: 1},
  {_id: 'kb.production.post-production.audio-music', _type: 'kbItem', title: 'Production / Post-Production / Audio & Music', kind: 'section', parent: {_ref: 'kb.production.post-production', _type: 'reference'}, slug: {current: 'production/post-production/audio-music'}, order: 2},
  {_id: 'kb.production.post-production.deliverables-qc', _type: 'kbItem', title: 'Production / Post-Production / Deliverables & QC', kind: 'section', parent: {_ref: 'kb.production.post-production', _type: 'reference'}, slug: {current: 'production/post-production/deliverables-qc'}, order: 3},

  // ============ SHOWS ============
  {_id: 'kb.shows', _type: 'kbItem', title: 'Shows', kind: 'section', slug: {current: 'shows'}, order: 3},
  
  // Shows > OTR
  {_id: 'kb.shows.otr', _type: 'kbItem', title: 'Shows / OTR', kind: 'show', parent: {_ref: 'kb.shows', _type: 'reference'}, slug: {current: 'shows/otr'}, order: 1},
  {_id: 'kb.shows.otr.pre-production', _type: 'kbItem', title: 'Shows / OTR / Pre-Production', kind: 'section', parent: {_ref: 'kb.shows.otr', _type: 'reference'}, slug: {current: 'shows/otr/pre-production'}, order: 1},
  {_id: 'kb.shows.otr.production', _type: 'kbItem', title: 'Shows / OTR / Production', kind: 'section', parent: {_ref: 'kb.shows.otr', _type: 'reference'}, slug: {current: 'shows/otr/production'}, order: 2},
  {_id: 'kb.shows.otr.post-production', _type: 'kbItem', title: 'Shows / OTR / Post-Production', kind: 'section', parent: {_ref: 'kb.shows.otr', _type: 'reference'}, slug: {current: 'shows/otr/post-production'}, order: 3},
  {_id: 'kb.shows.otr.distribution', _type: 'kbItem', title: 'Shows / OTR / Distribution', kind: 'section', parent: {_ref: 'kb.shows.otr', _type: 'reference'}, slug: {current: 'shows/otr/distribution'}, order: 4},
  {_id: 'kb.shows.otr.visual-identity', _type: 'kbItem', title: 'Shows / OTR / Visual Identity', kind: 'section', parent: {_ref: 'kb.shows.otr', _type: 'reference'}, slug: {current: 'shows/otr/visual-identity'}, order: 5},
  
  // Shows > Skyline
  {_id: 'kb.shows.skyline', _type: 'kbItem', title: 'Shows / Skyline', kind: 'show', parent: {_ref: 'kb.shows', _type: 'reference'}, slug: {current: 'shows/skyline'}, order: 2},
  {_id: 'kb.shows.skyline.pre-production', _type: 'kbItem', title: 'Shows / Skyline / Pre-Production', kind: 'section', parent: {_ref: 'kb.shows.skyline', _type: 'reference'}, slug: {current: 'shows/skyline/pre-production'}, order: 1},
  {_id: 'kb.shows.skyline.production', _type: 'kbItem', title: 'Shows / Skyline / Production', kind: 'section', parent: {_ref: 'kb.shows.skyline', _type: 'reference'}, slug: {current: 'shows/skyline/production'}, order: 2},
  {_id: 'kb.shows.skyline.post-production', _type: 'kbItem', title: 'Shows / Skyline / Post-Production', kind: 'section', parent: {_ref: 'kb.shows.skyline', _type: 'reference'}, slug: {current: 'shows/skyline/post-production'}, order: 3},
  {_id: 'kb.shows.skyline.distribution', _type: 'kbItem', title: 'Shows / Skyline / Distribution', kind: 'section', parent: {_ref: 'kb.shows.skyline', _type: 'reference'}, slug: {current: 'shows/skyline/distribution'}, order: 4},
  {_id: 'kb.shows.skyline.visual-identity', _type: 'kbItem', title: 'Shows / Skyline / Visual Identity', kind: 'section', parent: {_ref: 'kb.shows.skyline', _type: 'reference'}, slug: {current: 'shows/skyline/visual-identity'}, order: 5},

  // ============ TOOLS ============
  {_id: 'kb.tools', _type: 'kbItem', title: 'Tools', kind: 'section', slug: {current: 'tools'}, order: 4},
  
  // Tools > Editing & Design
  {_id: 'kb.tools.editing-design', _type: 'kbItem', title: 'Tools / Editing & Design', kind: 'section', parent: {_ref: 'kb.tools', _type: 'reference'}, slug: {current: 'tools/editing-design'}, order: 1},
  {_id: 'kb.tools.editing-design.premiere-davinci', _type: 'kbItem', title: 'Tools / Editing & Design / Premiere Pro / DaVinci', kind: 'section', parent: {_ref: 'kb.tools.editing-design', _type: 'reference'}, slug: {current: 'tools/editing-design/premiere-davinci'}, order: 1},
  {_id: 'kb.tools.editing-design.after-effects-figma', _type: 'kbItem', title: 'Tools / Editing & Design / After Effects / Figma', kind: 'section', parent: {_ref: 'kb.tools.editing-design', _type: 'reference'}, slug: {current: 'tools/editing-design/after-effects-figma'}, order: 2},
  {_id: 'kb.tools.editing-design.photoshop-illustrator', _type: 'kbItem', title: 'Tools / Editing & Design / Photoshop / Illustrator', kind: 'section', parent: {_ref: 'kb.tools.editing-design', _type: 'reference'}, slug: {current: 'tools/editing-design/photoshop-illustrator'}, order: 3},
  
  // Tools > Automation & Data
  {_id: 'kb.tools.automation-data', _type: 'kbItem', title: 'Tools / Automation & Data', kind: 'section', parent: {_ref: 'kb.tools', _type: 'reference'}, slug: {current: 'tools/automation-data'}, order: 2},
  {_id: 'kb.tools.automation-data.airtable-notion', _type: 'kbItem', title: 'Tools / Automation & Data / Airtable / Notion', kind: 'section', parent: {_ref: 'kb.tools.automation-data', _type: 'reference'}, slug: {current: 'tools/automation-data/airtable-notion'}, order: 1},
  {_id: 'kb.tools.automation-data.n8n-windmill', _type: 'kbItem', title: 'Tools / Automation & Data / n8n / Windmill', kind: 'section', parent: {_ref: 'kb.tools.automation-data', _type: 'reference'}, slug: {current: 'tools/automation-data/n8n-windmill'}, order: 2},
  {_id: 'kb.tools.automation-data.weaviate-qdrant', _type: 'kbItem', title: 'Tools / Automation & Data / Weaviate / Qdrant', kind: 'section', parent: {_ref: 'kb.tools.automation-data', _type: 'reference'}, slug: {current: 'tools/automation-data/weaviate-qdrant'}, order: 3},
  
  // Tools > Comms & Ops
  {_id: 'kb.tools.comms-ops', _type: 'kbItem', title: 'Tools / Comms & Ops', kind: 'section', parent: {_ref: 'kb.tools', _type: 'reference'}, slug: {current: 'tools/comms-ops'}, order: 3},
  {_id: 'kb.tools.comms-ops.slack-sessions', _type: 'kbItem', title: 'Tools / Comms & Ops / Slack / Sessions', kind: 'section', parent: {_ref: 'kb.tools.comms-ops', _type: 'reference'}, slug: {current: 'tools/comms-ops/slack-sessions'}, order: 1},
  {_id: 'kb.tools.comms-ops.gitbook-clickup', _type: 'kbItem', title: 'Tools / Comms & Ops / GitBook / ClickUp', kind: 'section', parent: {_ref: 'kb.tools.comms-ops', _type: 'reference'}, slug: {current: 'tools/comms-ops/gitbook-clickup'}, order: 2},
  {_id: 'kb.tools.comms-ops.email-sms', _type: 'kbItem', title: 'Tools / Comms & Ops / Email & SMS', kind: 'section', parent: {_ref: 'kb.tools.comms-ops', _type: 'reference'}, slug: {current: 'tools/comms-ops/email-sms'}, order: 3},

  // ============ PARTNERS ============
  {_id: 'kb.partners', _type: 'kbItem', title: 'Partners', kind: 'section', slug: {current: 'partners'}, order: 5},
  
  // Partners > Influencers
  {_id: 'kb.partners.influencers', _type: 'kbItem', title: 'Partners / Influencers', kind: 'section', parent: {_ref: 'kb.partners', _type: 'reference'}, slug: {current: 'partners/influencers'}, order: 1},
  {_id: 'kb.partners.influencers.pipeline-outreach', _type: 'kbItem', title: 'Partners / Influencers / Pipeline & Outreach', kind: 'section', parent: {_ref: 'kb.partners.influencers', _type: 'reference'}, slug: {current: 'partners/influencers/pipeline-outreach'}, order: 1},
  {_id: 'kb.partners.influencers.agreements-rates', _type: 'kbItem', title: 'Partners / Influencers / Agreements & Rates', kind: 'section', parent: {_ref: 'kb.partners.influencers', _type: 'reference'}, slug: {current: 'partners/influencers/agreements-rates'}, order: 2},
  {_id: 'kb.partners.influencers.assets-collabs', _type: 'kbItem', title: 'Partners / Influencers / Assets & Collabs', kind: 'section', parent: {_ref: 'kb.partners.influencers', _type: 'reference'}, slug: {current: 'partners/influencers/assets-collabs'}, order: 3},
  
  // Partners > Brands
  {_id: 'kb.partners.brands', _type: 'kbItem', title: 'Partners / Brands', kind: 'section', parent: {_ref: 'kb.partners', _type: 'reference'}, slug: {current: 'partners/brands'}, order: 2},
  {_id: 'kb.partners.brands.pipeline-outreach', _type: 'kbItem', title: 'Partners / Brands / Pipeline & Outreach', kind: 'section', parent: {_ref: 'kb.partners.brands', _type: 'reference'}, slug: {current: 'partners/brands/pipeline-outreach'}, order: 1},
  {_id: 'kb.partners.brands.agreements-rates', _type: 'kbItem', title: 'Partners / Brands / Agreements & Rates', kind: 'section', parent: {_ref: 'kb.partners.brands', _type: 'reference'}, slug: {current: 'partners/brands/agreements-rates'}, order: 2},
  {_id: 'kb.partners.brands.brand-kits-guidelines', _type: 'kbItem', title: 'Partners / Brands / Brand Kits & Guidelines', kind: 'section', parent: {_ref: 'kb.partners.brands', _type: 'reference'}, slug: {current: 'partners/brands/brand-kits-guidelines'}, order: 3},
  
  // Partners > Content Creators
  {_id: 'kb.partners.content-creators', _type: 'kbItem', title: 'Partners / Content Creators', kind: 'section', parent: {_ref: 'kb.partners', _type: 'reference'}, slug: {current: 'partners/content-creators'}, order: 3},
  {_id: 'kb.partners.content-creators.pipeline-outreach', _type: 'kbItem', title: 'Partners / Content Creators / Pipeline & Outreach', kind: 'section', parent: {_ref: 'kb.partners.content-creators', _type: 'reference'}, slug: {current: 'partners/content-creators/pipeline-outreach'}, order: 1},
  {_id: 'kb.partners.content-creators.collab-formats', _type: 'kbItem', title: 'Partners / Content Creators / Collab Formats', kind: 'section', parent: {_ref: 'kb.partners.content-creators', _type: 'reference'}, slug: {current: 'partners/content-creators/collab-formats'}, order: 2},
  {_id: 'kb.partners.content-creators.agreements-rev-share', _type: 'kbItem', title: 'Partners / Content Creators / Agreements & Rev Share', kind: 'section', parent: {_ref: 'kb.partners.content-creators', _type: 'reference'}, slug: {current: 'partners/content-creators/agreements-rev-share'}, order: 3},
]

async function deployToCloud() {
  console.log('🚀 Deploying EXACT KB structure to cloud...\n')
  
  // Create NDJSON for import
  const fs = require('fs')
  const ndjson = kbStructure.map(doc => JSON.stringify(doc)).join('\n')
  fs.writeFileSync('kb-exact-structure.ndjson', ndjson)
  
  console.log(`📊 Structure to deploy:
  - Company (with Vonas Media, Policies, SOPs, HR, Interns, Freelancers)
  - Production (Pre-Production, Shoots, Post-Production)
  - Shows (OTR, Skyline - each with full sub-structure)
  - Tools (Editing & Design, Automation & Data, Comms & Ops)
  - Partners (Influencers, Brands, Content Creators)
  
  Total: ${kbStructure.length} sections/folders
  `)
  
  console.log('📄 Created kb-exact-structure.ndjson')
  console.log('\n🔄 Importing to cloud using Sanity CLI...\n')
}

deployToCloud()
