import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { DocsLayout } from '@/components/layout/layout-consolidated'
import { Breadcrumbs } from '@/components/docs/breadcrumbs'
import { Pagination } from '@/components/docs/pagination'
import { PortableTextRenderer } from '@/components/docs/portable-text-renderer'
import {
  getDocsPageBySlug,
  getDocsNavigation,
  getAllDocsRoutes,
  getPreviousNext,
  generateTableOfContents,
  type DocsPage
} from '@/lib/sanity-queries'
import { generateMetadata as generateSEOMetadata, generateArticleSchema, generateBreadcrumbSchema, StructuredData, SEO_DEFAULTS } from '@/utils/seo'

interface PageProps {
  params: Promise<{
    slug?: string[]
  }>
}

export async function generateStaticParams() {
  const routes = await getAllDocsRoutes()
  
  return routes.map((route) => ({
    slug: route === '/docs' ? [] : route.replace('/docs/', '').split('/')
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugArray } = await params
  const slug = slugArray ? `/knowledge-base/${slugArray.join('/')}` : '/knowledge-base'
  const page = await getDocsPageBySlug(slug)
  
  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested knowledge base page could not be found.'
    }
  }
  
  const title = page.seoTitle || page.title
  const description = page.seoDescription || page.description || 'Comprehensive knowledge base and guides for Vonas Media services.'
  const keywords = page.tags || ['knowledge base', 'guides', 'help', 'support']
  const url = `${SEO_DEFAULTS.siteUrl}${slug}`
  
  return generateSEOMetadata({
    title,
    description,
    keywords,
    url,
    type: 'article',
    publishedTime: page.lastUpdated,
    author: page.author?.name,
  })
}

export default async function KnowledgeBasePage({ params }: PageProps) {
  const { slug: slugArray } = await params
  const slug = slugArray ? `/knowledge-base/${slugArray.join('/')}` : '/knowledge-base'
  const [page, navigation] = await Promise.all([
    getDocsPageBySlug(slug),
    getDocsNavigation()
  ])
  
  if (!page) {
    notFound()
  }
  
  const { prev, next } = await getPreviousNext(slug)
  const toc = generateTableOfContents(page.body)
  
  // Generate breadcrumbs
  const breadcrumbs = []
  if (page.section) {
    breadcrumbs.push({
      title: page.section.title,
      href: `/knowledge-base/${page.section.slug.current}`
    })
  }

  // Generate structured data
  const articleSchema = generateArticleSchema({
    headline: page.title,
    description: page.description,
    author: page.author?.name || 'Vonas Media',
    datePublished: page.lastUpdated,
    dateModified: page.lastUpdated,
    url: `${SEO_DEFAULTS.siteUrl}${slug}`,
    image: SEO_DEFAULTS.defaultImage,
  })

  const breadcrumbSchema = breadcrumbs.length > 0 ? generateBreadcrumbSchema(
    breadcrumbs.map((crumb, index) => ({
      name: crumb.title,
      url: `${SEO_DEFAULTS.siteUrl}${crumb.href}`
    }))
  ) : null
  
  return (
    <>
      <StructuredData data={articleSchema} />
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      <DocsLayout navigation={navigation} toc={toc}>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} />
        )}
        
        {/* Page Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-xl text-muted-foreground">
              {page.description}
            </p>
          )}
          {page.tags && page.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {page.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Page Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <PortableTextRenderer content={page.body} />
        </div>
        
        {/* Page Footer */}
        <div className="pt-8 mt-8 border-t">
          {page.lastUpdated && (
            <p className="text-sm text-muted-foreground mb-4">
              Last updated: {new Date(page.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
          {page.author && (
            <p className="text-sm text-muted-foreground">
              By {page.author.name}
            </p>
          )}
        </div>
        
        {/* Pagination */}
        <Pagination previous={prev || undefined} next={next || undefined} />
      </div>
    </DocsLayout>
    </>
  )
}