import { useState, useCallback, useEffect } from 'react'
import { sanityClient, kbItemsQuery } from '@/lib/sanity'
import type { Show, KnowledgeBaseItem as OriginalKBItem, KnowledgeBaseSection } from '@/data/knowledge-base-data'

// This bridge transforms Sanity data to work with existing components
// without changing the UI design

interface SanityKBItem {
  _id: string
  title: string
  slug: { current: string }
  category: 'company' | 'production' | 'shows' | 'tools' | 'partners' 
  description: string
  content?: any[]
  type: 'Article' | 'Video' | 'Workflow' | 'Reference'
  tags: string[]
  readTime: string
  order: number
  status: 'draft' | 'published' | 'archived'
  lastUpdated: string
  imageUrl?: any
  videoUrl?: string
  supportingDocs?: string
}

// Transform Sanity items to original interface
function transformSanityItem(sanityItem: SanityKBItem): OriginalKBItem {
  return {
    id: sanityItem._id,
    title: sanityItem.title,
    description: sanityItem.description,
    type: sanityItem.type,
    lastUpdated: new Date(sanityItem.lastUpdated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    tags: sanityItem.tags,
    readTime: sanityItem.readTime || '5 min read',
    imageUrl: sanityItem.imageUrl,
  }
}

// Create virtual "shows" from flat categories
function createVirtualShows(sanityItems: SanityKBItem[]): Show[] {
  const categories = [
    { id: 'company', name: 'Company' },
    { id: 'production', name: 'Production' },
    { id: 'shows', name: 'Shows' },
    { id: 'tools', name: 'Tools' },
    { id: 'partners', name: 'Partners' },
  ]

  return categories.map(category => {
    const categoryItems = sanityItems
      .filter(item => item.category === category.id && item.status === 'published')
      .sort((a, b) => a.order - b.order)

    // Create a single section per category for flat structure
    const section: KnowledgeBaseSection = {
      id: category.id,
      title: category.name,
      isExpanded: true,
      items: categoryItems.map(transformSanityItem),
    }

    return {
      id: category.id,
      name: category.name,
      sections: [section],
    }
  }).filter(show => show.sections[0].items.length > 0) // Only include categories with items
}

export function useKnowledgeBaseBridge() {
  const [sanityItems, setSanityItems] = useState<SanityKBItem[]>([])
  const [shows, setShows] = useState<Show[]>([])
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)
  const [selectedItem, setSelectedItem] = useState<OriginalKBItem | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Load Sanity data
  useEffect(() => {
    const loadSanityData = async () => {
      setLoading(true)
      try {
        const items = await sanityClient.fetch(kbItemsQuery)
        setSanityItems(items)
        
        const virtualShows = createVirtualShows(items)
        setShows(virtualShows)
        
        // Set default selection - first show and its first item
        if (virtualShows.length > 0) {
          const firstShow = virtualShows[0]
          setSelectedShow(firstShow)
          if (firstShow.sections[0]?.items[0]) {
            setSelectedItem(firstShow.sections[0].items[0])
          }
        }
      } catch (error) {
        console.error('Error loading Sanity data:', error)
        // Fallback to static data if Sanity fails
        const { shows: staticShows } = await import('@/data/knowledge-base-data')
        setShows(staticShows)
        setSelectedShow(staticShows[0])
        setSelectedItem(staticShows[0]?.sections[0]?.items[0] || null)
      } finally {
        setLoading(false)
      }
    }

    loadSanityData()
  }, [])

  const selectShow = useCallback((showId: string) => {
    const show = shows.find(s => s.id === showId)
    if (show) {
      setSelectedShow(show)
      setSelectedItem(show.sections[0]?.items[0] || null)
    }
  }, [shows])

  const selectItem = useCallback((itemId: string) => {
    if (!selectedShow) return
    
    for (const section of selectedShow.sections) {
      const item = section.items.find(i => i.id === itemId)
      if (item) {
        setSelectedItem(item)
        break
      }
    }
  }, [selectedShow])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const getBreadcrumb = useCallback(() => {
    if (!selectedShow || !selectedItem) {
      return { home: 'KB', section: '', current: '' }
    }

    // For flat structure, breadcrumb is KB > Category > Item
    return {
      home: 'KB',
      section: selectedShow.name,
      current: selectedItem.title
    }
  }, [selectedShow, selectedItem])

  const getRelatedArticles = useCallback(() => {
    if (!selectedShow || !selectedItem) return []

    const currentSection = selectedShow.sections[0] // Flat structure has only one section per show
    if (!currentSection) return []

    return currentSection.items
      .filter(item => item.id !== selectedItem.id)
      .slice(0, 3)
  }, [selectedShow, selectedItem])

  return {
    shows,
    selectedShow,
    selectedItem,
    sidebarOpen,
    searchQuery,
    loading,
    selectShow,
    selectItem,
    toggleSidebar,
    setSearchQuery,
    getBreadcrumb,
    getRelatedArticles,
  }
}