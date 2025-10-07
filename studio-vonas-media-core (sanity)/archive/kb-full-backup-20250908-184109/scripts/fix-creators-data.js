const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01'
})

// Generate high-quality SVG images
function generateProfileSVG(initials, bgColor = '#4F46E5', size = 400) {
  const gradient1 = adjustColor(bgColor, 20)
  const gradient2 = adjustColor(bgColor, -20)
  
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="profileGrad${Date.now()}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${gradient1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${gradient2};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow${Date.now()}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.2)"/>
      </filter>
    </defs>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2-10}" fill="url(#profileGrad${Date.now()})" filter="url(#shadow${Date.now()})"/>
    <circle cx="${size/2}" cy="${size/2-20}" r="50" fill="white" opacity="0.15"/>
    <text x="50%" y="58%" font-family="Inter, Arial, sans-serif" font-size="${size/4}" font-weight="600" 
          text-anchor="middle" dominant-baseline="middle" fill="white">${initials}</text>
  </svg>`
}

function generateHeroSVG(name, niche, bgColor = '#6366F1') {
  return `<svg width="1200" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heroGrad${Date.now()}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:${adjustColor(bgColor, -30)};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#heroGrad${Date.now()})"/>
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
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      },
      alt: alt
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

async function fixCreatorsData() {
  console.log('🔧 Fixing Exclusive Creators Data...')
  
  // Creator data with colors for images
  const creatorsData = {
    "Alexandra Chen": { color: "#EF4444", niche: "Tech Reviews & Tutorials", headline: "Your trusted guide to the latest in technology" },
    "Marcus Johnson": { color: "#8B5CF6", niche: "Gaming & Esports", headline: "Elite gaming content and esports analysis" },
    "Sofia Rodriguez": { color: "#EC4899", niche: "Lifestyle & Fashion", headline: "Sustainable style and authentic living" },
    "David Park": { color: "#F59E0B", niche: "Food & Cooking", headline: "Bringing restaurant-quality cooking to your kitchen" },
    "Emma Thompson": { color: "#10B981", niche: "Travel & Adventure", headline: "Exploring the world one adventure at a time" },
    "Ryan Mitchell": { color: "#059669", niche: "Fitness & Health", headline: "Transform your body, elevate your mind" },
    "Isabella Martinez": { color: "#7C3AED", niche: "Art & Design", headline: "Unleashing creativity through digital artistry" },
    "James Wilson": { color: "#DC2626", niche: "Music & Entertainment", headline: "Behind the beats: music production mastery" },
    "Chloe Kim": { color: "#2563EB", niche: "Education & Learning", headline: "Making learning accessible and enjoyable" },
    "Michael Brown": { color: "#1F2937", niche: "Business & Finance", headline: "Building wealth through smart financial decisions" }
  }

  try {
    // Get all existing exclusive creators
    console.log('📋 Fetching existing creators...')
    const existingCreators = await client.fetch('*[_type == "exclusiveCreator"]')
    
    console.log(`Found ${existingCreators.length} creators to fix`)
    
    for (const creator of existingCreators) {
      console.log(`Fixing ${creator.name}...`)
      
      const creatorData = creatorsData[creator.name]
      if (!creatorData) {
        console.log(`⚠️  No data found for ${creator.name}, skipping...`)
        continue
      }
      
      const initials = creator.name.split(' ').map(n => n[0]).join('')
      const slug = creator.name.toLowerCase().replace(/\s+/g, '-')
      
      // Upload hero image
      const heroImage = await uploadImage(
        generateHeroSVG(creator.name, creatorData.niche, creatorData.color),
        `${slug}-hero-fixed`,
        `Hero banner for ${creator.name}, ${creatorData.niche} content creator`
      )
      
      // Create the update data
      const updateData = {
        // Add missing slug
        slug: {
          _type: 'slug',
          current: slug
        },
        // Add headline if missing
        headline: creatorData.headline,
        // Add hero image with proper structure
        heroImage: heroImage,
        // Ensure niche is set
        niche: creatorData.niche || creator.niche,
        // Add niches array based on niche
        niches: creatorData.niche ? [creatorData.niche.toLowerCase().split(' ')[0]] : [],
      }
      
      // Update the creator
      const result = await client
        .patch(creator._id)
        .set(updateData)
        .commit()
      
      console.log(`✅ Fixed: ${creator.name} (${result._id})`)
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log('\\n🎉 Successfully fixed all exclusive creators!')
    console.log('\\n✅ Updates made:')
    console.log('   - Added slugs for all creators')
    console.log('   - Added hero images with proper imageWithAlt structure')
    console.log('   - Added headlines')
    console.log('   - Fixed niche fields')
    console.log('   - Added niches arrays')
    console.log('\\n🔗 Check the studio: http://localhost:3333/')
    
  } catch (error) {
    console.error('❌ Error fixing creators:', error)
  }
}

fixCreatorsData()
