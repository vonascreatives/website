'use client'

import React, { use, useEffect } from 'react'
import { TopNavigation } from '@/components/layout/top-navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { MainContent } from '@/components/content/main-content'
import { useKnowledgeBaseFlat } from '@/hooks/use-knowledge-base-flat'

export default function KBItemPage(props: any) {
  const params = use<{ id?: string }>(
    props?.params ?? Promise.resolve({} as { id?: string })
  )
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
    policiesChildren,
  } = useKnowledgeBaseFlat()

  useEffect(() => {
    // Select the item once data loaders have kicked in
    if (params?.id) {
      selectItem(params.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id])

  if (loading && !selectedItem) {
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
        shows={selectedShow ? [selectedShow] : shows}
        sections={topLevelSections}
        companyChildren={companyChildren}
        showsChildren={showsChildren}
        teamChildren={teamChildren}
        productionChildren={productionChildren}
        toolsChildren={toolsChildren}
        partnersChildren={partnersChildren}
        policiesChildren={policiesChildren}
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
