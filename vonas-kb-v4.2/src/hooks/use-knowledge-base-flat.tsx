"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import type { Show, KnowledgeBaseItem } from '@/data/knowledge-base-data'

interface SanityKBItem {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  itemType?: 'page' | 'section' | 'item'
  parentPage?: string
  section?: string
  order?: number
  content?: any[]
  videoUrl?: string
  supportingDocs?: string
  tags?: string[]
  type?: 'Article' | 'Video' | 'Workflow' | 'Reference'
  readTime?: string
  lastUpdated?: string
}

function transformKBItem(kbItem: SanityKBItem): KnowledgeBaseItem {
  const slugTitle = kbItem.slug?.current
    ? kbItem.slug.current.replace(/[-_]+/g, ' ').replace(/^\w|\s\w/g, (m) => m.toUpperCase())
    : ''
  const displayTitle = (kbItem.title || '').trim() || slugTitle || 'Untitled'
  return {
    id: kbItem._id,
    title: displayTitle,
    description: kbItem.description || '',
    type: (kbItem.type as any) || 'Article',
    lastUpdated: kbItem.lastUpdated
      ? new Date(kbItem.lastUpdated).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '',
    tags: Array.isArray(kbItem.tags) ? kbItem.tags : [],
    readTime: kbItem.readTime || '5 min read',
    imageUrl: '',
    workflowSteps: [],
    content: (kbItem as any).content || null,
    videoUrl: (kbItem as any).videoUrl || '',
    supportingDocs: kbItem.supportingDocs || '',
    slug: kbItem.slug?.current || '',
    hasSteps: Array.isArray((kbItem as any).steps) && (kbItem as any).steps.length > 0,
    hasContent: Boolean(kbItem.content?.length),
    summary: kbItem.description || '',
    body: (kbItem as any).content || null,
    checklist: (kbItem as any).checklist || null,
    steps: (kbItem as any).steps || null,
    embedCode: (kbItem as any).embedCode || null,
    faqs: (kbItem as any).faqs || null,
    attachments: (kbItem as any).attachments || null,
  } as any
}

async function safeFetchJson(url: string, fallback: any = { ok: false, data: [] }) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`API request failed: ${url} (${response.status})`)
      return fallback
    }
    const text = await response.text()
    if (!text) return fallback
    try {
      return JSON.parse(text)
    } catch (parseError) {
      console.error(`Failed to parse JSON from ${url}:`, text.substring(0, 100))
      return fallback
    }
  } catch (error) {
    console.error(`Network error fetching ${url}:`, error)
    return fallback
  }
}

export function useKnowledgeBaseFlat() {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)
  const [selectedItem, setSelectedItem] = useState<KnowledgeBaseItem | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const [topLevelSections, setTopLevelSections] = useState<Array<{ _id: string; title: string; slug: { current: string } }>>([])
  const [companyChildren, setCompanyChildren] = useState<SanityKBItem[]>([])
  const [showsChildren, setShowsChildren] = useState<SanityKBItem[]>([])
  const [productionChildren, setProductionChildren] = useState<SanityKBItem[]>([])
  const [toolsChildren, setToolsChildren] = useState<SanityKBItem[]>([])
  const [partnersChildren, setPartnersChildren] = useState<SanityKBItem[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const staticSections = [
          { _id: 'nav-company', title: 'Company', slug: { current: 'company' } },
          { _id: 'nav-production', title: 'Production', slug: { current: 'production' } },
          { _id: 'nav-shows', title: 'Shows', slug: { current: 'shows' } },
          { _id: 'nav-tools', title: 'Tools', slug: { current: 'tools' } },
          { _id: 'nav-partners', title: 'Partners', slug: { current: 'partners' } },
        ]
        setTopLevelSections(staticSections)

        const [companyRes, productionRes, toolsRes, partnersRes, showsRes] = await Promise.all([
          safeFetchJson('/api/kb/company'),
          safeFetchJson('/api/kb/production'),
          safeFetchJson('/api/kb/tools'),
          safeFetchJson('/api/kb/partners'),
          safeFetchJson('/api/kb/shows'),
        ])
        const showPages = showsRes.ok ? (showsRes.data || []) : []
        setCompanyChildren(companyRes.ok ? (companyRes.data||[]) : [])
        setProductionChildren(productionRes.ok ? (productionRes.data||[]) : [])
        setToolsChildren(toolsRes.ok ? (toolsRes.data||[]) : [])
        setPartnersChildren(partnersRes.ok ? (partnersRes.data||[]) : [])
        setShowsChildren(showPages)

        if (showPages.length > 0) {
          await selectShow(showPages[0]._id)
        } else {
          // Fallback: load OTR directly so the page always shows content
          await selectShow('kb.shows.otr')
        }
      } catch (e) {
        console.error('Error loading nav/dropdowns', e)
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectShow = useCallback(async (pageId: string) => {
    setLoading(true)
    try {
      const data = await safeFetchJson(`/api/kb/page/${pageId}`)
      if (data.ok) {
        const pageDoc = data.page
        const sectionsWithItems = Array.isArray(data.sectionsWithItems) ? data.sectionsWithItems : []
        const sections = sectionsWithItems.length ? sectionsWithItems : (data.sections || [])
        const items = data.items || []

        const virtualShow: Show = { id: pageDoc._id, name: pageDoc.title || 'Untitled', sections: [] }

        if (sectionsWithItems.length) {
          const clean = (t:string, slug?:string) => t?.split(' / ').pop() || (slug?.split('/')?.pop()?.replace(/-/g,' ') || 'Section')
          for (const section of sectionsWithItems) {
            const secItems = Array.isArray(section.items) ? section.items.map(transformKBItem) : []
            const title = clean(section.title || '', section.slug?.current)
            virtualShow.sections.push({ id: section._id, title, isExpanded: true, items: secItems })
          }
        } else {
          for (const section of sections as any[]) {
            const sectionSlug = String(section?.slug?.current || '')
            const sectionId = section?._id
            const sectionItems = (items as any[])
              .filter((i) => {
                const parentRefMatch = i?.parent?._ref && sectionId && i.parent._ref === sectionId
                const slug = String(i?.slug?.current || '')
                const slugMatch = slug === sectionSlug || slug.startsWith(sectionSlug + '/')
                return Boolean(parentRefMatch || slugMatch)
              })
              .map(transformKBItem)
            const title = (String(section?.title||'').split(' / ').pop()||'Untitled')
            virtualShow.sections.push({ id: section._id, title, isExpanded: true, items: sectionItems })
          }
        }

        if (virtualShow.sections.length > 0) {
          setSelectedShow(virtualShow)
          const firstItem = virtualShow.sections[0]?.items[0]
          if (firstItem) {
            const full = await safeFetchJson(`/api/kb/item/${firstItem.id}`)
            if (full?.ok && full.data) {
              setSelectedItem(transformKBItem(full.data))
            } else {
              setSelectedItem(firstItem)
            }
          }
          return
        }
      }

      // Fallback: if no kbItem page found, treat id as youtubeShow
      const showRes = await safeFetchJson(`/api/kb/show/${pageId}/articles`)
      if (showRes?.ok && showRes.show) {
        const showDoc = showRes.show
        const sectionsResp = Array.isArray(showRes.sections) ? showRes.sections : null
        const itemsResp = Array.isArray(showRes.items) ? showRes.items : null

        if (sectionsResp && itemsResp) {
          const virtualShow: Show = { id: showDoc._id, name: showDoc.title || 'Untitled Show', sections: [] }
          for (const section of sectionsResp as any[]) {
            const secSlug = String(section?.slug?.current || '')
            const secLabel = (String(section?.title || '').split(' / ').pop() || '').trim() ||
              (secSlug.startsWith('shows/') ? secSlug.split('/')[2]?.replace(/-/g,' ').replace(/^\w|\s\w/g, (m)=>m.toUpperCase()) : 'Section')
            const secItems = (itemsResp as any[])
              .filter((it) => String(it?.slug?.current || '').startsWith(`${secSlug}/`))
              .map(transformKBItem)
            virtualShow.sections.push({ id: secSlug || secLabel.toLowerCase().replace(/\s+/g,'-'), title: secLabel, isExpanded: true, items: secItems })
          }
          const covered = new Set(virtualShow.sections.flatMap(s => s.items.map(i => i.id)))
          const unmatched = (itemsResp as any[]).filter(it => !covered.has(it._id)).map(transformKBItem)
          if (unmatched.length) virtualShow.sections.unshift({ id: 'overview', title: 'Overview', isExpanded: true, items: unmatched })
          setSelectedShow(virtualShow)
          setSelectedItem(virtualShow.sections[0]?.items[0] || null)
          return
        }

        let articles = Array.isArray(showRes.articles) ? showRes.articles : []
        if (articles.length === 0 && showDoc?.slug?.current) {
          const catFallback = await safeFetchJson(`/api/kb/category/category-show-specific/articles`)
          if (catFallback?.ok && Array.isArray(catFallback.articles)) {
            const showSlug = String(showDoc.slug.current)
            articles = catFallback.articles.filter((a:any)=> String(a?.slug?.current||'').includes(showSlug))
          }
        }
        const groups = new Map<string, SanityKBItem[]>()
        for (const a of articles as any[]) {
          let sectionLabel = (a.section && String(a.section).trim()) || a.category?.title || ''
          if (!sectionLabel && a?.slug?.current && a.slug.current.startsWith('shows/')) {
            const parts = String(a.slug.current).split('/')
            if (parts.length >= 3) sectionLabel = parts[2].replace(/-/g,' ').replace(/^\w|\s\w/g, (m)=>m.toUpperCase())
          }
          if (!sectionLabel) sectionLabel = 'Overview'
          if (!groups.has(sectionLabel)) groups.set(sectionLabel, [])
          groups.get(sectionLabel)!.push(a)
        }
        const virtualShow: Show = { id: showDoc._id, name: showDoc.title || 'Untitled Show', sections: [] }
        for (const [label, arr] of Array.from(groups.entries())) {
          const items = arr.map(transformKBItem)
          virtualShow.sections.push({ id: label.toLowerCase().replace(/\s+/g, '-'), title: label, isExpanded: true, items })
        }
        virtualShow.sections.sort((a, b) => (a.title === 'Overview' ? -1 : b.title === 'Overview' ? 1 : a.title.localeCompare(b.title)))
        setSelectedShow(virtualShow)
        const firstItem = virtualShow.sections[0]?.items[0]
        setSelectedItem(firstItem || null)
        return
      }

      // Fallback to category id
      const catRes = await safeFetchJson(`/api/kb/category/${pageId}/articles`)
      if (catRes?.ok && catRes.category) {
        const cat = catRes.category
        const articles = Array.isArray(catRes.articles) ? catRes.articles : []
        const groups = new Map<string, SanityKBItem[]>()
        for (const a of articles as any[]) {
          let sectionLabel = (a.section && String(a.section).trim()) || ''
          if (!sectionLabel && a?.slug?.current && a.slug.current.startsWith('shows/')) {
            const parts = String(a.slug.current).split('/')
            if (parts.length >= 3) {
              sectionLabel = parts[2].replace(/-/g, ' ').replace(/^\w|\s\w/g, (m) => m.toUpperCase())
            }
          }
          if (!sectionLabel) sectionLabel = 'Overview'
          if (!groups.has(sectionLabel)) groups.set(sectionLabel, [])
          groups.get(sectionLabel)!.push(a)
        }
        const virtualShow: Show = { id: cat._id, name: cat.name || 'Untitled', sections: [] }
        for (const [label, arr] of Array.from(groups.entries())) {
          const items = arr.map(transformKBItem)
          virtualShow.sections.push({ id: label.toLowerCase().replace(/\s+/g, '-'), title: label, isExpanded: true, items })
        }
        virtualShow.sections.sort((a, b) => (a.title === 'Overview' ? -1 : b.title === 'Overview' ? 1 : a.title.localeCompare(b.title)))
        setSelectedShow(virtualShow)
        const firstItem = virtualShow.sections[0]?.items[0]
        setSelectedItem(firstItem || null)
        return
      }
    } catch (e) {
      console.error('Error selecting page', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const selectItem = useCallback(async (itemId: string) => {
    try {
      const data = await safeFetchJson(`/api/kb/item/${itemId}`)
      if (data.ok && (data.data || data.item)) {
        setSelectedItem(transformKBItem((data.data || data.item)))
        return
      }
      if (!selectedShow) return
      for (const section of selectedShow.sections) {
        const item = section.items.find((i) => i.id === itemId)
        if (item) {
          setSelectedItem(item)
          break
        }
      }
    } catch (e) {
      console.error('Error selecting item', e)
    }
  }, [selectedShow])

  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), [])

  const getBreadcrumb = useCallback(() => {
    if (!selectedShow || !selectedItem) return { home: 'KB', section: '', current: '' }
    return { home: 'KB', section: selectedShow.name, current: selectedItem.title }
  }, [selectedShow, selectedItem])

  const getRelatedArticles = useCallback(() => {
    if (!selectedShow || !selectedItem) return []
    const currentSection = selectedShow.sections.find((s) => s.items.some((i) => i.id === selectedItem.id))
    if (!currentSection) return []
    return currentSection.items.filter((i) => i.id !== selectedItem.id).slice(0, 3)
  }, [selectedShow, selectedItem])

  const shows: Show[] = useMemo(
    () => (showsChildren || []).map((p) => ({ id: p._id, name: p.title || 'Untitled', sections: [] })),
    [showsChildren],
  )

  return {
    shows,
    selectedShow,
    selectedItem,
    sidebarOpen,
    searchQuery,
    selectShow,
    selectItem,
    toggleSidebar,
    setSearchQuery,
    getBreadcrumb,
    getRelatedArticles,
    loading,
    topLevelSections,
    companyChildren,
    showsChildren,
    productionChildren,
    toolsChildren,
    partnersChildren,
  }
}
