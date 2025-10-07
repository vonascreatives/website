import {createClient} from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-09-03',
})

async function transformKbItemToKb() {
  console.log('🔄 Starting transformation of kbItem documents to kb...')
  
  try {
    // Get all kbItem documents
    const kbItems = await client.fetch(`*[_type == "kbItem"] {
      _id,
      _rev,
      _createdAt,
      _updatedAt,
      title,
      slug,
      kind,
      parent,
      hidden,
      description,
      order,
      content,
      steps,
      checklist,
      category,
      youtubeShow,
      faqs,
      docType,
      visibility,
      videoUrl,
      embedCode,
      attachments,
      relatedItems,
      author,
      tags,
      lastUpdated
    }`)

    console.log(`📊 Found ${kbItems.length} kbItem documents to transform`)

    let transformed = 0
    let errors = 0

    // Process in batches of 10
    for (let i = 0; i < kbItems.length; i += 10) {
      const batch = kbItems.slice(i, i + 10)
      
      try {
        // Create new kb documents
        const mutations = batch.map((item) => {
          // Clean up the document for kb schema
          const kbDocument = {
            _type: 'kb',
            _id: item._id.replace('drafts.', ''), // Remove drafts prefix if exists
            title: item.title,
            slug: item.slug,
            kind: item.kind || 'page',
            parent: item.parent,
            hidden: item.hidden || false,
            description: item.description,
            order: item.order || 100,
            content: item.content,
            steps: item.steps,
            checklist: item.checklist,
            docType: item.docType,
            audience: item.visibility || ['all'], // Transform visibility to audience
            videoUrl: item.videoUrl,
            embedCode: item.embedCode,
            attachments: item.attachments,
            relatedItems: item.relatedItems,
            faqs: item.faqs,
            tags: item.tags,
            author: item.author,
            lastUpdated: new Date().toISOString(),
          }

          // Remove undefined fields
          Object.keys(kbDocument).forEach(key => {
            if (kbDocument[key] === undefined) {
              delete kbDocument[key]
            }
          })

          return {
            createOrReplace: kbDocument
          }
        })

        // Execute batch
        await client.mutate(mutations)
        transformed += batch.length
        console.log(`✅ Transformed batch ${Math.floor(i/10) + 1}: ${batch.length} documents (Total: ${transformed})`)

      } catch (error) {
        console.error(`❌ Error transforming batch ${Math.floor(i/10) + 1}:`, error.message)
        errors += batch.length
      }
    }

    console.log('📈 Transformation Summary:')
    console.log(`   ✅ Successfully transformed: ${transformed}`)
    console.log(`   ❌ Errors: ${errors}`)
    
    if (transformed > 0) {
      console.log('🎉 All kbItem documents have been transformed to kb!')
      console.log('⚠️  Note: Old kbItem documents still exist. You can delete them manually after verifying the transformation.')
    }

  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  }
}

transformKbItemToKb()
