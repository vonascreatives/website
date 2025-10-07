#!/usr/bin/env node

/**
 * Migration script for Knowledge Base enhancement
 * Converts existing kbItem documents to enhanced structure
 * 
 * Usage: npx ts-node scripts/migrate-kb-enhanced.ts [--dry-run]
 */

import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config()

const isDryRun = process.argv.includes('--dry-run')

// Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN, // Need write token for mutations
  apiVersion: '2023-01-01',
  useCdn: false, // Don't use CDN for mutations
})

// Migration report
interface MigrationReport {
  totalDocuments: number
  migratedDocuments: number
  skippedDocuments: number
  errors: Array<{id: string; error: string}>
  warnings: Array<{id: string; warning: string}>
  orphanedItems: string[]
  duplicateSlugs: Array<{parent: string; slug: string; items: string[]}>
  tagNormalization: Map<string, string>
}

const report: MigrationReport = {
  totalDocuments: 0,
  migratedDocuments: 0,
  skippedDocuments: 0,
  errors: [],
  warnings: [],
  orphanedItems: [],
  duplicateSlugs: [],
  tagNormalization: new Map(),
}

// Tag normalization mapping
const TAG_NORMALIZATION: Record<string, string> = {
  // Old tag -> New normalized tag
  'Tags': 'general',
  'video-production': 'production',
  'video production': 'production',
  'editing': 'post-production',
  'post production': 'post-production',
  'pre production': 'pre-production',
  'social-media': 'social-media',
  'social media': 'social-media',
  'intern': 'interns',
  'freelancer': 'freelancers',
  'hr': 'human-resources',
  'HR': 'human-resources',
  'ops': 'operations',
  'dev': 'development',
  'ai': 'artificial-intelligence',
  'AI': 'artificial-intelligence',
}

// Document type inference from existing data
function inferDocType(item: any): string | undefined {
  const title = item.title?.toLowerCase() || ''
  const section = item.section?.toLowerCase() || ''
  const hasSteps = item.steps?.length > 0
  const hasChecklist = item.checklist?.length > 0
  const hasFaqs = item.faqs?.length > 0
  
  // Inference rules
  if (title.includes('policy') || section.includes('policies')) return 'policy'
  if (title.includes('sop') || title.includes('standard operating')) return 'sop'
  if (title.includes('template')) return 'template'
  if (title.includes('checklist') || hasChecklist) return 'checklist'
  if (title.includes('guide') || title.includes('how to')) return 'guide'
  if (title.includes('playbook')) return 'playbook'
  if (title.includes('brief')) return 'brief'
  if (title.includes('contract') || title.includes('agreement')) return 'contract'
  if (title.includes('rate') || title.includes('pricing')) return 'ratecard'
  if (hasFaqs || title.includes('faq')) return 'faq'
  if (hasSteps) return 'guide'
  
  // Default based on section
  if (section === 'about') return 'guide'
  
  return 'guide' // Default
}

// Kind inference from existing data
function inferKind(item: any, allItems: any[]): 'section' | 'folder' | 'page' | 'show' | 'link' {
  // Check if item has external URL
  if (item.supportLink?.startsWith('http') && !item.content && !item.steps) {
    return 'link'
  }
  
  // Check if it's a show
  if (item.youtubeShow?._ref || item.title?.match(/^(OTR|Skyline|Tatak|At the Backdoor)/i)) {
    return 'show'
  }
  
  // Check if item has children
  const hasChildren = allItems.some(i => i.parent?._ref === item._id)
  
  // Check if item has content
  const hasContent = item.content?.length > 0 || 
                    item.steps?.length > 0 || 
                    item.checklist?.length > 0
  
  // Determine kind
  if (!item.parent?._ref) {
    return 'section' // Root level items are sections
  } else if (hasChildren && !hasContent) {
    return 'folder' // Has children but no content = folder
  } else {
    return 'page' // Has content or is a leaf = page
  }
}

// Normalize audience/visibility
function normalizeAudience(visibility: any): string {
  if (!visibility) return 'All'
  
  if (Array.isArray(visibility)) {
    if (visibility.includes('All')) return 'All'
    if (visibility.includes('Core Team')) return 'Team'
    if (visibility.includes('Intern')) return 'Interns'
    if (visibility.includes('Freelancers')) return 'Freelancers'
    return visibility[0] || 'All'
  }
  
  return 'All'
}

// Extract plain text from portable text
function extractPlainText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks
    .filter(b => b._type === 'block')
    .map(block => {
      return block.children
        ?.filter((c: any) => c._type === 'span')
        ?.map((c: any) => c.text)
        ?.join('') || ''
    })
    .join('\n\n')
}

// Create AI chunks from content
function createChunks(plainText: string, maxChunkSize: number = 500): any[] {
  if (!plainText) return []
  
  const paragraphs = plainText.split('\n\n')
  const chunks: any[] = []
  let currentChunk = ''
  let chunkIndex = 0
  
  for (const para of paragraphs) {
    if ((currentChunk + para).length > maxChunkSize && currentChunk) {
      // Save current chunk
      chunks.push({
        _key: `chunk-${chunkIndex}`,
        anchorId: `section-${chunkIndex}`,
        heading: '', // Could extract from first line
        plainText: currentChunk.trim(),
        order: chunkIndex,
        tokensApprox: Math.ceil(currentChunk.length / 4),
      })
      chunkIndex++
      currentChunk = para
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para
    }
  }
  
  // Add final chunk
  if (currentChunk) {
    chunks.push({
      _key: `chunk-${chunkIndex}`,
      anchorId: `section-${chunkIndex}`,
      heading: '',
      plainText: currentChunk.trim(),
      order: chunkIndex,
      tokensApprox: Math.ceil(currentChunk.length / 4),
    })
  }
  
  return chunks
}

// Check for orphaned items
async function findOrphans(items: any[]): Promise<string[]> {
  const orphans: string[] = []
  const validIds = new Set(items.map(i => i._id))
  
  for (const item of items) {
    if (item.parent?._ref && !validIds.has(item.parent._ref)) {
      orphans.push(item._id)
      report.warnings.push({
        id: item._id,
        warning: `Orphaned item - parent ${item.parent._ref} does not exist`
      })
    }
  }
  
  return orphans
}

// Find duplicate slugs among siblings
async function findDuplicateSlugs(items: any[]): Promise<void> {
  const slugMap = new Map<string, string[]>()
  
  // Group by parent and slug
  for (const item of items) {
    const parentKey = item.parent?._ref || 'root'
    const slugKey = `${parentKey}:${item.slug?.current}`
    
    if (!slugMap.has(slugKey)) {
      slugMap.set(slugKey, [])
    }
    slugMap.get(slugKey)!.push(item._id)
  }
  
  // Find duplicates
  for (const [key, ids] of slugMap.entries()) {
    if (ids.length > 1) {
      const [parent, slug] = key.split(':')
      report.duplicateSlugs.push({
        parent: parent === 'root' ? 'root' : parent,
        slug,
        items: ids
      })
      
      for (const id of ids) {
        report.warnings.push({
          id,
          warning: `Duplicate slug "${slug}" among siblings`
        })
      }
    }
  }
}

// Migrate a single item
async function migrateItem(item: any, allItems: any[]): Promise<any> {
  try {
    const kind = inferKind(item, allItems)
    const docType = kind === 'page' || kind === 'show' ? inferDocType(item) : undefined
    const audience = normalizeAudience(item.visibility)
    
    // Extract plain text for AI
    const contentText = extractPlainText(item.content || [])
    const stepsText = item.steps?.map((s: any) => `${s.title}: ${s.content}`).join('\n') || ''
    const checklistText = item.checklist?.join('\n') || ''
    const plainText = [contentText, stepsText, checklistText].filter(Boolean).join('\n\n')
    
    // Create migration patch
    const patch: any = {
      _id: item._id,
      _type: 'kbItem',
      kind,
      audience,
      status: item.status || 'published',
    }
    
    // Add docType if applicable
    if (docType) {
      patch.docType = docType
    }
    
    // Add AI fields if content exists
    if (plainText) {
      patch.ai = {
        plainText,
        chunks: createChunks(plainText),
        lastProcessedAt: new Date().toISOString(),
      }
    }
    
    // Convert legacy modules to new module format
    if (item.content && kind === 'page') {
      patch.modules = [
        {
          _key: 'content-module',
          _type: 'richTextModule',
          content: item.content,
        }
      ]
      
      // Add steps module if exists
      if (item.steps?.length > 0) {
        patch.modules.push({
          _key: 'steps-module',
          _type: 'stepsModule',
          title: 'Steps',
          numbered: true,
          steps: item.steps.map((s: any, i: number) => ({
            _key: `step-${i}`,
            title: s.title,
            content: [{
              _type: 'block',
              _key: `step-content-${i}`,
              children: [{_type: 'span', text: s.content}],
              style: 'normal',
            }],
          })),
        })
      }
      
      // Add checklist module if exists
      if (item.checklist?.length > 0) {
        patch.modules.push({
          _key: 'checklist-module',
          _type: 'checklistModule',
          title: 'Checklist',
          items: item.checklist.map((c: any, i: number) => ({
            _key: `check-${i}`,
            label: c,
            required: false,
          })),
        })
      }
    }
    
    // Handle tags normalization
    if (item.tags?.length > 0) {
      const normalizedTags: string[] = []
      
      for (const tag of item.tags) {
        const normalized = TAG_NORMALIZATION[tag] || tag.toLowerCase().replace(/\s+/g, '-')
        normalizedTags.push(normalized)
        
        if (tag !== normalized) {
          report.tagNormalization.set(tag, normalized)
        }
      }
      
      // Note: In production, you'd create tag documents and reference them
      // For now, we'll store the normalized tag strings for later processing
      patch.normalizedTags = normalizedTags
    }
    
    // Set safety level based on audience
    if (audience === 'All') {
      patch.safetyLevel = 'public'
    } else if (audience === 'Partners') {
      patch.safetyLevel = 'confidential'
    } else {
      patch.safetyLevel = 'internal'
    }
    
    // Add default order if missing
    if (!item.order && item.order !== 0) {
      patch.order = 100
    }
    
    return patch
  } catch (error: any) {
    report.errors.push({
      id: item._id,
      error: error.message,
    })
    return null
  }
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting Knowledge Base migration...')
  if (isDryRun) {
    console.log('📋 DRY RUN MODE - No changes will be made')
  }
  
  // Fetch all kbItem documents
  console.log('📥 Fetching existing documents...')
  const query = `*[_type == "kbItem"] {
    _id,
    _type,
    title,
    slug,
    description,
    kind,
    parent,
    order,
    content,
    steps,
    checklist,
    section,
    category,
    youtubeShow,
    visibility,
    tags,
    status,
    docType,
    supportLink,
    faqs,
    recommended,
    writtenBy,
    hidden,
    _createdAt,
    _updatedAt
  }`
  
  const items = await client.fetch(query)
  report.totalDocuments = items.length
  console.log(`📊 Found ${items.length} documents`)
  
  // Find orphans and duplicates
  console.log('🔍 Checking for orphans and duplicates...')
  report.orphanedItems = await findOrphans(items)
  await findDuplicateSlugs(items)
  
  if (report.orphanedItems.length > 0) {
    console.log(`⚠️  Found ${report.orphanedItems.length} orphaned items`)
  }
  
  if (report.duplicateSlugs.length > 0) {
    console.log(`⚠️  Found ${report.duplicateSlugs.length} duplicate slug groups`)
  }
  
  // Migrate each item
  console.log('🔄 Processing documents...')
  const patches: any[] = []
  
  for (const item of items) {
    const patch = await migrateItem(item, items)
    if (patch) {
      patches.push(patch)
    }
  }
  
  // Apply patches (if not dry run)
  if (!isDryRun && patches.length > 0) {
    console.log(`✏️  Applying ${patches.length} migrations...`)
    
    // Create transaction
    const transaction = client.transaction()
    
    for (const patch of patches) {
      transaction.patch(patch._id, (p: any) => {
        const ops = p
        
        // Set new fields
        if (patch.kind) ops.set({kind: patch.kind})
        if (patch.docType) ops.set({docType: patch.docType})
        if (patch.audience) ops.set({audience: patch.audience})
        if (patch.safetyLevel) ops.set({safetyLevel: patch.safetyLevel})
        if (patch.ai) ops.set({ai: patch.ai})
        if (patch.modules) ops.set({modules: patch.modules})
        if (patch.normalizedTags) ops.set({normalizedTags: patch.normalizedTags})
        
        return ops
      })
    }
    
    try {
      await transaction.commit()
      report.migratedDocuments = patches.length
      console.log('✅ Migration completed successfully!')
    } catch (error: any) {
      console.error('❌ Migration failed:', error.message)
      report.errors.push({
        id: 'transaction',
        error: error.message,
      })
    }
  } else if (isDryRun) {
    report.migratedDocuments = patches.length
    console.log(`✅ Dry run complete - ${patches.length} documents would be migrated`)
  }
  
  // Print report
  console.log('\n📊 Migration Report:')
  console.log('===================')
  console.log(`Total documents: ${report.totalDocuments}`)
  console.log(`Migrated: ${report.migratedDocuments}`)
  console.log(`Skipped: ${report.skippedDocuments}`)
  console.log(`Errors: ${report.errors.length}`)
  console.log(`Warnings: ${report.warnings.length}`)
  console.log(`Orphaned items: ${report.orphanedItems.length}`)
  console.log(`Duplicate slug groups: ${report.duplicateSlugs.length}`)
  console.log(`Tags normalized: ${report.tagNormalization.size}`)
  
  // Print details if there are issues
  if (report.errors.length > 0) {
    console.log('\n❌ Errors:')
    report.errors.forEach(e => {
      console.log(`  - ${e.id}: ${e.error}`)
    })
  }
  
  if (report.warnings.length > 0 && report.warnings.length <= 20) {
    console.log('\n⚠️  Warnings:')
    report.warnings.forEach(w => {
      console.log(`  - ${w.id}: ${w.warning}`)
    })
  } else if (report.warnings.length > 20) {
    console.log(`\n⚠️  ${report.warnings.length} warnings (too many to display)`)
  }
  
  if (report.tagNormalization.size > 0) {
    console.log('\n🏷️  Tag Normalizations:')
    report.tagNormalization.forEach((newTag, oldTag) => {
      console.log(`  - "${oldTag}" → "${newTag}"`)
    })
  }
  
  // Save detailed report to file
  if (!isDryRun) {
    const fs = await import('fs')
    const reportPath = `./migration-report-${Date.now()}.json`
    await fs.promises.writeFile(
      reportPath,
      JSON.stringify(report, null, 2),
      'utf-8'
    )
    console.log(`\n📄 Detailed report saved to: ${reportPath}`)
  }
}

// Run migration
migrate().catch(error => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})
