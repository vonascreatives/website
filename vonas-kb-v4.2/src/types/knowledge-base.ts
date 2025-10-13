// Shared types for knowledge base
export interface KnowledgeBaseItem {
  _id: string
  title: string
  slug: { current: string }
  category: 'company' |'production' | 'shows' | 'tools' | 'partners' 
  description: string
  content?: any[] // Rich text content from Sanity
  type: 'Article' | 'Video' | 'Workflow' | 'Reference'
  tags: string[]
  readTime: string
  order: number
  status: 'draft' | 'published' | 'archived'
  lastUpdated: string
  imageUrl?: any // Sanity image object
  videoUrl?: string
  supportingDocs?: string
}

export interface CategorySection {
  id: string
  title: string
  items: KnowledgeBaseItem[]
}

export const CATEGORIES = [
  { id: 'company', title: 'Company' },
  { id: 'production', title: 'Production' },
  { id: 'shows', title: 'Shows' },
  { id: 'tools', title: 'Tools' },
  { id: 'partners', title: 'Partners' },
] as const

export type CategoryId = typeof CATEGORIES[number]['id']