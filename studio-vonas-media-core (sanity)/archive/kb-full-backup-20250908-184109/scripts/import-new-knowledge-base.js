/*
  Import knowledge base documents from markdown files

  Run:
  npx sanity exec scripts/import-new-knowledge-base.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')
const fs = require('fs')
const path = require('path')

const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

const basePath = path.join(__dirname, '..', 'OLD KB(Messy)', 'NEW knowledge')

// Helper functions
function generateKey() {
  return Math.random().toString(36).substr(2, 9)
}

function slugify(input = '') {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-/&]/g, '')
    .replace(/[&]/g, 'and')
    .replace(/[\s/]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function createParagraphBlock(text) {
  return {
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    children: [{
      _type: 'span',
      _key: generateKey(),
      text: text,
      marks: []
    }]
  }
}

function createHeaderBlock(text, style) {
  return {
    _type: 'block',
    _key: generateKey(),
    style: style,
    children: [{
      _type: 'span',
      _key: generateKey(),
      text: text,
      marks: []
    }]
  }
}

function createListBlock(items) {
  return {
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    listItem: 'bullet',
    children: [{
      _type: 'span',
      _key: generateKey(),
      text: items.join('\\n'),
      marks: []
    }]
  }
}

// Convert markdown content to Sanity blocks
function markdownToBlocks(content) {
  const lines = content.split('\\n')
  const blocks = []
  let currentParagraph = ''
  let inCodeBlock = false
  
  for (let line of lines) {
    line = line.trim()
    
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    
    if (inCodeBlock) {
      continue // Skip code blocks for now
    }
    
    if (!line) {
      if (currentParagraph) {
        blocks.push(createParagraphBlock(currentParagraph))
        currentParagraph = ''
      }
      continue
    }
    
    // Headers
    if (line.startsWith('####')) {
      if (currentParagraph) {
        blocks.push(createParagraphBlock(currentParagraph))
        currentParagraph = ''
      }
      blocks.push(createHeaderBlock(line.replace('####', '').trim(), 'h4'))
    } else if (line.startsWith('###')) {
      if (currentParagraph) {
        blocks.push(createParagraphBlock(currentParagraph))
        currentParagraph = ''
      }
      blocks.push(createHeaderBlock(line.replace('###', '').trim(), 'h3'))
    } else if (line.startsWith('##')) {
      if (currentParagraph) {
        blocks.push(createParagraphBlock(currentParagraph))
        currentParagraph = ''
      }
      blocks.push(createHeaderBlock(line.replace('##', '').trim(), 'h2'))
    } else if (line.startsWith('# ')) {
      continue // Skip main title
    } else if (line.startsWith('-') || line.startsWith('*')) {
      if (currentParagraph) {
        blocks.push(createParagraphBlock(currentParagraph))
        currentParagraph = ''
      }
      blocks.push(createParagraphBlock(line.replace(/^[-*]\\s*/, '• ')))
    } else {
      if (currentParagraph) {
        currentParagraph += ' ' + line
      } else {
        currentParagraph = line
      }
    }
  }
  
  if (currentParagraph) {
    blocks.push(createParagraphBlock(currentParagraph))
  }
  
  return blocks
}

// Parse markdown document structure
function parseMarkdownDocument(content) {
  const lines = content.split('\\n')
  let title = ''
  let description = ''
  let steps = []
  let checklist = []
  let mainContent = ''
  
  let currentSection = 'content'
  let stepTitle = ''
  let stepContent = ''
  let supportingInfo = {}
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.startsWith('# ')) {
      title = line.replace('# ', '')
      continue
    }
    
    if (line === '## Description') {
      currentSection = 'description'
      continue
    }
    
    if (line === '## Steps') {
      currentSection = 'steps'
      continue
    }
    
    if (line === '## Content') {
      currentSection = 'content'
      continue
    }
    
    if (line === '## Checklist') {
      currentSection = 'checklist'
      continue
    }
    
    if (line === '## Supporting Information') {
      currentSection = 'supporting'
      continue
    }
    
    switch (currentSection) {
      case 'description':
        if (line && !line.startsWith('#')) {
          description += line + ' '
        }
        break
        
      case 'steps':
        if (line.match(/^\\d+\\./)) {
          if (stepTitle) {
            steps.push({
              _key: generateKey(),
              title: stepTitle,
              content: stepContent.trim()
            })
          }
          stepTitle = line.replace(/^\\d+\\.\\s*/, '')
          stepContent = ''
        } else if (line && !line.startsWith('#')) {
          stepContent += line + '\\n'
        }
        break
        
      case 'checklist':
        if (line.startsWith('- [ ]')) {
          checklist.push(line.replace('- [ ]', '').trim())
        }
        break
        
      case 'supporting':
        if (line.startsWith('- **Slug**:')) {
          supportingInfo.slug = line.replace('- **Slug**:', '').trim()
        } else if (line.startsWith('- **Writer**:')) {
          supportingInfo.writer = line.replace('- **Writer**:', '').trim()
        } else if (line.startsWith('- **Category**:')) {
          supportingInfo.category = line.replace('- **Category**:', '').trim()
        }
        break
        
      case 'content':
        if (line && !line.startsWith('#')) {
          mainContent += line + '\\n'
        }
        break
    }
  }
  
  // Add final step if exists
  if (stepTitle && currentSection === 'steps') {
    steps.push({
      _key: generateKey(),
      title: stepTitle,
      content: stepContent.trim()
    })
  }
  
  return {
    title: title.trim(),
    description: description.trim(),
    steps: steps,
    checklist: checklist,
    content: markdownToBlocks(mainContent),
    supportingInfo
  }
}

// Import a single document
async function importDocument(filePath, categoryRef, options = {}) {
  try {
    console.log(`Reading file: ${filePath}`)
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = parseMarkdownDocument(content)
    
    const filename = path.basename(filePath, '.md')
    const slug = parsed.supportingInfo.slug || slugify(filename)
    
    const document = {
      _type: 'kbItem',
      _id: `kbItem.v5.${slug}`,
      title: parsed.title,
      slug: {
        _type: 'slug',
        current: slug
      },
      description: parsed.description || undefined,
      content: parsed.content.length > 0 ? parsed.content : undefined,
      steps: parsed.steps.length > 0 ? parsed.steps : undefined,
      checklist: parsed.checklist.length > 0 ? parsed.checklist : undefined,
      kind: 'page',
      category: {
        _type: 'reference',
        _ref: categoryRef
      },
      docType: options.docType || 'guide',
      visibility: ['All'],
      tags: options.tags || [],
      order: options.order || 100,
      lastUpdated: new Date().toISOString()
    }
    
    // Remove undefined fields
    Object.keys(document).forEach(key => {
      if (document[key] === undefined) {
        delete document[key]
      }
    })
    
    console.log(`Importing: ${parsed.title}`)
    const result = await client.createOrReplace(document)
    console.log(`✓ Imported: ${result._id}`)
    
    return result
  } catch (error) {
    console.error(`Error importing ${filePath}:`, error)
    return null
  }
}

// Main import function
async function main() {
  console.log('Starting knowledge base import from markdown files...')
  
  const categories = {
    company: 'kbCategory.v5.company',
    shows: 'kbCategory.v5.shows',
    production: 'kbCategory.v5.production',
    tools: 'kbCategory.v5.tools',
    partners: 'kbCategory.v5.partners'
  }
  
  let imported = 0
  let failed = 0
  
  try {
    // Import Company documents
    console.log('\\n=== IMPORTING COMPANY DOCUMENTS ===')
    const companyDocs = [
      'Company/Vonas Media/about-vonas-media-complete.md',
      'Company/Vonas Media/login-credentials-master.md',
      'Company/Vonas Media/company-faqs.md',
      'Company/Vonas Media/vision-mission-purpose.md',
      'Company/Vonas Media/Policies/time-off-policy.md',
      'Company/Vonas Media/SOPs/content-approval-sop.md'
    ]
    
    for (let i = 0; i < companyDocs.length; i++) {
      const doc = companyDocs[i]
      const fullPath = path.join(basePath, doc)
      
      if (fs.existsSync(fullPath)) {
        const result = await importDocument(fullPath, categories.company, {
          docType: 'reference',
          order: i + 1
        })
        if (result) imported++
        else failed++
        
        // Small delay between imports
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        console.log(`⚠ File not found: ${fullPath}`)
        failed++
      }
    }
    
    console.log(`\\n✅ Company documents: ${imported} imported, ${failed} failed`)
    
    // Import Shows documents
    console.log('\\n=== IMPORTING SHOWS DOCUMENTS ===')
    const showsDocs = [
      'Shows/off-the-record-complete-guide.md',
      'Shows/skyline-music-complete-guide.md',
      'Shows/tatak-complete-guide.md',
      'Shows/at-the-backdoor-complete-guide.md',
      'Shows/skyline-slam-complete-guide.md',
      'Shows/shows-faqs.md'
    ]
    
    let showsImported = 0
    for (let i = 0; i < showsDocs.length; i++) {
      const doc = showsDocs[i]
      const fullPath = path.join(basePath, doc)
      
      if (fs.existsSync(fullPath)) {
        const result = await importDocument(fullPath, categories.shows, {
          docType: 'guide',
          order: i + 1
        })
        if (result) showsImported++
        else failed++
        
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        console.log(`⚠ File not found: ${fullPath}`)
        failed++
      }
    }
    
    console.log(`\\n✅ Shows documents: ${showsImported} imported`)
    
    // Import Production documents
    console.log('\\n=== IMPORTING PRODUCTION DOCUMENTS ===')
    const productionDocs = [
      'Production/automation-migration-guide.md',
      'Production/Post-Production/davinci-resolve-workflow.md',
      'Production/Post-Production/faceless-video-production-guide.md'
    ]
    
    let productionImported = 0
    for (let i = 0; i < productionDocs.length; i++) {
      const doc = productionDocs[i]
      const fullPath = path.join(basePath, doc)
      
      if (fs.existsSync(fullPath)) {
        const result = await importDocument(fullPath, categories.production, {
          docType: 'guide',
          order: i + 1
        })
        if (result) productionImported++
        else failed++
        
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        console.log(`⚠ File not found: ${fullPath}`)
        failed++
      }
    }
    
    console.log(`\\n✅ Production documents: ${productionImported} imported`)
    
    // Import Tools documents
    console.log('\\n=== IMPORTING TOOLS DOCUMENTS ===')
    const toolsDocs = [
      'Tools/Editing & Design/klap-opus-video-editing-guide.md',
      'Tools/Project Management/smartsuite-comprehensive-guide.md',
      'Tools/Automation/bardeen-workflow-automation.md',
      'Tools/Creative Tools/adobe-creative-suite-guide.md',
      'Tools/Communication/slack-team-communication.md',
      'Tools/tools-systems-faqs.md'
    ]
    
    let toolsImported = 0
    for (let i = 0; i < toolsDocs.length; i++) {
      const doc = toolsDocs[i]
      const fullPath = path.join(basePath, doc)
      
      if (fs.existsSync(fullPath)) {
        const result = await importDocument(fullPath, categories.tools, {
          docType: 'guide',
          order: i + 1
        })
        if (result) toolsImported++
        else failed++
        
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        console.log(`⚠ File not found: ${fullPath}`)
        failed++
      }
    }
    
    console.log(`\\n✅ Tools documents: ${toolsImported} imported`)
    
    console.log(`\\n🎉 IMPORT COMPLETE!`)
    console.log(`Total imported: ${imported + showsImported + productionImported + toolsImported}`)
    console.log(`Total failed: ${failed}`)
    
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

main().catch(console.error)