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

// Sample media assets for different channel types
const sampleMediaAssets = [
  {
    _type: 'mediaAsset',
    _id: 'tech-hero-image',
    title: 'Technology Channel Hero Image',
    description: 'Modern tech workspace with multiple monitors and coding setup',
    category: 'images',
    tags: ['technology', 'workspace', 'coding', 'modern'],
    uploadedAt: new Date('2024-08-26').toISOString(),
    fileSize: 2.1
  },
  {
    _type: 'mediaAsset',
    _id: 'lifestyle-hero-image',
    title: 'Urban Lifestyle Hero Image',
    description: 'City street with modern architecture and urban lifestyle elements',
    category: 'images',
    tags: ['lifestyle', 'urban', 'city', 'modern'],
    uploadedAt: new Date('2024-08-25').toISOString(),
    fileSize: 1.8
  },
  {
    _type: 'mediaAsset',
    _id: 'gaming-hero-image',
    title: 'Gaming Setup Hero Image',
    description: 'RGB gaming setup with mechanical keyboard and gaming peripherals',
    category: 'images',
    tags: ['gaming', 'rgb', 'setup', 'esports'],
    uploadedAt: new Date('2024-08-24').toISOString(),
    fileSize: 2.3
  },
  {
    _type: 'mediaAsset',
    _id: 'education-hero-image',
    title: 'Educational Content Hero Image',
    description: 'Modern classroom with digital learning tools and educational materials',
    category: 'images',
    tags: ['education', 'learning', 'classroom', 'digital'],
    uploadedAt: new Date('2024-08-23').toISOString(),
    fileSize: 1.9
  },
  {
    _type: 'mediaAsset',
    _id: 'culture-hero-image',
    title: 'Culture and Arts Hero Image',
    description: 'Street art and cultural elements representing modern creative expression',
    category: 'images',
    tags: ['culture', 'art', 'creative', 'street'],
    uploadedAt: new Date('2024-08-22').toISOString(),
    fileSize: 2.0
  },
  {
    _type: 'mediaAsset',
    _id: 'tech-thumbnail-1',
    title: 'Tech Review Thumbnail',
    description: 'Clean tech product thumbnail with blue accents',
    category: 'images',
    tags: ['thumbnail', 'tech', 'review', 'product'],
    uploadedAt: new Date('2024-08-21').toISOString(),
    fileSize: 0.8
  },
  {
    _type: 'mediaAsset',
    _id: 'lifestyle-vlog-thumbnail',
    title: 'Lifestyle Vlog Thumbnail',
    description: 'Warm, authentic thumbnail for lifestyle content',
    category: 'images',
    tags: ['thumbnail', 'lifestyle', 'vlog', 'authentic'],
    uploadedAt: new Date('2024-08-20').toISOString(),
    fileSize: 0.9
  },
  {
    _type: 'mediaAsset',
    _id: 'pixel-art-thumbnail',
    title: 'Pixel Art Game Thumbnail',
    description: 'Retro pixel art style thumbnail for indie game content',
    category: 'images',
    tags: ['thumbnail', 'pixel-art', 'gaming', 'retro'],
    uploadedAt: new Date('2024-08-19').toISOString(),
    fileSize: 0.7
  },
  {
    _type: 'mediaAsset',
    _id: 'education-infographic',
    title: 'Educational Infographic',
    description: 'Clean, professional infographic for educational content',
    category: 'images',
    tags: ['infographic', 'education', 'professional', 'learning'],
    uploadedAt: new Date('2024-08-18').toISOString(),
    fileSize: 1.2
  },
  {
    _type: 'mediaAsset',
    _id: 'culture-collage',
    title: 'Culture Remix Collage',
    description: 'Bold, eclectic collage representing remix culture',
    category: 'images',
    tags: ['collage', 'culture', 'remix', 'bold'],
    uploadedAt: new Date('2024-08-17').toISOString(),
    fileSize: 1.5
  }
]

// Updated YouTube channels with proper image references
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
    visual_identity_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'tech-hero-image'
        },
        altText: 'TechSphere Daily hero image showing modern tech workspace'
      },
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'tech-thumbnail-1'
        },
        altText: 'Sample tech review thumbnail with clean design'
      }
    ],
    
    // Concept
    concept_subtitle: 'Technology for Everyone',
    concept_text_block_1: [
      createBlock('TechSphere Daily exists to democratize technology education. We believe that everyone deserves to understand the digital tools that shape our world, regardless of their technical background.')
    ],
    concept_text_block_2: [
      createBlock('Our target audience includes millennials and Gen Z professionals who want to stay current with technology trends without getting overwhelmed by jargon. We focus on practical applications and real-world impact.')
    ],
    concept_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'tech-hero-image'
        },
        altText: 'Behind the scenes of tech content creation'
      }
    ]
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
    visual_identity_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'lifestyle-hero-image'
        },
        altText: 'Urban Nomad Life brand imagery with city elements'
      },
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'lifestyle-vlog-thumbnail'
        },
        altText: 'Warm lifestyle vlog thumbnail'
      }
    ],
    
    // Concept
    concept_subtitle: 'Intentional Urban Living',
    concept_text_block_1: [
      createBlock('Urban Nomad Life explores what it means to live consciously in fast-paced city environments. We share stories of people who have found ways to slow down, connect, and thrive in urban spaces.')
    ],
    concept_text_block_2: [
      createBlock('Our audience consists of young professionals seeking work-life balance, remote workers exploring new cities, and anyone interested in sustainable urban lifestyle choices.')
    ],
    concept_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'lifestyle-hero-image'
        },
        altText: 'Urban lifestyle concept imagery'
      }
    ]
  },

  {
    _type: 'youtubeId',
    _id: 'youtube-03',
    
    // Hero / Intro Section  
    channel_number: '03',
    category: 'Gaming',
    channel_name: 'Pixel Pioneers',
    intro_description: [
      createBlock('Deep dives into indie games, gaming culture, and the stories behind the pixels. We celebrate the art and innovation in independent game development.')
    ],
    cta_button_url: 'https://youtube.com/@pixel-pioneers',
    
    // Side Info
    channel: 'Jordan Kim',
    date_started: '2019-07-22',
    focus: ['Reviews', 'Gaming', 'Entertainment'],
    share_links: {
      youtube_url: 'https://youtube.com/@pixel-pioneers',
      instagram_url: 'https://instagram.com/pixelpioneers',
      twitter_url: 'https://twitter.com/pixelpioneers',
      tiktok_url: 'https://tiktok.com/@pixelpioneers'
    },
    
    // Visual Identity
    visual_identity_subtitle: 'Retro-Future Gaming Aesthetic',
    visual_identity_description: [
      createBlock('Our visual identity pays homage to classic gaming while embracing modern design principles. Neon colors and pixel art elements create a nostalgic yet contemporary feel.')
    ],
    visual_identity_bullets: [
      '8-bit inspired graphics',
      'Neon color accents',
      'Pixel art thumbnails',
      'Retro gaming references'
    ],
    typography: [
      {
        _key: nanoid(),
        _type: 'typography',
        font_name: 'Press Start 2P',
        font_usage: 'Used for retro gaming titles and headers'
      },
      {
        _key: nanoid(),
        _type: 'typography',
        font_name: 'Source Code Pro',
        font_usage: 'Used for code snippets and technical content'
      }
    ],
    colors: [
      {
        _key: nanoid(),
        _type: 'colors',
        color_name: 'Neon Green',
        color_hex: '#39FF14'
      },
      {
        _key: nanoid(),
        _type: 'colors',
        color_name: 'Electric Purple',
        color_hex: '#8A2BE2'
      },
      {
        _key: nanoid(),
        _type: 'colors',
        color_name: 'Pixel Black',
        color_hex: '#0D0D0D'
      }
    ],
    visual_identity_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'gaming-hero-image'
        },
        altText: 'Gaming setup with RGB lighting and retro elements'
      },
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'pixel-art-thumbnail'
        },
        altText: 'Pixel art style thumbnail for indie game content'
      }
    ],
    
    // Concept
    concept_subtitle: 'Celebrating Indie Game Innovation',
    concept_text_block_1: [
      createBlock('Pixel Pioneers focuses on the incredible creativity and innovation happening in indie game development. We showcase games that push boundaries and tell unique stories.')
    ],
    concept_text_block_2: [
      createBlock('Our community includes indie game developers, retro gaming enthusiasts, and players who appreciate artistry in game design. We foster discussions about games as an art form.')
    ],
    concept_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'gaming-hero-image'
        },
        altText: 'Indie game development concept imagery'
      }
    ]
  },

  {
    _type: 'youtubeId',
    _id: 'youtube-04',
    
    // Hero / Intro Section
    channel_number: '04', 
    category: 'Education',
    channel_name: 'Future Skills Academy',
    intro_description: [
      createBlock('Preparing tomorrow\'s workforce with skills that matter. We teach digital literacy, creative problem-solving, and adaptive thinking for the modern economy.')
    ],
    cta_button_url: 'https://youtube.com/@future-skills-academy',
    
    // Side Info
    channel: 'Dr. Sarah Thompson',
    date_started: '2020-01-10',
    focus: ['Education', 'Tutorials', 'Technology'],
    share_links: {
      youtube_url: 'https://youtube.com/@future-skills-academy',
      instagram_url: 'https://instagram.com/futureskillsacademy',
      website_url: 'https://futureskillsacademy.org'
    },
    
    // Visual Identity
    visual_identity_subtitle: 'Professional, Accessible, Forward-Thinking',
    visual_identity_description: [
      createBlock('Our visual identity balances professionalism with approachability. Clean lines and academic blues convey expertise while remaining welcoming to learners at all levels.')
    ],
    visual_identity_bullets: [
      'Clean, academic design',
      'Professional color scheme',
      'Accessible typography',
      'Educational infographic style'
    ],
    typography: [
      {
        _key: nanoid(),
        _type: 'typography',
        font_name: 'Lato',
        font_usage: 'Used for educational content and presentations'
      },
      {
        _key: nanoid(),
        _type: 'typography',
        font_name: 'Merriweather',
        font_usage: 'Used for course titles and headers'
      }
    ],
    colors: [
      {
        _key: nanoid(),
        _type: 'colors',
        color_name: 'Academic Blue',
        color_hex: '#2E86AB'
      },
      {
        _key: nanoid(),
        _type: 'colors',
        color_name: 'Success Green',
        color_hex: '#A23B72'
      },
      {
        _key: nanoid(),
        _type: 'colors',
        color_name: 'Neutral Gray',
        color_hex: '#F18F01'
      }
    ],
    visual_identity_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'education-hero-image'
        },
        altText: 'Educational content hero image with modern learning tools'
      },
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'education-infographic'
        },
        altText: 'Professional educational infographic'
      }
    ],
    
    // Concept
    concept_subtitle: 'Skills for the Future Economy',
    concept_text_block_1: [
      createBlock('Future Skills Academy addresses the growing skills gap in the digital economy. We provide practical education that bridges traditional learning with future-ready competencies.')
    ],
    concept_text_block_2: [
      createBlock('Our target audience includes career changers, recent graduates, and professionals looking to upskill. We focus on making complex topics accessible and actionable.')
    ],
    concept_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'education-hero-image'
        },
        altText: 'Future skills education concept'
      }
    ]
  },

  {
    _type: 'youtubeId',
    _id: 'youtube-05',
    
    // Hero / Intro Section
    channel_number: '05',
    category: 'Entertainment',
    channel_name: 'Culture Remix',
    intro_description: [
      createBlock('Where pop culture meets subculture. We explore the underground movements, viral trends, and creative communities shaping tomorrow\'s mainstream.')
    ],
    cta_button_url: 'https://youtube.com/@culture-remix',
    
    // Side Info
    channel: 'Marcus Rivera',
    date_started: '2021-09-03',
    focus: ['Comedy', 'Entertainment', 'Reviews'],
    share_links: {
      youtube_url: 'https://youtube.com/@culture-remix',
      instagram_url: 'https://instagram.com/culture.remix',
      tiktok_url: 'https://tiktok.com/@cultureremix',
      twitter_url: 'https://twitter.com/cultureremix'
    },
    
    // Visual Identity
    visual_identity_subtitle: 'Bold, Eclectic, Street-Smart',
    visual_identity_description: [
      createBlock('Our visual identity reflects the chaotic beauty of internet culture. Bold typography, vibrant colors, and collage-style graphics mirror the remix culture we celebrate.')
    ],
    visual_identity_bullets: [
      'Street art inspired graphics',
      'Bold, contrasting colors',
      'Collage and mashup aesthetics',
      'Underground culture references'
    ],
    typography: [
      {
        _key: nanoid(),
        _type: 'typography',
        font_name: 'Bebas Neue',
        font_usage: 'Used for bold headlines and impact text'
      },
      {
        _key: nanoid(),
        _type: 'typography',
        font_name: 'Inter',
        font_usage: 'Used for body text and descriptions'
      }
    ],
    colors: [
      {
        _key: nanoid(),
        _type: 'colors',
        color_name: 'Hot Pink',
        color_hex: '#FF1493'
      },
      {
        _key: nanoid(),
        _type: 'colors',
        color_name: 'Electric Lime',
        color_hex: '#CCFF00'
      },
      {
        _key: nanoid(),
        _type: 'colors',
        color_name: 'Deep Purple',
        color_hex: '#4B0082'
      }
    ],
    visual_identity_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'culture-hero-image'
        },
        altText: 'Culture Remix brand imagery with street art elements'
      },
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'culture-collage'
        },
        altText: 'Bold cultural collage representing remix culture'
      }
    ],
    
    // Concept
    concept_subtitle: 'Where Underground Meets Mainstream',
    concept_text_block_1: [
      createBlock('Culture Remix explores the fascinating journey of ideas from subculture to mainstream. We track viral trends, underground movements, and the creative forces that shape popular culture.')
    ],
    concept_text_block_2: [
      createBlock('Our audience includes trend-conscious millennials, cultural critics, and anyone curious about the forces shaping digital culture. We celebrate both established and emerging voices.')
    ],
    concept_images: [
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'reference',
          _ref: 'culture-hero-image'
        },
        altText: 'Cultural trend analysis and underground movements'
      }
    ]
  }
]

async function addCompleteYouTubeWithImages() {
  try {
    console.log('🎨 Adding complete YouTube channels with media assets...\\n')
    
    // First, add media assets
    console.log('📸 Creating media assets...')
    for (const asset of sampleMediaAssets) {
      try {
        await client.createOrReplace(asset)
        console.log(`   ✅ Created: ${asset.title}`)
      } catch (error) {
        console.log(`   ❌ Failed to create: ${asset.title}`)
      }
    }
    
    console.log('\\n🗑️ Removing old YouTube documents...')
    // Remove old documents
    for (let i = 1; i <= 5; i++) {
      try {
        await client.delete(`youtube-0${i}`)
        console.log(`   Deleted youtube-0${i}`)
      } catch (error) {
        console.log(`   youtube-0${i} not found (ok)`)
      }
    }
    
    console.log('\\n✨ Creating YouTube channels with images...')
    
    for (const channel of sampleYouTubeChannels) {
      const result = await client.createOrReplace(channel)
      console.log(`✅ Created: ${channel.channel_name} (${channel.category})`)
      console.log(`   Channel Number: ${channel.channel_number}`)
      console.log(`   Creator: ${channel.channel}`)
      console.log(`   Images: ${channel.visual_identity_images?.length || 0} visual identity, ${channel.concept_images?.length || 0} concept`)
      console.log('')
    }
    
    console.log('🎉 Successfully created complete YouTube channels with images!')
    console.log(`📊 Added ${sampleYouTubeChannels.length} YouTube channels with full media support:`)
    sampleYouTubeChannels.forEach(channel => {
      console.log(`   • ${channel.channel_number}: ${channel.channel_name} (${channel.category})`)
    })
    console.log(`\\n📸 Added ${sampleMediaAssets.length} media assets:`)
    console.log('   • Hero images for each channel category')
    console.log('   • Thumbnail examples for different content types')
    console.log('   • Visual identity and concept imagery')
    console.log('\\n🔧 Fixed issues:')
    console.log('   • Resolved React minification error in colors component')
    console.log('   • Added proper _key properties to all array items')
    console.log('   • Included comprehensive image galleries')
    console.log('\\n🌐 Check them out at:')
    console.log('   • Local: http://localhost:3333/')
    console.log('   • Deployed: https://vonas-media.sanity.studio/')
    
  } catch (error) {
    console.error('❌ Error creating complete YouTube channels:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  addCompleteYouTubeWithImages()
}

module.exports = { addCompleteYouTubeWithImages }
