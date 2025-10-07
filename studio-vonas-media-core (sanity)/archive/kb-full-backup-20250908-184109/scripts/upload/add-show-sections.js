import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_AUTH_TOKEN
})

const showSections = [
  // OTR About and Other sections
  {
    _id: 'kb.shows.otr.about',
    _type: 'kbItem',
    title: 'Shows / OTR / About',
    kind: 'section',
    parent: {
      _ref: 'kb.shows.otr',
      _type: 'reference'
    },
    slug: {
      current: 'shows/otr/about'
    },
    order: 6,
    description: 'General information about the OTR show including concept, format, target audience, and show overview.',
    tags: ['OTR', 'about', 'show information'],
    visibility: ['All'],
    hidden: false
  },
  {
    _id: 'kb.shows.otr.other',
    _type: 'kbItem',
    title: 'Shows / OTR / Other',
    kind: 'section',
    parent: {
      _ref: 'kb.shows.otr',
      _type: 'reference'
    },
    slug: {
      current: 'shows/otr/other'
    },
    order: 7,
    description: 'Miscellaneous OTR content that doesn\'t fit into the main production categories.',
    tags: ['OTR', 'other', 'miscellaneous'],
    visibility: ['All'],
    hidden: false
  },
  // Skyline About and Other sections
  {
    _id: 'kb.shows.skyline.about',
    _type: 'kbItem',
    title: 'Shows / Skyline / About',
    kind: 'section',
    parent: {
      _ref: 'kb.shows.skyline',
      _type: 'reference'
    },
    slug: {
      current: 'shows/skyline/about'
    },
    order: 6,
    description: 'General information about the Skyline show including concept, format, target audience, and show overview.',
    tags: ['Skyline', 'about', 'show information'],
    visibility: ['All'],
    hidden: false
  },
  {
    _id: 'kb.shows.skyline.other',
    _type: 'kbItem',
    title: 'Shows / Skyline / Other',
    kind: 'section',
    parent: {
      _ref: 'kb.shows.skyline',
      _type: 'reference'
    },
    slug: {
      current: 'shows/skyline/other'
    },
    order: 7,
    description: 'Miscellaneous Skyline content that doesn\'t fit into the main production categories.',
    tags: ['Skyline', 'other', 'miscellaneous'],
    visibility: ['All'],
    hidden: false
  }
]

async function createShowSections() {
  console.log('Creating About and Other sections for all shows...')
  
  try {
    for (const section of showSections) {
      console.log(`Creating section: ${section.title}`)
      
      const result = await client.createOrReplace(section)
      console.log(`✅ Created: ${result._id}`)
    }
    
    console.log('\\n🎉 Successfully created all show sections!')
    console.log('\\nCreated sections:')
    showSections.forEach(section => {
      console.log(`- ${section.title} (${section._id})`)
    })
    
  } catch (error) {
    console.error('Error creating show sections:', error)
  }
}

createShowSections()
