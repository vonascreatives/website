// Migration script to convert static data to Sanity
// This script shows how to migrate the existing static data to the new Sanity structure

import { createClient } from '@sanity/client'
// Import static data for migration
const shows = [
  {
    id: 'off-the-record',
    name: 'Off the Record',
    sections: [
      {
        id: 'pre-production',
        title: 'Pre-Production',
        items: [
          {
            id: 'concept-development',
            title: 'Concept Development',
            description: 'Initial ideation and concept planning for episodes',
            type: 'Article',
            tags: ['planning', 'creative'],
            readTime: '6 min read'
          }
        ]
      },
      {
        id: 'shooting',
        title: 'Shooting',
        items: [
          {
            id: 'equipment-setup',
            title: 'Equipment Setup',
            description: 'Complete guide for setting up professional video recording equipment',
            type: 'Workflow',
            tags: ['equipment', 'workflow', 'video-production'],
            readTime: '10 min read'
          }
        ]
      },
      {
        id: 'post-production',
        title: 'Post-Production',
        items: [
          {
            id: 'video-editing',
            title: 'Video Editing',
            description: 'Complete video editing workflow and best practices',
            type: 'Workflow',
            tags: ['editing', 'post-production'],
            readTime: '15 min read'
          }
        ]
      }
    ]
  },
  {
    id: 'passions',
    name: 'Passions',
    sections: [
      {
        id: 'content-planning',
        title: 'Content Planning',
        items: [
          {
            id: 'passion-discovery',
            title: 'Passion Discovery Process',
            description: 'Methods for identifying compelling passion stories',
            type: 'Workflow',
            tags: ['discovery', 'content'],
            readTime: '8 min read'
          }
        ]
      }
    ]
  }
]

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-09-03'
})

// Category mapping for flat structure
const categoryMap = {
  'Off the Record': 'shows',
  'Passions': 'shows',
  'Tech Talks': 'shows',
  'Weekly Wrap': 'shows',
  'Company': 'company',
  'Team': 'team',
  'Production': 'production',
  'Tools': 'tools',
  'Partners': 'partners',
  'Policies': 'policies'
}

async function migrateData() {
  console.log('Starting migration to Sanity with universal page structure...')
  
  const kbItems = []
  let order = 0

  for (const show of shows) {
    const category = categoryMap[show.name] || 'shows'
    const pageSlug = show.id // e.g., 'off-the-record'
    
    // Create the main page (e.g., "Off the Record")
    const pageItem = {
      _type: 'kbItem',
      title: show.name,
      slug: {
        _type: 'slug',
        current: pageSlug
      },
      category,
      itemType: 'page',
      description: `${show.name} show documentation and workflows`,
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: `Complete documentation for the ${show.name} show including all production workflows, guidelines, and resources.`
            }
          ]
        }
      ],
      type: 'Reference',
      tags: [show.name.toLowerCase().replace(/\s+/g, '-')],
      readTime: '2 min read',
      order: order++,
      status: 'published',
      hidden: false,
      lastUpdated: new Date().toISOString()
    }
    kbItems.push(pageItem)
    
    // Create sections for this page
    for (const section of show.sections) {
      const sectionSlug = section.id
      
      const sectionItem = {
        _type: 'kbItem',
        title: section.title,
        slug: {
          _type: 'slug',
          current: `${pageSlug}-${sectionSlug}`
        },
        category,
        itemType: 'section',
        parentPage: pageSlug,
        description: `${section.title} documentation and workflows`,
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: `${section.title} guidelines and procedures for ${show.name}.`
              }
            ]
          }
        ],
        type: 'Reference',
        tags: [sectionSlug, show.name.toLowerCase().replace(/\s+/g, '-')],
        readTime: '3 min read',
        order: order++,
        status: 'published',
        hidden: false,
        lastUpdated: new Date().toISOString()
      }
      kbItems.push(sectionItem)
      
      // Create items within this section
      for (const item of section.items) {
        const itemSlug = item.id
        
        // Create content with workflow steps for certain items
        const content = []
        
        // Add workflow steps for specific workflow items
        if (item.type === 'Workflow' && item.title === 'Equipment Setup') {
          // Add workflow steps like shown in screenshot
          content.push(
            {
              _type: 'workflowStep',
              stepNumber: 1,
              headline: 'Camera Positioning',
              description: 'Set up the main camera at eye level, 6 feet from the interview subject. Ensure the background is clean and professional.',
              duration: '~5 minutes',
              status: 'completed'
            },
            {
              _type: 'workflowStep', 
              stepNumber: 2,
              headline: 'Audio Equipment Setup',
              description: 'Connect wireless microphones and test audio levels. Set up backup audio recording on separate device.',
              duration: '~8 minutes',
              status: 'completed'
            },
            {
              _type: 'workflowStep',
              stepNumber: 3,
              headline: 'Lighting Configuration', 
              description: 'Position key light, fill light, and background light. Test for proper exposure and color temperature consistency.',
              duration: '~10 minutes',
              status: 'in-progress'
            },
            {
              _type: 'workflowStep',
              stepNumber: 4,
              headline: 'Camera Settings Configuration',
              description: 'Configure manual focus, frame rate, and recording quality settings.',
              duration: '~3 minutes',
              status: 'pending'
            },
            {
              _type: 'workflowStep',
              stepNumber: 5,
              headline: 'Final Testing & Rehearsal',
              description: 'Conduct final equipment test and brief rehearsal with all participants.',
              duration: '~7 minutes',
              status: 'pending'
            },
            {
              _type: 'workflowStep',
              stepNumber: 6,
              headline: 'Backup Systems Verification',
              description: 'Verify all backup recording systems are functioning and properly configured.',
              duration: '~4 minutes',
              status: 'pending'
            }
          )
        } else {
          // Regular content for non-workflow items
          content.push({
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: item.description
              }
            ]
          })
        }
        
        const kbItem = {
          _type: 'kbItem',
          title: item.title,
          slug: {
            _type: 'slug',
            current: itemSlug
          },
          category,
          itemType: 'item',
          parentPage: pageSlug,
          section: sectionSlug,
          description: item.description,
          content,
          type: item.type,
          tags: item.tags,
          readTime: item.readTime,
          order: order++,
          status: 'published',
          hidden: false,
          lastUpdated: new Date().toISOString()
        }

        if (item.imageUrl) {
          console.log(`Image found for ${item.title}: ${item.imageUrl}`)
        }

        kbItems.push(kbItem)
      }
    }
  }

  console.log(`Migrating ${kbItems.length} items (${kbItems.filter(i => i.itemType === 'page').length} pages, ${kbItems.filter(i => i.itemType === 'section').length} sections, ${kbItems.filter(i => i.itemType === 'item').length} items)...`)
  if (!client.config().token) {
    throw new Error('Missing SANITY_API_TOKEN environment variable. Aborting migration.')
  }

  // Create documents in Sanity
  for (const item of kbItems) {
    try {
      const result = await client.create(item)
      console.log(`Created ${item.itemType}: ${result.title}`)
    } catch (error) {
      console.error(`Error creating ${item.title}:`, error)
    }
  }

  console.log('Migration completed with universal page structure!')
}

// Run migration
migrateData().catch(console.error)

export { migrateData }
