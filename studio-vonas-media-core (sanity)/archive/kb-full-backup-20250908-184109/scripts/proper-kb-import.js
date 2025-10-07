/*
  Proper knowledge base import following the exact Sanity schema structure

  Run:
  npx sanity exec scripts/proper-kb-import.js --with-user-token
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

function createBlock(text, style = 'normal', markDefs = []) {
  return {
    _type: 'block',
    _key: generateKey(),
    style: style,
    children: [{
      _type: 'span',
      _key: generateKey(),
      text: text,
      marks: []
    }],
    markDefs: markDefs
  }
}

// Convert markdown content to Sanity blocks
function markdownToBlocks(content) {
  if (!content) return []
  
  const lines = content.split('\\n')
  const blocks = []
  let currentParagraph = ''
  
  for (let line of lines) {
    line = line.trim()
    
    if (!line) {
      if (currentParagraph) {
        blocks.push(createBlock(currentParagraph))
        currentParagraph = ''
      }
      continue
    }
    
    // Headers
    if (line.startsWith('####')) {
      if (currentParagraph) {
        blocks.push(createBlock(currentParagraph))
        currentParagraph = ''
      }
      blocks.push(createBlock(line.replace('####', '').trim(), 'h4'))
    } else if (line.startsWith('###')) {
      if (currentParagraph) {
        blocks.push(createBlock(currentParagraph))
        currentParagraph = ''
      }
      blocks.push(createBlock(line.replace('###', '').trim(), 'h3'))
    } else if (line.startsWith('##')) {
      if (currentParagraph) {
        blocks.push(createBlock(currentParagraph))
        currentParagraph = ''
      }
      blocks.push(createBlock(line.replace('##', '').trim(), 'h2'))
    } else if (line.startsWith('# ')) {
      continue // Skip main title
    } else if (line.startsWith('-') && !line.startsWith('- [ ]')) {
      if (currentParagraph) {
        blocks.push(createBlock(currentParagraph))
        currentParagraph = ''
      }
      blocks.push(createBlock(line.replace(/^-\\s*/, '• ')))
    } else {
      if (currentParagraph) {
        currentParagraph += ' ' + line
      } else {
        currentParagraph = line
      }
    }
  }
  
  if (currentParagraph) {
    blocks.push(createBlock(currentParagraph))
  }
  
  return blocks
}

// Parse markdown document
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
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim()
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
      break // Stop parsing at supporting info
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
        
      case 'content':
        if (line) {
          mainContent += line + '\\n'
        }
        break
    }
  }
  
  // Add final step
  if (stepTitle && currentSection === 'steps') {
    steps.push({
      _key: generateKey(),
      title: stepTitle,
      content: stepContent.trim()
    })
  }
  
  return {
    title,
    description: description.trim() || undefined,
    steps: steps.length > 0 ? steps : undefined,
    checklist: checklist.length > 0 ? checklist : undefined,
    content: markdownToBlocks(mainContent)
  }
}

// Import a single document
async function importDocument(filePath, categoryRef, options = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ File not found: ${filePath}`)
      return false
    }
    
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = parseMarkdownDocument(content)
    
    if (!parsed.title) {
      console.log(`⚠ No title found in: ${filePath}`)
      return false
    }
    
    const filename = path.basename(filePath, '.md')
    const slug = filename
    
    const document = {
      _type: 'kbItem',
      _id: `kbItem.new.${slug}`,
      title: parsed.title,
      slug: {
        _type: 'slug',
        current: slug
      },
      description: parsed.description,
      content: parsed.content.length > 0 ? parsed.content : undefined,
      steps: parsed.steps,
      checklist: parsed.checklist,
      kind: options.kind || 'page',
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
    console.log(`  - Description: ${parsed.description ? 'Yes' : 'No'}`)
    console.log(`  - Steps: ${parsed.steps?.length || 0}`)
    console.log(`  - Content blocks: ${parsed.content?.length || 0}`)
    console.log(`  - Checklist items: ${parsed.checklist?.length || 0}`)
    
    const result = await client.createOrReplace(document)
    console.log(`✓ Imported: ${result._id}\\n`)
    
    return result
  } catch (error) {
    console.error(`Error importing ${filePath}:`, error)
    return false
  }
}

// Main import function
async function main() {
  console.log('Starting proper knowledge base import...')
  
  const categories = {
    company: 'kbCategory.v5.company',
    shows: 'kbCategory.v5.shows',
    production: 'kbCategory.v5.production',
    tools: 'kbCategory.v5.tools'
  }
  
  let imported = 0
  let failed = 0
  
  try {
    // Test with one document first
    console.log('\\n=== TESTING WITH ONE DOCUMENT ===')
    const testPath = path.join(basePath, 'Company/Vonas Media/about-vonas-media-complete.md')
    const result = await importDocument(testPath, categories.company, {
      docType: 'reference',
      order: 1
    })
    
    if (result) {
      imported++
      console.log(`\\n🎉 SUCCESS! Test document imported correctly.`)
      console.log(`You can view it at: https://vonas-media.sanity.studio/intent/edit/id=${result._id}`)
    } else {
      failed++
      console.log(`\\n❌ Test import failed`)
    }
    
    console.log(`\\n📊 Results:`)
    console.log(`✅ Imported: ${imported}`)
    console.log(`❌ Failed: ${failed}`)
    
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

main().catch(console.error)