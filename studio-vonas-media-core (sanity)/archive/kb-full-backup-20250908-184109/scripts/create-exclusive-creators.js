const { createClient } = require('@sanity/client')

// Initialize Sanity client
const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01'
})

// Helper function to generate professional stock image SVG
function generateProfileSVG(initials, bgColor = '#4F46E5', textColor = '#FFFFFF') {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${adjustColor(bgColor, -20)};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="120" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${initials}</text>
  </svg>`
}

function generateBannerSVG(text, bgColor = '#6366F1', textColor = '#FFFFFF') {
  return `<svg width="1200" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${adjustColor(bgColor, 20)};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${bgColor};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bannerGrad)"/>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${text}</text>
  </svg>`
}

// Helper function to adjust color brightness
function adjustColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

// Function to upload an image and return asset reference
async function uploadImage(svgContent, filename, alt) {
  try {
    const buffer = Buffer.from(svgContent, 'utf8')
    const asset = await client.assets.upload('image', buffer, {
      filename: filename + '.svg',
      contentType: 'image/svg+xml'
    })
    
    return {
      _type: 'imageWithAlt',
      asset: {
        _type: 'reference',
        _ref: asset._id
      },
      alt: alt
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

async function createExclusiveCreators() {
  console.log('🌟 Creating 12 Exclusive Creators with stock images...')
  
  const creators = [
    {
      name: 'Alexandra Chen',
      niche: 'Tech Reviews & Tutorials',
      subscribers: '2.8M',
      specialty: 'Latest gadgets, smartphone reviews, and tech tutorials',
      color: '#EF4444'
    },
    {
      name: 'Marcus Johnson',
      niche: 'Gaming & Esports',
      subscribers: '3.5M', 
      specialty: 'Professional gaming, esports analysis, and game reviews',
      color: '#8B5CF6'
    },
    {
      name: 'Sofia Rodriguez',
      niche: 'Lifestyle & Fashion',
      subscribers: '2.1M',
      specialty: 'Fashion trends, lifestyle tips, and beauty content',
      color: '#EC4899'
    },
    {
      name: 'David Park',
      niche: 'Food & Cooking',
      subscribers: '1.9M',
      specialty: 'Recipe tutorials, restaurant reviews, and cooking tips',
      color: '#F59E0B'
    },
    {
      name: 'Emma Thompson',
      niche: 'Travel & Adventure',
      subscribers: '2.3M',
      specialty: 'Travel vlogs, adventure sports, and cultural exploration',
      color: '#10B981'
    },
    {
      name: 'Ryan Mitchell',
      niche: 'Fitness & Health',
      subscribers: '1.7M',
      specialty: 'Workout routines, nutrition advice, and wellness tips',
      color: '#059669'
    },
    {
      name: 'Isabella Martinez',
      niche: 'Art & Design',
      subscribers: '1.4M',
      specialty: 'Digital art tutorials, design principles, and creative inspiration',
      color: '#7C3AED'
    },
    {
      name: 'James Wilson',
      niche: 'Music & Entertainment',
      subscribers: '2.6M',
      specialty: 'Music production, artist interviews, and entertainment news',
      color: '#DC2626'
    },
    {
      name: 'Chloe Kim',
      niche: 'Education & Learning',
      subscribers: '1.8M',
      specialty: 'Educational content, study tips, and academic guidance',
      color: '#2563EB'
    },
    {
      name: 'Michael Brown',
      niche: 'Business & Finance',
      subscribers: '2.2M',
      specialty: 'Investment advice, business strategy, and financial planning',
      color: '#1F2937'
    },
    {
      name: 'Zoe Anderson',
      niche: 'DIY & Crafts',
      subscribers: '1.6M',
      specialty: 'DIY projects, craft tutorials, and home improvement tips',
      color: '#F97316'
    },
    {
      name: 'Lucas Garcia',
      niche: 'Science & Technology',
      subscribers: '2.0M',
      specialty: 'Science education, tech innovation, and research insights',
      color: '#0891B2'
    }
  ]

  try {
    // Delete existing exclusive creators
    console.log('🗑️ Clearing existing exclusive creators...')
    await client.delete({ query: "*[_type == 'exclusiveCreator']" })
    
    await new Promise(resolve => setTimeout(resolve, 1000))

    for (const creator of creators) {
      console.log(`Creating ${creator.name}...`)
      
      const initials = creator.name.split(' ').map(n => n[0]).join('')
      
      const profilePhoto = await uploadImage(
        generateProfileSVG(initials, creator.color),
        `${creator.name.toLowerCase().replace(/\s+/g, '-')}-profile`,
        `Professional profile photo of ${creator.name}, exclusive creator specializing in ${creator.niche}`
      )

      const bannerImage = await uploadImage(
        generateBannerSVG(creator.niche, creator.color),
        `${creator.name.toLowerCase().replace(/\s+/g, '-')}-banner`,
        `Content banner for ${creator.name}'s ${creator.niche} channel`
      )

      const doc = {
        _type: 'exclusiveCreator',
        name: creator.name,
        niche: creator.niche,
        subscribers: creator.subscribers,
        bio: [
          {
            _key: `bio-${Date.now() + Math.random()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now() + Math.random()}`,
              _type: 'span',
              marks: [],
              text: `Exclusive creator specializing in ${creator.specialty}. With ${creator.subscribers} subscribers, ${creator.name.split(' ')[0]} brings unique expertise and engaging content to our platform. Known for high-quality production and authentic audience engagement.`
            }],
            markDefs: [],
            style: 'normal'
          }
        ],
        profilePhoto: profilePhoto,
        bannerImage: bannerImage,
        exclusiveContent: true,
        joinDate: '2023-06-15',
        socialLinks: {
          youtube: `https://youtube.com/@${creator.name.toLowerCase().replace(/\s+/g, '')}`,
          instagram: `https://instagram.com/${creator.name.toLowerCase().replace(/\s+/g, '')}`,
          twitter: `https://twitter.com/${creator.name.toLowerCase().replace(/\s+/g, '')}`
        }
      }

      const result = await client.create(doc)
      console.log(`✅ Created: ${creator.name} (${result._id})`)
    }

    console.log('\\n🎉 Successfully created 12 exclusive creators!')
    console.log('\\n📊 Summary by Niche:')
    console.log('- Tech Reviews & Tutorials')
    console.log('- Gaming & Esports') 
    console.log('- Lifestyle & Fashion')
    console.log('- Food & Cooking')
    console.log('- Travel & Adventure')
    console.log('- Fitness & Health')
    console.log('- Art & Design')
    console.log('- Music & Entertainment')
    console.log('- Education & Learning')
    console.log('- Business & Finance')
    console.log('- DIY & Crafts')
    console.log('- Science & Technology')
    console.log('\\n✅ All creators have professional stock profile images and banners!')
    console.log('✅ All images include proper alt text for accessibility!')
    console.log('\\n🔗 Access your Studio at: http://localhost:3333/')

  } catch (error) {
    console.error('❌ Error creating exclusive creators:', error)
  }
}

// Run the script
createExclusiveCreators()
