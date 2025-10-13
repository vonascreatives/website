import { useState, useCallback, useEffect } from 'react'
import { sanityClient, kbItemsQuery, kbItemsByCategoryQuery } from '@/lib/sanity'

// Updated interfaces to match Sanity structure
export interface KnowledgeBaseItem {
  _id: string
  title: string
  slug: { current: string }
  category: 'company' | 'production' | 'shows' | 'tools' | 'partners' 
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

export interface KnowledgeBaseSection {
  id: string
  title: string
  items: KnowledgeBaseItem[]
  isExpanded: boolean
}

// Main sections for flat navigation
export const mainSections = [
  { id: 'company', title: 'Company' },
  { id: 'production', title: 'Production' },
  { id: 'shows', title: 'Shows' },
  { id: 'tools', title: 'Tools' },
  { id: 'partners', title: 'Partners' },
]

export function useKnowledgeBaseSanity() {
  const [allItems, setAllItems] = useState<KnowledgeBaseItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('company')
  const [selectedItem, setSelectedItem] = useState<KnowledgeBaseItem | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Load all items on mount
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true)
      try {
        const items = await sanityClient.fetch(kbItemsQuery)
        setAllItems(items.filter((item: KnowledgeBaseItem) => item.status === 'published'))
        
        // Set default selected item
        const companyItems = items.filter((item: KnowledgeBaseItem) => 
          item.category === 'company' && item.status === 'published'
        )
        if (companyItems.length > 0) {
          setSelectedItem(companyItems[0])
        }
      } catch (error) {
        console.error('Error loading KB items:', error)
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  const selectCategory = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    
    // Set first item in category as selected
    const categoryItems = allItems.filter(item => 
      item.category === categoryId && item.status === 'published'
    )
    if (categoryItems.length > 0) {
      setSelectedItem(categoryItems[0])
    }
  }, [allItems])

  const selectItem = useCallback((itemId: string) => {
    const item = allItems.find(i => i._id === itemId)
    if (item) {
      setSelectedItem(item)
      setSelectedCategory(item.category)
    }
  }, [allItems])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const getBreadcrumb = useCallback(() => {
    const sectionTitle = mainSections.find(s => s.id === selectedCategory)?.title || 'KB'
    
    return {
      home: 'KB',
      section: sectionTitle,
      current: selectedItem?.title || ''
    }
  }, [selectedCategory, selectedItem])

  const getRelatedArticles = useCallback(() => {
    if (!selectedItem) return []

    return allItems
      .filter(item => 
        item.category === selectedItem.category &&
        item._id !== selectedItem._id &&
        item.status === 'published'
      )
      .slice(0, 3)
  }, [selectedItem, allItems])

  const getCurrentCategoryItems = useCallback(() => {
    return allItems.filter(item => 
      item.category === selectedCategory && 
      item.status === 'published'
    )
  }, [allItems, selectedCategory])

  const getItemsByCategory = useCallback((categoryId: string) => {
    return allItems.filter(item => 
      item.category === categoryId && 
      item.status === 'published'
    )
  }, [allItems])

  const searchItems = useCallback((query: string) => {
    if (!query.trim()) return []
    
    const lowerQuery = query.toLowerCase()
    return allItems.filter(item =>
      (item.title.toLowerCase().includes(lowerQuery) ||
       item.description.toLowerCase().includes(lowerQuery) ||
       item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) &&
      item.status === 'published'
    )
  }, [allItems])

  return {
    // Data
    mainSections,
    allItems,
    selectedCategory,
    selectedItem,
    sidebarOpen,
    searchQuery,
    loading,
    
    // Actions
    selectCategory,
    selectItem,
    toggleSidebar,
    setSearchQuery,
    
    // Computed
    getBreadcrumb,
    getRelatedArticles,
    getCurrentCategoryItems,
    getItemsByCategory,
    searchItems,
  }
}