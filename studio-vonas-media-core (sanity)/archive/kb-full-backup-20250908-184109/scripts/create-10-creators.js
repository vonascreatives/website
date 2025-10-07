const { getCliClient } = require('sanity/cli')

// Use the CLI client which should have proper authentication
const client = getCliClient()

// Helper function to generate professional SVG avatars
function generateProfileSVG(initials, bgColor = '#4F46E5') {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${adjustBrightness(bgColor, -20)};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <circle cx="200" cy="150" r="60" fill="white" opacity="0.1"/>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="120" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="white">${initials}</text>
  </svg>`
}

function generateBannerSVG(text, bgColor = '#6366F1') {
  return `<svg width="1200" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${adjustBrightness(bgColor, 20)};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${bgColor};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bannerGrad)"/>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="white">${text}</text>
  </svg>`
}

function adjustBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

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

async function create10ExclusiveCreators() {
  console.log('🚀 Creating 10 Exclusive Creators...')
  
  const creators = [
    {
      name: "Alexandra Chen",
      niche: "Tech Reviews & Tutorials", 
      subscribers: "2.8M",
      bio: "Leading tech reviewer specializing in smartphone reviews, gadget tutorials, and emerging technology analysis. Known for detailed technical breakdowns and honest product assessments.",
      color: "#EF4444"
    },
    {
      name: "Marcus Johnson", 
      niche: "Gaming & Esports",
      subscribers: "3.5M",
      bio: "Professional gamer and esports analyst covering competitive gaming, game reviews, and industry insights. Former pro player with expertise in FPS and strategy games.",
      color: "#8B5CF6"
    },
    {
      name: "Sofia Rodriguez",
      niche: "Lifestyle & Fashion",
      subscribers: "2.1M", 
      bio: "Fashion influencer and lifestyle content creator sharing style tips, beauty tutorials, and wellness advice. Focus on sustainable fashion and authentic lifestyle content.",
      color: "#EC4899"
    },
    {
      name: "David Park",
      niche: "Food & Cooking",
      subscribers: "1.9M",
      bio: "Chef and culinary educator creating recipe tutorials, cooking techniques, and restaurant reviews. Specializes in fusion cuisine and accessible cooking for home chefs.",
      color: "#F59E0B"
    },
    {
      name: "Emma Thompson",
      niche: "Travel & Adventure",
      subscribers: "2.3M",
      bio: "Adventure travel vlogger documenting global destinations, cultural experiences, and outdoor activities. Promotes sustainable travel and cultural awareness.",
      color: "#10B981"
    },
    {
      name: "Ryan Mitchell", 
      niche: "Fitness & Health",
      subscribers: "1.7M",
      bio: "Certified personal trainer and nutritionist sharing workout routines, health tips, and wellness advice. Focus on sustainable fitness and mental health awareness.",
      color: "#059669"
    },
    {
      name: "Isabella Martinez",
      niche: "Art & Design",
      subscribers: "1.4M",
      bio: "Digital artist and design educator creating tutorials on illustration, graphic design, and creative workflows. Specializes in Adobe Creative Suite and digital art techniques.",
      color: "#7C3AED"
    },
    {
      name: "James Wilson",
      niche: "Music & Entertainment", 
      subscribers: "2.6M",
      bio: "Music producer and entertainment journalist covering music industry news, artist interviews, and production tutorials. Expert in electronic music and audio engineering.",
      color: "#DC2626"
    },
    {
      name: "Chloe Kim",
      niche: "Education & Learning",
      subscribers: "1.8M", 
      bio: "Educational content creator and former teacher developing study guides, academic tutorials, and learning strategies. Focus on STEM education and student success.",
      color: "#2563EB"
    },
    {
      name: "Michael Brown",
      niche: "Business & Finance",
      subscribers: "2.2M",
      bio: "Financial advisor and business strategist sharing investment advice, market analysis, and entrepreneurship insights. Expertise in personal finance and startup guidance.",
      color: "#1F2937"
    }
  ]

  try {
    // Clear existing creators first
    console.log('🗑️ Clearing existing exclusive creators...')
    await client.delete({ query: "*[_type == 'exclusiveCreator']" })
    await new Promise(resolve => setTimeout(resolve, 2000))

    for (const creator of creators) {
      console.log(`Creating ${creator.name}...`)
      
      const initials = creator.name.split(' ').map(n => n[0]).join('')
      
      // Upload profile photo
      const profilePhoto = await uploadImage(
        generateProfileSVG(initials, creator.color),
        `${creator.name.toLowerCase().replace(/\s+/g, '-')}-profile`,
        `Professional profile photo of ${creator.name}, exclusive creator specializing in ${creator.niche}`
      )

      // Upload banner image  
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
            _key: `bio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              _type: 'span',
              marks: [],
              text: creator.bio
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

    console.log('\n🎉 Successfully created 10 exclusive creators!')
    console.log('\n📊 Creators by niche:')
    creators.forEach((creator, i) => {
      console.log(`${i + 1}. ${creator.name} - ${creator.niche} (${creator.subscribers})`)
    })
    console.log('\n✅ All creators have stock profile images and banners with proper alt text!')
    
  } catch (error) {
    console.error('❌ Error creating creators:', error)
    console.log('\n📝 Manual creation instructions:')
    console.log('1. Go to http://localhost:3333/')
    console.log('2. Navigate to Team → Exclusive Creators') 
    console.log('3. Create each creator manually using the data above')
  }
}

create10ExclusiveCreators()
