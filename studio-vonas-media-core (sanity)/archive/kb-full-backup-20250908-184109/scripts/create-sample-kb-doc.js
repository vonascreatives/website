/*
  Create a properly formatted sample KB document

  Run:
  npx sanity exec scripts/create-sample-kb-doc.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')

const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

function generateKey() {
  return Math.random().toString(36).substr(2, 9)
}

async function createSampleDoc() {
  const sampleDoc = {
    _type: 'kbItem',
    _id: 'kbItem.v5.sample-test-document',
    title: 'Sample Test Document',
    slug: {
      _type: 'slug',
      current: 'sample-test-document'
    },
    description: 'This is a sample document to test the knowledge base structure and ensure proper rendering in the Sanity studio.',
    
    // Sample steps
    steps: [
      {
        _key: generateKey(),
        title: 'Review the document structure',
        content: 'Examine how this document is structured with title, description, steps, and content sections.'
      },
      {
        _key: generateKey(),
        title: 'Check the content blocks',
        content: 'Verify that the rich content blocks are rendering properly with headers and paragraphs.'
      },
      {
        _key: generateKey(),
        title: 'Validate the checklist',
        content: 'Ensure the checklist items display correctly in the studio interface.'
      }
    ],
    
    // Sample content blocks
    content: [
      {
        _type: 'block',
        _key: generateKey(),
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: 'About This Sample Document',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: 'This sample document demonstrates the proper structure for VONAS Media knowledge base items. It includes all the key fields that should be populated when importing real content.',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'h3',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: 'Key Features',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: '• Structured steps with titles and detailed content',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: '• Rich content blocks with headers and paragraphs',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: '• Checklist items for actionable tasks',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: '• Proper categorization and metadata',
            marks: []
          }
        ]
      }
    ],
    
    // Sample checklist
    checklist: [
      'Document structure verified',
      'Content blocks rendering correctly',
      'Steps displaying with proper formatting',
      'Category assignment working',
      'Search and filtering functional'
    ],
    
    kind: 'page',
    category: {
      _type: 'reference',
      _ref: 'kbCategory.v5.company'
    },
    docType: 'guide',
    visibility: ['All'],
    tags: ['sample', 'test', 'documentation'],
    order: 1,
    lastUpdated: new Date().toISOString()
  }
  
  try {
    const result = await client.createOrReplace(sampleDoc)
    console.log(`✓ Created sample document: ${result._id}`)
    console.log(`Title: ${result.title}`)
    console.log(`Steps: ${result.steps?.length || 0}`)
    console.log(`Content blocks: ${result.content?.length || 0}`)
    console.log(`Checklist items: ${result.checklist?.length || 0}`)
    
    return result
  } catch (error) {
    console.error('Error creating sample document:', error)
    throw error
  }
}

createSampleDoc().catch(console.error)