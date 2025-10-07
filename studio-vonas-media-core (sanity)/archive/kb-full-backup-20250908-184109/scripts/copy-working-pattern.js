/*
  Copy the exact pattern of working documents

  Run:
  npx sanity exec scripts/copy-working-pattern.js --with-user-token
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
    description: description.trim() || undefined,
    steps: steps.length > 0 ? steps : undefined,
    checklist: checklist.length > 0 ? checklist : undefined,
    content: markdownToBlocks(mainContent)
  }
}

async function createDocument() {
  try {
    const testPath = '/Users/theova/Documents/code/Vonas Media Test Page/studio-vonas-media-core (sanity)/OLD KB(Messy)/NEW knowledge/Company/Vonas Media/about-vonas-media-complete.md'
    const content = fs.readFileSync(testPath, 'utf-8')
    const parsed = parseMarkdownDocument(content)
    
    // COPY THE EXACT PATTERN OF WORKING DOCUMENTS
    const document = {
      _type: 'kbItem',
      _id: 'about-vonas-media-test', // Simple ID like working docs
      
      title: parsed.title,
      slug: {
        _type: 'slug',
        current: 'about-vonas-media-complete'
      },
      
      // Copy exact fields from working document
      category: {
        _type: 'reference',
        _ref: 'kbCategory.company-foundation'
      },
      content: parsed.content,
      order: 1, // Set as first item
      tags: ['company', 'about'], // Simple tags like working docs
      
      // Add the parsed additional content
      description: parsed.description,
      steps: parsed.steps,
      checklist: parsed.checklist,
      
      lastUpdated: new Date().toISOString()
    }
    
    console.log(`Creating: ${parsed.title}`)
    console.log(`  Description: ${parsed.description ? 'YES ✓' : 'No'}`)
    console.log(`  Steps: ${parsed.steps?.length || 0}`)
    console.log(`  Content blocks: ${parsed.content?.length || 0}`)
    console.log(`  Checklist: ${parsed.checklist?.length || 0}`)
    
    const result = await client.createOrReplace(document)
    console.log(`✅ SUCCESS: ${result._id}`)
    console.log(`View at: https://vonas-media.sanity.studio/intent/edit/id=${result._id}`)
    
    return result
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}

createDocument().catch(console.error)