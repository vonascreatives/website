#!/usr/bin/env node

/**
 * Create a complete hierarchical KB structure with folders and pages
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

// Hierarchical structure to create
const kbStructure = [
  // ============ COMPANY SECTION ============
  {
    _id: 'kb-company',
    _type: 'kbItem',
    title: 'Company',
    kind: 'section',
    slug: {current: 'company'},
    description: 'Everything about Vonas Media as a company',
    order: 1,
  },
  {
    _id: 'kb-company-about',
    _type: 'kbItem',
    title: 'Company / About Us',
    kind: 'section',
    parent: {_ref: 'kb-company', _type: 'reference'},
    slug: {current: 'company/about'},
    description: 'About Vonas Media',
    order: 1,
  },
  {
    _id: 'kb-company-about-history',
    _type: 'kbItem',
    title: 'Company / About Us / Our History',
    kind: 'page',
    parent: {_ref: 'kb-company-about', _type: 'reference'},
    slug: {current: 'company/about/history'},
    description: 'The story of Vonas Media from inception to today',
    docType: 'reference',
    content: 'Founded in 2019, Vonas Media has grown from a small production company to a leading digital media powerhouse...',
    order: 1,
  },
  {
    _id: 'kb-company-about-mission',
    _type: 'kbItem',
    title: 'Company / About Us / Mission & Vision',
    kind: 'page',
    parent: {_ref: 'kb-company-about', _type: 'reference'},
    slug: {current: 'company/about/mission'},
    description: 'Our mission, vision, and values',
    docType: 'reference',
    content: 'Mission: To create compelling content that informs, entertains, and inspires...',
    order: 2,
  },
  {
    _id: 'kb-company-policies',
    _type: 'kbItem',
    title: 'Company / Policies',
    kind: 'section',
    parent: {_ref: 'kb-company', _type: 'reference'},
    slug: {current: 'company/policies'},
    description: 'Company policies and guidelines',
    order: 2,
  },
  {
    _id: 'kb-company-policies-remote',
    _type: 'kbItem',
    title: 'Company / Policies / Remote Work Policy',
    kind: 'page',
    parent: {_ref: 'kb-company-policies', _type: 'reference'},
    slug: {current: 'company/policies/remote-work'},
    description: 'Guidelines for remote work arrangements',
    docType: 'policy',
    content: 'This policy outlines the guidelines for remote work at Vonas Media...',
    tags: [{_ref: 'kbTag-policy', _type: 'reference'}],
    order: 1,
  },
  {
    _id: 'kb-company-policies-vacation',
    _type: 'kbItem',
    title: 'Company / Policies / Time Off & Vacation',
    kind: 'page',
    parent: {_ref: 'kb-company-policies', _type: 'reference'},
    slug: {current: 'company/policies/vacation'},
    description: 'PTO and vacation policies',
    docType: 'policy',
    content: 'All full-time employees are entitled to...',
    tags: [{_ref: 'kbTag-policy', _type: 'reference'}],
    order: 2,
  },
  {
    _id: 'kb-company-hr',
    _type: 'kbItem',
    title: 'Company / HR & Benefits',
    kind: 'section',
    parent: {_ref: 'kb-company', _type: 'reference'},
    slug: {current: 'company/hr'},
    description: 'Human resources and employee benefits',
    order: 3,
  },
  {
    _id: 'kb-company-hr-benefits',
    _type: 'kbItem',
    title: 'Company / HR & Benefits / Benefits Overview',
    kind: 'page',
    parent: {_ref: 'kb-company-hr', _type: 'reference'},
    slug: {current: 'company/hr/benefits'},
    description: 'Complete overview of employee benefits',
    docType: 'guide',
    content: 'Vonas Media offers comprehensive benefits including health, dental, vision...',
    tags: [{_ref: 'kbTag-all-staff', _type: 'reference'}],
    order: 1,
  },
  {
    _id: 'kb-company-training',
    _type: 'kbItem',
    title: 'Company / Training & Development',
    kind: 'section',
    parent: {_ref: 'kb-company', _type: 'reference'},
    slug: {current: 'company/training'},
    description: 'Training programs and professional development',
    order: 4,
  },
  {
    _id: 'kb-company-training-onboarding',
    _type: 'kbItem',
    title: 'Company / Training & Development / New Employee Onboarding',
    kind: 'page',
    parent: {_ref: 'kb-company-training', _type: 'reference'},
    slug: {current: 'company/training/onboarding'},
    description: 'Complete onboarding checklist for new hires',
    docType: 'checklist',
    content: '## Week 1\n- [ ] Complete HR paperwork\n- [ ] Get building access\n- [ ] Set up workstation\n\n## Week 2\n- [ ] Department orientation\n- [ ] Meet team members',
    tags: [
      {_ref: 'kbTag-new-hires', _type: 'reference'},
      {_ref: 'kbTag-checklist', _type: 'reference'}
    ],
    order: 1,
  },

  // ============ PRODUCTION SECTION ============
  {
    _id: 'kb-production',
    _type: 'kbItem',
    title: 'Production',
    kind: 'section',
    slug: {current: 'production'},
    description: 'Production workflows, standards, and resources',
    order: 2,
  },
  {
    _id: 'kb-production-pre',
    _type: 'kbItem',
    title: 'Production / Pre-Production',
    kind: 'section',
    parent: {_ref: 'kb-production', _type: 'reference'},
    slug: {current: 'production/pre-production'},
    description: 'Planning and pre-production processes',
    order: 1,
  },
  {
    _id: 'kb-production-pre-planning',
    _type: 'kbItem',
    title: 'Production / Pre-Production / Show Planning Template',
    kind: 'page',
    parent: {_ref: 'kb-production-pre', _type: 'reference'},
    slug: {current: 'production/pre-production/planning-template'},
    description: 'Template for planning new show episodes',
    docType: 'template',
    content: '# Show Planning Template\n\n## Episode Details\n- Show Name:\n- Episode Number:\n- Recording Date:\n- Publish Date:\n\n## Content Outline\n- Opening segment:\n- Main topics:\n- Guest segments:\n- Closing:',
    tags: [
      {_ref: 'kbTag-template', _type: 'reference'},
      {_ref: 'kbTag-producers', _type: 'reference'}
    ],
    order: 1,
  },
  {
    _id: 'kb-production-workflow',
    _type: 'kbItem',
    title: 'Production / Workflow',
    kind: 'section',
    parent: {_ref: 'kb-production', _type: 'reference'},
    slug: {current: 'production/workflow'},
    description: 'Production workflows and processes',
    order: 2,
  },
  {
    _id: 'kb-production-workflow-editing',
    _type: 'kbItem',
    title: 'Production / Workflow / Video Editing Standards',
    kind: 'page',
    parent: {_ref: 'kb-production-workflow', _type: 'reference'},
    slug: {current: 'production/workflow/editing-standards'},
    description: 'Standards and best practices for video editing',
    docType: 'sop',
    content: '## Color Grading Standards\n- Use company LUT pack\n- Maintain consistent exposure\n\n## Audio Standards\n- Normalize to -3db\n- Apply noise reduction',
    tags: [
      {_ref: 'kbTag-sop', _type: 'reference'},
      {_ref: 'kbTag-editors', _type: 'reference'}
    ],
    order: 1,
  },
  {
    _id: 'kb-production-post',
    _type: 'kbItem',
    title: 'Production / Post-Production',
    kind: 'section',
    parent: {_ref: 'kb-production', _type: 'reference'},
    slug: {current: 'production/post-production'},
    description: 'Post-production workflows',
    order: 3,
  },
  {
    _id: 'kb-production-post-checklist',
    _type: 'kbItem',
    title: 'Production / Post-Production / Final Review Checklist',
    kind: 'page',
    parent: {_ref: 'kb-production-post', _type: 'reference'},
    slug: {current: 'production/post-production/review-checklist'},
    description: 'Checklist for final video review before publishing',
    docType: 'checklist',
    content: '## Technical Review\n- [ ] Video resolution correct (1080p/4K)\n- [ ] Audio levels normalized\n- [ ] Color grading applied\n- [ ] Graphics/titles correct\n\n## Content Review\n- [ ] No copyrighted material\n- [ ] Sponsors mentioned correctly\n- [ ] End cards added',
    tags: [
      {_ref: 'kbTag-checklist', _type: 'reference'},
      {_ref: 'kbTag-editors', _type: 'reference'}
    ],
    order: 1,
  },
  {
    _id: 'kb-production-equipment',
    _type: 'kbItem',
    title: 'Production / Equipment',
    kind: 'section',
    parent: {_ref: 'kb-production', _type: 'reference'},
    slug: {current: 'production/equipment'},
    description: 'Equipment guides and resources',
    order: 4,
  },
  {
    _id: 'kb-production-equipment-cameras',
    _type: 'kbItem',
    title: 'Production / Equipment / Camera Setup Guide',
    kind: 'page',
    parent: {_ref: 'kb-production-equipment', _type: 'reference'},
    slug: {current: 'production/equipment/camera-setup'},
    description: 'Standard camera setup for all shows',
    docType: 'guide',
    content: '## Camera Settings\n\n### Sony FX3\n- Resolution: 4K 24fps\n- Picture Profile: S-Log3\n- ISO: 640-1280\n\n### Canon C70\n- Resolution: 4K 24fps\n- Color: Canon Log 3',
    videoUrl: 'https://www.youtube.com/watch?v=example',
    tags: [{_ref: 'kbTag-guide', _type: 'reference'}],
    order: 1,
  },

  // ============ SHOWS SECTION ============
  {
    _id: 'kb-shows',
    _type: 'kbItem',
    title: 'Shows',
    kind: 'section',
    slug: {current: 'shows'},
    description: 'All show-specific documentation and resources',
    order: 3,
  },
  {
    _id: 'kb-shows-otr',
    _type: 'kbItem',
    title: 'Shows / Off The Record',
    kind: 'section',
    parent: {_ref: 'kb-shows', _type: 'reference'},
    slug: {current: 'shows/off-the-record'},
    description: 'Off The Record show resources',
    order: 1,
  },
  {
    _id: 'kb-shows-otr-overview',
    _type: 'kbItem',
    title: 'Shows / Off The Record / OTR 2.0 - Overview',
    kind: 'page',
    parent: {_ref: 'kb-shows-otr', _type: 'reference'},
    slug: {current: 'shows/off-the-record/overview'},
    description: 'Complete overview of Off The Record format and guidelines',
    docType: 'reference',
    content: '# Off The Record 2.0\n\n## Show Format\n- Duration: 45-60 minutes\n- Frequency: Weekly\n- Style: Interview/Discussion\n\n## Key Segments\n1. Cold Open (2 min)\n2. Introduction (3 min)\n3. Main Interview (35-40 min)\n4. Rapid Fire Questions (5 min)\n5. Closing (3 min)',
    tags: [{_ref: 'kbTag-shows', _type: 'reference'}],
    isFeatured: true,
    order: 1,
  },
  {
    _id: 'kb-shows-otr-guests',
    _type: 'kbItem',
    title: 'Shows / Off The Record / Guest Preparation',
    kind: 'page',
    parent: {_ref: 'kb-shows-otr', _type: 'reference'},
    slug: {current: 'shows/off-the-record/guest-prep'},
    description: 'How to prepare guests for OTR appearances',
    docType: 'guide',
    content: '## Pre-Interview\n- Send show overview\n- Technical requirements\n- Topic discussion\n\n## Day of Recording\n- Tech check 30 min before\n- Review key topics\n- Explain format',
    tags: [
      {_ref: 'kbTag-guide', _type: 'reference'},
      {_ref: 'kbTag-guests', _type: 'reference'}
    ],
    order: 2,
  },
  {
    _id: 'kb-shows-otr-checklist',
    _type: 'kbItem',
    title: 'Shows / Off The Record / Episode Checklist',
    kind: 'page',
    parent: {_ref: 'kb-shows-otr', _type: 'reference'},
    slug: {current: 'shows/off-the-record/episode-checklist'},
    description: 'Complete checklist for OTR episode production',
    docType: 'checklist',
    content: '## Pre-Production\n- [ ] Guest confirmed\n- [ ] Research completed\n- [ ] Questions prepared\n- [ ] Tech requirements sent\n\n## Production\n- [ ] Studio setup\n- [ ] Audio check\n- [ ] Lighting check\n- [ ] Recording backup started\n\n## Post-Production\n- [ ] Edit complete\n- [ ] Thumbnail created\n- [ ] Description written\n- [ ] Scheduled for release',
    tags: [{_ref: 'kbTag-checklist', _type: 'reference'}],
    order: 3,
  },
  {
    _id: 'kb-shows-skyline',
    _type: 'kbItem',
    title: 'Shows / Skyline',
    kind: 'section',
    parent: {_ref: 'kb-shows', _type: 'reference'},
    slug: {current: 'shows/skyline'},
    description: 'Skyline show documentation',
    order: 2,
  },
  {
    _id: 'kb-shows-skyline-overview',
    _type: 'kbItem',
    title: 'Shows / Skyline / Show Overview',
    kind: 'page',
    parent: {_ref: 'kb-shows-skyline', _type: 'reference'},
    slug: {current: 'shows/skyline/overview'},
    description: 'Overview of the Skyline show format',
    docType: 'reference',
    content: '# Skyline\n\n## Format\n- News and analysis show\n- 30-minute episodes\n- Bi-weekly release\n\n## Segments\n1. Headlines (5 min)\n2. Deep Dive (15 min)\n3. Panel Discussion (8 min)\n4. Closing Thoughts (2 min)',
    tags: [{_ref: 'kbTag-shows', _type: 'reference'}],
    order: 1,
  },
  {
    _id: 'kb-shows-all-shows',
    _type: 'kbItem',
    title: 'Shows / All Shows / General Guidelines',
    kind: 'page',
    parent: {_ref: 'kb-shows', _type: 'reference'},
    slug: {current: 'shows/general-guidelines'},
    description: 'Guidelines that apply to all Vonas Media shows',
    docType: 'guide',
    content: '## Brand Standards\n- Always use official intro/outro\n- Include sponsor mentions as agreed\n- Follow content guidelines\n\n## Technical Standards\n- Minimum 1080p video\n- -3db audio normalization\n- Color corrected footage',
    tags: [{_ref: 'kbTag-guide', _type: 'reference'}],
    order: 10,
  },

  // ============ TOOLS SECTION ============
  {
    _id: 'kb-tools',
    _type: 'kbItem',
    title: 'Tools',
    kind: 'section',
    slug: {current: 'tools'},
    description: 'Software and tool documentation',
    order: 4,
  },
  {
    _id: 'kb-tools-software',
    _type: 'kbItem',
    title: 'Tools / Software Guides',
    kind: 'section',
    parent: {_ref: 'kb-tools', _type: 'reference'},
    slug: {current: 'tools/software'},
    description: 'Guides for production software',
    order: 1,
  },
  {
    _id: 'kb-tools-software-premiere',
    _type: 'kbItem',
    title: 'Tools / Software Guides / Adobe Premiere Setup',
    kind: 'page',
    parent: {_ref: 'kb-tools-software', _type: 'reference'},
    slug: {current: 'tools/software/premiere-setup'},
    description: 'Standard Premiere Pro project setup',
    docType: 'tutorial',
    content: '## Project Setup\n1. Create new project\n2. Import media\n3. Apply project template\n4. Set up sequences\n\n## Export Settings\n- Format: H.264\n- Preset: YouTube 4K\n- Bitrate: 45 Mbps',
    tags: [
      {_ref: 'kbTag-how-to', _type: 'reference'},
      {_ref: 'kbTag-editors', _type: 'reference'}
    ],
    order: 1,
  },

  // ============ PARTNERS SECTION ============
  {
    _id: 'kb-partners',
    _type: 'kbItem',
    title: 'Partners',
    kind: 'section',
    slug: {current: 'partners'},
    description: 'Partner and sponsor information',
    order: 5,
  },
  {
    _id: 'kb-partners-sponsors',
    _type: 'kbItem',
    title: 'Partners / Sponsor Guidelines',
    kind: 'page',
    parent: {_ref: 'kb-partners', _type: 'reference'},
    slug: {current: 'partners/sponsor-guidelines'},
    description: 'Guidelines for sponsor integrations',
    docType: 'guide',
    content: '## Sponsor Mentions\n- Beginning of show: 15-30 seconds\n- Mid-roll: 60-90 seconds\n- End of show: 15 seconds\n\n## Best Practices\n- Keep it natural\n- Use personal experiences\n- Include promo codes',
    tags: [{_ref: 'kbTag-guide', _type: 'reference'}],
    order: 1,
  },
]

async function createHierarchy() {
  console.log('🏗️  Creating KB hierarchy structure...\n')
  
  const transaction = client.transaction()
  
  for (const doc of kbStructure) {
    transaction.createIfNotExists(doc)
    
    // Log the creation with proper indentation to show hierarchy
    const depth = (doc.title.match(/\//g) || []).length
    const indent = '  '.repeat(depth)
    const icon = doc.kind === 'section' ? '📁' : '📄'
    console.log(`${indent}${icon} ${doc.title}`)
  }
  
  try {
    console.log('\n⏳ Uploading to Sanity...')
    const result = await transaction.commit()
    console.log(`\n✅ Successfully created ${result.documentIds.length} KB items!`)
    console.log('\n📊 Structure Summary:')
    console.log('   - 5 main sections (Company, Production, Shows, Tools, Partners)')
    console.log('   - Multiple subsections per main section')
    console.log('   - Various document types (guides, checklists, templates, SOPs, etc.)')
    console.log('\n🎯 You can now see this hierarchy in your Sanity Studio at http://localhost:3333')
  } catch (error) {
    console.error('\n❌ Error creating hierarchy:', error.message)
    if (error.message.includes('permission')) {
      console.log('\n💡 Using Sanity CLI import instead...')
      
      // Create NDJSON file for import
      const fs = require('fs')
      const ndjson = kbStructure.map(doc => JSON.stringify(doc)).join('\n')
      fs.writeFileSync('kb-hierarchy.ndjson', ndjson)
      console.log('📄 Created kb-hierarchy.ndjson file')
      console.log('📤 Run: npx sanity dataset import kb-hierarchy.ndjson production --replace')
    }
  }
}

createHierarchy()
