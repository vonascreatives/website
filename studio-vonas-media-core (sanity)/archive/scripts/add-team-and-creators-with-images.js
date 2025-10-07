const {createClient} = require('@sanity/client')
const {nanoid} = require('nanoid')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-08-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// Helper function to create proper block content
function createBlock(text) {
  return {
    _key: nanoid(),
    _type: 'block',
    children: [
      {
        _key: nanoid(),
        _type: 'span',
        marks: [],
        text: text
      }
    ],
    markDefs: [],
    style: 'normal'
  }
}

// Function to create placeholder profile images
function createProfileImageBuffer(color, initials, width = 200, height = 200) {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${initials}</text>
  </svg>`
  return Buffer.from(svg)
}

// Function to create creator banner images
function createBannerImageBuffer(color, text, width = 400, height = 200) {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color}AA;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${text}</text>
  </svg>`
  return Buffer.from(svg)
}

// Team member data
const teamMembersData = [
  {
    name: 'Sarah Chen',
    initials: 'SC',
    color: '#6366F1',
    role: 'Creative Director',
    bio: 'Sarah leads our creative vision with over 8 years of experience in digital content strategy and brand development.',
    email: 'sarah@vonas-media.com'
  },
  {
    name: 'Marcus Thompson',
    initials: 'MT',
    color: '#8B5CF6',
    role: 'Content Strategy Lead',
    bio: 'Marcus specializes in content strategy and audience engagement, helping creators build authentic connections.',
    email: 'marcus@vonas-media.com'
  },
  {
    name: 'Elena Rodriguez',
    initials: 'ER',
    color: '#EC4899',
    role: 'Social Media Manager',
    bio: 'Elena manages our social media presence and helps creators optimize their cross-platform strategies.',
    email: 'elena@vonas-media.com'
  },
  {
    name: 'David Kim',
    initials: 'DK',
    color: '#06B6D4',
    role: 'Technical Producer',
    bio: 'David handles the technical side of content production, from equipment to post-production workflows.',
    email: 'david@vonas-media.com'
  },
  {
    name: 'Zoe Williams',
    initials: 'ZW',
    color: '#10B981',
    role: 'Community Manager',
    bio: 'Zoe builds and nurtures our creator community, fostering collaboration and growth opportunities.',
    email: 'zoe@vonas-media.com'
  }
]

// Exclusive creators data
const exclusiveCreatorsData = [
  {
    name: 'Alex Park',
    initials: 'AP',
    color: '#F59E0B',
    banner: 'Tech Reviews & Tutorials',
    channel: 'TechFlow',
    category: 'Technology',
    followers: '2.1M',
    bio: 'Alex creates in-depth tech reviews and tutorials, making complex technology accessible to everyone.',
    platforms: ['YouTube', 'TikTok', 'Instagram']
  },
  {
    name: 'Maya Jensen',
    initials: 'MJ',
    color: '#EF4444',
    banner: 'Lifestyle & Wellness',
    channel: 'MindfulMaya',
    category: 'Lifestyle',
    followers: '1.8M',
    bio: 'Maya shares mindful living tips, wellness routines, and sustainable lifestyle choices.',
    platforms: ['Instagram', 'YouTube', 'TikTok']
  },
  {
    name: 'Jordan Cruz',
    initials: 'JC',
    color: '#7C3AED',
    banner: 'Gaming & Esports',
    channel: 'CruzControl',
    category: 'Gaming',
    followers: '3.2M',
    bio: 'Jordan covers the latest in gaming, esports tournaments, and indie game discoveries.',
    platforms: ['Twitch', 'YouTube', 'Twitter']
  },
  {
    name: 'Sage Taylor',
    initials: 'ST',
    color: '#059669',
    banner: 'Education & Learning',
    channel: 'LearnWithSage',
    category: 'Education',
    followers: '1.4M',
    bio: 'Sage makes learning fun with educational content spanning science, history, and creative skills.',
    platforms: ['YouTube', 'Instagram', 'TikTok']
  },
  {
    name: 'River Morgan',
    initials: 'RM',
    color: '#DC2626',
    banner: 'Art & Creativity',
    channel: 'RiverCreates',
    category: 'Art & Design',
    followers: '950K',
    bio: 'River showcases digital art techniques, design processes, and creative inspiration.',
    platforms: ['Instagram', 'YouTube', 'Pinterest']
  }
]

async function uploadTeamAndCreatorImages() {
  try {
    console.log('🖼️ Uploading team member profile images...')
    
    const teamImages = {}
    const creatorImages = {}
    const creatorBanners = {}
    
    // Upload team member images
    for (const member of teamMembersData) {
      const imageBuffer = createProfileImageBuffer(member.color, member.initials)
      const asset = await client.assets.upload('image', imageBuffer, {
        filename: `${member.initials.toLowerCase()}-profile.svg`,
        title: `${member.name} Profile Photo`,
      })
      teamImages[member.initials] = asset._id
      console.log(`   ✅ Uploaded: ${member.name} profile`)
    }
    
    // Upload creator profile images
    console.log('\\n🎨 Uploading exclusive creator images...')
    for (const creator of exclusiveCreatorsData) {
      // Profile image
      const profileBuffer = createProfileImageBuffer(creator.color, creator.initials)
      const profileAsset = await client.assets.upload('image', profileBuffer, {
        filename: `${creator.initials.toLowerCase()}-creator-profile.svg`,
        title: `${creator.name} Creator Profile`,
      })
      creatorImages[creator.initials] = profileAsset._id
      
      // Banner image
      const bannerBuffer = createBannerImageBuffer(creator.color, creator.banner)
      const bannerAsset = await client.assets.upload('image', bannerBuffer, {
        filename: `${creator.initials.toLowerCase()}-banner.svg`,
        title: `${creator.name} Banner`,
      })
      creatorBanners[creator.initials] = bannerAsset._id
      
      console.log(`   ✅ Uploaded: ${creator.name} profile & banner`)
    }
    
    return { teamImages, creatorImages, creatorBanners }
    
  } catch (error) {
    console.error('❌ Error uploading images:', error)
    return { teamImages: {}, creatorImages: {}, creatorBanners: {} }
  }
}

async function createTeamMembers(teamImages) {
  console.log('\\n👥 Creating team members...')
  
  for (const member of teamMembersData) {
    const teamMember = {
      _type: 'teamMember',
      _id: `team-${member.initials.toLowerCase()}`,
      name: member.name,
      role: member.role,
      bio: [createBlock(member.bio)],
      email: member.email,
      avatar: teamImages[member.initials] ? {
        _type: 'imageWithAlt',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: teamImages[member.initials]
          }
        },
        alt: `${member.name} profile photo`
      } : undefined
    }
    
    await client.createOrReplace(teamMember)
    console.log(`   ✅ Created: ${member.name} (${member.role})`)
  }
}

async function createExclusiveCreators(creatorImages, creatorBanners) {
  console.log('\\n🌟 Creating exclusive creators...')
  
  for (const creator of exclusiveCreatorsData) {
    const exclusiveCreator = {
      _type: 'exclusiveCreator',
      _id: `creator-${creator.initials.toLowerCase()}`,
      name: creator.name,
      channelName: creator.channel,
      category: creator.category,
      followerCount: creator.followers,
      bio: [createBlock(creator.bio)],
      socialPlatforms: creator.platforms,
      avatar: creatorImages[creator.initials] ? {
        _type: 'imageWithAlt',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: creatorImages[creator.initials]
          }
        },
        alt: `${creator.name} avatar`
      } : undefined,
      bannerImage: creatorBanners[creator.initials] ? {
        _type: 'imageWithAlt',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: creatorBanners[creator.initials]
          }
        },
        alt: `${creator.name} banner - ${creator.banner}`
      } : undefined
    }
    
    await client.createOrReplace(exclusiveCreator)
    console.log(`   ✅ Created: ${creator.name} (${creator.category})`)
  }
}

async function addTeamAndCreatorsWithImages() {
  try {
    console.log('🚀 Adding Team Members and Exclusive Creators with stock images...\\n')
    
    const { teamImages, creatorImages, creatorBanners } = await uploadTeamAndCreatorImages()
    
    await createTeamMembers(teamImages)
    await createExclusiveCreators(creatorImages, creatorBanners)
    
    console.log('\\n🎉 Successfully created Team Members and Exclusive Creators!')
    console.log(`📊 Added ${teamMembersData.length} team members and ${exclusiveCreatorsData.length} exclusive creators`)
    console.log('\\n👥 Team Members:')
    teamMembersData.forEach(member => {
      console.log(`   • ${member.name} - ${member.role}`)
    })
    console.log('\\n🌟 Exclusive Creators:')
    exclusiveCreatorsData.forEach(creator => {
      console.log(`   • ${creator.name} (${creator.channel}) - ${creator.category}`)
    })
    
  } catch (error) {
    console.error('❌ Error creating team and creators:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  addTeamAndCreatorsWithImages()
}

module.exports = { addTeamAndCreatorsWithImages }
