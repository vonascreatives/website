import { MetadataRoute } from 'next'
import { SEO_DEFAULTS } from '@/utils/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/studio/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: `${SEO_DEFAULTS.siteUrl}/sitemap`,
  }
}
