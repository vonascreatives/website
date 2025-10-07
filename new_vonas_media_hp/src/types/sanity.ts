// Sanity CMS data types

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SanityAuthor {
  _id: string;
  _type: 'author';
  name: string;
  slug?: SanitySlug;
  image?: SanityImage;
  bio?: string;
}

export interface SanityCategory {
  _id: string;
  _type: 'category';
  title: string;
  slug?: SanitySlug;
  description?: string;
}

export interface SanitySEO {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: SanityImage;
}

export interface SanityBlockContent {
  _type: 'block';
  _key: string;
  style?: string;
  children: Array<{
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key: string;
    href?: string;
  }>;
}

export interface SanityBlogPost {
  _id: string;
  _type: 'post';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt: string;
  heroImage?: string; // URL string from Sanity query
  heroImageAlt?: string; // Alt text from Sanity query
  author?: SanityAuthor;
  category?: string;
  categories?: SanityCategory[];
  body?: SanityBlockContent[];
  readTime?: number;
  seo?: SanitySEO;
  featured?: boolean;
  tags?: string[];
}

// Transformed blog post for frontend use
export interface TransformedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  heroImage?: string;
  heroImageAlt?: string;
  author?: string;
  category?: string;
  categories?: string[];
  body?: any;
  readTime?: number;
  featured?: boolean;
  tags?: string[];
  // Legacy fields for compatibility
  img?: string;
  date: string;
  desc?: string;
}

// News data response from Sanity
export interface SanityNewsResponse {
  posts: SanityBlogPost[];
  total: number;
}

// Generic Sanity document
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

// Sanity reference
export interface SanityReference {
  _type: 'reference';
  _ref: string;
}

// Sanity portable text
export type SanityPortableText = SanityBlockContent[];

// Common Sanity query result
export interface SanityQueryResult<T = any> {
  result: T;
  query: string;
  params?: Record<string, any>;
}