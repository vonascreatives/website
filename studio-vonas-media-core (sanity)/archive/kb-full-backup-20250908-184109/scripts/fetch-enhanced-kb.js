#!/usr/bin/env node

/**
 * Script to fetch and display enhanced KB content
 * Demonstrates the hierarchical structure and new features
 */

const {createClient} = require('@sanity/client')
require('dotenv').config({path: '.env.local'})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: true,
})

async function fetchContent() {
  console.log('📖 Fetching enhanced KB content...\n')
  
  try {
    // 1. Fetch the hierarchical structure
    console.log('1️⃣ HIERARCHICAL STRUCTURE')
    console.log('=' .repeat(50))
    
    const tree = await client.fetch(`
      *[_type == "kbItem" && kind == "section" && !hidden] | order(order asc) {
        _id,
        title,
        slug,
        kind,
        audience,
        "children": *[_type == "kbItem" && parent._ref == ^._id] | order(order asc) {
          _id,
          title,
          slug,
          kind,
          docType,
          "pages": *[_type == "kbItem" && parent._ref == ^._id] | order(order asc) {
            _id,
            title,
            slug,
            kind,
            docType
          }
        }
      }
    `)
    
    console.log('Knowledge Base Tree:')
    tree.forEach(section => {
      console.log(`\n📁 ${section.title} (${section.audience})`)
      if (section.children) {
        section.children.forEach(folder => {
          console.log(`   └─ 📂 ${folder.title} (${folder.kind})`)
          if (folder.pages) {
            folder.pages.forEach(page => {
              console.log(`      └─ 📄 ${page.title} (${page.docType || page.kind})`)
            })
          }
        })
      }
    })
    
    // 2. Fetch a specific page with modules
    console.log('\n\n2️⃣ PAGE WITH MODULES')
    console.log('=' .repeat(50))
    
    const policyPage = await client.fetch(`
      *[_type == "kbItem" && _id == "kb.company.policies.remote-work"][0] {
        title,
        description,
        kind,
        docType,
        audience,
        safetyLevel,
        status,
        ownerTeam,
        reviewCycleDays,
        lastReviewedAt,
        "modules": modules[] {
          _key,
          _type,
          ...
        },
        "path": select(
          defined(parent) => parent->title + " / " + title,
          title
        )
      }
    `)
    
    if (policyPage) {
      console.log(`\n📄 ${policyPage.title}`)
      console.log(`   Path: ${policyPage.path}`)
      console.log(`   Type: ${policyPage.docType}`)
      console.log(`   Audience: ${policyPage.audience}`)
      console.log(`   Safety: ${policyPage.safetyLevel}`)
      console.log(`   Status: ${policyPage.status}`)
      
      if (policyPage.ownerTeam) {
        console.log(`   Owner: ${policyPage.ownerTeam}`)
        console.log(`   Review Cycle: ${policyPage.reviewCycleDays} days`)
      }
      
      console.log(`\n   📦 Modules (${policyPage.modules?.length || 0}):`)
      policyPage.modules?.forEach(module => {
        switch (module._type) {
          case 'heroModule':
            console.log(`      • Hero: "${module.heading}"`)
            break
          case 'richTextModule':
            console.log(`      • Rich Text (${module.content?.length || 0} blocks)`)
            break
          case 'checklistModule':
            console.log(`      • Checklist: "${module.title}" (${module.items?.length || 0} items)`)
            break
          case 'stepsModule':
            console.log(`      • Steps: "${module.title}" (${module.steps?.length || 0} steps)`)
            break
          case 'relatedContentModule':
            console.log(`      • Related Content (${module.mode} mode)`)
            break
          default:
            console.log(`      • ${module._type}`)
        }
      })
    }
    
    // 3. Fetch content by audience
    console.log('\n\n3️⃣ CONTENT BY AUDIENCE')
    console.log('=' .repeat(50))
    
    const audiences = ['All', 'Team', 'Interns']
    for (const aud of audiences) {
      const count = await client.fetch(
        `count(*[_type == "kbItem" && audience == $audience && status == "published"])`,
        {audience: aud}
      )
      console.log(`   ${aud}: ${count} items`)
    }
    
    // 4. Fetch pages with different doc types
    console.log('\n\n4️⃣ DOCUMENT TYPES')
    console.log('=' .repeat(50))
    
    const docTypes = await client.fetch(`
      *[_type == "kbItem" && defined(docType)] {
        title,
        docType,
        kind
      }
    `)
    
    const typeGroups = {}
    docTypes.forEach(doc => {
      if (!typeGroups[doc.docType]) {
        typeGroups[doc.docType] = []
      }
      typeGroups[doc.docType].push(doc.title)
    })
    
    Object.keys(typeGroups).forEach(type => {
      console.log(`   ${type}: ${typeGroups[type].join(', ')}`)
    })
    
    // 5. Check for AI fields (will be empty until processed)
    console.log('\n\n5️⃣ AI READINESS')
    console.log('=' .repeat(50))
    
    const aiFields = await client.fetch(`
      *[_type == "kbItem" && kind == "page"][0...3] {
        title,
        "hasAI": defined(ai),
        "hasModules": count(modules) > 0,
        "moduleTypes": array::unique(modules[]._type)
      }
    `)
    
    aiFields.forEach(doc => {
      console.log(`   ${doc.title}:`)
      console.log(`      • Has Modules: ${doc.hasModules ? 'Yes' : 'No'}`)
      if (doc.moduleTypes?.length > 0) {
        console.log(`      • Module Types: ${doc.moduleTypes.join(', ')}`)
      }
      console.log(`      • AI Ready: ${doc.hasAI ? 'Processed' : 'Pending'}`)
    })
    
    console.log('\n\n✅ Content fetch complete!')
    console.log('\n📝 Next Steps:')
    console.log('   1. Visit http://localhost:3333 to explore the Studio')
    console.log('   2. Navigate to Knowledge Base → Sections')
    console.log('   3. Try the Page Hierarchy view')
    console.log('   4. Create new content using the page builder modules')
    console.log('   5. Run migration on existing content: npx ts-node scripts/migrate-kb-enhanced.ts --dry-run')
    
  } catch (error) {
    console.error('❌ Error fetching content:', error)
  }
}

fetchContent()
