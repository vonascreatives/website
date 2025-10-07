const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
  useCdn: false,
  apiVersion: '2023-01-01'
})

// Available image assets in the dataset
const imageAssets = [
  'image-0fcd2417695309659c2a3fed64bf6969d34783df-400x300-svg', // tech-thumbnail-1.svg
  'image-26ebb409a17c12f99a9f9df6edccd0f82d546534-400x300-svg', // pixel-art-thumbnail.svg
  'image-4cbbd6d3b2ec2049db18c9c51499c8b31551196c-400x300-svg', // culture-hero-image.svg
  'image-5d0064c5acf932ac6b0f2143591d7e2ccefed0e7-800x600-jpg', // photo-1460925895917-afdab827c52f
  'image-6521f43b12b1b4bdfe39c28db66433829d26479a-400x300-svg', // lifestyle-hero-image.svg
  'image-6db1363832f96a3ac1ab19541f830767e6df27f0-400x300-svg', // tech-hero-image.svg
  'image-785e5c786e1b19b01f30cacf35bcf77978cafa08-800x600-jpg', // photo-1611224923853-80b023f02d71
  'image-805d93f90e205ea17b84808e4465e5db2f266f97-400x300-svg', // culture-collage.svg
  'image-8ef3c894245e7ced3f8e532bb6b5b949e6365358-400x300-svg', // lifestyle-vlog-thumbnail.svg
  'image-96319028037d8dc55129670f212d98311286053f-400x300-svg', // education-hero-image.svg
  'image-b09d9063b42ddc9a6d6ccdda1a0cc0c6fb8831ee-1280x720-png', // OTR Thumbnails YouTube (2).png
  'image-bb3871c0f874e8c251174ac6160e8e248b1e2d5e-800x600-jpg', // photo-1611605698335-8b1569810432
  'image-cf53f7dc07ac7953206597aa922b028de84aeed5-400x300-svg', // education-infographic.svg
  'image-e69eb259e2e904baca50552946eac261bdc0402b-800x600-jpg', // photo-1563013544-824ae1b704d3
  'image-ef5160103a5e623877babfb518d8f8c0fa92d6a0-800x600-jpg', // photo-1551288049-bebda4e38f71
  'image-f29df308e1a7173fdbba69bf2865d34efa1d1221-400x300-svg'  // gaming-hero-image.svg
]

function getRandomImage() {
  return imageAssets[Math.floor(Math.random() * imageAssets.length)]
}

function createImageWithAlt(altText) {
  return {
    _type: 'imageWithAlt',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: getRandomImage()
      }
    },
    alt: altText
  }
}

async function fixExclusiveCreators() {
  console.log('Fixing exclusive creators...')
  
  const creators = await client.fetch(`*[_type == "exclusiveCreator" && (heroImages == null || profileImage == null || length(heroImages) == 0)]`)
  
  for (const creator of creators) {
    console.log(`Fixing creator: ${creator.name}`)
    
    const patches = {}
    
    // Fix heroImages if null or empty
    if (!creator.heroImages || creator.heroImages.length === 0) {
      patches.heroImages = [
        createImageWithAlt(`${creator.name} hero image`),
        createImageWithAlt(`${creator.name} featured content`)
      ]
    }
    
    // Fix profileImage if null
    if (!creator.profileImage || creator.profileImage.length === 0) {
      patches.profileImage = [createImageWithAlt(`${creator.name} profile photo`)]
    }
    
    if (Object.keys(patches).length > 0) {
      await client.patch(creator._id).set(patches).commit()
      console.log(`✅ Fixed ${creator.name}`)
    }
  }
}

async function fixTeamMembers() {
  console.log('Fixing team members...')
  
  const members = await client.fetch(`*[_type == "teamMember" && (profileImages == null || length(profileImages) == 0)]`)
  
  for (const member of members) {
    console.log(`Fixing team member: ${member.name}`)
    
    await client.patch(member._id).set({
      profileImages: [createImageWithAlt(`${member.name} professional photo`)]
    }).commit()
    
    console.log(`✅ Fixed ${member.name}`)
  }
}

async function fixBlogPosts() {
  console.log('Fixing blog posts...')
  
  const posts = await client.fetch(`*[_type == "post" && (featuredImages == null || length(featuredImages) == 0)]`)
  
  for (const post of posts) {
    console.log(`Fixing post: ${post.title}`)
    
    await client.patch(post._id).set({
      featuredImages: [
        createImageWithAlt(`Featured image for ${post.title}`),
        createImageWithAlt(`${post.title} supporting visual`)
      ]
    }).commit()
    
    console.log(`✅ Fixed ${post.title}`)
  }
}

async function fixKnowledgeBase() {
  console.log('Fixing knowledge base articles...')
  
  const articles = await client.fetch(`*[_type == "knowledgeBase" && (illustrations == null || length(illustrations) == 0)]`)
  
  for (const article of articles) {
    console.log(`Fixing article: ${article.title}`)
    
    await client.patch(article._id).set({
      illustrations: [createImageWithAlt(`Illustration for ${article.title}`)]
    }).commit()
    
    console.log(`✅ Fixed ${article.title}`)
  }
}

async function fixJobBoards() {
  console.log('Fixing job board postings...')
  
  const jobs = await client.fetch(`*[_type == "jobBoard" && (companyLogos == null || length(companyLogos) == 0)]`)
  
  for (const job of jobs) {
    console.log(`Fixing job: ${job.title}`)
    
    await client.patch(job._id).set({
      companyLogos: [createImageWithAlt(`${job.company} logo`)]
    }).commit()
    
    console.log(`✅ Fixed ${job.title}`)
  }
}

async function fixChannels() {
  console.log('Fixing YouTube channels...')
  
  const channels = await client.fetch(`*[_type == "channel" && (images == null || length(images) == 0)]`)
  
  for (const channel of channels) {
    console.log(`Fixing channel: ${channel.title}`)
    
    await client.patch(channel._id).set({
      images: [
        createImageWithAlt(`${channel.title} channel banner`),
        createImageWithAlt(`${channel.title} thumbnail`)
      ]
    }).commit()
    
    console.log(`✅ Fixed ${channel.title}`)
  }
}

async function fixBrandCollaborations() {
  console.log('Fixing brand collaborations...')
  
  const brands = await client.fetch(`*[_type == "brandCollaboration" && (logo == null || length(logo) == 0)]`)
  
  for (const brand of brands) {
    console.log(`Fixing brand: ${brand.brandName}`)
    
    await client.patch(brand._id).set({
      logo: [createImageWithAlt(`${brand.brandName} logo`)]
    }).commit()
    
    console.log(`✅ Fixed ${brand.brandName}`)
  }
}

async function main() {
  try {
    console.log('🚀 Starting image fix process...')
    console.log(`Using ${imageAssets.length} available image assets`)
    
    await fixExclusiveCreators()
    await fixTeamMembers()
    await fixBlogPosts()
    await fixKnowledgeBase()
    await fixJobBoards()
    await fixChannels()
    await fixBrandCollaborations()
    
    console.log('✅ All documents fixed successfully!')
    
  } catch (error) {
    console.error('❌ Error fixing documents:', error)
    process.exit(1)
  }
}

main()
