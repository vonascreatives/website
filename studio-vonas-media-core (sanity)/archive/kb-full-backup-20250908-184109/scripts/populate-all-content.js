const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// Initialize Sanity client
const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN || 'skCqnPJT7CdbEGfUMYdNFgOXSe2QVNBKZCgQNUkSIBKyCPCJ8Sew6xBo1KECKT84fBrBf7z5K38NvZzKWm9C9dRLh4vG9x4hDpnC9bSNJb1wZ4RVzCQDjLPF3XdHYp2ycfOgOJK7eXV3CTMQ1NsRH8kzG6vBF5LdKYi3JhWcV8Rq4N7eA2z'
})

// Helper function to generate SVG placeholder
function generateSVG(width, height, text, bgColor = '#4F46E5', textColor = '#FFFFFF') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${text}</text>
  </svg>`
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

async function populateAllContent() {
  console.log('🚀 Starting comprehensive content population...')
  
  try {
    // Delete existing documents to start fresh
    console.log('🗑️ Clearing existing documents...')
    await client.delete({ query: "*[_type in ['youtubeId', 'teamMember', 'exclusiveCreator', 'post', 'knowledgeBase', 'faq', 'jobBoard', 'businessDoc']]" })
    
    console.log('⏳ Waiting for deletion to complete...')
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create YouTube ID documents
    console.log('📺 Creating YouTube ID documents...')
    const youtubeChannels = [
      {
        name: 'TechVision Pro',
        category: 'Technology',
        description: 'Cutting-edge technology reviews and tutorials',
        heroColor: '#FF6B6B',
        thumbnailColor: '#4ECDC4'
      },
      {
        name: 'Lifestyle Luxe',
        category: 'Lifestyle', 
        description: 'Premium lifestyle content and trends',
        heroColor: '#45B7D1',
        thumbnailColor: '#96CEB4'
      },
      {
        name: 'GameMaster Elite',
        category: 'Gaming',
        description: 'Professional gaming content and esports',
        heroColor: '#9B59B6',
        thumbnailColor: '#E67E22'
      },
      {
        name: 'EduCore Academy',
        category: 'Education',
        description: 'Educational content for modern learners',
        heroColor: '#2ECC71',
        thumbnailColor: '#F39C12'
      },
      {
        name: 'Culture Connect',
        category: 'Culture',
        description: 'Exploring diverse cultures and traditions',
        heroColor: '#E74C3C',
        thumbnailColor: '#1ABC9C'
      }
    ]

    for (const channel of youtubeChannels) {
      const heroImage = await uploadImage(
        generateSVG(1920, 1080, `${channel.name} Hero`, channel.heroColor),
        `${channel.name.toLowerCase().replace(/\s+/g, '-')}-hero`,
        `Hero image for ${channel.name} - ${channel.description}`
      )

      const thumbnailImage = await uploadImage(
        generateSVG(640, 480, `${channel.name} Thumb`, channel.thumbnailColor),
        `${channel.name.toLowerCase().replace(/\s+/g, '-')}-thumbnail`,
        `Thumbnail for ${channel.name} channel`
      )

      const conceptImage = await uploadImage(
        generateSVG(800, 600, 'Concept', '#34495E'),
        `${channel.name.toLowerCase().replace(/\s+/g, '-')}-concept`,
        `Visual concept for ${channel.name}`
      )

      const identityImage = await uploadImage(
        generateSVG(500, 500, 'ID', '#7F8C8D'),
        `${channel.name.toLowerCase().replace(/\s+/g, '-')}-identity`,
        `Brand identity for ${channel.name}`
      )

      const doc = {
        _type: 'youtubeId',
        title: channel.name,
        category: channel.category,
        description: [
          {
            _key: `desc-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: channel.description
            }],
            markDefs: [],
            style: 'normal'
          }
        ],
        heroSection: {
          _type: 'heroSection',
          title: `Welcome to ${channel.name}`,
          subtitle: 'Your premier destination for quality content',
          heroImage: heroImage,
          ctaText: 'Subscribe Now',
          ctaUrl: '#subscribe'
        },
        sideInfo: {
          _type: 'sideInfo',
          subscribers: `${Math.floor(Math.random() * 900 + 100)}K`,
          totalViews: `${Math.floor(Math.random() * 50 + 5)}M`,
          joinDate: '2020-01-15',
          thumbnailImage: thumbnailImage,
          shareLinks: {
            _type: 'shareLinks',
            youtube: `https://youtube.com/@${channel.name.toLowerCase().replace(/\s+/g, '')}`,
            twitter: `https://twitter.com/${channel.name.toLowerCase().replace(/\s+/g, '')}`,
            instagram: `https://instagram.com/${channel.name.toLowerCase().replace(/\s+/g, '')}`
          }
        },
        visualIdentity: {
          _type: 'visualIdentity',
          primaryColor: {
            _type: 'color',
            hex: channel.heroColor
          },
          secondaryColor: {
            _type: 'color', 
            hex: channel.thumbnailColor
          },
          typography: {
            _type: 'typography',
            headingFont: 'Inter',
            bodyFont: 'Open Sans',
            fontSize: 16
          },
          identityImage: identityImage
        },
        conceptSection: {
          _type: 'conceptSection',
          conceptTitle: `${channel.name} Brand Concept`,
          conceptDescription: [
            {
              _key: `concept-${Date.now()}`,
              _type: 'block',
              children: [{
                _key: `span-${Date.now()}`,
                _type: 'span',
                marks: [],
                text: `Our brand concept focuses on delivering high-quality ${channel.category.toLowerCase()} content that engages and educates our audience.`
              }],
              markDefs: [],
              style: 'normal'
            }
          ],
          conceptImage: conceptImage
        }
      }

      const result = await client.create(doc)
      console.log(`✅ Created YouTube channel: ${channel.name} (${result._id})`)
    }

    // Create Team Members
    console.log('👥 Creating Team Members...')
    const teamMembers = [
      {
        name: 'Sarah Johnson',
        role: 'Creative Director',
        department: 'Creative',
        bio: 'Leading creative vision with 10+ years of experience in digital media.'
      },
      {
        name: 'Mike Chen',
        role: 'Head of Technology',
        department: 'Engineering',
        bio: 'Technology leader specializing in scalable content delivery systems.'
      },
      {
        name: 'Emily Rodriguez',
        role: 'Content Strategy Lead',
        department: 'Content',
        bio: 'Strategic content planning and audience engagement expert.'
      },
      {
        name: 'David Kim',
        role: 'Senior Producer',
        department: 'Production',
        bio: 'Award-winning producer with expertise in multi-platform content.'
      }
    ]

    for (const member of teamMembers) {
      const profilePhoto = await uploadImage(
        generateSVG(400, 400, member.name.split(' ').map(n => n[0]).join(''), '#2C3E50'),
        `${member.name.toLowerCase().replace(/\s+/g, '-')}-profile`,
        `Profile photo of ${member.name}, ${member.role}`
      )

      const bannerImage = await uploadImage(
        generateSVG(1200, 300, `${member.department} Team`, '#34495E'),
        `${member.name.toLowerCase().replace(/\s+/g, '-')}-banner`,
        `Department banner for ${member.department} team`
      )

      const doc = {
        _type: 'teamMember',
        name: member.name,
        role: member.role,
        department: member.department,
        bio: [
          {
            _key: `bio-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: member.bio
            }],
            markDefs: [],
            style: 'normal'
          }
        ],
        profilePhoto: profilePhoto,
        bannerImage: bannerImage,
        email: `${member.name.toLowerCase().replace(/\s+/g, '.')}@vonasmedia.com`,
        socialLinks: {
          linkedin: `https://linkedin.com/in/${member.name.toLowerCase().replace(/\s+/g, '')}`,
          twitter: `https://twitter.com/${member.name.toLowerCase().replace(/\s+/g, '')}`
        }
      }

      const result = await client.create(doc)
      console.log(`✅ Created team member: ${member.name} (${result._id})`)
    }

    // Create Exclusive Creators
    console.log('⭐ Creating Exclusive Creators...')
    const exclusiveCreators = [
      {
        name: 'Alex Thompson',
        niche: 'Tech Reviews',
        subscribers: '2.5M',
        specialty: 'Latest gadget reviews and tech tutorials'
      },
      {
        name: 'Maria Santos',
        niche: 'Lifestyle & Fashion',
        subscribers: '1.8M',
        specialty: 'Fashion trends and lifestyle content'
      },
      {
        name: 'James Wilson',
        niche: 'Gaming',
        subscribers: '3.2M',
        specialty: 'Professional gaming and esports content'
      }
    ]

    for (const creator of exclusiveCreators) {
      const profilePhoto = await uploadImage(
        generateSVG(400, 400, creator.name.split(' ').map(n => n[0]).join(''), '#E74C3C'),
        `${creator.name.toLowerCase().replace(/\s+/g, '-')}-profile`,
        `Profile photo of ${creator.name}, exclusive creator specializing in ${creator.niche}`
      )

      const bannerImage = await uploadImage(
        generateSVG(1200, 300, creator.niche, '#8E44AD'),
        `${creator.name.toLowerCase().replace(/\s+/g, '-')}-banner`,
        `Content banner for ${creator.name}'s ${creator.niche} content`
      )

      const doc = {
        _type: 'exclusiveCreator',
        name: creator.name,
        niche: creator.niche,
        subscribers: creator.subscribers,
        bio: [
          {
            _key: `bio-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: `Exclusive creator specializing in ${creator.specialty}. With ${creator.subscribers} subscribers, brings unique perspective to our platform.`
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
          instagram: `https://instagram.com/${creator.name.toLowerCase().replace(/\s+/g, '')}`
        }
      }

      const result = await client.create(doc)
      console.log(`✅ Created exclusive creator: ${creator.name} (${result._id})`)
    }

    // Create Blog Posts
    console.log('📝 Creating Blog Posts...')
    const blogPosts = [
      {
        title: 'The Future of Content Creation in 2024',
        category: 'Industry Insights',
        excerpt: 'Exploring emerging trends and technologies shaping content creation.'
      },
      {
        title: 'Building Authentic Brand Partnerships',
        category: 'Business Strategy',
        excerpt: 'How to create meaningful collaborations between creators and brands.'
      },
      {
        title: 'Maximizing Audience Engagement Across Platforms',
        category: 'Social Media',
        excerpt: 'Strategies for cross-platform content optimization and engagement.'
      }
    ]

    for (const post of blogPosts) {
      const featuredImage = await uploadImage(
        generateSVG(1200, 630, 'Blog Post', '#3498DB'),
        `${post.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-featured`,
        `Featured image for blog post: ${post.title}`
      )

      const doc = {
        _type: 'post',
        title: post.title,
        slug: {
          _type: 'slug',
          current: post.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-')
        },
        author: 'Vonas Media Team',
        publishedAt: new Date().toISOString(),
        featuredImage: featuredImage,
        excerpt: post.excerpt,
        categories: [post.category],
        body: [
          {
            _key: `intro-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: `${post.excerpt} In this comprehensive guide, we'll explore the key concepts and strategies that matter most in today's digital landscape.`
            }],
            markDefs: [],
            style: 'normal'
          },
          {
            _key: `heading-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: 'Key Insights'
            }],
            markDefs: [],
            style: 'h2'
          },
          {
            _key: `content-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: 'Our research shows that successful content strategies require a deep understanding of audience behavior, platform algorithms, and emerging technologies. By focusing on authentic storytelling and data-driven insights, creators can build sustainable, engaging content ecosystems.'
            }],
            markDefs: [],
            style: 'normal'
          }
        ]
      }

      const result = await client.create(doc)
      console.log(`✅ Created blog post: ${post.title} (${result._id})`)
    }

    // Create Knowledge Base articles
    console.log('📚 Creating Knowledge Base articles...')
    const kbArticles = [
      {
        title: 'Getting Started with Vonas Media',
        category: 'Onboarding',
        content: 'Complete guide to getting started with our platform and services.'
      },
      {
        title: 'Content Guidelines and Best Practices',
        category: 'Guidelines',
        content: 'Essential guidelines for creating high-quality content that resonates with audiences.'
      },
      {
        title: 'Analytics and Performance Tracking',
        category: 'Analytics',
        content: 'How to use our analytics tools to track and improve content performance.'
      }
    ]

    for (const article of kbArticles) {
      const thumbnailImage = await uploadImage(
        generateSVG(600, 400, 'Knowledge Base', '#27AE60'),
        `kb-${article.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-thumb`,
        `Knowledge base article thumbnail: ${article.title}`
      )

      const doc = {
        _type: 'knowledgeBase',
        title: article.title,
        slug: {
          _type: 'slug',
          current: article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-')
        },
        category: article.category,
        thumbnailImage: thumbnailImage,
        content: [
          {
            _key: `intro-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: article.content
            }],
            markDefs: [],
            style: 'normal'
          },
          {
            _key: `details-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: 'This comprehensive resource provides step-by-step instructions, examples, and best practices to help you succeed on our platform.'
            }],
            markDefs: [],
            style: 'normal'
          }
        ],
        tags: [article.category.toLowerCase(), 'guide', 'documentation'],
        publishedAt: new Date().toISOString(),
        featured: Math.random() > 0.5
      }

      const result = await client.create(doc)
      console.log(`✅ Created knowledge base article: ${article.title} (${result._id})`)
    }

    // Create FAQ items
    console.log('❓ Creating FAQ items...')
    const faqItems = [
      {
        question: 'How do I get started with Vonas Media?',
        answer: 'Getting started is easy! Simply create an account, complete your profile, and explore our content creation tools and resources.'
      },
      {
        question: 'What types of content can I create?',
        answer: 'Our platform supports various content types including videos, articles, podcasts, and interactive media across multiple categories.'
      },
      {
        question: 'How does monetization work?',
        answer: 'We offer multiple monetization options including ad revenue sharing, sponsored content opportunities, and direct creator support features.'
      },
      {
        question: 'Can I collaborate with other creators?',
        answer: 'Yes! Our platform includes collaboration tools that make it easy to work with other creators on joint projects and cross-promotional content.'
      }
    ]

    for (const faq of faqItems) {
      const doc = {
        _type: 'faq',
        question: faq.question,
        answer: [
          {
            _key: `answer-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: faq.answer
            }],
            markDefs: [],
            style: 'normal'
          }
        ],
        category: 'General',
        featured: Math.random() > 0.5,
        publishedAt: new Date().toISOString()
      }

      const result = await client.create(doc)
      console.log(`✅ Created FAQ: ${faq.question} (${result._id})`)
    }

    // Create Job Board postings
    console.log('💼 Creating Job Board postings...')
    const jobPostings = [
      {
        title: 'Senior Content Creator',
        department: 'Content',
        location: 'Remote',
        type: 'Full-time',
        description: 'Join our team as a Senior Content Creator and help shape the future of digital media.'
      },
      {
        title: 'Video Production Specialist',
        department: 'Production',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        description: 'Seeking an experienced video production specialist to lead our video content initiatives.'
      },
      {
        title: 'Community Manager',
        department: 'Marketing',
        location: 'New York, NY',
        type: 'Full-time',
        description: 'Manage and grow our online community across multiple social media platforms.'
      }
    ]

    for (const job of jobPostings) {
      const companyLogo = await uploadImage(
        generateSVG(200, 200, 'VM', '#E67E22'),
        `job-${job.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-logo`,
        `Vonas Media logo for ${job.title} position`
      )

      const doc = {
        _type: 'jobBoard',
        title: job.title,
        company: 'Vonas Media',
        department: job.department,
        location: job.location,
        jobType: job.type,
        companyLogo: companyLogo,
        description: [
          {
            _key: `desc-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: job.description
            }],
            markDefs: [],
            style: 'normal'
          },
          {
            _key: `req-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: ['strong'],
              text: 'Requirements:'
            }],
            markDefs: [],
            style: 'normal'
          },
          {
            _key: `req-list-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: '• 3+ years of relevant experience\n• Strong portfolio of work\n• Excellent communication skills\n• Passion for digital media and content creation'
            }],
            markDefs: [],
            style: 'normal'
          }
        ],
        requirements: [
          '3+ years of relevant experience',
          'Strong portfolio of work', 
          'Excellent communication skills',
          'Passion for digital media'
        ],
        salaryRange: '$70,000 - $95,000',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        postedDate: new Date().toISOString(),
        active: true
      }

      const result = await client.create(doc)
      console.log(`✅ Created job posting: ${job.title} (${result._id})`)
    }

    // Create Business Documents
    console.log('📊 Creating Business Documents...')
    const businessDocs = [
      {
        title: 'Q4 2024 Performance Report',
        type: 'Report',
        description: 'Comprehensive analysis of Q4 performance metrics and growth indicators.'
      },
      {
        title: 'Content Strategy Roadmap 2025',
        type: 'Strategy',
        description: 'Strategic roadmap for content initiatives and platform expansion in 2025.'
      },
      {
        title: 'Partner Collaboration Guidelines',
        type: 'Guidelines',
        description: 'Framework for successful partnerships and collaboration agreements.'
      }
    ]

    for (const bizDoc of businessDocs) {
      const coverImage = await uploadImage(
        generateSVG(800, 600, bizDoc.type, '#2C3E50'),
        `biz-${bizDoc.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-cover`,
        `Cover image for business document: ${bizDoc.title}`
      )

      const doc = {
        _type: 'businessDoc',
        title: bizDoc.title,
        documentType: bizDoc.type,
        coverImage: coverImage,
        description: [
          {
            _key: `desc-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: bizDoc.description
            }],
            markDefs: [],
            style: 'normal'
          }
        ],
        content: [
          {
            _key: `exec-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: ['strong'],
              text: 'Executive Summary'
            }],
            markDefs: [],
            style: 'h2'
          },
          {
            _key: `summary-${Date.now()}`,
            _type: 'block',
            children: [{
              _key: `span-${Date.now()}`,
              _type: 'span',
              marks: [],
              text: `This document provides comprehensive insights into ${bizDoc.title.toLowerCase()}. Our analysis covers key performance indicators, strategic recommendations, and actionable insights for stakeholders.`
            }],
            markDefs: [],
            style: 'normal'
          }
        ],
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        confidentialityLevel: 'Internal',
        author: 'Vonas Media Business Team'
      }

      const result = await client.create(doc)
      console.log(`✅ Created business document: ${bizDoc.title} (${result._id})`)
    }

    console.log('\n🎉 Content population completed successfully!')
    console.log('\n📋 Summary:')
    console.log('- 5 YouTube ID documents with hero/thumbnail images')
    console.log('- 4 Team Member profiles with photos')
    console.log('- 3 Exclusive Creator profiles with banners')
    console.log('- 3 Blog Posts with featured images')
    console.log('- 3 Knowledge Base articles with thumbnails') 
    console.log('- 4 FAQ items')
    console.log('- 3 Job Board postings with company logos')
    console.log('- 3 Business Documents with cover images')
    console.log('\n✅ All images include proper alt text for accessibility!')
    console.log('\n🔗 Access your Studio at: http://localhost:3333/')

  } catch (error) {
    console.error('❌ Error during content population:', error)
  }
}

// Run the script
populateAllContent()
