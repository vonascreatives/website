#!/usr/bin/env node

/**
 * Script to create sample enhanced KB content
 * Demonstrates the new hierarchical structure and page builder modules
 */

const {createClient} = require('@sanity/client')
require('dotenv').config({path: '.env.local'})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: false,
})

// Sample content structure
const sampleContent = [
  // Root sections
  {
    _type: 'kbItem',
    _id: 'kb.company',
    title: 'Company',
    slug: {current: 'company'},
    description: 'Everything about Vonas Media - policies, culture, and operations',
    kind: 'section',
    audience: 'All',
    status: 'published',
    order: 10,
    hidden: false,
  },
  {
    _type: 'kbItem',
    _id: 'kb.production',
    title: 'Production',
    slug: {current: 'production'},
    description: 'Production workflows, guidelines, and resources',
    kind: 'section',
    audience: 'Team',
    status: 'published',
    order: 20,
    hidden: false,
  },
  {
    _type: 'kbItem',
    _id: 'kb.shows',
    title: 'Shows',
    slug: {current: 'shows'},
    description: 'Documentation for all our shows',
    kind: 'section',
    audience: 'All',
    status: 'published',
    order: 30,
    hidden: false,
  },

  // Company sub-folders
  {
    _type: 'kbItem',
    _id: 'kb.company.policies',
    title: 'Policies',
    slug: {current: 'policies'},
    description: 'Company policies and guidelines',
    kind: 'folder',
    parent: {_ref: 'kb.company'},
    audience: 'Team',
    status: 'published',
    order: 10,
    hidden: false,
  },
  {
    _type: 'kbItem',
    _id: 'kb.company.interns',
    title: 'Interns',
    slug: {current: 'interns'},
    description: 'Intern program resources and onboarding',
    kind: 'folder',
    parent: {_ref: 'kb.company'},
    audience: 'Interns',
    status: 'published',
    order: 20,
    hidden: false,
  },

  // Sample Policy Page with Enhanced Features
  {
    _type: 'kbItem',
    _id: 'kb.company.policies.remote-work',
    title: 'Remote Work Policy',
    slug: {current: 'remote-work-policy'},
    description: 'Guidelines and requirements for remote work at Vonas Media',
    kind: 'page',
    docType: 'policy',
    parent: {_ref: 'kb.company.policies'},
    audience: 'Team',
    safetyLevel: 'internal',
    status: 'published',
    order: 10,
    hidden: false,
    
    // Governance fields for policy
    ownerTeam: 'hr',
    reviewCycleDays: 180,
    lastReviewedAt: new Date().toISOString(),
    
    // Page builder modules
    modules: [
      {
        _key: 'hero-1',
        _type: 'heroModule',
        heading: 'Remote Work Policy',
        subheading: 'Effective January 2025 - Empowering flexible work arrangements while maintaining collaboration and productivity',
      },
      {
        _key: 'content-1',
        _type: 'richTextModule',
        content: [
          {
            _type: 'block',
            _key: 'block-1',
            children: [
              {_type: 'span', text: 'Overview', marks: ['strong']}
            ],
            style: 'h2',
          },
          {
            _type: 'block',
            _key: 'block-2',
            children: [
              {_type: 'span', text: 'Vonas Media embraces flexible work arrangements that benefit both our team members and the company. This policy outlines the guidelines for remote work, ensuring we maintain our high standards of collaboration, creativity, and productivity.'}
            ],
            style: 'normal',
          },
          {
            _type: 'block',
            _key: 'block-3',
            children: [
              {_type: 'span', text: 'Eligibility', marks: ['strong']}
            ],
            style: 'h3',
          },
          {
            _type: 'block',
            _key: 'block-4',
            children: [
              {_type: 'span', text: 'All full-time employees who have completed their probation period are eligible for remote work arrangements, subject to manager approval and role requirements.'}
            ],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'checklist-1',
        _type: 'checklistModule',
        title: 'Remote Work Setup Requirements',
        items: [
          {
            _key: 'check-1',
            label: 'Reliable internet connection (minimum 50 Mbps)',
            required: true,
          },
          {
            _key: 'check-2',
            label: 'Dedicated workspace free from distractions',
            required: true,
          },
          {
            _key: 'check-3',
            label: 'Company-approved security software installed',
            required: true,
          },
          {
            _key: 'check-4',
            label: 'Signed remote work agreement',
            required: true,
          },
          {
            _key: 'check-5',
            label: 'Ergonomic desk setup (recommended)',
            required: false,
          },
        ],
      },
      {
        _key: 'steps-1',
        _type: 'stepsModule',
        title: 'How to Request Remote Work',
        numbered: true,
        steps: [
          {
            _key: 'step-1',
            title: 'Discuss with your manager',
            content: [
              {
                _type: 'block',
                _key: 'step-content-1',
                children: [{_type: 'span', text: 'Schedule a meeting to discuss your remote work needs and proposed schedule.'}],
                style: 'normal',
              },
            ],
          },
          {
            _key: 'step-2',
            title: 'Submit formal request',
            content: [
              {
                _type: 'block',
                _key: 'step-content-2',
                children: [{_type: 'span', text: 'Complete the Remote Work Request Form in Airtable with your proposed arrangement.'}],
                style: 'normal',
              },
            ],
          },
          {
            _key: 'step-3',
            title: 'Complete setup checklist',
            content: [
              {
                _type: 'block',
                _key: 'step-content-3',
                children: [{_type: 'span', text: 'Ensure all technical and workspace requirements are met.'}],
                style: 'normal',
              },
            ],
          },
          {
            _key: 'step-4',
            title: 'Sign agreement',
            content: [
              {
                _type: 'block',
                _key: 'step-content-4',
                children: [{_type: 'span', text: 'Review and sign the remote work agreement outlining expectations and responsibilities.'}],
                style: 'normal',
              },
            ],
          },
        ],
      },
      {
        _key: 'related-1',
        _type: 'relatedContentModule',
        title: 'Related Policies',
        mode: 'auto',
        autoConfig: {
          matchTags: true,
          matchAudience: true,
          matchDocType: true,
          preferFreshness: true,
        },
        limit: 3,
        layout: 'cards',
      },
    ],
    
    // Tags (we'll add references to actual tag documents once they're created)
    tags: [],
    
    // SEO
    ogTitle: 'Remote Work Policy - Vonas Media',
    ogDescription: 'Learn about our flexible remote work arrangements and guidelines',
  },

  // Sample Training Guide with Different Modules
  {
    _type: 'kbItem',
    _id: 'kb.company.interns.onboarding-guide',
    title: 'Intern Onboarding Guide',
    slug: {current: 'onboarding-guide'},
    description: 'Complete guide for new interns joining Vonas Media',
    kind: 'page',
    docType: 'guide',
    parent: {_ref: 'kb.company.interns'},
    audience: 'Interns',
    safetyLevel: 'internal',
    status: 'published',
    order: 10,
    hidden: false,
    
    modules: [
      {
        _key: 'hero-2',
        _type: 'heroModule',
        heading: 'Welcome to Vonas Media!',
        subheading: 'Your journey in creative media production starts here',
      },
      {
        _key: 'quote-1',
        _type: 'quoteModule',
        text: 'At Vonas Media, we believe in nurturing the next generation of creative professionals. Your fresh perspective and enthusiasm are valuable to our team.',
        author: 'CEO, Vonas Media',
        role: 'Leadership Team',
      },
      {
        _key: 'content-2',
        _type: 'richTextModule',
        content: [
          {
            _type: 'block',
            _key: 'block-5',
            children: [
              {_type: 'span', text: 'Your First Week', marks: ['strong']}
            ],
            style: 'h2',
          },
          {
            _type: 'block',
            _key: 'block-6',
            children: [
              {_type: 'span', text: 'Your first week will be focused on orientation, meeting the team, and getting familiar with our tools and workflows.'}
            ],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'links-1',
        _type: 'linkGridModule',
        title: 'Essential Resources',
        columns: 3,
        items: [
          {
            _key: 'link-1',
            type: 'external',
            externalUrl: 'https://slack.com',
            label: 'Slack Workspace',
            description: 'Join our team communication',
            icon: '💬',
          },
          {
            _key: 'link-2',
            type: 'external',
            externalUrl: 'https://airtable.com',
            label: 'Airtable Base',
            description: 'Access project management',
            icon: '📊',
          },
          {
            _key: 'link-3',
            type: 'external',
            externalUrl: 'https://notion.so',
            label: 'Notion Workspace',
            description: 'Documentation and notes',
            icon: '📝',
          },
        ],
      },
      {
        _key: 'faq-1',
        _type: 'faqListModule',
        title: 'Frequently Asked Questions',
        mode: 'manual',
        manualItems: [
          {
            _key: 'faq-item-1',
            question: 'What are the working hours?',
            answer: [
              {
                _type: 'block',
                _key: 'answer-1',
                children: [{_type: 'span', text: 'Core hours are 10 AM - 4 PM EST, with flexibility for the remaining hours based on your schedule and project needs.'}],
                style: 'normal',
              },
            ],
          },
          {
            _key: 'faq-item-2',
            question: 'Who should I contact for technical issues?',
            answer: [
              {
                _type: 'block',
                _key: 'answer-2',
                children: [{_type: 'span', text: 'Reach out to the IT team via #tech-support on Slack for immediate assistance.'}],
                style: 'normal',
              },
            ],
          },
        ],
      },
    ],
    
    ogTitle: 'Intern Onboarding - Vonas Media',
    ogDescription: 'Everything you need to know as a new intern at Vonas Media',
  },

  // Production folder
  {
    _type: 'kbItem',
    _id: 'kb.production.workflows',
    title: 'Workflows',
    slug: {current: 'workflows'},
    description: 'Standard production workflows and processes',
    kind: 'folder',
    parent: {_ref: 'kb.production'},
    audience: 'Team',
    status: 'published',
    order: 10,
    hidden: false,
  },

  // Show example
  {
    _type: 'kbItem',
    _id: 'kb.shows.otr',
    title: 'OTR (Off The Record)',
    slug: {current: 'otr'},
    description: 'Documentation for the OTR show',
    kind: 'show',
    parent: {_ref: 'kb.shows'},
    audience: 'Team',
    status: 'published',
    order: 10,
    hidden: false,
  },
]

async function createSampleContent() {
  console.log('📚 Creating enhanced KB sample content...')
  
  try {
    // Create documents in batches to avoid rate limits
    const batchSize = 5
    for (let i = 0; i < sampleContent.length; i += batchSize) {
      const batch = sampleContent.slice(i, i + batchSize)
      const transaction = client.transaction()
      
      for (const doc of batch) {
        transaction.createIfNotExists(doc)
      }
      
      await transaction.commit()
      console.log(`✅ Created batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(sampleContent.length/batchSize)}`)
    }
    
    console.log(`\n✨ Successfully created ${sampleContent.length} sample documents!`)
    console.log('\n🔗 Access your content:')
    console.log('   Local Studio: http://localhost:3333')
    console.log('   Navigate to: Knowledge Base → Sections')
    console.log('\n📊 Sample hierarchy created:')
    console.log('   Company/')
    console.log('     ├── Policies/')
    console.log('     │   └── Remote Work Policy (with modules)')
    console.log('     └── Interns/')
    console.log('         └── Onboarding Guide (with modules)')
    console.log('   Production/')
    console.log('     └── Workflows/')
    console.log('   Shows/')
    console.log('     └── OTR/')
    
  } catch (error) {
    console.error('❌ Error creating sample content:', error)
    if (error.statusCode === 403) {
      console.log('\n⚠️  Permission issue detected. The token might be read-only.')
      console.log('   To create content, you can:')
      console.log('   1. Use the Studio UI at http://localhost:3333')
      console.log('   2. Create a write token at https://www.sanity.io/manage/project/5cywtc7a/api')
    }
  }
}

createSampleContent()
