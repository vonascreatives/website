import { Metadata } from 'next';
import React from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/images/og-default.svg',
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section
  } = config;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title,
      description,
      type,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };

  return metadata;
}

// Structured Data Generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vonas Media',
    url: 'https://vonasmedia.com',
    logo: 'https://vonasmedia.com/assets/img/logo/logo-white.png',
    description: 'Building digital success stories through content creation and channel management',
    sameAs: [
      'https://twitter.com/vonasmedia',
      'https://linkedin.com/company/vonasmedia',
      'https://instagram.com/vonasmedia'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'hello@vonasmedia.com'
    }
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vonas Media',
    url: 'https://vonasmedia.com',
    description: 'Building digital success stories through content creation and channel management',
    publisher: {
      '@type': 'Organization',
      name: 'Vonas Media'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://vonasmedia.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generatePersonSchema(creator: any) {
  if (!creator) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: creator.name,
    description: creator.bio?.[0]?.children?.[0]?.text || creator.headline,
    image: creator.heroImage?.url || creator.profileImage?.url,
    url: `https://vonasmedia.com/creators/${creator.slug?.current}`,
    sameAs: [
      creator.socialLinks?.instagram && `https://instagram.com/${creator.socialLinks.instagram}`,
      creator.socialLinks?.youtube && `https://youtube.com/@${creator.socialLinks.youtube}`,
      creator.socialLinks?.tiktok && `https://tiktok.com/@${creator.socialLinks.tiktok}`,
      creator.socialLinks?.twitter && `https://twitter.com/${creator.socialLinks.twitter}`,
    ].filter(Boolean),
    knowsAbout: creator.categories || [],
    worksFor: {
      '@type': 'Organization',
      name: 'Vonas Media'
    }
  };
}

export function generateArticleSchema(article: any) {
  if (!article) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.description,
    image: article.featuredImage?.url,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Vonas Media'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vonas Media',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vonasmedia.com/assets/img/logo/logo-white.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://vonasmedia.com/news/${article.slug?.current}`
    }
  };
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Component for injecting structured data
export function StructuredData({ data }: { data: any }): React.ReactElement | null {
  if (!data) return null;

  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data)
    }
  });
}

// SEO constants
export const SEO_DEFAULTS = {
  siteName: 'Vonas Media',
  siteUrl: 'https://vonasmedia.com',
  defaultImage: '/images/og-default.svg',
  homepageImage: '/images/og-homepage.svg',
  twitterHandle: '@vonasmedia',
  defaultKeywords: [
    'content creation',
    'digital marketing',
    'creators',
    'channel management',
    'social media',
    'influencer marketing'
  ]
};