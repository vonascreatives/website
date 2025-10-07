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

// Use the uploaded image IDs
const uploadedImageIds = {
  'tech-hero': 'image-6db1363832f96a3ac1ab19541f830767e6df27f0-400x300-svg',
  'lifestyle-hero': 'image-6521f43b12b1b4bdfe39c28db66433829d26479a-400x300-svg',
  'gaming-hero': 'image-f29df308e1a7173fdbba69bf2865d34efa1d1221-400x300-svg',
  'education-hero': 'image-96319028037d8dc55129670f212d98311286053f-400x300-svg',
  'culture-hero': 'image-4cbbd6d3b2ec2049db18c9c51499c8b31551196c-400x300-svg',
  'tech-thumb': 'image-0fcd2417695309659c2a3fed64bf6969d34783df-400x300-svg',
  'lifestyle-thumb': 'image-8ef3c894245e7ced3f8e532bb6b5b949e6365358-400x300-svg',
  'gaming-thumb': 'image-26ebb409a17c12f99a9f9df6edccd0f82d546534-400x300-svg',
  'education-thumb': 'image-cf53f7dc07ac7953206597aa922b028de84aeed5-400x300-svg',
  'culture-thumb': 'image-805d93f90e205ea17b84808e4465e5db2f266f97-400x300-svg'
}

const allChannels = [
  {
    _type: 'youtubeId',
    _id: 'youtube-01',
    
    channel_number: '01',
    category: 'Technology',
    channel_name: 'TechSphere Daily',
    intro_description: [
      createBlock('Your daily dose of cutting-edge technology news, reviews, and tutorials. We break down complex tech concepts into digestible content for the modern digital native.')
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['tech-hero']
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
            _ref: uploadedImageIds['tech-thumb']
          }
        },
        altText: 'Sample tech review thumbnail with clean design'
      }
    ],
    
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['tech-hero']
          }
        },
        altText: 'Behind the scenes of tech content creation'
      }
    ]
  },

  {
    _type: 'youtubeId',
    _id: 'youtube-02',
    
    channel_number: '02',
    category: 'Lifestyle',
    channel_name: 'Urban Nomad Life',
    intro_description: [
      createBlock('Join me as I explore city life, remote work culture, and the art of living intentionally in urban environments. Real stories from real places.')
    ],
    cta_button_url: 'https://youtube.com/@urban-nomad-life',
    
    channel: 'Maya Chen',
    date_started: '2020-11-08',
    focus: ['Vlogs', 'Lifestyle', 'Travel'],
    share_links: {
      youtube_url: 'https://youtube.com/@urban-nomad-life',
      instagram_url: 'https://instagram.com/urban.nomad.maya',
      tiktok_url: 'https://tiktok.com/@urbannomadlife',
      website_url: 'https://urbannomadlife.co'
    },
    
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['lifestyle-hero']
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
            _ref: uploadedImageIds['lifestyle-thumb']
          }
        },
        altText: 'Warm lifestyle vlog thumbnail'
      }
    ],
    
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['lifestyle-hero']
          }
        },
        altText: 'Urban lifestyle concept imagery'
      }
    ]
  },

  {
    _type: 'youtubeId',
    _id: 'youtube-03',
    
    channel_number: '03',
    category: 'Gaming',
    channel_name: 'Pixel Pioneers',
    intro_description: [
      createBlock('Deep dives into indie games, gaming culture, and the stories behind the pixels. We celebrate the art and innovation in independent game development.')
    ],
    cta_button_url: 'https://youtube.com/@pixel-pioneers',
    
    channel: 'Jordan Kim',
    date_started: '2019-07-22',
    focus: ['Reviews', 'Gaming', 'Entertainment'],
    share_links: {
      youtube_url: 'https://youtube.com/@pixel-pioneers',
      instagram_url: 'https://instagram.com/pixelpioneers',
      twitter_url: 'https://twitter.com/pixelpioneers',
      tiktok_url: 'https://tiktok.com/@pixelpioneers'
    },
    
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['gaming-hero']
          }
        },
        altText: 'Gaming setup with RGB lighting and retro elements'
      },
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['gaming-thumb']
          }
        },
        altText: 'Pixel art style thumbnail for indie game content'
      }
    ],
    
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['gaming-hero']
          }
        },
        altText: 'Indie game development concept imagery'
      }
    ]
  },

  {
    _type: 'youtubeId',
    _id: 'youtube-04',
    
    channel_number: '04',
    category: 'Education',
    channel_name: 'Future Skills Academy',
    intro_description: [
      createBlock('Preparing tomorrow\'s workforce with skills that matter. We teach digital literacy, creative problem-solving, and adaptive thinking for the modern economy.')
    ],
    cta_button_url: 'https://youtube.com/@future-skills-academy',
    
    channel: 'Dr. Sarah Thompson',
    date_started: '2020-01-10',
    focus: ['Education', 'Tutorials', 'Technology'],
    share_links: {
      youtube_url: 'https://youtube.com/@future-skills-academy',
      instagram_url: 'https://instagram.com/futureskillsacademy',
      website_url: 'https://futureskillsacademy.org'
    },
    
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['education-hero']
          }
        },
        altText: 'Educational content hero image with modern learning tools'
      },
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['education-thumb']
          }
        },
        altText: 'Professional educational infographic'
      }
    ],
    
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['education-hero']
          }
        },
        altText: 'Future skills education concept'
      }
    ]
  },

  {
    _type: 'youtubeId',
    _id: 'youtube-05',
    
    channel_number: '05',
    category: 'Entertainment',
    channel_name: 'Culture Remix',
    intro_description: [
      createBlock('Where pop culture meets subculture. We explore the underground movements, viral trends, and creative communities shaping tomorrow\'s mainstream.')
    ],
    cta_button_url: 'https://youtube.com/@culture-remix',
    
    channel: 'Marcus Rivera',
    date_started: '2021-09-03',
    focus: ['Comedy', 'Entertainment', 'Reviews'],
    share_links: {
      youtube_url: 'https://youtube.com/@culture-remix',
      instagram_url: 'https://instagram.com/culture.remix',
      tiktok_url: 'https://tiktok.com/@cultureremix',
      twitter_url: 'https://twitter.com/cultureremix'
    },
    
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['culture-hero']
          }
        },
        altText: 'Culture Remix brand imagery with street art elements'
      },
      {
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['culture-thumb']
          }
        },
        altText: 'Bold cultural collage representing remix culture'
      }
    ],
    
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
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageIds['culture-hero']
          }
        },
        altText: 'Cultural trend analysis and underground movements'
      }
    ]
  }
]

async function createAllChannelsWithImages() {
  try {
    console.log('🎬 Creating all 5 YouTube channels with images...\\n')
    
    for (const channel of allChannels) {
      const result = await client.createOrReplace(channel)
      console.log(`✅ Created: ${channel.channel_name} (${channel.category})`)
      console.log(`   Channel Number: ${channel.channel_number}`)
      console.log(`   Creator: ${channel.channel}`)
      console.log(`   Visual Identity Images: ${channel.visual_identity_images?.length || 0}`)
      console.log(`   Concept Images: ${channel.concept_images?.length || 0}`)
      console.log('')
    }
    
    console.log('🎉 Successfully created all YouTube channels with images!')
    console.log(`📊 Created ${allChannels.length} complete channels:`)
    allChannels.forEach(channel => {
      console.log(`   • ${channel.channel_number}: ${channel.channel_name} (${channel.category})`)
    })
    console.log('\\n🌐 Check them out at:')
    console.log('   • Local: http://localhost:3333/')
    console.log('   • Deployed: https://vonas-media.sanity.studio/')
    console.log('\\n💡 Each channel now includes:')
    console.log('   • Complete content across all 4 sections')
    console.log('   • Real uploaded images with proper alt text')
    console.log('   • Typography and color specifications')
    console.log('   • No missing keys or validation errors')
    
  } catch (error) {
    console.error('❌ Error creating channels:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  createAllChannelsWithImages()
}

module.exports = { createAllChannelsWithImages }
