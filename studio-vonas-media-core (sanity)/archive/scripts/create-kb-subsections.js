const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
})

const knowledgeBaseSections = [
  {
    _type: 'knowledgeBase',
    title: 'Editing',
    slug: {
      _type: 'slug',
      current: 'postproduction-editing'
    },
    summary: 'Comprehensive guide to video editing techniques, tools, and workflows for post-production.',
    parentCategory: 'postproduction',
    subCategory: 'editing',
    nestingLevel: 2,
    topic: 'editing',
    body: [
      {
        _type: 'block',
        _key: 'editing-intro',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'editing-span1',
            text: 'Video editing is the backbone of post-production, where raw footage transforms into compelling stories. This section covers essential editing techniques, software workflows, and industry best practices.',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'editing-content',
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'editing-h2-span',
            text: 'Key Topics Covered',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'editing-topics',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'topic1',
            text: 'Timeline organization and project management',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'editing-topics-2',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'topic2',
            text: 'Cutting techniques and pacing',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'editing-topics-3',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'topic3',
            text: 'Color correction and grading workflows',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'editing-topics-4',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'topic4',
            text: 'Audio sync and mixing fundamentals',
            marks: []
          }
        ]
      }
    ],
    tags: ['editing', 'postproduction', 'workflow', 'timeline', 'cutting'],
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'knowledgeBase',
    title: 'Off the Record',
    slug: {
      _type: 'slug',
      current: 'youtube-off-the-record'
    },
    summary: 'Behind-the-scenes insights, informal discussions, and off-camera moments from YouTube content creation.',
    parentCategory: 'youtube',
    subCategory: 'off-the-record',
    nestingLevel: 2,
    topic: 'behind-scenes',
    body: [
      {
        _type: 'block',
        _key: 'otr-intro',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'otr-span1',
            text: 'Off the Record captures the authentic moments that happen before, after, and between takes. This section provides insights into the real experiences of content creation beyond what viewers see.',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'otr-content',
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'otr-h2-span',
            text: 'What You\'ll Find Here',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'otr-topics',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'otr-topic1',
            text: 'Creator candid conversations and reflections',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'otr-topics-2',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'otr-topic2',
            text: 'Behind-the-scenes production stories',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'otr-topics-3',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'otr-topic3',
            text: 'Lessons learned from content creation challenges',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'otr-topics-4',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'otr-topic4',
            text: 'Industry insights and informal discussions',
            marks: []
          }
        ]
      }
    ],
    tags: ['behind-scenes', 'youtube', 'creators', 'insights', 'candid'],
    publishedAt: new Date().toISOString(),
  }
]

async function createKnowledgeBaseSections() {
  try {
    console.log('Creating knowledge base sub-sections...')
    
    for (const section of knowledgeBaseSections) {
      const result = await client.create(section)
      console.log(`✅ Created: ${section.title} (${section.parentCategory} -> ${section.subCategory})`)
      console.log(`   Document ID: ${result._id}`)
    }
    
    console.log('\\n🎉 Successfully created all knowledge base sub-sections!')
    console.log('\\nStructure created:')
    console.log('📁 Postproduction')
    console.log('  └── 📄 Editing')
    console.log('📁 YouTube')
    console.log('  └── 📄 Off the Record')
    
  } catch (error) {
    console.error('❌ Error creating knowledge base sections:', error)
  }
}

// Check if we have the required environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required')
  console.log('💡 Create an API token in your Sanity project dashboard and set it as an environment variable')
  process.exit(1)
}

createKnowledgeBaseSections()
