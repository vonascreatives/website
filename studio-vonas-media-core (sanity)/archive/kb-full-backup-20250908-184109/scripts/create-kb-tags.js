#!/usr/bin/env node

/**
 * Script to create initial KB tags
 */

const {createClient} = require('@sanity/client')
require('dotenv').config()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: false,
})

const tags = [
  // Topic tags
  {_type: 'kbTag', _id: 'tag.hr', name: 'HR', slug: {current: 'hr'}, category: 'topic', color: 'blue', isActive: true},
  {_type: 'kbTag', _id: 'tag.finance', name: 'Finance', slug: {current: 'finance'}, category: 'topic', color: 'green', isActive: true},
  {_type: 'kbTag', _id: 'tag.production', name: 'Production', slug: {current: 'production'}, category: 'topic', color: 'purple', isActive: true},
  {_type: 'kbTag', _id: 'tag.post-production', name: 'Post-Production', slug: {current: 'post-production'}, category: 'topic', color: 'yellow', isActive: true},
  {_type: 'kbTag', _id: 'tag.social-media', name: 'Social Media', slug: {current: 'social-media'}, category: 'topic', color: 'blue', isActive: true},
  
  // Tool tags
  {_type: 'kbTag', _id: 'tag.premiere-pro', name: 'Premiere Pro', slug: {current: 'premiere-pro'}, category: 'tool', color: 'purple', isActive: true},
  {_type: 'kbTag', _id: 'tag.davinci-resolve', name: 'DaVinci Resolve', slug: {current: 'davinci-resolve'}, category: 'tool', color: 'red', isActive: true},
  {_type: 'kbTag', _id: 'tag.airtable', name: 'Airtable', slug: {current: 'airtable'}, category: 'tool', color: 'green', isActive: true},
  {_type: 'kbTag', _id: 'tag.slack', name: 'Slack', slug: {current: 'slack'}, category: 'tool', color: 'purple', isActive: true},
  {_type: 'kbTag', _id: 'tag.notion', name: 'Notion', slug: {current: 'notion'}, category: 'tool', color: 'gray', isActive: true},
  
  // Process tags
  {_type: 'kbTag', _id: 'tag.onboarding', name: 'Onboarding', slug: {current: 'onboarding'}, category: 'process', color: 'green', isActive: true},
  {_type: 'kbTag', _id: 'tag.workflow', name: 'Workflow', slug: {current: 'workflow'}, category: 'process', color: 'blue', isActive: true},
  {_type: 'kbTag', _id: 'tag.automation', name: 'Automation', slug: {current: 'automation'}, category: 'process', color: 'yellow', isActive: true},
  
  // Department tags
  {_type: 'kbTag', _id: 'tag.creative', name: 'Creative', slug: {current: 'creative'}, category: 'department', color: 'purple', isActive: true},
  {_type: 'kbTag', _id: 'tag.operations', name: 'Operations', slug: {current: 'operations'}, category: 'department', color: 'blue', isActive: true},
  {_type: 'kbTag', _id: 'tag.marketing', name: 'Marketing', slug: {current: 'marketing'}, category: 'department', color: 'green', isActive: true},
  
  // Project tags
  {_type: 'kbTag', _id: 'tag.otr', name: 'OTR', slug: {current: 'otr'}, category: 'project', color: 'red', isActive: true},
  {_type: 'kbTag', _id: 'tag.skyline', name: 'Skyline', slug: {current: 'skyline'}, category: 'project', color: 'blue', isActive: true},
  
  // Skill tags
  {_type: 'kbTag', _id: 'tag.editing', name: 'Editing', slug: {current: 'editing'}, category: 'skill', color: 'purple', isActive: true},
  {_type: 'kbTag', _id: 'tag.design', name: 'Design', slug: {current: 'design'}, category: 'skill', color: 'yellow', isActive: true},
]

async function createTags() {
  console.log('🏷️  Creating KB tags...')
  
  const transaction = client.transaction()
  
  for (const tag of tags) {
    transaction.createIfNotExists(tag)
  }
  
  try {
    await transaction.commit()
    console.log(`✅ Created/updated ${tags.length} tags`)
  } catch (error) {
    console.error('❌ Error creating tags:', error)
  }
}

createTags()
