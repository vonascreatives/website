import { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity'
import { SEO_DEFAULTS } from '@/utils/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_DEFAULTS.siteUrl

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/creators`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/channels`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/knowledge-base`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    if (!sanityClient) {
      console.warn('Sanity client not available, returning static routes only')
      return staticRoutes
    }

    // Dynamic creator routes
    const creators = await sanityClient.fetch(`
      *[_type == "creator" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt
      }
    `)

    const creatorRoutes: MetadataRoute.Sitemap = creators.map((creator: any) => ({
      url: `${baseUrl}/creators/${creator.slug}`,
      lastModified: new Date(creator._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic channel routes
    const channels = await sanityClient.fetch(`
      *[_type == "channel" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt
      }
    `)

    const channelRoutes: MetadataRoute.Sitemap = channels.map((channel: any) => ({
      url: `${baseUrl}/channels/${channel.slug}`,
      lastModified: new Date(channel._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Dynamic docs routes
    const docs = await sanityClient.fetch(`
      *[_type == "docsPage" && defined(slug)] {
        slug,
        _updatedAt
      }
    `)

    const docsRoutes: MetadataRoute.Sitemap = docs.map((doc: any) => ({
      url: `${baseUrl}${doc.slug}`,
      lastModified: new Date(doc._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Dynamic knowledge base routes
    const kbPages = await sanityClient.fetch(`
      *[_type == "knowledgeBase" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt
      }
    `)

    const kbRoutes: MetadataRoute.Sitemap = kbPages.map((page: any) => ({
      url: `${baseUrl}/knowledge-base/${page.slug}`,
      lastModified: new Date(page._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...creatorRoutes, ...channelRoutes, ...docsRoutes, ...kbRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes if dynamic content fails
    return staticRoutes
  }
}
