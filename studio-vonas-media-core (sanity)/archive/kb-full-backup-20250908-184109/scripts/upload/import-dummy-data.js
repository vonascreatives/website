const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-08-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

const dummyAuthors = [
  {
    _type: 'author',
    name: 'Alex Chen',
    slug: { current: 'alex-chen' },
    bio: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Digital content strategist specializing in millennial and Gen X engagement. Alex has over 8 years of experience creating viral content across multiple platforms.'
          }
        ]
      }
    ]
  },
  {
    _type: 'author',
    name: 'Sarah Martinez',
    slug: { current: 'sarah-martinez' },
    bio: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Former tech journalist turned content creator. Sarah focuses on making complex technology topics accessible to mainstream audiences.'
          }
        ]
      }
    ]
  },
  {
    _type: 'author',
    name: 'Marcus Johnson',
    slug: { current: 'marcus-johnson' },
    bio: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Sports and entertainment analyst with a passion for subculture movements. Marcus brings unique perspectives to digital storytelling.'
          }
        ]
      }
    ]
  }
]

const dummyPosts = [
  {
    _type: 'post',
    title: 'The Future of Digital Content: Why Millennials Are Leading the Change',
    slug: { current: 'future-digital-content-millennials' },
    excerpt: 'Exploring how millennial content creators are revolutionizing the digital landscape with authentic storytelling and innovative formats.',
    category: 'technology',
    publishedAt: new Date('2024-08-20').toISOString(),
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'The digital content landscape is experiencing a seismic shift, and millennials are at the forefront of this transformation. Unlike previous generations, millennials approach content creation with a unique blend of authenticity, technology savviness, and social consciousness.'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'What sets millennial content apart is their commitment to genuine connection over polished perfection. They understand that audiences today crave real stories, honest perspectives, and content that speaks to their lived experiences.'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'At Vonas Media, we recognize this shift and work with creators who embody these values. Our platform amplifies voices that matter and creates content formats specifically designed for modern consumption patterns.'
          }
        ]
      }
    ]
  },
  {
    _type: 'post',
    title: 'Breaking Down Barriers: How Social Media Democratizes Information',
    slug: { current: 'social-media-democratizes-information' },
    excerpt: 'Social media platforms have transformed how we consume and share information, creating unprecedented opportunities for diverse voices to be heard.',
    category: 'education',
    publishedAt: new Date('2024-08-15').toISOString(),
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Social media has fundamentally changed the information ecosystem. Where traditional media once gatekept knowledge distribution, platforms like TikTok, Instagram, and Twitter have created direct pathways between creators and audiences.'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'This democratization has profound implications for education, journalism, and social movements. Information that might have taken weeks to surface through traditional channels can now reach millions in hours.'
          }
        ]
      }
    ]
  },
  {
    _type: 'post',
    title: 'The Rise of Micro-Communities: Finding Your Tribe Online',
    slug: { current: 'rise-micro-communities-online' },
    excerpt: 'Subcultures are thriving in digital spaces, creating intimate communities around shared interests and values.',
    category: 'subculture',
    publishedAt: new Date('2024-08-10').toISOString(),
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'The internet has become a haven for niche communities and subcultures. From plant enthusiasts to vintage fashion collectors, people are finding their tribes in ways never before possible.'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'These micro-communities represent the future of social interaction online. They prioritize depth over breadth, quality over quantity, and authentic connection over superficial engagement.'
          }
        ]
      }
    ]
  },
  {
    _type: 'post',
    title: 'Business Innovation in the Creator Economy',
    slug: { current: 'business-innovation-creator-economy' },
    excerpt: 'How modern businesses are adapting to work with content creators and influencers in the new digital economy.',
    category: 'business',
    publishedAt: new Date('2024-08-05').toISOString(),
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'The creator economy has disrupted traditional business models across industries. Companies that once relied solely on traditional advertising are now building authentic partnerships with content creators.'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'This shift represents more than just marketing evolution—it signifies a fundamental change in how businesses connect with their audiences and build brand loyalty.'
          }
        ]
      }
    ]
  },
  {
    _type: 'post',
    title: 'Sports Entertainment Goes Digital: New Formats for New Audiences',
    slug: { current: 'sports-entertainment-digital-formats' },
    excerpt: 'Traditional sports media is being revolutionized by digital-first content creators who understand modern audience preferences.',
    category: 'sports',
    publishedAt: new Date('2024-07-30').toISOString(),
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Sports content has evolved far beyond traditional highlight reels and post-game interviews. Today\'s sports fans expect behind-the-scenes access, real-time commentary, and interactive experiences.'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Digital creators are filling this gap with innovative formats that blend entertainment with sports analysis, creating content that resonates with younger demographics.'
          }
        ]
      }
    ]
  },
  {
    _type: 'post',
    title: 'Entertainment Value: Creating Content That Actually Entertains',
    slug: { current: 'entertainment-value-content-creation' },
    excerpt: 'In an oversaturated content market, entertainment value has become the key differentiator for successful digital content.',
    category: 'entertainment',
    publishedAt: new Date('2024-07-25').toISOString(),
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'With millions of pieces of content published daily, entertainment value has become crucial for breaking through the noise. But what does "entertaining" mean in the digital age?'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Modern audiences define entertainment broadly—from educational content that makes learning fun to storytelling that provides emotional connection. The key is understanding your audience\'s definition of value.'
          }
        ]
      }
    ]
  }
]

async function importData() {
  try {
    console.log('Starting data import...')
    
    // Import authors first
    console.log('Importing authors...')
    for (const author of dummyAuthors) {
      const result = await client.create(author)
      console.log(`Created author: ${author.name}`)
    }
    
    // Import posts
    console.log('Importing posts...')
    for (const post of dummyPosts) {
      const result = await client.create(post)
      console.log(`Created post: ${post.title}`)
    }
    
    console.log('✅ Data import completed successfully!')
    console.log(`Imported ${dummyAuthors.length} authors and ${dummyPosts.length} posts`)
    
  } catch (error) {
    console.error('❌ Error importing data:', error)
  }
}

// Run the import if this file is executed directly
if (require.main === module) {
  importData()
}

module.exports = { importData }
