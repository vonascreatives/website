import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-09-03',
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

// ===== Queries aligned to hierarchical kbItem schema (kind + parent + slug path) =====

// Dynamic Shows dropdown: top-level show folders
export const kbShowsPagesQuery = `
  *[_type == "kb" && kind == "show" && coalesce(hidden,false) == false && !(_id in path("drafts.**"))]
  | order(order asc, title asc) {
    _id,
    title,
    slug,
    order
  }
`

// Optional: company pages dropdown (kept for legacy/other sections)
export const kbCompanyPagesQuery = `
  *[_type == "kb" && coalesce(hidden,false) == false && !(_id in path("drafts.**")) &&
    (defined(kind) && kind == "page") &&
    (category->slug.current == "company" || slug.current match "company/*")
  ]
  | order(order asc, title asc) {
    _id,
    title,
    slug,
    order
  }
`

// Sections for a given page/show slug (e.g., shows/otr)
export const kbSectionsForPageQuery = `
  *[_type == "kb" && kind == "section" && slug.current match ($pageSlug + "/*") && coalesce(hidden,false) == false && !(_id in path("drafts.**"))]
  | order(order asc, title asc) {
    _id,
    title,
    slug,
    order
  }
`

// Items for a given page/show slug: all pages beneath that path
export const kbItemsForPageQuery = `
  *[_type == "kb" && kind == "page" && slug.current match ($pageSlug + "/*") && coalesce(hidden,false) == false && !(_id in path("drafts.**"))]
  | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    type,
    kind,
    tags,
    readTime,
    imageUrl,
    videoUrl,
    embedCode,
    supportingDocs,
    lastUpdated,
    content,
    steps,
    checklist
  }
`

// Item by ID (page or show or section)
export const kbItemByIdQuery = `
  *[_type == "kb" && _id == $itemId && coalesce(hidden,false) == false && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    description,
    type,
    kind,
    parent,
    // derive show id: parent of section, or parent if this is a page directly under show
    "showId": coalesce(parent->parent->_id, parent->_id),
    tags,
    readTime,
    imageUrl,
    videoUrl,
    embedCode,
    supportingDocs,
    lastUpdated,
    content,
    steps,
    checklist,
    faqs[]-> {
      _id,
      title,
      question,
      answer,
      content
    },
    attachments[] {
      _key,
      _type,
      title,
      description,
      asset-> { _id, url }
    }
  }
`

// Item by slug (optional)
export const kbItemBySlugQuery = `
  *[_type == "kb" && slug.current == $slug && coalesce(hidden,false) == false && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    description,
    type,
    kind,
    parent,
    "showId": coalesce(parent->parent->_id, parent->_id),
    tags,
    readTime,
    imageUrl,
    videoUrl,
    embedCode,
    supportingDocs,
    lastUpdated,
    content,
    steps,
    checklist,
    faqs[]-> {
      _id,
      title,
      question,
      answer,
      content
    },
    attachments[] {
      _key,
      _type,
      title,
      description,
      asset-> { _id, url }
    }
  }
`

// Search across KB items (simple text search)
export const kbSearchQuery = `
  *[_type == "kb" && coalesce(hidden,false) == false && (
    title match $q || description match $q || content[].children[].text match $q
  )]
  | order(_updatedAt desc) [0..20] {
    _id,
    title,
    slug,
    description,
    type,
    tags,
    _updatedAt,
    "parentTitle": parent->title,
    "parentSlug": parent->slug.current,
    // show is parent of section; if this is a section-page, parent->parent
    "showId": coalesce(parent->parent->_id, parent->_id)
  }
`
