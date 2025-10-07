const {createClient} = require('@sanity/client')
const {nanoid} = require('nanoid')
const fs = require('fs')
const path = require('path')

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

// Function to create a simple colored image (as placeholder)
function createPlaceholderImageBuffer(color, width = 400, height = 300) {
  // Create a simple SVG as a placeholder
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">Sample Image</text>
  </svg>`
  return Buffer.from(svg)
}

// Upload sample images
async function uploadSampleImages() {
  const sampleImages = [
    {
      id: 'tech-hero-image',
      title: 'Technology Hero Image',
      color: '#00D4FF',
      description: 'Technology workspace hero image'
    },
    {
      id: 'lifestyle-hero-image', 
      title: 'Lifestyle Hero Image',
      color: '#E07A5F',
      description: 'Urban lifestyle hero image'
    },
    {
      id: 'gaming-hero-image',
      title: 'Gaming Hero Image', 
      color: '#39FF14',
      description: 'Gaming setup hero image'
    },
    {
      id: 'education-hero-image',
      title: 'Education Hero Image',
      color: '#2E86AB', 
      description: 'Educational content hero image'
    },
    {
      id: 'culture-hero-image',
      title: 'Culture Hero Image',
      color: '#FF1493',
      description: 'Culture and arts hero image'
    },
    {
      id: 'tech-thumbnail-1',
      title: 'Tech Thumbnail',
      color: '#1A1B3A',
      description: 'Tech review thumbnail'
    },
    {
      id: 'lifestyle-vlog-thumbnail',
      title: 'Lifestyle Thumbnail',
      color: '#81B29A',
      description: 'Lifestyle vlog thumbnail'
    },
    {
      id: 'pixel-art-thumbnail',
      title: 'Gaming Thumbnail',
      color: '#8A2BE2',
      description: 'Gaming pixel art thumbnail'
    },
    {
      id: 'education-infographic',
      title: 'Education Infographic',
      color: '#A23B72',
      description: 'Educational infographic'
    },
    {
      id: 'culture-collage',
      title: 'Culture Collage',
      color: '#CCFF00',
      description: 'Culture remix collage'
    }
  ]

  console.log('🖼️ Uploading sample images...')
  
  const uploadedImages = {}
  
  for (const img of sampleImages) {
    try {
      console.log(`   Uploading ${img.title}...`)
      
      // Create placeholder image buffer
      const imageBuffer = createPlaceholderImageBuffer(img.color)
      
      // Upload the image to Sanity
      const asset = await client.assets.upload('image', imageBuffer, {
        filename: `${img.id}.svg`,
        title: img.title,
      })
      
      uploadedImages[img.id] = asset._id
      console.log(`   ✅ Uploaded: ${img.title} (${asset._id})`)
      
    } catch (error) {
      console.error(`   ❌ Failed to upload ${img.title}:`, error.message)
    }
  }
  
  return uploadedImages
}

// Updated YouTube channels with proper image references
async function createYouTubeChannelsWithImages(uploadedImages) {
  const sampleYouTubeChannels = [
    {
      _type: 'youtubeId',
      _id: 'youtube-01',
      
      // Hero / Intro Section
      channel_number: '01',
      category: 'Technology',
      channel_name: 'TechSphere Daily',
      intro_description: [
        createBlock('Your daily dose of cutting-edge technology news, reviews, and tutorials. We break down complex tech concepts into digestible content for the modern digital native.')
      ],
      cta_button_url: 'https://youtube.com/@techsphere-daily',
      
      // Side Info
      channel: 'Alex Rodriguez',
      date_started: '2021-03-15',
      focus: ['Reviews', 'Tutorials', 'Technology'],
      share_links: {
        youtube_url: 'https://youtube.com/@techsphere-daily',
        instagram_url: 'https://instagram.com/techsphere.daily',
        twitter_url: 'https://twitter.com/techspheretv',
        website_url: 'https://techsphere.media'
      },
      
      // Visual Identity
      visual_identity_subtitle: 'Clean, Modern, Tech-Forward',
      visual_identity_description: [
        createBlock('Our visual identity reflects the intersection of human creativity and technological innovation. We use a minimalist approach with bold typography and electric blue accents that represent the digital frontier.')
      ],
      visual_identity_bullets: [
        'Minimalist design philosophy',
        'Electric blue and white color scheme', 
        'Futuristic typography choices',
        'Clean thumbnail layouts'
      ],
      typography: [
        {
          _key: nanoid(),
          _type: 'typography',
          font_name: 'Roboto',
          font_usage: 'Used for video thumbnails and titles'
        },
        {
          _key: nanoid(),
          _type: 'typography',
          font_name: 'Montserrat',
          font_usage: 'Used for overlay text and descriptions'
        }
      ],
      colors: [
        {
          _key: nanoid(),
          _type: 'colors',
          color_name: 'Electric Blue',
          color_hex: '#00D4FF'
        },
        {
          _key: nanoid(),
          _type: 'colors',
          color_name: 'Deep Navy',
          color_hex: '#1A1B3A'
        },
        {
          _key: nanoid(),
          _type: 'colors',
          color_hex: '#FFFFFF'
        }
      ],
      visual_identity_images: uploadedImages['tech-hero-image'] ? [
        {
          _key: nanoid(),
          _type: 'imageWithAlt',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedImages['tech-hero-image']
            }
          },
          altText: 'TechSphere Daily hero image showing modern tech workspace'
        },
        {
          _key: nanoid(),
          _type: 'imageWithAlt',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedImages['tech-thumbnail-1']
            }
          },
          altText: 'Sample tech review thumbnail with clean design'
        }
      ] : [],
      
      // Concept
      concept_subtitle: 'Technology for Everyone',
      concept_text_block_1: [
        createBlock('TechSphere Daily exists to democratize technology education. We believe that everyone deserves to understand the digital tools that shape our world, regardless of their technical background.')
      ],
      concept_text_block_2: [
        createBlock('Our target audience includes millennials and Gen Z professionals who want to stay current with technology trends without getting overwhelmed by jargon. We focus on practical applications and real-world impact.')
      ],
      concept_images: uploadedImages['tech-hero-image'] ? [
        {
          _key: nanoid(),
          _type: 'imageWithAlt',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedImages['tech-hero-image']
            }
          },
          altText: 'Behind the scenes of tech content creation'
        }
      ] : []
    },

    {
      _type: 'youtubeId',
      _id: 'youtube-02',
      
      // Hero / Intro Section
      channel_number: '02',
      category: 'Lifestyle',
      channel_name: 'Urban Nomad Life',
      intro_description: [
        createBlock('Join me as I explore city life, remote work culture, and the art of living intentionally in urban environments. Real stories from real places.')
      ],
      cta_button_url: 'https://youtube.com/@urban-nomad-life',
      
      // Side Info
      channel: 'Maya Chen',
      date_started: '2020-11-08',
      focus: ['Vlogs', 'Lifestyle', 'Travel'],
      share_links: {
        youtube_url: 'https://youtube.com/@urban-nomad-life',
        instagram_url: 'https://instagram.com/urban.nomad.maya',
        tiktok_url: 'https://tiktok.com/@urbannomadlife',
        website_url: 'https://urbannomadlife.co'
      },
      
      // Visual Identity
      visual_identity_subtitle: 'Warm, Authentic, City-Inspired',
      visual_identity_description: [
        createBlock('Our visual identity captures the energy and diversity of city life. Warm earth tones meet urban concrete grays, creating a palette that feels both grounded and dynamic.')
      ],
      visual_identity_bullets: [
        'Earth tone color palette',
        'Hand-drawn illustrative elements',
        'Urban photography aesthetic',
        'Authentic, unfiltered moments'
      ],
      typography: [
        {
          _key: nanoid(),
          _type: 'typography',
          font_name: 'Playfair Display',
          font_usage: 'Used for channel branding and main titles'
        },
        {
          _key: nanoid(),
          _type: 'typography',
          font_name: 'Open Sans',
          font_usage: 'Used for video descriptions and subtitles'
        }
      ],
      colors: [
        {
          _key: nanoid(),
          _type: 'colors',
          color_name: 'Terracotta',
          color_hex: '#E07A5F'
        },
        {
          _key: nanoid(),
          _type: 'colors',
          color_name: 'Sage Green',
          color_hex: '#81B29A'
        },
        {
          _key: nanoid(),
          _type: 'colors',
          color_name: 'Warm Gray',
          color_hex: '#F2F2F2'
        }
      ],
      visual_identity_images: uploadedImages['lifestyle-hero-image'] ? [
        {
          _key: nanoid(),
          _type: 'imageWithAlt',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedImages['lifestyle-hero-image']
            }
          },
          altText: 'Urban Nomad Life brand imagery with city elements'
        },
        {
          _key: nanoid(),
          _type: 'imageWithAlt',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedImages['lifestyle-vlog-thumbnail']
            }
          },
          altText: 'Warm lifestyle vlog thumbnail'
        }
      ] : [],
      
      // Concept
      concept_subtitle: 'Intentional Urban Living',
      concept_text_block_1: [
        createBlock('Urban Nomad Life explores what it means to live consciously in fast-paced city environments. We share stories of people who have found ways to slow down, connect, and thrive in urban spaces.')
      ],
      concept_text_block_2: [
        createBlock('Our audience consists of young professionals seeking work-life balance, remote workers exploring new cities, and anyone interested in sustainable urban lifestyle choices.')
      ]
    }
    // Add more channels following the same pattern...
  ]
  
  return sampleYouTubeChannels
}

async function uploadRealImages() {
  try {
    console.log('🎨 Uploading real images and creating YouTube channels...\\n')
    
    // Upload images first
    const uploadedImages = await uploadSampleImages()
    
    console.log('\\n🗑️ Cleaning up old documents...')
    
    // Delete old YouTube documents
    for (let i = 1; i <= 5; i++) {
      try {
        await client.delete(`youtube-0${i}`)
        console.log(`   Deleted youtube-0${i}`)
      } catch (error) {
        console.log(`   youtube-0${i} not found (ok)`)
      }
    }
    
    // Create a simple working example first
    console.log('\\n✨ Creating YouTube channels with real images...')
    
    const testChannel = {
      _type: 'youtubeId',
      _id: 'youtube-01',
      
      channel_number: '01',
      category: 'Technology',
      channel_name: 'TechSphere Daily',
      intro_description: [
        createBlock('Your daily dose of cutting-edge technology news, reviews, and tutorials.')
      ],
      cta_button_url: 'https://youtube.com/@techsphere-daily',
      
      channel: 'Alex Rodriguez',
      date_started: '2021-03-15',
      focus: ['Reviews', 'Tutorials', 'Technology'],
      share_links: {
        youtube_url: 'https://youtube.com/@techsphere-daily',
        instagram_url: 'https://instagram.com/techsphere.daily',
        twitter_url: 'https://twitter.com/techspheretv',
        website_url: 'https://techsphere.media'
      },
      
      visual_identity_subtitle: 'Clean, Modern, Tech-Forward',
      visual_identity_description: [
        createBlock('Our visual identity reflects modern technology with clean lines and electric blue accents.')
      ],
      visual_identity_bullets: [
        'Minimalist design philosophy',
        'Electric blue color scheme',
        'Modern typography'
      ],
      typography: [
        {
          _key: nanoid(),
          _type: 'typography',
          font_name: 'Roboto',
          font_usage: 'Used for video thumbnails and titles'
        }
      ],
      colors: [
        {
          _key: nanoid(),
          _type: 'colors',
          color_name: 'Electric Blue',
          color_hex: '#00D4FF'
        }
      ],
      visual_identity_images: uploadedImages['tech-hero-image'] ? [
        {
          _key: nanoid(),
          _type: 'imageWithAlt',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedImages['tech-hero-image']
            }
          },
          altText: 'TechSphere Daily hero image'
        }
      ] : [],
      
      concept_subtitle: 'Technology for Everyone',
      concept_text_block_1: [
        createBlock('TechSphere Daily democratizes technology education for everyone.')
      ]
    }
    
    const result = await client.createOrReplace(testChannel)
    console.log(`✅ Created: ${testChannel.channel_name} with ${testChannel.visual_identity_images?.length || 0} images`)
    
    console.log('\\n🎉 Successfully created YouTube channel with real images!')
    console.log('\\n🌐 Check it out at:')
    console.log('   • Local: http://localhost:3333/')
    console.log('   • Deployed: https://vonas-media.sanity.studio/')
    
  } catch (error) {
    console.error('❌ Error uploading real images:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  uploadRealImages()
}

module.exports = { uploadRealImages }
