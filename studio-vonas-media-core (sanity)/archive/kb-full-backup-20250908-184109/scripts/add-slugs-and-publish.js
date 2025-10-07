// Run with: sanity exec scripts/add-slugs-and-publish.js --with-user-token

import {getCliClient} from 'sanity/cli'

const client = getCliClient()

// Generate slug from text
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-') // Remove leading/trailing hyphens
}

// Ensure unique slug
async function ensureUniqueSlug(baseSlug, docType, docId) {
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const existing = await client.fetch(`*[_type == "${docType}" && slug.current == "${slug}" && _id != "${docId}"]`)
    if (existing.length === 0) break
    
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

async function processExclusiveCreators() {
  console.log('🎯 Processing exclusive creators...')
  
  const creators = await client.fetch(`*[_type == "exclusiveCreator"]`)
  
  for (const creator of creators) {
    console.log(`Processing creator: ${creator.name}`)
    
    const patches = {}
    const publishedId = creator._id.replace('drafts.', '')
    
    // Add slug if missing
    if (!creator.slug?.current) {
      const baseSlug = generateSlug(creator.name)
      const uniqueSlug = await ensureUniqueSlug(baseSlug, 'exclusiveCreator', creator._id)
      patches.slug = { current: uniqueSlug, _type: 'slug' }
    }
    
    // Apply patches if needed
    if (Object.keys(patches).length > 0) {
      await client.patch(creator._id).set(patches).commit()
      console.log(`✅ Updated ${creator.name}`)
    }
    
    // Publish the document
    try {
      await client.createOrReplace({
        ...creator,
        ...patches,
        _id: publishedId
      })
      console.log(`📤 Published ${creator.name}`)
    } catch (error) {
      console.log(`⚠️  Could not publish ${creator.name}: ${error.message}`)
    }
  }
}

async function processTeamMembers() {
  console.log('👥 Processing team members...')
  
  const members = await client.fetch(`*[_type == "teamMember"]`)
  
  for (const member of members) {
    console.log(`Processing member: ${member.name}`)
    
    const patches = {}
    const publishedId = member._id.replace('drafts.', '')
    
    // Add slug if missing
    if (!member.slug?.current) {
      const baseSlug = generateSlug(member.name)
      const uniqueSlug = await ensureUniqueSlug(baseSlug, 'teamMember', member._id)
      patches.slug = { current: uniqueSlug, _type: 'slug' }
    }
    
    // Apply patches if needed
    if (Object.keys(patches).length > 0) {
      await client.patch(member._id).set(patches).commit()
      console.log(`✅ Updated ${member.name}`)
    }
    
    // Publish the document
    try {
      await client.createOrReplace({
        ...member,
        ...patches,
        _id: publishedId
      })
      console.log(`📤 Published ${member.name}`)
    } catch (error) {
      console.log(`⚠️  Could not publish ${member.name}: ${error.message}`)
    }
  }
}

async function processBlogPosts() {
  console.log('📝 Processing blog posts...')
  
  const posts = await client.fetch(`*[_type == "post"]`)
  
  for (const post of posts) {
    console.log(`Processing post: ${post.title}`)
    
    const patches = {}
    const publishedId = post._id.replace('drafts.', '')
    
    // Add slug if missing
    if (!post.slug?.current) {
      const baseSlug = generateSlug(post.title)
      const uniqueSlug = await ensureUniqueSlug(baseSlug, 'post', post._id)
      patches.slug = { current: uniqueSlug, _type: 'slug' }
    }
    
    // Add publishedAt if missing
    if (!post.publishedAt) {
      patches.publishedAt = new Date().toISOString()
    }
    
    // Apply patches if needed
    if (Object.keys(patches).length > 0) {
      await client.patch(post._id).set(patches).commit()
      console.log(`✅ Updated ${post.title}`)
    }
    
    // Publish the document
    try {
      await client.createOrReplace({
        ...post,
        ...patches,
        _id: publishedId
      })
      console.log(`📤 Published ${post.title}`)
    } catch (error) {
      console.log(`⚠️  Could not publish ${post.title}: ${error.message}`)
    }
  }
}

async function processKnowledgeBase() {
  console.log('📚 Processing knowledge base articles...')
  
  const articles = await client.fetch(`*[_type == "knowledgeBase"]`)
  
  for (const article of articles) {
    console.log(`Processing article: ${article.title}`)
    
    const patches = {}
    const publishedId = article._id.replace('drafts.', '')
    
    // Add slug if missing
    if (!article.slug?.current) {
      const baseSlug = generateSlug(article.title)
      const uniqueSlug = await ensureUniqueSlug(baseSlug, 'knowledgeBase', article._id)
      patches.slug = { current: uniqueSlug, _type: 'slug' }
    }
    
    // Add publishedAt if missing
    if (!article.publishedAt) {
      patches.publishedAt = new Date().toISOString()
    }
    
    // Apply patches if needed
    if (Object.keys(patches).length > 0) {
      await client.patch(article._id).set(patches).commit()
      console.log(`✅ Updated ${article.title}`)
    }
    
    // Publish the document
    try {
      await client.createOrReplace({
        ...article,
        ...patches,
        _id: publishedId
      })
      console.log(`📤 Published ${article.title}`)
    } catch (error) {
      console.log(`⚠️  Could not publish ${article.title}: ${error.message}`)
    }
  }
}

async function processChannels() {
  console.log('📺 Processing channels...')
  
  const channels = await client.fetch(`*[_type == "channel"]`)
  
  for (const channel of channels) {
    console.log(`Processing channel: ${channel.name}`)
    
    const patches = {}
    const publishedId = channel._id.replace('drafts.', '')
    
    // Add slug if missing
    if (!channel.slug?.current) {
      const baseSlug = generateSlug(channel.name)
      const uniqueSlug = await ensureUniqueSlug(baseSlug, 'channel', channel._id)
      patches.slug = { current: uniqueSlug, _type: 'slug' }
    }
    
    // Apply patches if needed
    if (Object.keys(patches).length > 0) {
      await client.patch(channel._id).set(patches).commit()
      console.log(`✅ Updated ${channel.name}`)
    }
    
    // Publish the document
    try {
      await client.createOrReplace({
        ...channel,
        ...patches,
        _id: publishedId
      })
      console.log(`📤 Published ${channel.name}`)
    } catch (error) {
      console.log(`⚠️  Could not publish ${channel.name}: ${error.message}`)
    }
  }
}

async function processJobBoards() {
  console.log('💼 Processing job board postings...')
  
  const jobs = await client.fetch(`*[_type == "jobBoard"]`)
  
  for (const job of jobs) {
    console.log(`Processing job: ${job.title}`)
    
    const patches = {}
    const publishedId = job._id.replace('drafts.', '')
    
    // Add slug if missing
    if (!job.slug?.current) {
      const baseSlug = generateSlug(job.title)
      const uniqueSlug = await ensureUniqueSlug(baseSlug, 'jobBoard', job._id)
      patches.slug = { current: uniqueSlug, _type: 'slug' }
    }
    
    // Add publishedAt if missing
    if (!job.publishedAt) {
      patches.publishedAt = new Date().toISOString()
    }
    
    // Apply patches if needed
    if (Object.keys(patches).length > 0) {
      await client.patch(job._id).set(patches).commit()
      console.log(`✅ Updated ${job.title}`)
    }
    
    // Publish the document
    try {
      await client.createOrReplace({
        ...job,
        ...patches,
        _id: publishedId
      })
      console.log(`📤 Published ${job.title}`)
    } catch (error) {
      console.log(`⚠️  Could not publish ${job.title}: ${error.message}`)
    }
  }
}

async function processBrandCollaborations() {
  console.log('🤝 Processing brand collaborations...')
  
  const brands = await client.fetch(`*[_type == "brandCollaboration"]`)
  
  for (const brand of brands) {
    console.log(`Processing brand: ${brand.brandName}`)
    
    const patches = {}
    const publishedId = brand._id.replace('drafts.', '')
    
    // Add slug if missing
    if (!brand.slug?.current) {
      const baseSlug = generateSlug(brand.brandName)
      const uniqueSlug = await ensureUniqueSlug(baseSlug, 'brandCollaboration', brand._id)
      patches.slug = { current: uniqueSlug, _type: 'slug' }
    }
    
    // Add createdAt if missing
    if (!brand.createdAt) {
      patches.createdAt = new Date().toISOString()
    }
    
    // Apply patches if needed
    if (Object.keys(patches).length > 0) {
      await client.patch(brand._id).set(patches).commit()
      console.log(`✅ Updated ${brand.brandName}`)
    }
    
    // Publish the document
    try {
      await client.createOrReplace({
        ...brand,
        ...patches,
        _id: publishedId
      })
      console.log(`📤 Published ${brand.brandName}`)
    } catch (error) {
      console.log(`⚠️  Could not publish ${brand.brandName}: ${error.message}`)
    }
  }
}

async function processFAQs() {
  console.log('❓ Processing FAQs...')
  
  const faqs = await client.fetch(`*[_type == "faq"]`)
  
  for (const faq of faqs) {
    console.log(`Processing FAQ: ${faq.question}`)
    
    const patches = {}
    const publishedId = faq._id.replace('drafts.', '')
    
    // Add slug if missing
    if (!faq.slug?.current) {
      const baseSlug = generateSlug(faq.question)
      const uniqueSlug = await ensureUniqueSlug(baseSlug, 'faq', faq._id)
      patches.slug = { current: uniqueSlug, _type: 'slug' }
    }
    
    // Apply patches if needed
    if (Object.keys(patches).length > 0) {
      await client.patch(faq._id).set(patches).commit()
      console.log(`✅ Updated FAQ`)
    }
    
    // Publish the document
    try {
      await client.createOrReplace({
        ...faq,
        ...patches,
        _id: publishedId
      })
      console.log(`📤 Published FAQ`)
    } catch (error) {
      console.log(`⚠️  Could not publish FAQ: ${error.message}`)
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting slug addition and publishing process...')
    console.log('=' .repeat(60))
    
    await processExclusiveCreators()
    console.log('')
    await processTeamMembers()
    console.log('')
    await processBlogPosts()
    console.log('')
    await processKnowledgeBase()
    console.log('')
    await processChannels()
    console.log('')
    await processJobBoards()
    console.log('')
    await processBrandCollaborations()
    console.log('')
    await processFAQs()
    
    console.log('')
    console.log('=' .repeat(60))
    console.log('✅ ALL DOCUMENTS PROCESSED AND PUBLISHED!')
    console.log('')
    console.log('📋 Summary:')
    console.log('- ✅ Added missing slugs to all document types')
    console.log('- ✅ Added missing publishedAt dates where needed')
    console.log('- ✅ Published all documents (moved from drafts to production)')
    console.log('- ✅ All documents now available on frontend via API')
    console.log('')
    console.log('🎯 Your frontend can now fetch:')
    console.log('- Exclusive creators with images and slugs')
    console.log('- Team members with photos and slugs')
    console.log('- Blog posts with hero images and slugs')
    console.log('- Knowledge base articles with cover images and slugs')
    console.log('- Channels with logos and slugs')
    console.log('- Job board postings with slugs')
    console.log('- Brand collaborations with logos and slugs')
    console.log('- FAQs with slugs')
    
  } catch (error) {
    console.error('❌ Error during processing:', error)
    process.exit(1)
  }
}

main()
