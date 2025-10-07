const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

// Mapping function for niche to mainCategory
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

// Function to normalize metrics
function createPlatformMetrics(followers) {
  // Extract number from followers string (e.g., "2.8M" -> 2800000)
  if (!followers || typeof followers !== 'string') {
    // Default to 100K followers if no data
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

// Function to extract text from bio (handles string, array, or rich text)
function getBioText(bio) {
  if (!bio) return null
  if (typeof bio === 'string') return bio
  if (Array.isArray(bio)) {
    // Extract text from rich text blocks
    return bio.map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map(child => child.text).join('')
      }
      return ''
    }).join(' ').trim()
  }
  return null
}

// Function to create social links
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

async function migrateExclusiveCreatorsToCreators() {
  console.log('🚀 Starting migration from exclusiveCreator to creator schema...')
  
  try {
    // Fetch all exclusiveCreator documents
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
    
    console.log(`📊 Found ${exclusiveCreators.length} exclusiveCreator documents to migrate`)
    
    if (exclusiveCreators.length === 0) {
      console.log('ℹ️ No exclusiveCreator documents found. Creating sample data first...')
      
      // Run the creator creation script first
      const { execSync } = require('child_process')
      execSync('node scripts/create-exclusive-creators.js', { stdio: 'inherit' })
      
      // Re-fetch after creation
      const newExclusiveCreators = await client.fetch(`
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
      
      console.log(`📊 Now found ${newExclusiveCreators.length} exclusiveCreator documents`)
      exclusiveCreators.push(...newExclusiveCreators)
    }
    
    // Check if creator documents already exist
    const existingCreators = await client.fetch(`*[_type == "creator"] { _id, name }`)
    if (existingCreators.length > 0) {
      console.log(`⚠️ Found ${existingCreators.length} existing creator documents. Skipping migration.`)
      console.log('To force migration, delete existing creator documents first.')
      return
    }
    
    const creatorDocs = []
    
    // Transform each exclusiveCreator to creator
    for (const oldCreator of exclusiveCreators) {
      console.log(`🔄 Processing ${oldCreator.name}...`)
      
      const slug = oldCreator.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      const newCreator = {
        _type: 'creator',
        name: oldCreator.name,
        slug: {
          _type: 'slug',
          current: slug
        },
        headline: `${oldCreator.niche || 'Content'} specialist with ${oldCreator.subscribers || '100K+'} followers`,
        bio: getBioText(oldCreator.bio) || `Expert content creator specializing in ${oldCreator.niche || 'digital content'}. ${oldCreator.specialty || 'Creating engaging content for millions of followers worldwide.'}`,
        mainCategory: mapNicheToMainCategory(oldCreator.niche),
        niches: [oldCreator.niche ? oldCreator.niche.toLowerCase().replace(/\s+/g, '-') : 'general'],
        location: 'United States', // Default location
        availability: {
          status: 'open',
          responseTime: '24 hours'
        },
        featured: Math.random() > 0.7, // 30% chance of being featured
        
        // Images
        images: oldCreator.heroImage ? [{
          _key: 'profile-image',
          ...oldCreator.heroImage,
          alt: oldCreator.heroImage.alt || `Profile photo of ${oldCreator.name}`
        }] : [],
        
        // Social Links
        socialLinks: createSocialLinks(oldCreator.name),
        
        // Platform metrics
        platforms: createPlatformMetrics(oldCreator.subscribers),
        
        // Sample packages
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
        
        // SEO
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
      
      creatorDocs.push(newCreator)
    }
    
    // Create all creator documents in a transaction
    console.log(`📝 Creating ${creatorDocs.length} creator documents...`)
    
    const transaction = client.transaction()
    creatorDocs.forEach(doc => {
      transaction.create(doc)
    })
    
    const result = await transaction.commit()
    
    console.log('✅ Migration completed successfully!')
    console.log(`📊 Created ${result.length} creator documents`)
    
    // Log the created creators
    result.forEach((doc, index) => {
      console.log(`  ${index + 1}. ${doc.name} (${doc.mainCategory})`)
    })
    
    console.log('\n🎉 Migration Summary:')
    console.log(`  • Migrated ${exclusiveCreators.length} exclusiveCreator documents`)
    console.log(`  • Created ${result.length} new creator documents`) 
    console.log(`  • Applied schema transformations:`)
    console.log(`    - Niche mapping to mainCategory enums`)
    console.log(`    - Normalized platform metrics`)
    console.log(`    - Generated social links`)
    console.log(`    - Created package offerings`)
    console.log(`    - Added SEO metadata`)
    
    console.log('\n🚀 Next steps:')
    console.log('  1. Visit your Next.js app at http://localhost:3000/creators')
    console.log('  2. Verify creator data displays correctly')
    console.log('  3. Test filtering and search functionality')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    if (error.details) {
      console.error('Error details:', error.details)
    }
  }
}

// Run the migration
if (require.main === module) {
  migrateExclusiveCreatorsToCreators()
}
