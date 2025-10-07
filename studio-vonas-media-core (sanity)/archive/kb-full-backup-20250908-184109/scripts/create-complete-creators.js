const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01'
})

// Helper to generate high-quality SVG profile images
function generateProfileSVG(initials, bgColor = '#4F46E5', size = 400) {
  const gradient1 = adjustColor(bgColor, 20)
  const gradient2 = adjustColor(bgColor, -20)
  
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${gradient1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${gradient2};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.2)"/>
      </filter>
    </defs>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2-10}" fill="url(#profileGrad)" filter="url(#shadow)"/>
    <circle cx="${size/2}" cy="${size/2-20}" r="50" fill="white" opacity="0.15"/>
    <text x="50%" y="58%" font-family="Inter, Arial, sans-serif" font-size="${size/4}" font-weight="600" 
          text-anchor="middle" dominant-baseline="middle" fill="white">${initials}</text>
  </svg>`
}

function generateHeroSVG(name, niche, bgColor = '#6366F1') {
  return `<svg width="1200" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:${adjustColor(bgColor, -30)};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#heroGrad)"/>
    <circle cx="200" cy="100" r="80" fill="white" opacity="0.1"/>
    <circle cx="1000" cy="300" r="120" fill="white" opacity="0.05"/>
    <text x="50%" y="40%" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="700" 
          text-anchor="middle" fill="white">${name}</text>
    <text x="50%" y="65%" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="400" 
          text-anchor="middle" fill="rgba(255,255,255,0.9)">${niche}</text>
  </svg>`
}

function adjustColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt))
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
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

async function createCompleteCreators() {
  console.log('🚀 Creating 10 Complete Exclusive Creators with Images...')
  
  const creators = [
    {
      name: "Alexandra Chen",
      niche: "Tech Reviews & Tutorials",
      niches: ["tech", "education"],
      subscribers: "2.8M",
      bio: "Leading tech reviewer specializing in smartphone reviews, gadget tutorials, and emerging technology analysis. Known for detailed technical breakdowns and honest product assessments that help consumers make informed decisions.",
      location: "San Francisco, CA",
      languages: ["English", "Mandarin"],
      color: "#EF4444",
      headline: "Your trusted guide to the latest in technology"
    },
    {
      name: "Marcus Johnson", 
      niche: "Gaming & Esports",
      niches: ["gaming", "sports", "entertainment"],
      subscribers: "3.5M",
      bio: "Professional gamer and esports analyst covering competitive gaming, game reviews, and industry insights. Former pro player with expertise in FPS and strategy games, now helping others improve their gameplay.",
      location: "Los Angeles, CA",
      languages: ["English"],
      color: "#8B5CF6",
      headline: "Elite gaming content and esports analysis"
    },
    {
      name: "Sofia Rodriguez",
      niche: "Lifestyle & Fashion",
      niches: ["lifestyle", "fashion", "beauty"],
      subscribers: "2.1M", 
      bio: "Fashion influencer and lifestyle content creator sharing style tips, beauty tutorials, and wellness advice. Focus on sustainable fashion and authentic lifestyle content that inspires positive change.",
      location: "Miami, FL",
      languages: ["English", "Spanish"],
      color: "#EC4899",
      headline: "Sustainable style and authentic living"
    },
    {
      name: "David Park",
      niche: "Food & Cooking",
      niches: ["food", "lifestyle"],
      subscribers: "1.9M",
      bio: "Chef and culinary educator creating recipe tutorials, cooking techniques, and restaurant reviews. Specializes in fusion cuisine and accessible cooking for home chefs of all skill levels.",
      location: "New York, NY",
      languages: ["English", "Korean"],
      color: "#F59E0B",
      headline: "Bringing restaurant-quality cooking to your kitchen"
    },
    {
      name: "Emma Thompson",
      niche: "Travel & Adventure",
      niches: ["travel", "documentary", "lifestyle"],
      subscribers: "2.3M",
      bio: "Adventure travel vlogger documenting global destinations, cultural experiences, and outdoor activities. Promotes sustainable travel and cultural awareness through immersive storytelling.",
      location: "London, UK",
      languages: ["English", "French", "Spanish"],
      color: "#10B981",
      headline: "Exploring the world one adventure at a time"
    },
    {
      name: "Ryan Mitchell", 
      niche: "Fitness & Health",
      niches: ["fitness", "lifestyle"],
      subscribers: "1.7M",
      bio: "Certified personal trainer and nutritionist sharing workout routines, health tips, and wellness advice. Focus on sustainable fitness and mental health awareness for long-term well-being.",
      location: "Austin, TX",
      languages: ["English"],
      color: "#059669",
      headline: "Transform your body, elevate your mind"
    },
    {
      name: "Isabella Martinez",
      niche: "Art & Design",
      niches: ["art", "education"],
      subscribers: "1.4M",
      bio: "Digital artist and design educator creating tutorials on illustration, graphic design, and creative workflows. Specializes in Adobe Creative Suite and digital art techniques for beginners to professionals.",
      location: "Barcelona, Spain",
      languages: ["Spanish", "English"],
      color: "#7C3AED",
      headline: "Unleashing creativity through digital artistry"
    },
    {
      name: "James Wilson",
      niche: "Music & Entertainment", 
      niches: ["music", "entertainment"],
      subscribers: "2.6M",
      bio: "Music producer and entertainment journalist covering music industry news, artist interviews, and production tutorials. Expert in electronic music and audio engineering with 15+ years experience.",
      location: "Nashville, TN",
      languages: ["English"],
      color: "#DC2626",
      headline: "Behind the beats: music production mastery"
    },
    {
      name: "Chloe Kim",
      niche: "Education & Learning",
      niches: ["education", "science"],
      subscribers: "1.8M", 
      bio: "Educational content creator and former teacher developing study guides, academic tutorials, and learning strategies. Focus on STEM education and student success through engaging, accessible content.",
      location: "Seattle, WA",
      languages: ["English", "Korean"],
      color: "#2563EB",
      headline: "Making learning accessible and enjoyable"
    },
    {
      name: "Michael Brown",
      niche: "Business & Finance",
      niches: ["business", "education"],
      subscribers: "2.2M",
      bio: "Financial advisor and business strategist sharing investment advice, market analysis, and entrepreneurship insights. Expertise in personal finance and startup guidance for aspiring entrepreneurs.",
      location: "Chicago, IL",
      languages: ["English"],
      color: "#1F2937",
      headline: "Building wealth through smart financial decisions"
    }
  ]

  try {
    // Clear existing creators
    console.log('🗑️ Clearing existing exclusive creators...')
    await client.delete({ query: "*[_type == 'exclusiveCreator']" })
    await new Promise(resolve => setTimeout(resolve, 2000))

    for (const creator of creators) {
      console.log(`Creating ${creator.name}...`)
      
      const initials = creator.name.split(' ').map(n => n[0]).join('')
      const slug = creator.name.toLowerCase().replace(/\s+/g, '-')
      
      // Upload hero image
      const heroImage = await uploadImage(
        generateHeroSVG(creator.name, creator.niche, creator.color),
        `${slug}-hero`,
        `Hero banner for ${creator.name}, ${creator.niche} content creator`
      )

      // Upload profile photo
      const profileImage = await uploadImage(
        generateProfileSVG(initials, creator.color),
        `${slug}-profile`,
        `Professional profile photo of ${creator.name}, exclusive creator specializing in ${creator.niche}`
      )

      const doc = {
        _type: 'exclusiveCreator',
        name: creator.name,
        slug: {
          _type: 'slug',
          current: slug
        },
        headline: creator.headline,
        heroImage: heroImage,
        niche: creator.niche,
        niches: creator.niches,
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
        location: creator.location,
        languages: creator.languages,
        joinDate: '2023-06-15',
        exclusiveContent: true,
        featured: Math.random() > 0.5,
        gallery: [heroImage, profileImage].filter(Boolean),
        socialLinks: {
          youtube: `https://youtube.com/@${slug}`,
          instagram: `https://instagram.com/${slug}`,
          twitter: `https://twitter.com/${slug}`,
          website: `https://${slug}.com`
        },
        metrics: [
          {
            _key: `metric-${Date.now()}`,
            _type: 'platformMetrics',
            platform: 'YouTube',
            followers: parseInt(creator.subscribers.replace(/[^\d]/g, '')) * (creator.subscribers.includes('M') ? 1000000 : 1000),
            engagement: Math.round((Math.random() * 5 + 3) * 100) / 100
          }
        ],
        totalFollowers: parseInt(creator.subscribers.replace(/[^\d]/g, '')) * (creator.subscribers.includes('M') ? 1000000 : 1000),
        availability: 'open',
        contactEmail: `${slug}@vonasmedia.com`
      }

      const result = await client.create(doc)
      console.log(`✅ Created: ${creator.name} (${result._id})`)
    }

    console.log('\n🎉 Successfully created 10 complete exclusive creators!')
    console.log('\n📊 Summary:')
    creators.forEach((creator, i) => {
      console.log(`${i + 1}. ${creator.name}`)
      console.log(`   - Niche: ${creator.niche}`)
      console.log(`   - Subscribers: ${creator.subscribers}`)
      console.log(`   - Location: ${creator.location}`)
      console.log(`   - Languages: ${creator.languages.join(', ')}`)
    })
    console.log('\n✅ All creators have:')
    console.log('   - Hero images with proper alt text')
    console.log('   - Complete profile information')
    console.log('   - Social media links')
    console.log('   - Platform metrics')
    console.log('   - Rich bio content')
    console.log('\n🔗 Access Studio: http://localhost:3333/')
    console.log('🌐 Live Studio: https://vonas-media.sanity.studio/')
    
  } catch (error) {
    console.error('❌ Error creating creators:', error)
  }
}

createCompleteCreators()
