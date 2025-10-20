'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TopNavigation } from '@/components/layout/top-navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { useKnowledgeBaseFlat } from '@/hooks/use-knowledge-base-flat'
import Link from 'next/link'
import type { KnowledgeBaseItem } from '@/data/knowledge-base-data'

interface SanityKBItem {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  tags?: string[]
  type?: 'Article' | 'Video' | 'Workflow' | 'Reference'
  readTime?: string
  lastUpdated?: string
}

export default function TagPage() {
  const params = useParams()
  const router = useRouter()
  const tag = params?.tag as string
  const decodedTag = tag ? decodeURIComponent(tag) : ''

  const [items, setItems] = useState<SanityKBItem[]>([])
  const [loading, setLoading] = useState(true)

  const {
    selectedShow,
    sidebarOpen,
    searchQuery,
    selectShow,
    selectItem,
    toggleSidebar,
    setSearchQuery,
    topLevelSections,
    companyChildren,
    showsChildren,
    productionChildren,
    toolsChildren,
    partnersChildren,
  } = useKnowledgeBaseFlat()

  useEffect(() => {
    const fetchTaggedItems = async () => {
      if (!decodedTag) return
      setLoading(true)
      try {
        const res = await fetch(`/api/kb/tag/${encodeURIComponent(decodedTag)}`)
        if (!res.ok) {
          console.warn(`[TagPage] API returned ${res.status}`)
          return
        }
        const data = await res.json()
        if (data.ok && Array.isArray(data.items)) {
          setItems(data.items)
        }
      } catch (error) {
        console.error('Error fetching tagged items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTaggedItems()
  }, [decodedTag])

  const handleItemClick = (item: SanityKBItem) => {
    router.push(`/kb/item/${item._id}`)
  }

  return (
    <div className="bg-background text-foreground font-sans">
      <TopNavigation
        onShowSelect={selectShow}
        onToggleSidebar={toggleSidebar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onItemSelect={(showId, itemId) => {
          selectShow(showId)
          selectItem(itemId)
        }}
        shows={selectedShow ? [selectedShow] : []}
        sections={topLevelSections}
        companyChildren={companyChildren}
        showsChildren={showsChildren}
        productionChildren={productionChildren}
        toolsChildren={toolsChildren}
        partnersChildren={partnersChildren}
      />

      <div className="flex pt-14 max-w-screen-2xl mx-auto">
        <Sidebar
          show={selectedShow}
          selectedItem={null}
          isOpen={sidebarOpen}
          breadcrumb={{ home: 'KB', section: '', current: '' }}
          onItemSelect={selectItem}
        />

        <main className="flex-1 max-w-none">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Knowledge Base
                </Link>
                <span>/</span>
                <span className="text-foreground">Tags</span>
                <span>/</span>
                <span className="text-foreground font-medium">{decodedTag}</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Articles tagged with "{decodedTag}"
              </h1>
              <p className="text-muted-foreground">
                {loading ? 'Loading...' : `${items.length} article${items.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading articles...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">
                  No articles found with tag "{decodedTag}"
                </p>
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Back to Knowledge Base
                </Link>
              </div>
            )}

            {/* Articles List */}
            {!loading && items.length > 0 && (
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item._id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-2 hover:text-blue-600 transition-colors">
                          {item.title}
                        </h2>
                        {item.description && (
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {item.type && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              {item.type}
                            </span>
                          )}
                          {item.readTime && <span>{item.readTime}</span>}
                          {item.lastUpdated && (
                            <span>Updated {new Date(item.lastUpdated).toLocaleDateString()}</span>
                          )}
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                className={`px-2 py-1 text-xs rounded ${
                                  t === decodedTag
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (t !== decodedTag) {
                                    router.push(`/kb/tag/${encodeURIComponent(t)}`)
                                  }
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
