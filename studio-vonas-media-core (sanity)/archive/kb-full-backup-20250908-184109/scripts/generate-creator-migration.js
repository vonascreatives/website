const { createClient } = require('@sanity/client')
const fs = require('fs')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

// Same helper functions as before
function mapNicheToMainCategory(niche) {
  const nicheMapping = {
    'Tech Reviews & Tutorials': 'technology',
    'Gaming & Esports': 'gaming', 
    'Lifestyle & Fashion': 'fashion-and-style',
    'Food & Cooking': 'food-and-cooking',
    'Travel & Adventure': 'travel-and-adventure',
    'Fitness & Health': 'fitness-and-health',
    'Art & Design': 'art-and-design',
    'Music & Entertainment': 'comedy-and-entertainment',
    'Education & Learning': 'lifestyle',
    'Business & Finance': 'business-and-finance',
    'DIY & Crafts': 'lifestyle',
    'Science & Technology': 'technology'
  }
  return nicheMapping[niche] || 'lifestyle'
}

function createPlatformMetrics(followers) {
  if (!followers || typeof followers !== 'string') {
    return [
      { _key: 'youtube-metrics', platform: 'youtube', followers: 60000, engagement: 6.5 },
      { _key: 'instagram-metrics', platform: 'instagram', followers: 40000, engagement: 5.2 }
    ]
  }
  const numFollowers = parseFloat(followers) * (followers.includes('M') ? 1000000 : 1000)
  
  return [
    {
      _key: 'youtube-metrics',
      platform: 'youtube', 
      followers: Math.floor(numFollowers * 0.6),
      engagement: parseFloat((Math.random() * 5 + 3).toFixed(1))
    },
    {
      _key: 'instagram-metrics',
      platform: 'instagram',
      followers: Math.floor(numFollowers * 0.4), 
      engagement: parseFloat((Math.random() * 4 + 4).toFixed(1))
    }
  ]
}

function createSocialLinks(name) {
  const slug = name.toLowerCase().replace(/\s+/g, '')
  return [
    {
      _key: 'youtube-link',
      platform: 'youtube',
      url: `https://youtube.com/@${slug}`,
      handle: `@${slug}`
    },
    {
      _key: 'instagram-link', 
      platform: 'instagram',
      url: `https://instagram.com/${slug}`,
      handle: `@${slug}`
    }
  ]
}

function getBioText(bio) {
  if (!bio) return null
  if (typeof bio === 'string') return bio
  if (Array.isArray(bio)) {
    return bio.map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map(child => child.text).join('')
      }
      return ''
    }).join(' ').trim()
  }
  return null
}

async function generateMigrationData() {
  console.log('🚀 Generating migration data...')
  
  try {
    const exclusiveCreators = await client.fetch(`
      *[_type == "exclusiveCreator"] {
        _id,
        name,
        niche,
        subscribers,
        bio,
        heroImage,
        banner,
        specialty,
        _createdAt,
        _updatedAt
      }
    `)
    
    console.log(`📊 Found ${exclusiveCreators.length} exclusiveCreator documents`)
    
    const ndjsonLines = []
    
    for (const oldCreator of exclusiveCreators) {
      const slug = oldCreator.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      const newCreator = {
        _type: 'creator',
        _id: `creator-${slug}`,
        name: oldCreator.name,
        slug: {
          _type: 'slug',
          current: slug
        },
        headline: `${oldCreator.niche || 'Content'} specialist with ${oldCreator.subscribers || '100K+'} followers`,
        bio: getBioText(oldCreator.bio) || `Expert content creator specializing in ${oldCreator.niche || 'digital content'}. ${oldCreator.specialty || 'Creating engaging content for millions of followers worldwide.'}`,
        mainCategory: mapNicheToMainCategory(oldCreator.niche),
        niches: [oldCreator.niche ? oldCreator.niche.toLowerCase().replace(/\s+/g, '-') : 'general'],
        location: 'United States',
        availability: {
          status: 'open',
          responseTime: '24 hours'
        },
        featured: Math.random() > 0.7,
        
        images: oldCreator.heroImage ? [{
          _key: 'profile-image',
          ...oldCreator.heroImage,
          alt: oldCreator.heroImage.alt || `Profile photo of ${oldCreator.name}`
        }] : [],
        
        socialLinks: createSocialLinks(oldCreator.name),
        platforms: createPlatformMetrics(oldCreator.subscribers),
        
        packages: [
          {
            _key: 'basic-package',
            name: 'Content Creation',
            price: Math.floor(Math.random() * 2000) + 1000,
            description: `Professional ${(oldCreator.niche || 'content').toLowerCase()} creation`,
            deliverables: [
              '1 high-quality video/post',
              'Social media promotion', 
              'Performance analytics'
            ]
          },
          {
            _key: 'premium-package',
            name: 'Brand Partnership',
            price: Math.floor(Math.random() * 3000) + 2000,
            description: `Complete brand collaboration in ${(oldCreator.niche || 'content').toLowerCase()}`,
            deliverables: [
              'Multiple content pieces',
              'Cross-platform promotion',
              'Dedicated brand integration',
              'Performance report'
            ]
          }
        ],
        
        seo: {
          title: `${oldCreator.name} - ${oldCreator.niche || 'Content'} Creator | Vonas Media`,
          description: `Partner with ${oldCreator.name}, a top ${(oldCreator.niche || 'content').toLowerCase()} creator with ${oldCreator.subscribers || '100K+'} followers. Professional content creation and brand collaborations.`,
          keywords: [
            oldCreator.name.toLowerCase(),
            (oldCreator.niche || 'content').toLowerCase(),
            'content creator',
            'brand collaboration',
            'social media influencer'
          ]
        }
      }
      
      ndjsonLines.push(JSON.stringify(newCreator))
      console.log(`✅ Generated creator: ${oldCreator.name}`)
    }
    
    // Write to file
    const ndjsonContent = ndjsonLines.join('\n')
    fs.writeFileSync('creator-migration.ndjson', ndjsonContent)
    
    console.log(`📝 Generated migration file: creator-migration.ndjson`)
    console.log(`📊 Created ${ndjsonLines.length} creator records`)
    console.log('\n🚀 To import, run:')
    console.log('  npx sanity dataset import creator-migration.ndjson production --replace')
    
  } catch (error) {
    console.error('❌ Generation failed:', error)
  }
}

generateMigrationData()
