'use client'

import { TopNavigation } from '@/components/layout/top-navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { MainContent } from '@/components/content/main-content'
import { useKnowledgeBaseFlat } from '@/hooks/use-knowledge-base-flat'

export default function Home() {
  const {
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
    teamChildren,
    productionChildren,
    toolsChildren,
    partnersChildren,
    policiesChildren
  } = useKnowledgeBaseFlat()

  if (loading) {
    return (
      <div className="bg-background text-foreground font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Knowledge Base...</p>
        </div>
      </div>
    )
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
          selectedItem={selectedItem}
          isOpen={sidebarOpen}
          breadcrumb={getBreadcrumb()}
          onItemSelect={selectItem}
        />

        <MainContent
          item={selectedItem}
          relatedArticles={getRelatedArticles()}
        />
      </div>
    </div>
  )
}
