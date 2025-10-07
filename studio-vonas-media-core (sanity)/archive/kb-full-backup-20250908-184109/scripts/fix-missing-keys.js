// Run with: sanity exec scripts/fix-missing-keys.js --with-user-token

import {getCliClient} from 'sanity/cli'
import {v4 as uuidv4} from 'uuid'

const client = getCliClient()

// Generate a unique key for array items
function generateKey() {
  return uuidv4().replace(/-/g, '').slice(0, 12)
}

// Add keys to imageWithAlt array items
function addKeysToImageArray(imageArray) {
  if (!Array.isArray(imageArray)) return imageArray
  
  return imageArray.map(item => ({
    ...item,
    _key: item._key || generateKey()
  }))
}

async function fixExclusiveCreators() {
  console.log('🔧 Fixing missing keys in exclusive creators...')
  
  const creators = await client.fetch(`*[_type == "exclusiveCreator"]`)
  
  for (const creator of creators) {
    console.log(`Processing creator: ${creator.name}`)
    
    const patches = {}
    
    // Fix heroImage array keys
    if (creator.heroImage && Array.isArray(creator.heroImage)) {
      const fixedHeroImage = addKeysToImageArray(creator.heroImage)
      if (JSON.stringify(fixedHeroImage) !== JSON.stringify(creator.heroImage)) {
        patches.heroImage = fixedHeroImage
      }
    }
    
    // Fix gallery array keys
    if (creator.gallery && Array.isArray(creator.gallery)) {
      const fixedGallery = addKeysToImageArray(creator.gallery)
      if (JSON.stringify(fixedGallery) !== JSON.stringify(creator.gallery)) {
        patches.gallery = fixedGallery
      }
    }
    
    if (Object.keys(patches).length > 0) {
      await client.patch(creator._id).set(patches).commit()
      console.log(`✅ Fixed keys for ${creator.name}`)
    } else {
      console.log(`⏭️  No keys needed for ${creator.name}`)
    }
  }
}

async function fixTeamMembers() {
  console.log('🔧 Fixing missing keys in team members...')
  
  const members = await client.fetch(`*[_type == "teamMember"]`)
  
  for (const member of members) {
    console.log(`Processing team member: ${member.name}`)
    
    const patches = {}
    
    // Fix photo array keys
    if (member.photo && Array.isArray(member.photo)) {
      const fixedPhoto = addKeysToImageArray(member.photo)
      if (JSON.stringify(fixedPhoto) !== JSON.stringify(member.photo)) {
        patches.photo = fixedPhoto
      }
    }
    
    if (Object.keys(patches).length > 0) {
      await client.patch(member._id).set(patches).commit()
      console.log(`✅ Fixed keys for ${member.name}`)
    } else {
      console.log(`⏭️  No keys needed for ${member.name}`)
    }
  }
}

async function fixBlogPosts() {
  console.log('🔧 Fixing missing keys in blog posts...')
  
  const posts = await client.fetch(`*[_type == "post"]`)
  
  for (const post of posts) {
    console.log(`Processing post: ${post.title}`)
    
    const patches = {}
    
    // Fix heroImage array keys
    if (post.heroImage && Array.isArray(post.heroImage)) {
      const fixedHeroImage = addKeysToImageArray(post.heroImage)
      if (JSON.stringify(fixedHeroImage) !== JSON.stringify(post.heroImage)) {
        patches.heroImage = fixedHeroImage
      }
    }
    
    if (Object.keys(patches).length > 0) {
      await client.patch(post._id).set(patches).commit()
      console.log(`✅ Fixed keys for ${post.title}`)
    } else {
      console.log(`⏭️  No keys needed for ${post.title}`)
    }
  }
}

async function fixKnowledgeBase() {
  console.log('🔧 Fixing missing keys in knowledge base articles...')
  
  const articles = await client.fetch(`*[_type == "knowledgeBase"]`)
  
  for (const article of articles) {
    console.log(`Processing article: ${article.title}`)
    
    const patches = {}
    
    // Fix coverImage array keys
    if (article.coverImage && Array.isArray(article.coverImage)) {
      const fixedCoverImage = addKeysToImageArray(article.coverImage)
      if (JSON.stringify(fixedCoverImage) !== JSON.stringify(article.coverImage)) {
        patches.coverImage = fixedCoverImage
      }
    }
    
    // Fix images array keys
    if (article.images && Array.isArray(article.images)) {
      const fixedImages = addKeysToImageArray(article.images)
      if (JSON.stringify(fixedImages) !== JSON.stringify(article.images)) {
        patches.images = fixedImages
      }
    }
    
    if (Object.keys(patches).length > 0) {
      await client.patch(article._id).set(patches).commit()
      console.log(`✅ Fixed keys for ${article.title}`)
    } else {
      console.log(`⏭️  No keys needed for ${article.title}`)
    }
  }
}

async function fixChannels() {
  console.log('🔧 Fixing missing keys in channels...')
  
  const channels = await client.fetch(`*[_type == "channel"]`)
  
  for (const channel of channels) {
    console.log(`Processing channel: ${channel.name}`)
    
    const patches = {}
    
    // Fix logo array keys
    if (channel.logo && Array.isArray(channel.logo)) {
      const fixedLogo = addKeysToImageArray(channel.logo)
      if (JSON.stringify(fixedLogo) !== JSON.stringify(channel.logo)) {
        patches.logo = fixedLogo
      }
    }
    
    if (Object.keys(patches).length > 0) {
      await client.patch(channel._id).set(patches).commit()
      console.log(`✅ Fixed keys for ${channel.name}`)
    } else {
      console.log(`⏭️  No keys needed for ${channel.name}`)
    }
  }
}

async function fixBrandCollaborations() {
  console.log('🔧 Fixing missing keys in brand collaborations...')
  
  const brands = await client.fetch(`*[_type == "brandCollaboration"]`)
  
  for (const brand of brands) {
    console.log(`Processing brand: ${brand.brandName}`)
    
    const patches = {}
    
    // Fix logo array keys
    if (brand.logo && Array.isArray(brand.logo)) {
      const fixedLogo = addKeysToImageArray(brand.logo)
      if (JSON.stringify(fixedLogo) !== JSON.stringify(brand.logo)) {
        patches.logo = fixedLogo
      }
    }
    
    if (Object.keys(patches).length > 0) {
      await client.patch(brand._id).set(patches).commit()
      console.log(`✅ Fixed keys for ${brand.brandName}`)
    } else {
      console.log(`⏭️  No keys needed for ${brand.brandName}`)
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting missing keys fix...')
    
    await fixExclusiveCreators()
    await fixTeamMembers()
    await fixBlogPosts()
    await fixKnowledgeBase()
    await fixChannels()
    await fixBrandCollaborations()
    
    console.log('✅ All missing keys have been fixed!')
    console.log('🎯 Images should now display properly in Sanity Studio!')
    
  } catch (error) {
    console.error('❌ Error fixing missing keys:', error)
    process.exit(1)
  }
}

main()
