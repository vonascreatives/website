import {createClient} from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

async function forceDeleteAllKbItems() {
  try {
    console.log('🔍 Finding all remaining kbItem documents...')
    
    // Get all remaining kbItem document IDs
    const kbItemIds = await client.fetch(`*[_type == "kbItem"]._id`)
    
    console.log(`Found ${kbItemIds.length} remaining kbItem documents`)
    
    if (kbItemIds.length === 0) {
      console.log('✅ No kbItem documents remaining!')
      return
    }
    
    console.log('📋 Remaining documents:', kbItemIds)
    
    // We need to delete from most specific to most general
    // Sort documents by their hierarchy depth (more dots = deeper)
    const sortedIds = kbItemIds.sort((a, b) => {
      const aDepth = (a.match(/\./g) || []).length
      const bDepth = (b.match(/\./g) || []).length
      return bDepth - aDepth // Descending order (deepest first)
    })
    
    console.log('🔄 Deletion order (deepest first):', sortedIds)
    
    let deleted = 0
    let maxRetries = 3
    
    // Keep trying until all are deleted or we hit max retries
    for (let retry = 0; retry < maxRetries; retry++) {
      console.log(`\\n🔄 Deletion attempt ${retry + 1}/${maxRetries}`)
      
      let remainingIds = await client.fetch(`*[_type == "kbItem"]._id`)
      
      if (remainingIds.length === 0) {
        console.log('✅ All kbItem documents deleted!')
        break
      }
      
      console.log(`  📊 ${remainingIds.length} documents remaining`)
      
      // Sort again by depth
      const sortedRemaining = remainingIds.sort((a, b) => {
        const aDepth = (a.match(/\./g) || []).length
        const bDepth = (b.match(/\./g) || []).length
        return bDepth - aDepth
      })
      
      for (const id of sortedRemaining) {
        try {
          await client.delete(id)
          console.log(`    ✅ Deleted: ${id}`)
          deleted++
          
          // Small delay
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (error) {
          console.log(`    ⚠️  Cannot delete ${id} yet: ${error.message.split(':')[0]}`)
        }
      }
      
      // Wait between retries
      if (retry < maxRetries - 1) {
        console.log('    ⏳ Waiting 2 seconds before next attempt...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    const finalCheck = await client.fetch(`count(*[_type == "kbItem"])`)
    
    console.log(`\\n🎉 Final Status:`)
    console.log(`  Total deleted: ${deleted}`)
    console.log(`  Remaining kbItem documents: ${finalCheck}`)
    
    if (finalCheck > 0) {
      console.log('\\n⚠️  Some documents could not be deleted due to references.')
      console.log('   These may need manual intervention in the Studio.')
    }
    
  } catch (error) {
    console.error('💥 Force deletion failed:', error)
  }
}

async function main() {
  console.log('🚀 Force deleting remaining kbItem documents...')
  console.log('Project ID: 5cywtc7a')
  console.log('Dataset: production')
  console.log('---\\n')
  
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is required')
    process.exit(1)
  }
  
  await forceDeleteAllKbItems()
  
}

main().catch(console.error)
