import { useState, useCallback } from 'react';
import { shows, type Show, type KnowledgeBaseItem } from '@/data/knowledge-base-data';

export function useKnowledgeBase() {
  const [selectedShow, setSelectedShow] = useState<Show | null>(shows[0]);
  const [selectedItem, setSelectedItem] = useState<KnowledgeBaseItem | null>(
    shows[0]?.sections[1]?.items[0] || null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectShow = useCallback((showId: string) => {
    const show = shows.find(s => s.id === showId);
    if (show) {
      setSelectedShow(show);
      setSelectedItem(show.sections[0]?.items[0] || null);
    }
  }, []);

  const selectItem = useCallback((itemId: string) => {
    if (!selectedShow) return;
    
    for (const section of selectedShow.sections) {
      const item = section.items.find(i => i.id === itemId);
      if (item) {
        setSelectedItem(item);
        break;
      }
    }
  }, [selectedShow]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const getBreadcrumb = useCallback(() => {
    if (!selectedShow || !selectedItem) {
      return { home: 'Home', section: '', current: '' };
    }

    const section = selectedShow.sections.find(s => 
      s.items.some(i => i.id === selectedItem.id)
    );

    return {
      home: 'Home',
      section: 'YouTube Shows',
      current: selectedShow.name
    };
  }, [selectedShow, selectedItem]);

  const getRelatedArticles = useCallback(() => {
    if (!selectedShow || !selectedItem) return [];

    const currentSection = selectedShow.sections.find(s => 
      s.items.some(i => i.id === selectedItem.id)
    );

    if (!currentSection) return [];

    return currentSection.items
      .filter(item => item.id !== selectedItem.id)
      .slice(0, 3);
  }, [selectedShow, selectedItem]);

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
    getRelatedArticles
  };
}
