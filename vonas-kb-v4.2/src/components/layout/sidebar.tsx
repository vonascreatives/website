import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Show, KnowledgeBaseItem } from '@/data/knowledge-base-data';

interface SidebarProps {
  show: Show | null;
  selectedItem: KnowledgeBaseItem | null;
  isOpen: boolean;
  breadcrumb: {
    home: string;
    section: string;
    current: string;
  };
  onItemSelect: (itemId: string) => void;
}

export function Sidebar({ show, selectedItem, isOpen, breadcrumb, onItemSelect }: SidebarProps) {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(show?.sections.map(s => s.id) || [])
  );

  const clean = (t: string) => (t || '').split(' / ').pop() || t

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  if (!show) {
    return (
      <aside className={cn(
        "sidebar w-64 bg-card border-r border-border h-screen sticky top-14 overflow-y-auto",
        isOpen && "open"
      )}>
        <div className="p-4">
          <div className="text-muted-foreground text-center py-8">
            Select a show to view its content
          </div>
        </div>
      </aside>
    );
  }

  const hasAnyItems = !!show.sections.find(s => (s.items?.length || 0) > 0)

  return (
    <aside className={cn(
      "sidebar w-64 bg-card border-r border-border h-screen sticky top-14 overflow-y-auto",
      isOpen && "open"
    )}>
      <div className="p-4">
        {!hasAnyItems && (
          <div className="text-muted-foreground text-sm p-3 border border-dashed rounded mb-4">
            No items yet. Link articles to this selection in Sanity and add a section label to group them.
          </div>
        )}
        {/* Show Navigation */}
        <div className="space-y-2" data-testid="sidebar-content">
          {show.sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <div key={section.id} className="sidebar-section">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full py-2 px-1 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  data-testid={`button-section-${section.id}`}
                >
                  <span className="text-sm">{clean(section.title)}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-gray-500" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-3 mt-1 space-y-0.5">
                    {section.items.map((item) => (
                      <a
                        key={item.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onItemSelect(item.id);
                          router.push(`/kb/item/${item.id}`)
                        }}
                        className={cn(
                          "sidebar-item block py-1.5 px-2 text-sm transition-colors",
                          selectedItem?.id === item.id
                            ? "active"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                        data-testid={`link-item-${item.id}`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
