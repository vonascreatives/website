import { useState, useCallback, useEffect } from 'react'
import { sanityClient, kbTopLevelSectionsQuery, kbItemsByParentQuery, kbItemByIdQuery } from '../../lib/sanity'
import type { Show, KnowledgeBaseItem as OriginalKBItem, KnowledgeBaseSection } from '@/data/knowledge-base-data'

// Interface for kbItem schema
interface SanityKBItem {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  kind: 'section' | 'page' | 'show' | null
  parent?: {
    _ref: string
    _type: 'reference'
  } | null
  order: number
  steps?: Array<{
    title: string
    content: string
  }>
  content?: any[] // portable text
  videoUrl?: string
  embedCode?: string
  attachments?: any[]
  relatedItems?: Array<{
    _id: string
    title: string
    slug: { current: string }
    description?: string
  }>
  faqs?: Array<{
    _id: string
    question: string
    answer: string
  }>
  tags?: string[]
  lastUpdated?: string
}

// Transform kbItem to UI component interface
function transformKBItem(kbItem: SanityKBItem): OriginalKBItem {
  return {
    id: kbItem._id,
    title: kbItem.title || 'Untitled',
    description: kbItem.description || '', // maps to summary field as required
    type: kbItem.kind === 'page' ? 'Guide' : 'Section',
    lastUpdated: kbItem.lastUpdated 
      ? new Date(kbItem.lastUpdated).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long', 
          day: 'numeric',
        })
      : '',
    tags: kbItem.tags || [],
    readTime: '5 min read',
    imageUrl: '',
    // Map steps array directly - preserve exactly as stored
    workflowSteps: kbItem.steps?.map((step, index) => ({
      stepNumber: index + 1,
      headline: step.title,
      description: step.content
    })) || [],
    // Map content array to body
    content: kbItem.content,
    videoUrl: kbItem.videoUrl,
    supportingDocs: kbItem.attachments,
    slug: kbItem.slug.current,
    // Additional fields for linking
    relatedItems: kbItem.relatedItems,
    faqs: kbItem.faqs
  } as any
}

// Build hierarchical tree structure from flat array
function buildTree(items: SanityKBItem[], parentId: string | null = null): SanityKBItem[] {
  return items
    .filter(item => {
      const itemParentId = item.parent?._ref || null
      return itemParentId === parentId
    })
    .sort((a, b) => {
      // Sort by order first, then title A-Z
      if (a.order !== b.order) {
        return a.order - b.order
      }
      return (a.title || '').localeCompare(b.title || '')
    })
}

// Get all descendants recursively 
async function getAllDescendants(parentId: string): Promise<SanityKBItem[]> {
  try {
    const directChildren = await sanityClient.fetch(kbItemsByParentQuery, { parentId })
    let allDescendants = [...directChildren]
    
    // Recursively get children of children
    for (const child of directChildren) {
      const grandChildren = await getAllDescendants(child._id)
      allDescendants = [...allDescendants, ...grandChildren]
    }
    
    return allDescendants
  } catch (error) {
    console.error(`Error getting descendants for ${parentId}:`, error)
    return []
  }
}

export function useKnowledgeBaseUniversal() {
  const [topLevelSections, setTopLevelSections] = useState<SanityKBItem[]>([])
  const [currentShow, setCurrentShow] = useState<Show | null>(null)
  const [selectedItem, setSelectedItem] = useState<OriginalKBItem | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Load all top-level sections on mount (Company, Shows, etc.)
  useEffect(() => {
    const loadTopLevelSections = async () => {
      setLoading(true)
      console.log('🔍 Loading top-level sections from Sanity...')
      
      try {
        const sections = await sanityClient.fetch(kbTopLevelSectionsQuery)
        console.log('✅ Top-level sections loaded:', sections.length, sections)
        setTopLevelSections(sections)
        
        // Set default to Company section (kb-company)
        const companySection = sections.find((s: SanityKBItem) => s._id === 'kb-company')
        if (companySection) {
          console.log('🎯 Setting Company as default section')
          await selectShow(companySection._id)
        } else if (sections.length > 0) {
          console.log('🎯 Setting first section as default:', sections[0].title)
          await selectShow(sections[0]._id)
        }
      } catch (error) {
        console.error('❌ Error loading sections:', error)
        console.log('🔄 Falling back to static data...')
        // Fallback to static data
        const { shows: staticShows } = await import('@/data/knowledge-base-data')
        setCurrentShow(staticShows[0])
        setSelectedItem(staticShows[0]?.sections[0]?.items[0] || null)
      } finally {
        setLoading(false)
      }
    }

    loadTopLevelSections()
  }, [])

  // Select a top-level section and build its tree structure
  const selectShow = useCallback(async (sectionId: string) => {
    setLoading(true)
    console.log(`🎯 Selecting section: ${sectionId}`)
    
    try {
      // Find the section in our loaded data
      const section = topLevelSections.find(s => s._id === sectionId)
      if (!section) {
        console.error(`Section ${sectionId} not found`)
        return
      }

      // Get all descendants of this section
      const allDescendants = await getAllDescendants(sectionId)
      console.log(`📊 Found ${allDescendants.length} descendants for ${section.title || sectionId}`)

      // Build hierarchical structure
      const treeItems = buildTree([section, ...allDescendants], null)
      
      // Create "show" structure for compatibility with existing components
      const virtualShow: Show = {
        id: sectionId,
        name: section.title || 'Untitled Section',
        sections: [{
          id: 'overview',
          title: 'Overview',
          isExpanded: true,
          // The section itself is the "overview" item
          items: [transformKBItem(section)]
        }]
      }

      // Add child sections as additional sections in the show
      const directChildren = buildTree(allDescendants, sectionId)
      for (const child of directChildren) {
        const childItems = [transformKBItem(child)]
        // Add grandchildren as items within the child section
        const grandChildren = buildTree(allDescendants, child._id)
        childItems.push(...grandChildren.map(transformKBItem))
        
        virtualShow.sections.push({
          id: child._id,
          title: child.title || 'Untitled',
          isExpanded: true,
          items: childItems
        })
      }

      console.log(`✅ Virtual show created for ${section.title}:`, virtualShow)
      setCurrentShow(virtualShow)
      
      // Set first item as selected
      const firstItem = virtualShow.sections[0]?.items[0]
      if (firstItem) {
        console.log(`📄 Setting first item:`, firstItem.title)
        setSelectedItem(firstItem)
      }
    } catch (error) {
      console.error(`❌ Error selecting section ${sectionId}:`, error)
    } finally {
      setLoading(false)
    }
  }, [topLevelSections])

  // Select specific item by ID (load full details)
  const selectItem = useCallback(async (itemId: string) => {
    try {
      // Get full item details from Sanity
      const fullItem = await sanityClient.fetch(kbItemByIdQuery, { itemId })
      if (fullItem) {
        const transformedItem = transformKBItem(fullItem)
        console.log(`📄 Selected item:`, transformedItem.title)
        setSelectedItem(transformedItem)
      } else {
        // Fallback to finding in current show structure
        if (!currentShow) return
        
        for (const section of currentShow.sections) {
          const item = section.items.find(i => i.id === itemId)
          if (item) {
            setSelectedItem(item)
            break
          }
        }
      }
    } catch (error) {
      console.error(`Error loading item ${itemId}:`, error)
    }
  }, [currentShow])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const getBreadcrumb = useCallback(() => {
    if (!currentShow || !selectedItem) {
      return { home: 'KB', section: '', current: '' }
    }

    // KB > Section Name > Current Item
    return {
      home: 'KB',
      section: currentShow.name,
      current: selectedItem.title
    }
  }, [currentShow, selectedItem])

  const getRelatedArticles = useCallback(() => {
    if (!currentShow || !selectedItem) return []

    // Use relatedItems if available, otherwise find items from same section
    if (selectedItem.relatedItems?.length) {
      return selectedItem.relatedItems.slice(0, 3).map(related => ({
        id: related._id,
        title: related.title,
        description: related.description || '',
        slug: related.slug.current
      }))
    }

    // Fallback: find items from current section
    const currentSection = currentShow.sections.find(s => 
      s.items.some(i => i.id === selectedItem.id)
    )
    
    if (!currentSection) return []

    return currentSection.items
      .filter(item => item.id !== selectedItem.id)
      .slice(0, 3)
  }, [currentShow, selectedItem])

  // Get top-level sections for navigation dropdowns
  const getCategories = useCallback(() => {
    return topLevelSections
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order
        return (a.title || '').localeCompare(b.title || '')
      })
      .map(section => ({
        _id: section._id,
        title: section.title || 'Untitled',
        slug: section.slug,
        order: section.order
      }))
  }, [topLevelSections])

  // Create shows list for backward compatibility
  const shows = topLevelSections.map(section => ({
    id: section._id,
    name: section.title || 'Untitled',
    sections: [] // Will be populated when selected
  }))

  return {
    shows,
    selectedShow: currentShow,
    selectedItem,
    sidebarOpen,
    searchQuery,
    loading,
    allCategories: getCategories(), // For backward compatibility
    selectShow,
    selectItem,
    toggleSidebar,
    setSearchQuery,
    getBreadcrumb,
    getRelatedArticles,
    getCategories,
  }
}
