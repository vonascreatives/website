/*
  Fix knowledge base import - properly parse content into correct fields

  Run:
  npx sanity exec scripts/fix-kb-import.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')

const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

// Helper functions
function generateKey() {
  return Math.random().toString(36).substr(2, 9)
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
    } else if (line.startsWith('-') && !line.startsWith('- [ ]')) {
      if (currentParagraph) {
        blocks.push(createParagraphBlock(currentParagraph))
        currentParagraph = ''
      }
      blocks.push(createParagraphBlock(line.replace(/^-\\s*/, '• ')))
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
function parseMarkdownDocument(fullContent) {
  const lines = fullContent.split('\\n')
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

async function fixDocument(docId) {
  try {
    // Get the document
    const doc = await client.getDocument(docId)
    
    if (!doc || !doc.title) {
      console.log(`⚠ Document ${docId} not found or has no content`)
      return false
    }
    
    console.log(`Processing: ${docId}`)
    
    // Parse the content from the title field
    const parsed = parseMarkdownDocument(doc.title)
    
    // Create the update
    const update = {
      title: parsed.title,
      description: parsed.description || undefined,
      content: parsed.content.length > 0 ? parsed.content : undefined,
      steps: parsed.steps.length > 0 ? parsed.steps : undefined,
      checklist: parsed.checklist.length > 0 ? parsed.checklist : undefined,
      lastUpdated: new Date().toISOString()
    }
    
    // Remove undefined fields
    Object.keys(update).forEach(key => {
      if (update[key] === undefined) {
        delete update[key]
      }
    })
    
    // Update the document
    await client.patch(docId).set(update).commit()
    
    console.log(`✓ Fixed: ${docId} - ${parsed.title}`)
    return true
    
  } catch (error) {
    console.error(`Error fixing ${docId}:`, error)
    return false
  }
}

async function main() {
  try {
    console.log('Starting knowledge base content fix...')
    
    // Get all kbItem documents that need fixing
    const docs = await client.fetch('*[_type == "kbItem" && _id match "kbItem.v5.*"] {_id}')
    
    console.log(`Found ${docs.length} documents to fix`)
    
    let fixed = 0
    let failed = 0
    
    for (const doc of docs) {
      const success = await fixDocument(doc._id)
      if (success) {
        fixed++
      } else {
        failed++
      }
      
      // Small delay between updates
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log(`\\n✅ Fix complete!`)
    console.log(`Fixed: ${fixed}`)
    console.log(`Failed: ${failed}`)
    
  } catch (error) {
    console.error('Fix failed:', error)
    process.exit(1)
  }
}

main().catch(console.error)