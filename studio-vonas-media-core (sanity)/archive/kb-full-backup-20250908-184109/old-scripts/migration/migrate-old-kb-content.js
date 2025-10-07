import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'e4kxcm89',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-09-03',
  token: process.env.SANITY_WRITE_TOKEN, // Make sure to set this
})

// Mapping from old categories to new KB structure
const categoryMapping = {
  'category-company-foundation': {
    articles: {
      'article-about-vonas-media': {
        parent: 'kb.company.vonas-media',
        title: 'About Vonas Media',
        docType: 'reference',
        kind: 'page'
      },
      'article-company-values': {
        parent: 'kb.company.vonas-media',
        title: 'Company Values & Culture',
        docType: 'reference',
        kind: 'page'
      },
      'article-vision-mission-purpose': {
        parent: 'kb.company.vonas-media',
        title: 'Vision, Mission & Purpose',
        docType: 'reference',
        kind: 'page'
      }
    }
  },
  'category-team-management': {
    articles: {
      'article-onboarding-processes': {
        parent: 'kb.company.interns.onboarding',
        title: 'Onboarding Processes & Procedures',
        docType: 'guide',
        kind: 'page'
      },
      'article-team-structure-roles': {
        parent: 'kb.company.hr-finance',
        title: 'Team Structure & Role Definitions',
        docType: 'reference',
        kind: 'page'
      }
    }
  },
  'category-content-production': {
    articles: {
      'article-guest-selection-management': {
        parent: 'kb.production.pre-production.casting-outreach',
        title: 'Guest Selection & Management',
        docType: 'guide',
        kind: 'page'
      },
      'article-video-production-process': {
        parent: 'kb.production.post-production.editing-color',
        title: 'Video Production Workflow',
        docType: 'guide',
        kind: 'page'
      }
    }
  },
  'category-show-specific': {
    articles: {
      'article-off-the-record': {
        parent: 'kb.shows.otr.production',
        title: 'Off The Record - Production Guide',
        docType: 'guide',
        kind: 'page'
      },
      'article-passions-show': {
        parent: 'kb.shows.skyline.production',
        title: 'Skyline Show - Interview Format',
        docType: 'guide',
        kind: 'page'
      }
    }
  },
  'category-tools-systems': {
    articles: {
      'article-content-creation-tools': {
        parent: 'kb.tools',
        title: 'Content Creation Tools & Software',
        docType: 'reference',
        kind: 'page'
      }
    }
  }
}

// Generate content based on article info
function generateContent(articleId, title, tags, docType) {
  const baseContent = [
    {
      _type: 'block',
      _key: 'intro',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: `This is a comprehensive guide covering ${title.toLowerCase()}.`
        }
      ]
    },
    {
      _type: 'block',
      _key: 'overview',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'Overview'
        }
      ]
    }
  ]

  // Add content based on article type and tags
  if (tags.includes('company-overview')) {
    baseContent.push({
      _type: 'block',
      _key: 'company-info',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Vonas Media is a content creation company focused on building authentic connections between creators and audiences through high-quality video production and strategic partnerships.'
        }
      ]
    })
  }

  if (tags.includes('onboarding')) {
    baseContent.push({
      _type: 'block',
      _key: 'onboarding-steps',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Our onboarding process ensures new team members are properly integrated into our workflow and company culture. This includes training on our tools, processes, and expectations.'
        }
      ]
    })
  }

  if (tags.includes('production-tools') || tags.includes('tools')) {
    baseContent.push({
      _type: 'block',
      _key: 'tools-info',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'We use industry-standard tools for content creation, editing, and project management. Our tech stack is carefully chosen to optimize efficiency and quality.'
        }
      ]
    })
  }

  if (tags.includes('video-production')) {
    baseContent.push({
      _type: 'block',
      _key: 'production-info',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Our video production process follows a structured workflow from pre-production planning through post-production delivery, ensuring consistent quality and timely delivery.'
        }
      ]
    })
  }

  if (tags.includes('off-the-record')) {
    baseContent.push({
      _type: 'block',
      _key: 'otr-info',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Off The Record is our flagship interview series featuring candid conversations with industry leaders, focusing on authentic insights and behind-the-scenes perspectives.'
        }
      ]
    })
  }

  if (tags.includes('guest-management')) {
    baseContent.push({
      _type: 'block',
      _key: 'guest-info',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Guest selection and management is crucial to our content success. We maintain relationships with creators, industry experts, and thought leaders to ensure engaging and valuable content.'
        }
      ]
    })
  }

  return baseContent
}

async function migrateOldKBContent() {
  console.log('Starting migration of old KB content...')
  
  try {
    // Fetch old knowledge articles
    const oldArticles = await client.fetch('*[_type == "knowledgeArticle" && !(_id in path("drafts.**"))]')
    console.log(`Found ${oldArticles.length} articles to migrate`)

    const migrations = []

    for (const article of oldArticles) {
      console.log(`Processing article: ${article._id}`)
      
      // Find mapping for this article
      const categoryRef = article.category?._ref
      const categoryMap = categoryMapping[categoryRef]
      
      if (!categoryMap || !categoryMap.articles[article._id]) {
        console.log(`No mapping found for article ${article._id}, skipping...`)
        continue
      }

      const mapping = categoryMap.articles[article._id]
      
      // Generate new kbItem document
      const newKbItem = {
        _type: 'kbItem',
        _id: article._id.replace('article-', 'kb-migrated-'),
        title: mapping.title,
        slug: article.slug,
        kind: mapping.kind,
        docType: mapping.docType,
        parent: {
          _type: 'reference',
          _ref: mapping.parent
        },
        content: generateContent(article._id, mapping.title, article.tags || [], mapping.docType),
        tags: (article.tags || []).map(tag => ({
          _type: 'reference',
          _ref: `kb-tag-${tag}`, // We'll need to create these tags
          _key: tag
        })),
        status: 'published',
        priority: 'medium',
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }

      migrations.push(newKbItem)
    }

    // Create KB tags first
    const allTags = new Set()
    oldArticles.forEach(article => {
      (article.tags || []).forEach(tag => allTags.add(tag))
    })

    console.log(`Creating ${allTags.size} KB tags...`)
    const tagCreations = Array.from(allTags).map(tag => ({
      _type: 'kbTag',
      _id: `kb-tag-${tag}`,
      name: tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      slug: {
        _type: 'slug',
        current: tag
      },
      description: `Tag for ${tag.replace(/-/g, ' ')} related content`,
      color: '#3B82F6' // Default blue color
    }))

    // Execute tag creation
    for (const tag of tagCreations) {
      try {
        await client.createOrReplace(tag)
        console.log(`Created tag: ${tag.name}`)
      } catch (error) {
        console.error(`Error creating tag ${tag.name}:`, error)
      }
    }

    // Execute migrations
    console.log(`Migrating ${migrations.length} articles...`)
    for (const item of migrations) {
      try {
        await client.createOrReplace(item)
        console.log(`Migrated: ${item.title}`)
      } catch (error) {
        console.error(`Error migrating ${item.title}:`, error)
      }
    }

    console.log('Migration completed successfully!')
    console.log(`Migrated ${migrations.length} articles and created ${tagCreations.length} tags`)

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Export the function so it can be run
export { migrateOldKBContent }

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateOldKBContent()
}
