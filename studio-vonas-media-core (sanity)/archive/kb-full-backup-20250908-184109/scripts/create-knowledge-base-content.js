import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
})

// FAQ content
const videoProductionFAQs = [
  {
    _type: 'faq',
    title: 'What equipment do I need to start video production?',
    body: [
      {
        _type: 'block',
        _key: 'faq1block1',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'faq1span1',
            text: 'For basic video production, you need a camera (smartphone cameras work great), a tripod for stability, good lighting (natural light works), and audio equipment (lavalier mic or external recorder). As you grow, you can invest in better cameras, professional lighting kits, and advanced audio gear.',
            marks: []
          }
        ],
        style: 'normal'
      }
    ]
  },
  {
    _type: 'faq',
    title: 'How long does it take to edit a 10-minute video?',
    body: [
      {
        _type: 'block',
        _key: 'faq2block1',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'faq2span1',
            text: 'Editing time varies greatly depending on complexity. A simple talking head video might take 2-4 hours per finished minute, while complex productions with graphics, multiple camera angles, and detailed color grading can take 6-10 hours per finished minute. A 10-minute video typically requires 20-100 hours of editing work.',
            marks: []
          }
        ],
        style: 'normal'
      }
    ]
  },
  {
    _type: 'faq',
    title: 'What are the best export settings for YouTube?',
    body: [
      {
        _type: 'block',
        _key: 'faq3block1',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'faq3span1',
            text: 'For YouTube, export in H.264 codec, MP4 format, 1920x1080 resolution (1080p), 24-30fps frame rate, and use a bitrate of 8-12 Mbps for 1080p content. For 4K content, use 35-45 Mbps. Always export in progressive scan, not interlaced.',
            marks: []
          }
        ],
        style: 'normal'
      }
    ]
  },
  {
    _type: 'faq',
    title: 'How do I improve my video audio quality?',
    body: [
      {
        _type: 'block',
        _key: 'faq4block1',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'faq4span1',
            text: 'Good audio starts with recording in a quiet environment with minimal echo. Use an external microphone (lavalier, shotgun, or USB mic) instead of camera built-in mics. Record at 48kHz sample rate, monitor levels while recording, and use noise reduction and EQ in post-production to clean up the audio.',
            marks: []
          }
        ],
        style: 'normal'
      }
    ]
  },
  {
    _type: 'faq',
    title: 'What is the rule of thirds in video composition?',
    body: [
      {
        _type: 'block',
        _key: 'faq5block1',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'faq5span1',
            text: 'The rule of thirds divides your frame into a 3x3 grid. Place important elements along these lines or at their intersections rather than centering everything. For interviews, position the subject\'s eyes on the upper third line. This creates more dynamic and visually appealing compositions.',
            marks: []
          }
        ],
        style: 'normal'
      }
    ]
  }
]

async function createFAQs() {
  console.log('Creating FAQ documents...')
  
  for (let i = 0; i < videoProductionFAQs.length; i++) {
    const faq = videoProductionFAQs[i]
    const faqDoc = {
      _type: 'faq',
      _id: `faq-${i + 1}`,
      title: faq.title,
      body: faq.body,
      category: 'video-production',
      publishedAt: new Date().toISOString(),
      isPublished: true
    }
    
    try {
      const result = await client.createOrReplace(faqDoc)
      console.log(`Created FAQ: ${faq.title}`)
    } catch (error) {
      console.error(`Error creating FAQ ${faq.title}:`, error)
    }
  }
}

async function updateKnowledgeBaseWithBlocks() {
  console.log('Updating knowledge base articles with Schema UI blocks...')
  
  // Get existing knowledge base articles
  const articles = await client.fetch(`
    *[_type == "knowledgeBase" && defined(slug.current)][0...3] {
      _id,
      title,
      slug,
      parentCategory
    }
  `)
  
  for (const article of articles) {
    console.log(`Updating article: ${article.title}`)
    
    const blocks = []
    
    // Add FAQ block
    blocks.push({
      _type: 'faqs',
      _key: `faqs-${Math.random().toString(36).substr(2, 9)}`,
      padding: 'section',
      colorVariant: 'default',
      faqs: [
        { _type: 'reference', _ref: 'faq-1' },
        { _type: 'reference', _ref: 'faq-2' },
        { _type: 'reference', _ref: 'faq-3' }
      ]
    })
    
    // Add split-row with split-cards-list for step-by-step
    blocks.push({
      _type: 'split-row',
      _key: `split-${Math.random().toString(36).substr(2, 9)}`,
      padding: 'section',
      colorVariant: 'default',
      noGap: false,
      splitColumns: [
        {
          _type: 'split-cards-list',
          _key: `split-cards-${Math.random().toString(36).substr(2, 9)}`,
          list: [
            {
              _key: `card1-${Math.random().toString(36).substr(2, 9)}`,
              tagLine: 'Step 1',
              title: 'Planning and Pre-Production',
              body: [
                {
                  _type: 'block',
                  _key: `block1-${Math.random().toString(36).substr(2, 9)}`,
                  markDefs: [],
                  children: [
                    {
                      _type: 'span',
                      _key: `span1-${Math.random().toString(36).substr(2, 9)}`,
                      text: 'Define your video concept, create a script or outline, plan your shots, and gather all necessary equipment. Good preparation is 80% of successful video production.',
                      marks: []
                    }
                  ],
                  style: 'normal'
                }
              ]
            },
            {
              _key: `card2-${Math.random().toString(36).substr(2, 9)}`,
              tagLine: 'Step 2',
              title: 'Setup and Recording',
              body: [
                {
                  _type: 'block',
                  _key: `block2-${Math.random().toString(36).substr(2, 9)}`,
                  markDefs: [],
                  children: [
                    {
                      _type: 'span',
                      _key: `span2-${Math.random().toString(36).substr(2, 9)}`,
                      text: 'Set up your camera, lighting, and audio equipment. Test everything before recording. Record multiple takes and capture different angles when possible.',
                      marks: []
                    }
                  ],
                  style: 'normal'
                }
              ]
            },
            {
              _key: `card3-${Math.random().toString(36).substr(2, 9)}`,
              tagLine: 'Step 3',
              title: 'Post-Production and Export',
              body: [
                {
                  _type: 'block',
                  _key: `block3-${Math.random().toString(36).substr(2, 9)}`,
                  markDefs: [],
                  children: [
                    {
                      _type: 'span',
                      _key: `span3-${Math.random().toString(36).substr(2, 9)}`,
                      text: 'Edit your footage, add transitions and effects, color correct, mix audio, and export in the appropriate format for your platform. Review and optimize before publishing.',
                      marks: []
                    }
                  ],
                  style: 'normal'
                }
              ]
            }
          ]
        }
      ]
    })
    
    // Add section header
    blocks.push({
      _type: 'section-header',
      _key: `header-${Math.random().toString(36).substr(2, 9)}`,
      padding: 'section',
      colorVariant: 'default',
      title: 'Additional Resources',
      subtitle: 'Tools and tips to enhance your video production workflow'
    })
    
    // Update the article with blocks
    try {
      const result = await client
        .patch(article._id)
        .set({ blocks: blocks })
        .commit()
      
      console.log(`Updated article: ${article.title} with ${blocks.length} blocks`)
    } catch (error) {
      console.error(`Error updating article ${article.title}:`, error)
    }
  }
}

async function main() {
  try {
    console.log('Starting knowledge base content creation...')
    
    // Create FAQs first
    await createFAQs()
    
    // Wait a moment for FAQs to be created
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update knowledge base articles with blocks
    await updateKnowledgeBaseWithBlocks()
    
    console.log('✅ Knowledge base content creation completed!')
    console.log('You can now view the updated articles with proper Schema UI blocks.')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()