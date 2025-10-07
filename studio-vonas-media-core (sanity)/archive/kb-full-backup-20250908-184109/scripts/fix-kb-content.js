#!/usr/bin/env node

/**
 * Fix existing KB content to work with new schema
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

async function fixContent() {
  console.log('🔧 Fixing KB content...')
  
  try {
    // Fetch all kbItem documents
    const items = await client.fetch(`
      *[_type == "kbItem"] {
        _id,
        _type,
        title,
        supportLink,
        recommended,
        writtenBy
      }
    `)
    
    console.log(`Found ${items.length} KB items to check`)
    
    let fixed = 0
    let errors = 0
    
    for (const item of items) {
      try {
        const patches = []
        
        // Migrate supportLink to videoUrl or embedCode
        if (item.supportLink) {
          if (item.supportLink.includes('youtube.com') || item.supportLink.includes('vimeo.com')) {
            patches.push({
              set: {videoUrl: item.supportLink},
              unset: ['supportLink']
            })
          } else if (item.supportLink.includes('guidejar.com') || item.supportLink.includes('iframe')) {
            // If it looks like an embed code or Guidjar link
            const embedCode = item.supportLink.includes('<') 
              ? item.supportLink 
              : `<div style="position:relative;height:0;width:100%;overflow:hidden;z-index:99999;box-sizing:border-box;padding-bottom:calc(55.07921715% + 32px)"><iframe src="${item.supportLink}" width="100%" height="100%" style="position:absolute;inset:0" allowfullscreen frameborder="0"></iframe></div>`
            
            patches.push({
              set: {embedCode},
              unset: ['supportLink']
            })
          }
        }
        
        // Migrate recommended to relatedItems
        if (item.recommended && Array.isArray(item.recommended)) {
          patches.push({
            set: {relatedItems: item.recommended},
            unset: ['recommended']
          })
        }
        
        // Migrate writtenBy to author
        if (item.writtenBy) {
          patches.push({
            set: {author: item.writtenBy},
            unset: ['writtenBy']
          })
        }
        
        // Apply patches if any
        if (patches.length > 0) {
          const transaction = client.transaction()
          
          for (const patch of patches) {
            transaction.patch(item._id, p => {
              if (patch.set) p.set(patch.set)
              if (patch.unset) p.unset(patch.unset)
              return p
            })
          }
          
          await transaction.commit()
          fixed++
          console.log(`✅ Fixed: ${item.title}`)
        }
      } catch (error) {
        console.error(`❌ Error fixing ${item.title}:`, error.message)
        errors++
      }
    }
    
    console.log(`\n📊 Migration complete:`)
    console.log(`   Fixed: ${fixed} items`)
    console.log(`   Errors: ${errors} items`)
    console.log(`   Unchanged: ${items.length - fixed - errors} items`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

fixContent()
