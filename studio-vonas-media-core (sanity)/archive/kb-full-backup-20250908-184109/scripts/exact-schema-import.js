/*
  EXACT SCHEMA FOLLOWING import - no deviations from kbItemFixed.ts

  Run:
  npx sanity exec scripts/exact-schema-import.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')
const fs = require('fs')
const path = require('path')

const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

function generateKey() {
  return Math.random().toString(36).substr(2, 9)
}

function createBlock(text, style = 'normal') {
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
    markDefs: []
  }
}

function markdownToBlocks(content) {
  if (!content) return []
  
  const lines = content.split('\n')
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
      blocks.push(createBlock(line.replace(/^-\s*/, '• ')))
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

function parseMarkdownDocument(content) {
  const lines = content.split('\n')
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
      break
    }
    
    switch (currentSection) {
      case 'description':
        if (line && !line.startsWith('#')) {
          description += line + ' '
        }
        break
        
      case 'steps':
        if (line.match(/^\d+\./)) {
          if (stepTitle) {
            steps.push({
              _key: generateKey(),
              title: stepTitle,
              content: stepContent.trim()
            })
          }
          stepTitle = line.replace(/^\d+\.\s*/, '')
          stepContent = ''
        } else if (line && !line.startsWith('#')) {
          stepContent += line + '\n'
        }
        break
        
      case 'checklist':
        if (line.startsWith('- [ ]')) {
          checklist.push(line.replace('- [ ]', '').trim())
        }
        break
        
      case 'content':
        if (line) {
          mainContent += line + '\n'
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
    description: description.trim() || null,
    steps: steps.length > 0 ? steps : null,
    checklist: checklist.length > 0 ? checklist : null,
    content: markdownToBlocks(mainContent)
  }
}

async function importDocument(filePath, categoryRef, customId = null) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = parseMarkdownDocument(content)
    
    const filename = path.basename(filePath, '.md')
    
    // EXACT SCHEMA MATCH - following kbItemFixed.ts exactly
    const document = {
      _type: 'kbItem',
      _id: customId || filename, // Use simple ID, not prefixed
      
      // CORE FIELDS (exactly as in schema)
      title: parsed.title,
      slug: {
        _type: 'slug',
        current: filename
      },
      description: parsed.description, // Can be null as per schema
      
      // STRUCTURE (exactly as in schema)
      kind: 'page', // Default from schema
      parent: null, // No parent for now
      order: 100, // Default from schema
      category: {
        _type: 'reference',
        _ref: categoryRef
      },
      
      // MAIN CONTENT (exactly as in schema)
      content: parsed.content.length > 0 ? parsed.content : null,
      
      // STRUCTURED CONTENT (exactly as in schema)
      steps: parsed.steps,
      checklist: parsed.checklist,
      
      // MEDIA & EMBEDS (null as per schema defaults)
      videoUrl: null,
      embedCode: null,
      attachments: null,
      
      // RELATIONSHIPS (null as per schema defaults)  
      relatedItems: null,
      faqs: null,
      
      // METADATA (as per schema)
      docType: 'guide', // Default option from schema
      tags: ['imported'], // Array as per schema
      visibility: ['All'], // Default from schema
      author: null, // Reference field, keeping null
      youtubeShow: null, // Hidden for non-show items
      
      // SYSTEM (as per schema)
      hidden: false, // Default from schema
      lastUpdated: new Date().toISOString()
    }
    
    console.log(`Importing: ${parsed.title}`)
    console.log(`  ID: ${document._id}`)
    console.log(`  Description: ${parsed.description ? 'YES ✓' : 'No'}`)
    console.log(`  Steps: ${parsed.steps?.length || 0}`)
    console.log(`  Content blocks: ${parsed.content?.length || 0}`)
    console.log(`  Checklist: ${parsed.checklist?.length || 0}`)
    
    const result = await client.createOrReplace(document)
    console.log(`✅ SUCCESS: ${result._id}\n`)
    
    return result
  } catch (error) {
    console.error(`Error importing ${filePath}:`, error)
    return false
  }
}

async function main() {
  console.log('🚀 Starting EXACT SCHEMA import...')
  
  // Test with existing categories (not the v5 ones I was using incorrectly)
  const testPath = '/Users/theova/Documents/code/Vonas Media Test Page/studio-vonas-media-core (sanity)/OLD KB(Messy)/NEW knowledge/Company/Vonas Media/about-vonas-media-complete.md'
  
  // Use an existing category that works
  const result = await importDocument(testPath, 'kbCategory.company-foundation', 'about-vonas-complete-test')
  
  if (result) {
    console.log(`🎉 PERFECT! Document follows exact schema!`)
    console.log(`View it at: https://vonas-media.sanity.studio/intent/edit/id=${result._id}`)
  } else {
    console.log(`❌ Import failed`)
  }
}

main().catch(console.error)