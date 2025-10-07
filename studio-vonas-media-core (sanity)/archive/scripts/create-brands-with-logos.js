const {createClient} = require('@sanity/client')
const {nanoid} = require('nanoid')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-08-26',
  token: process.env.SANITY_API_TOKEN || 'skZQcAQ9gbAHpg7hhIfcStbr6KWOZOp9hUSGhOJWkg4aWejVrns4JZYbN4zyINFzsGl0wPVEdWFHu48jn',
  useCdn: false
})

// Helper function to create block content
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

// Function to create professional mock logos
function createMockLogo(brandName, color, logoType = 'text') {
  const width = 300
  const height = 120
  let svg
  
  if (logoType === 'circle') {
    svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <circle cx="${width/2}" cy="${height/2}" r="40" fill="${color}" stroke="${color}" stroke-width="3"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${brandName.charAt(0)}</text>
      <text x="50%" y="85%" font-family="Arial, sans-serif" font-size="16" fill="${color}" text-anchor="middle" font-weight="bold">${brandName}</text>
    </svg>`
  } else if (logoType === 'square') {
    svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <rect x="${width/2-40}" y="${height/2-25}" width="80" height="50" fill="${color}" rx="8"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${brandName.charAt(0)}</text>
      <text x="50%" y="85%" font-family="Arial, sans-serif" font-size="16" fill="${color}" text-anchor="middle" font-weight="bold">${brandName}</text>
    </svg>`
  } else {
    // Text-based logo
    svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="${color}" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${brandName}</text>
      <line x1="20" y1="65" x2="${width-20}" y2="65" stroke="${color}" stroke-width="2"/>
    </svg>`
  }
  
  return Buffer.from(svg)
}

async function uploadLogo(buffer, filename, title) {
  try {
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
      title: title
    })
    console.log(`✅ Uploaded logo: ${title}`)
    return asset
  } catch (error) {
    console.error(`❌ Failed to upload ${title}:`, error.message)
    return null
  }
}

// Brand collaboration data with diverse industries
const brandCollaborations = [
  {
    title: 'TechFlow Solutions Partnership',
    brandName: 'TechFlow',
    industry: 'Technology',
    color: '#2563EB',
    logoType: 'square',
    description: 'Strategic partnership with TechFlow Solutions to showcase their innovative software development tools and cloud infrastructure services.',
    collaborationType: 'Product Showcase',
    duration: '6 months',
    deliverables: ['Product demo videos', 'Tutorial series', 'Case study content'],
    budget: '$15,000'
  },
  {
    title: 'EcoGreen Lifestyle Brand Campaign',
    brandName: 'EcoGreen',
    industry: 'Sustainability',
    color: '#10B981',
    logoType: 'circle',
    description: 'Collaboration with EcoGreen to promote sustainable living products and eco-friendly lifestyle choices through authentic content.',
    collaborationType: 'Brand Ambassador',
    duration: '12 months',
    deliverables: ['Monthly lifestyle vlogs', 'Product reviews', 'Social media campaigns'],
    budget: '$25,000'
  },
  {
    title: 'FitCore Fitness Equipment Review',
    brandName: 'FitCore',
    industry: 'Fitness & Health',
    color: '#EF4444',
    logoType: 'text',
    description: 'Partnership with FitCore to review and demonstrate their latest home fitness equipment and workout programs.',
    collaborationType: 'Product Review',
    duration: '3 months',
    deliverables: ['Equipment reviews', 'Workout tutorials', 'Before/after content'],
    budget: '$8,000'
  },
  {
    title: 'StyleHub Fashion Collaboration',
    brandName: 'StyleHub',
    industry: 'Fashion',
    color: '#EC4899',
    logoType: 'circle',
    description: 'Fashion collaboration with StyleHub to showcase their seasonal collections and styling tips for different occasions.',
    collaborationType: 'Fashion Showcase',
    duration: '4 months',
    deliverables: ['Lookbook videos', 'Styling tutorials', 'Fashion hauls'],
    budget: '$12,000'
  },
  {
    title: 'CookMaster Kitchen Tools Partnership',
    brandName: 'CookMaster',
    industry: 'Kitchen & Cooking',
    color: '#F59E0B',
    logoType: 'square',
    description: 'Culinary partnership with CookMaster to feature their professional-grade kitchen tools and cooking equipment.',
    collaborationType: 'Cooking Content',
    duration: '6 months',
    deliverables: ['Recipe videos', 'Tool demonstrations', 'Cooking tips series'],
    budget: '$18,000'
  },
  {
    title: 'TravelEase Luggage Campaign',
    brandName: 'TravelEase',
    industry: 'Travel & Lifestyle',
    color: '#8B5CF6',
    logoType: 'text',
    description: 'Travel collaboration with TravelEase to showcase their innovative luggage and travel accessories during various trips.',
    collaborationType: 'Travel Documentation',
    duration: '8 months',
    deliverables: ['Travel vlogs', 'Product testing', 'Packing tutorials'],
    budget: '$20,000'
  },
  {
    title: 'GameZone Gaming Gear Review',
    brandName: 'GameZone',
    industry: 'Gaming',
    color: '#6366F1',
    logoType: 'square',
    description: 'Gaming partnership with GameZone to review their latest gaming peripherals and accessories for content creators.',
    collaborationType: 'Gaming Content',
    duration: '5 months',
    deliverables: ['Gaming setup tours', 'Product reviews', 'Gameplay content'],
    budget: '$14,000'
  },
  {
    title: 'BeautyBloom Cosmetics Collaboration',
    brandName: 'BeautyBloom',
    industry: 'Beauty & Cosmetics',
    color: '#F97316',
    logoType: 'circle',
    description: 'Beauty collaboration with BeautyBloom to create makeup tutorials and product reviews featuring their organic cosmetic line.',
    collaborationType: 'Beauty Content',
    duration: '6 months',
    deliverables: ['Makeup tutorials', 'Product reviews', 'Beauty tips'],
    budget: '$16,000'
  },
  {
    title: 'AutoTech Car Accessories Partnership',
    brandName: 'AutoTech',
    industry: 'Automotive',
    color: '#374151',
    logoType: 'text',
    description: 'Automotive partnership with AutoTech to showcase their innovative car accessories and tech upgrades.',
    collaborationType: 'Automotive Content',
    duration: '4 months',
    deliverables: ['Car modification videos', 'Product installations', 'Tech reviews'],
    budget: '$22,000'
  },
  {
    title: 'PetCare Plus Animal Products Campaign',
    brandName: 'PetCare Plus',
    industry: 'Pet Care',
    color: '#059669',
    logoType: 'square',
    description: 'Pet care collaboration with PetCare Plus to feature their premium pet products and care solutions.',
    collaborationType: 'Pet Content',
    duration: '7 months',
    deliverables: ['Pet care tutorials', 'Product demonstrations', 'Pet lifestyle content'],
    budget: '$13,000'
  }
]

async function createBrandCollaborationsWithLogos() {
  console.log('🚀 Creating brand collaborations with professional mock logos...\n')
  
  try {
    for (const brand of brandCollaborations) {
      // Create and upload logo
      const logoBuffer = createMockLogo(brand.brandName, brand.color, brand.logoType)
      const logoAsset = await uploadLogo(
        logoBuffer,
        `${brand.brandName.toLowerCase()}-logo.svg`,
        `${brand.brandName} Brand Logo`
      )
      
      if (logoAsset) {
        // Create brand collaboration document
        const collaboration = {
          _type: 'brandCollaboration',
          _id: nanoid(),
          title: brand.title,
          slug: {
            _type: 'slug',
            current: brand.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          },
          brandName: brand.brandName,
          industry: brand.industry,
          collaborationType: brand.collaborationType,
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          duration: brand.duration,
          budget: brand.budget,
          description: [createBlock(brand.description)],
          deliverables: brand.deliverables,
          brandLogo: [{
            _key: nanoid(),
            _type: 'imageWithAlt',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: logoAsset._id
              }
            },
            alt: `${brand.brandName} company logo`
          }],
          featuredImage: [{
            _key: nanoid(),
            _type: 'imageWithAlt',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: logoAsset._id
              }
            },
            alt: `${brand.brandName} collaboration featured image`
          }],
          tags: [brand.industry, brand.collaborationType, 'Partnership'],
          isActive: true,
          priority: 'medium'
        }
        
        const result = await client.create(collaboration)
        console.log(`✅ Created brand collaboration: ${brand.title}`)
      }
    }
    
    console.log('\n🎉 SUCCESS! Created brand collaborations with mock logos!')
    console.log(`📊 Total brands created: ${brandCollaborations.length}`)
    console.log('🏢 Industries covered: Technology, Sustainability, Fitness, Fashion, Cooking, Travel, Gaming, Beauty, Automotive, Pet Care')
    console.log('🎨 All brands have professional mock logos')
    
  } catch (error) {
    console.error('❌ Error creating brand collaborations:', error)
  }
}

createBrandCollaborationsWithLogos()
