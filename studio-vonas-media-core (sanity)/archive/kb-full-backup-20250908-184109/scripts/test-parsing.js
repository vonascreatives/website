const fs = require('fs')
const path = require('path')

// Test the parsing function
function parseMarkdownDocument(content) {
  console.log('=== PARSING START ===')
  console.log('Content length:', content.length)
  console.log('First 200 chars:', content.substring(0, 200))
  
  const lines = content.split('\\n')
  console.log('Total lines:', lines.length)
  console.log('First few lines:', lines.slice(0, 10))
  
  let title = ''
  let description = ''
  let steps = []
  let checklist = []
  let mainContent = ''
  
  let currentSection = 'content'
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim()
      console.log('Found title:', title)
      continue
    }
    
    if (line === '## Description') {
      console.log('Found Description section')
      currentSection = 'description'
      continue
    }
    
    if (line === '## Steps') {
      console.log('Found Steps section')
      currentSection = 'steps'
      continue
    }
    
    if (line === '## Content') {
      console.log('Found Content section')
      currentSection = 'content'
      continue
    }
    
    if (line === '## Checklist') {
      console.log('Found Checklist section')
      currentSection = 'checklist'
      continue
    }
    
    if (line === '## Supporting Information') {
      console.log('Stopping at Supporting Information')
      break
    }
    
    switch (currentSection) {
      case 'description':
        if (line && !line.startsWith('#')) {
          description += line + ' '
        }
        break
        
      case 'steps':
        if (line.match(/^\\d+\\./)) {
          console.log('Found step:', line)
          steps.push(line)
        }
        break
        
      case 'checklist':
        if (line.startsWith('- [ ]')) {
          console.log('Found checklist item:', line)
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
  
  console.log('=== PARSING RESULTS ===')
  console.log('Title:', title)
  console.log('Description length:', description.length)
  console.log('Steps count:', steps.length)
  console.log('Checklist count:', checklist.length)
  console.log('Main content length:', mainContent.length)
  
  return {
    title,
    description: description.trim() || undefined,
    steps: steps.length > 0 ? steps : undefined,
    checklist: checklist.length > 0 ? checklist : undefined,
    mainContent
  }
}

// Test with the actual file
const filePath = '/Users/theova/Documents/code/Vonas Media Test Page/studio-vonas-media-core (sanity)/OLD KB(Messy)/NEW knowledge/Company/Vonas Media/about-vonas-media-complete.md'
const content = fs.readFileSync(filePath, 'utf-8')
const result = parseMarkdownDocument(content)

console.log('\\n=== FINAL RESULT ===')
console.log(JSON.stringify(result, null, 2))