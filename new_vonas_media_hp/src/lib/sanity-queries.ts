import { client } from './sanity-client'

// Fallback data for when Sanity is unavailable
function getFallbackSections(): DocsSection[] {
  return [
    {
      _id: 'fallback-getting-started',
      title: 'Getting Started',
      slug: { current: 'getting-started' },
      description: 'Learn the basics of content creation and channel building',
      order: 1,
      isCollapsible: false,
      isPublished: true
    },
    {
      _id: 'fallback-content-strategy',
      title: 'Content Strategy',
      slug: { current: 'content-strategy' },
      description: 'Advanced strategies for content planning and execution',
      order: 2,
      isCollapsible: true,
      isPublished: true
    },
    {
      _id: 'fallback-analytics',
      title: 'Analytics & Performance',
      slug: { current: 'analytics' },
      description: 'Track and optimize your content performance',
      order: 3,
      isCollapsible: true,
      isPublished: true
    }
  ]
}

function getFallbackPages(): DocsPage[] {
  const sections = getFallbackSections()
  
  return [
    {
      _id: 'fallback-welcome',
      title: 'Welcome to Vonas Media',
      slug: { current: 'docs' },
      description: 'Your guide to building successful content channels',
      section: sections[0],
      order: 1,
      body: [
        {
          _type: 'block',
          children: [
            {
              text: 'Welcome to the Vonas Media Knowledge Base. Here you\'ll find comprehensive guides, strategies, and insights to help you build and grow successful content channels.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ text: 'What You\'ll Learn' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Our documentation covers everything from basic content creation principles to advanced analytics and performance optimization. Whether you\'re just starting out or looking to scale your existing channels, you\'ll find valuable insights here.'
            }
          ]
        }
      ],
      tableOfContents: true,
      breadcrumbs: true,
      lastUpdated: '2024-01-15T10:00:00Z',
      author: {
        _id: 'vonas-team',
        name: 'Vonas Team',
        slug: { current: 'vonas-team' }
      },
      tags: ['welcome', 'getting-started'],
      isPublished: true,
      seoTitle: 'Vonas Media Knowledge Base - Content Creation Guide',
      seoDescription: 'Comprehensive guide to building successful content channels with Vonas Media'
    },
    {
      _id: 'fallback-content-framework',
      title: 'Content Strategy Framework',
      slug: { current: 'content-strategy-framework' },
      description: 'Our systematic approach to building content that scales and converts',
      section: sections[1],
      order: 1,
      body: [
        {
          _type: 'block',
          children: [
            {
              text: 'Content strategy is the backbone of successful channel building. Our framework focuses on three core principles: audience understanding, format optimization, and cultural resonance.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'The Three Pillars' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: '1. Audience Understanding: Deep research into viewer behavior, consumption patterns, and cultural context.'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              text: '2. Format Optimization: Tailoring content structure, length, and style to platform algorithms and user preferences.'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              text: '3. Cultural Resonance: Creating content that speaks to local culture while maintaining universal appeal.'
            }
          ]
        }
      ],
      tableOfContents: true,
      breadcrumbs: true,
      lastUpdated: '2024-01-12T14:30:00Z',
      author: {
        _id: 'vonas-team',
        name: 'Vonas Team',
        slug: { current: 'vonas-team' }
      },
      tags: ['strategy', 'content', 'framework'],
      isPublished: true,
      seoTitle: 'Content Strategy Framework - Vonas Media',
      seoDescription: 'Learn our systematic approach to building content that scales and converts'
    },
    {
      _id: 'fallback-analytics-guide',
      title: 'Analytics & Performance Tracking',
      slug: { current: 'analytics-performance' },
      description: 'Track and optimize your content performance with data-driven insights',
      section: sections[2],
      order: 1,
      body: [
        {
          _type: 'block',
          children: [
            {
              text: 'Understanding your content performance is crucial for growth. This guide covers the key metrics to track and how to use them to optimize your strategy.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Key Metrics to Track' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Focus on engagement rate, watch time, click-through rates, and conversion metrics rather than just view counts.'
            }
          ]
        }
      ],
      tableOfContents: true,
      breadcrumbs: true,
      lastUpdated: '2024-01-10T16:45:00Z',
      author: {
        _id: 'vonas-team',
        name: 'Vonas Team',
        slug: { current: 'vonas-team' }
      },
      tags: ['analytics', 'performance', 'metrics'],
      isPublished: true,
      seoTitle: 'Analytics & Performance Tracking - Vonas Media',
      seoDescription: 'Learn how to track and optimize your content performance with data-driven insights'
    },
    {
      _id: 'fallback-channel-setup',
      title: 'Channel Setup & Optimization',
      slug: { current: 'channel-setup' },
      description: 'Complete guide to setting up and optimizing your content channels',
      section: sections[0],
      order: 2,
      body: [
        {
          _type: 'block',
          children: [
            {
              text: 'Setting up your channel properly from the start is crucial for long-term success. This guide covers everything from branding to technical setup.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ text: 'Channel Branding' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Your channel branding should be consistent across all platforms. This includes your logo, color scheme, thumbnails, and overall visual identity.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ text: 'Technical Setup' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Ensure your channel settings are optimized for discovery. This includes proper SEO in your channel description, relevant keywords, and complete profile information.'
            }
          ]
        }
      ],
      tableOfContents: true,
      breadcrumbs: true,
      lastUpdated: '2024-01-14T09:15:00Z',
      author: {
        _id: 'vonas-team',
        name: 'Vonas Team',
        slug: { current: 'vonas-team' }
      },
      tags: ['setup', 'branding', 'optimization'],
      isPublished: true,
      seoTitle: 'Channel Setup & Optimization - Vonas Media',
      seoDescription: 'Complete guide to setting up and optimizing your content channels for success'
    },
    {
      _id: 'fallback-monetization',
      title: 'Monetization Strategies',
      slug: { current: 'monetization-strategies' },
      description: 'Explore various ways to monetize your content and build sustainable revenue',
      section: sections[1],
      order: 2,
      body: [
        {
          _type: 'block',
          children: [
            {
              text: 'Building a sustainable income from content creation requires a diversified approach. Learn about the various monetization strategies available to creators.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ text: 'Revenue Streams' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Diversify your income with multiple revenue streams: ad revenue, sponsorships, merchandise, memberships, and direct fan support.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ text: 'Building Partnerships' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Develop relationships with brands that align with your content and audience. Authentic partnerships perform better than generic sponsorships.'
            }
          ]
        }
      ],
      tableOfContents: true,
      breadcrumbs: true,
      lastUpdated: '2024-01-13T11:20:00Z',
      author: {
        _id: 'vonas-team',
        name: 'Vonas Team',
        slug: { current: 'vonas-team' }
      },
      tags: ['monetization', 'revenue', 'partnerships'],
      isPublished: true,
      seoTitle: 'Monetization Strategies - Vonas Media',
      seoDescription: 'Learn various ways to monetize your content and build sustainable revenue streams'
    }
  ]
}

// Types based on Sanity schemas
export interface DocsSection {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  parent?: DocsSection
  order: number
  isCollapsible: boolean
  icon?: string
  isPublished: boolean
}

export interface DocsPage {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  section: DocsSection
  order: number
  body: any[] // PortableText content
  tableOfContents: boolean
  breadcrumbs: boolean
  lastUpdated: string
  author?: any
  tags?: string[]
  isPublished: boolean
  seoTitle?: string
  seoDescription?: string
}

export interface NavigationItem {
  title: string
  href: string
  items?: NavigationItem[]
  noLink?: boolean
  tag?: string
  order: number
}

export interface JobPost {
  _id: string
  title: string
  slug: { current: string }
  team?: string
  location?: string
  jobType?: string
  description?: any[]
  requirements?: string[]
  compensation?: string
  applyUrl?: string
  active: boolean
  publishedAt: string
  mainImage?: string
}

export interface JobTest {
  _id: string
  title: string
  slug: { current: string }
  content: any[]
  contactPerson?: {
    _id: string
    name: string
    email?: string
    image?: string
  }
  supportedDocuments?: any[]
  relatedFAQs?: any[]
  order: number
  isActive: boolean
}

// GROQ Queries
const DOCS_SECTION_QUERY = `
  _id,
  title,
  slug,
  description,
  parent->{
    _id,
    title,
    slug
  },
  order,
  isCollapsible,
  icon,
  isPublished
`

const DOCS_PAGE_QUERY = `
  _id,
  title,
  slug,
  description,
  section->{
    ${DOCS_SECTION_QUERY}
  },
  order,
  body,
  tableOfContents,
  breadcrumbs,
  lastUpdated,
  author->{
    _id,
    name,
    slug
  },
  tags,
  isPublished,
  seoTitle,
  seoDescription
`

// Get all published documentation sections
export async function getDocsSections(): Promise<DocsSection[]> {
  const query = `*[_type == "docsSection" && isPublished == true] | order(order asc) {
    ${DOCS_SECTION_QUERY}
  }`
  
  try {
    const sections = await client.fetch(query)
    if (sections && sections.length > 0) {
      return sections
    }
    // Return fallback data if no sections found
    return getFallbackSections()
  } catch (error) {
    console.warn('Failed to fetch docs sections from Sanity, using fallback data:', error)
    return getFallbackSections()
  }
}

// Get all published documentation pages
export async function getDocsPages(): Promise<DocsPage[]> {
  const query = `*[_type == "docsPage" && isPublished == true] | order(section->order asc, order asc) {
    ${DOCS_PAGE_QUERY}
  }`
  
  try {
    const pages = await client.fetch(query)
    if (pages && pages.length > 0) {
      return pages
    }
    // Return fallback data if no pages found
    return getFallbackPages()
  } catch (error) {
    console.warn('Failed to fetch docs pages from Sanity, using fallback data:', error)
    return getFallbackPages()
  }
}

// Get a specific documentation page by slug
export async function getDocsPageBySlug(slug: string): Promise<DocsPage | null> {
  // Handle root docs page
  const searchSlug = slug === '/docs' ? 'docs' : slug.replace('/docs/', '')
  
  const query = `*[_type == "docsPage" && slug.current == $searchSlug && isPublished == true][0] {
    ${DOCS_PAGE_QUERY}
  }`
  
  try {
    const page = await client.fetch(query, { searchSlug })
    if (page) {
      return page
    }
    // Check fallback data
    const fallbackPages = getFallbackPages()
    return fallbackPages.find((p: DocsPage) => p.slug.current === searchSlug) || null
  } catch (error) {
    console.warn('Failed to fetch docs page from Sanity, checking fallback data:', error)
    const fallbackPages = getFallbackPages()
    return fallbackPages.find((p: DocsPage) => p.slug.current === searchSlug) || null
  }
}

// Get pages within a specific section
export async function getDocsPagesBySection(sectionSlug: string): Promise<DocsPage[]> {
  const query = `*[_type == "docsPage" && section->slug.current == $sectionSlug && isPublished == true] | order(order asc) {
    ${DOCS_PAGE_QUERY}
  }`
  
  return await client.fetch(query, { sectionSlug })
}

// Build navigation structure from Sanity data
export async function getDocsNavigation(): Promise<NavigationItem[]> {
  const sections = await getDocsSections()
  const pages = await getDocsPages()
  
  // Group pages by section
  const pagesBySection = pages.reduce((acc, page) => {
    const sectionId = page.section._id
    if (!acc[sectionId]) {
      acc[sectionId] = []
    }
    acc[sectionId].push(page)
    return acc
  }, {} as Record<string, DocsPage[]>)
  
  // Build navigation tree
  const navigation: NavigationItem[] = []
  
  // Process root sections (no parent)
  const rootSections = sections.filter(section => !section.parent)
  
  for (const section of rootSections) {
    const sectionPages = pagesBySection[section._id] || []
    const childSections = sections.filter(child => child.parent?._id === section._id)
    
    const navItem: NavigationItem = {
      title: section.title,
      href: `/docs/${section.slug.current}`,
      noLink: true,
      order: section.order,
      items: []
    }
    
    // Add pages to section
    for (const page of sectionPages) {
      navItem.items!.push({
        title: page.title,
        href: `/docs/${page.slug.current}`,
        order: page.order
      })
    }
    
    // Add child sections
    for (const childSection of childSections) {
      const childPages = pagesBySection[childSection._id] || []
      const childNavItem: NavigationItem = {
        title: childSection.title,
        href: `/docs/${childSection.slug.current}`,
        noLink: true,
        order: childSection.order,
        items: []
      }
      
      for (const page of childPages) {
        childNavItem.items!.push({
          title: page.title,
          href: `/docs/${page.slug.current}`,
          order: page.order
        })
      }
      
      navItem.items!.push(childNavItem)
    }
    
    // Sort items by order
    navItem.items!.sort((a, b) => a.order - b.order)
    
    navigation.push(navItem)
  }
  
  // Sort navigation by order
  navigation.sort((a, b) => a.order - b.order)
  
  return navigation
}

// Get all page routes for static generation
export async function getAllDocsRoutes(): Promise<string[]> {
  const pages = await getDocsPages()
  return pages.map(page => page.slug.current)
}

// Get table of contents from page content
export function generateTableOfContents(body: any[]): { id: string; title: string; level: number }[] {
  const toc: { id: string; title: string; level: number }[] = []
  
  if (!body) return toc
  
  body.forEach((block) => {
    if (block._type === 'block' && block.style && block.style.match(/^h[1-6]$/)) {
      const level = parseInt(block.style.replace('h', ''))
      const title = block.children
        ?.map((child: any) => child.text)
        ?.join('') || ''
      
      if (title) {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        
        toc.push({ id, title, level })
      }
    }
  })
  
  return toc
}

// Get previous and next pages for navigation
export async function getPreviousNext(currentSlug: string): Promise<{
  prev: { title: string; href: string } | null
  next: { title: string; href: string } | null
}> {
  const pages = await getDocsPages()
  const currentIndex = pages.findIndex(page => page.slug.current === currentSlug)
  
  if (currentIndex === -1) {
    return { prev: null, next: null }
  }
  
  const prev = currentIndex > 0 ? pages[currentIndex - 1] : null
  const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null
  
  return {
    prev: prev ? {
      title: prev.title,
      href: `/docs/${prev.slug.current}`
    } : null,
    next: next ? {
      title: next.title,
      href: `/docs/${next.slug.current}`
    } : null
  }
}

// Job Posts Queries
export async function getJobPosts(): Promise<JobPost[]> {
  try {
    const query = `*[_type == "jobBoard" && active == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      team,
      location,
      jobType,
      description,
      requirements,
      compensation,
      applyUrl,
      active,
      publishedAt,
      "mainImage": mainImage.asset->url
    }`
    
    const jobs = await client.fetch(query)
    return jobs || []
  } catch (error) {
    console.error('Error fetching job posts:', error)
    return []
  }
}

export async function getJobPostBySlug(slug: string): Promise<JobPost | null> {
  try {
    const query = `*[_type == "jobBoard" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      team,
      location,
      jobType,
      description,
      requirements,
      compensation,
      applyUrl,
      active,
      publishedAt
    }`
    
    const job = await client.fetch(query, { slug })
    return job || null
  } catch (error) {
    console.error('Error fetching job post:', error)
    return null
  }
}

// Job Tests Queries
export async function getJobTests(): Promise<JobTest[]> {
  try {
    const query = `*[_type == "jobTests" && isActive == true] | order(order asc) {
      _id,
      title,
      slug,
      content,
      contactPerson->{
        _id,
        name,
        email,
        image
      },
      supportedDocuments[]->{
        _id,
        title,
        slug
      },
      relatedFAQs[]->{
        _id,
        question,
        slug
      },
      order,
      isActive
    }`
    
    const tests = await client.fetch(query)
    return tests || []
  } catch (error) {
    console.error('Error fetching job tests:', error)
    return []
  }
}

export async function getJobTestBySlug(slug: string): Promise<JobTest | null> {
  try {
    const query = `*[_type == "jobTests" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      content,
      contactPerson->{
        _id,
        name,
        email,
        image
      },
      supportedDocuments[]->{
        _id,
        title,
        slug
      },
      relatedFAQs[]->{
        _id,
        question,
        slug
      },
      order,
      isActive
    }`
    
    const test = await client.fetch(query, { slug })
    return test || null
  } catch (error) {
    console.error('Error fetching job test:', error)
    return null
  }
}