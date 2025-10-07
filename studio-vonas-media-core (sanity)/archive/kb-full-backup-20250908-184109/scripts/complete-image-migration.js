// Run with: sanity exec scripts/complete-image-migration.js --with-user-token

import {getCliClient} from 'sanity/cli'

const client = getCliClient()

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

// Convert single imageWithAlt to array format
function convertSingleToArray(imageWithAlt) {
  if (!imageWithAlt) return null
  return [imageWithAlt]
}

async function migrateExclusiveCreators() {
  console.log('Migrating exclusive creators...')
  
  const creators = await client.fetch(`*[_type == "exclusiveCreator"]`)
  
  for (const creator of creators) {
    console.log(`Processing creator: ${creator.name}`)
    
    const patches = {}
    const unsetFields = []
    
    // Migrate profileImage -> heroImage
    if (creator.profileImage) {
      patches.heroImage = creator.profileImage
      unsetFields.push('profileImage')
    }
    
    // Migrate heroImages -> gallery 
    if (creator.heroImages) {
      patches.gallery = creator.heroImages
      unsetFields.push('heroImages')
    }
    
    // Ensure heroImage exists
    if (!creator.heroImage && !patches.heroImage) {
      patches.heroImage = [createImageWithAlt(`${creator.name} hero image`)]
    }
    
    // Ensure gallery exists
    if (!creator.gallery && !patches.gallery) {
      patches.gallery = [
        createImageWithAlt(`${creator.name} gallery image 1`),
        createImageWithAlt(`${creator.name} gallery image 2`)
      ]
    }
    
    if (Object.keys(patches).length > 0 || unsetFields.length > 0) {
      let transaction = client.patch(creator._id)
      
      if (Object.keys(patches).length > 0) {
        transaction = transaction.set(patches)
      }
      
      if (unsetFields.length > 0) {
        transaction = transaction.unset(unsetFields)
      }
      
      await transaction.commit()
      console.log(`✅ Migrated ${creator.name}`)
    }
  }
}

async function migrateTeamMembers() {
  console.log('Migrating team members...')
  
  const members = await client.fetch(`*[_type == "teamMember"]`)
  
  for (const member of members) {
    console.log(`Processing team member: ${member.name}`)
    
    const patches = {}
    const unsetFields = []
    
    // Migrate profileImages -> photo (if needed)
    if (member.profileImages) {
      patches.photo = member.profileImages.slice(0, 1) // Take first image only
      unsetFields.push('profileImages')
    }
    
    // Ensure photo exists
    if (!member.photo && !patches.photo) {
      patches.photo = [createImageWithAlt(`${member.name} professional photo`)]
    }
    
    if (Object.keys(patches).length > 0 || unsetFields.length > 0) {
      let transaction = client.patch(member._id)
      
      if (Object.keys(patches).length > 0) {
        transaction = transaction.set(patches)
      }
      
      if (unsetFields.length > 0) {
        transaction = transaction.unset(unsetFields)
      }
      
      await transaction.commit()
      console.log(`✅ Migrated ${member.name}`)
    }
  }
}

async function migrateBlogPosts() {
  console.log('Migrating blog posts...')
  
  const posts = await client.fetch(`*[_type == "post"]`)
  
  for (const post of posts) {
    console.log(`Processing post: ${post.title}`)
    
    const patches = {}
    const unsetFields = []
    
    // Migrate coverImage -> heroImage (if needed)
    if (post.coverImage) {
      patches.heroImage = post.coverImage
      unsetFields.push('coverImage')
    }
    
    // Clean up invalid featuredImages field
    if (post.featuredImages) {
      unsetFields.push('featuredImages')
    }
    
    // Ensure heroImage exists
    if (!post.heroImage && !patches.heroImage) {
      patches.heroImage = [createImageWithAlt(`Hero image for ${post.title}`)]
    }
    
    if (Object.keys(patches).length > 0 || unsetFields.length > 0) {
      let transaction = client.patch(post._id)
      
      if (Object.keys(patches).length > 0) {
        transaction = transaction.set(patches)
      }
      
      if (unsetFields.length > 0) {
        transaction = transaction.unset(unsetFields)
      }
      
      await transaction.commit()
      console.log(`✅ Migrated ${post.title}`)
    }
  }
}

async function migrateKnowledgeBase() {
  console.log('Migrating knowledge base articles...')
  
  const articles = await client.fetch(`*[_type == "knowledgeBase"]`)
  
  for (const article of articles) {
    console.log(`Processing article: ${article.title}`)
    
    const patches = {}
    const unsetFields = []
    
    // Migrate illustrations -> images
    if (article.illustrations) {
      patches.images = article.illustrations
      unsetFields.push('illustrations')
    }
    
    // Ensure coverImage exists (this is the heroImage equivalent for KB)
    if (!article.coverImage) {
      patches.coverImage = [createImageWithAlt(`Cover image for ${article.title}`)]
    }
    
    // Ensure images exists
    if (!article.images && !patches.images) {
      patches.images = [createImageWithAlt(`Illustration for ${article.title}`)]
    }
    
    if (Object.keys(patches).length > 0 || unsetFields.length > 0) {
      let transaction = client.patch(article._id)
      
      if (Object.keys(patches).length > 0) {
        transaction = transaction.set(patches)
      }
      
      if (unsetFields.length > 0) {
        transaction = transaction.unset(unsetFields)
      }
      
      await transaction.commit()
      console.log(`✅ Migrated ${article.title}`)
    }
  }
}

async function migrateChannels() {
  console.log('Migrating channels...')
  
  const channels = await client.fetch(`*[_type == "channel"]`)
  
  for (const channel of channels) {
    console.log(`Processing channel: ${channel.name}`)
    
    const patches = {}
    const unsetFields = []
    
    // Convert single logo to array format
    if (channel.logo && channel.logo._type === 'imageWithAlt') {
      patches.logo = [channel.logo]
    }
    
    // Clean up invalid images field
    if (channel.images) {
      unsetFields.push('images')
    }
    
    // Ensure logo exists as array
    if (!channel.logo && !patches.logo) {
      patches.logo = [createImageWithAlt(`${channel.name} logo`)]
    }
    
    if (Object.keys(patches).length > 0 || unsetFields.length > 0) {
      let transaction = client.patch(channel._id)
      
      if (Object.keys(patches).length > 0) {
        transaction = transaction.set(patches)
      }
      
      if (unsetFields.length > 0) {
        transaction = transaction.unset(unsetFields)
      }
      
      await transaction.commit()
      console.log(`✅ Migrated ${channel.name}`)
    }
  }
}

async function migrateBrandCollaborations() {
  console.log('Migrating brand collaborations...')
  
  // First, let's import the brand collaborations we created
  await importBrandCollaborations()
  
  const brands = await client.fetch(`*[_type == "brandCollaboration"]`)
  
  for (const brand of brands) {
    console.log(`Processing brand: ${brand.brandName}`)
    
    const patches = {}
    
    // Ensure logo exists
    if (!brand.logo || brand.logo.length === 0) {
      patches.logo = [createImageWithAlt(`${brand.brandName} logo`)]
    }
    
    if (Object.keys(patches).length > 0) {
      await client.patch(brand._id).set(patches).commit()
      console.log(`✅ Migrated ${brand.brandName}`)
    }
  }
}

async function importBrandCollaborations() {
  console.log('Importing brand collaboration seed data...')
  
  // Check if brand collaborations already exist
  const existingBrands = await client.fetch(`count(*[_type == "brandCollaboration"])`)
  
  if (existingBrands === 0) {
    const brandCollaborations = [
      {
        _type: 'brandCollaboration',
        _id: 'brand-nike',
        brandName: 'Nike',
        slug: { current: 'nike' },
        logo: [createImageWithAlt('Nike swoosh logo')],
        status: 'active',
        budgetRange: '$150,000 - $200,000',
        timeline: 'Q2 2024',
        objectives: ['Increase brand awareness among Gen Z', 'Drive sales of Air Max series'],
        deliverables: ['5 YouTube videos', '10 Instagram posts', '2 TikTok campaigns']
      },
      {
        _type: 'brandCollaboration',
        _id: 'brand-apple',
        brandName: 'Apple',
        slug: { current: 'apple' },
        logo: [createImageWithAlt('Apple logo')],
        status: 'negotiation',
        budgetRange: '$300,000 - $500,000',
        timeline: 'Q1-Q3 2024',
        objectives: ['Showcase iPhone 15 Pro camera capabilities', 'Highlight creative workflows'],
        deliverables: ['iPhone photography tutorials', 'Mac creative workflow videos']
      },
      {
        _type: 'brandCollaboration',
        _id: 'brand-spotify',
        brandName: 'Spotify',
        slug: { current: 'spotify' },
        logo: [createImageWithAlt('Spotify logo')],
        status: 'lead',
        budgetRange: '$80,000 - $120,000',
        timeline: 'Q4 2024',
        objectives: ['Promote podcast discovery features', 'Drive premium subscriptions'],
        deliverables: ['Podcast recommendation content', 'Music discovery videos']
      }
    ]
    
    for (const brand of brandCollaborations) {
      await client.createOrReplace(brand)
      console.log(`✅ Imported ${brand.brandName}`)
    }
  } else {
    console.log('Brand collaborations already exist, skipping import')
  }
}

async function main() {
  try {
    console.log('🚀 Starting complete image migration...')
    console.log(`Using ${imageAssets.length} available image assets`)
    
    await migrateExclusiveCreators()
    await migrateTeamMembers()
    await migrateBlogPosts()
    await migrateKnowledgeBase()
    await migrateChannels()
    await migrateBrandCollaborations()
    
    console.log('✅ Complete migration finished successfully!')
    console.log('\n📋 Summary:')
    console.log('- ✅ Exclusive creators: profileImage -> heroImage, heroImages -> gallery')
    console.log('- ✅ Team members: profileImages -> photo')  
    console.log('- ✅ Blog posts: coverImage -> heroImage, removed featuredImages')
    console.log('- ✅ Knowledge base: illustrations -> images, ensured coverImage exists')
    console.log('- ✅ Channels: single logo -> array logo, removed invalid images')
    console.log('- ✅ Brand collaborations: imported and ensured logos exist')
    console.log('\n🎯 All image fields now use consistent naming and have valid images!')
    
  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  }
}

main()
