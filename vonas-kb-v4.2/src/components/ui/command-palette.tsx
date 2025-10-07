import { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Video, Workflow, Book } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { KnowledgeBaseItem, Show } from '@/data/knowledge-base-data';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemSelect: (showId: string, itemId: string) => void;
  shows: Show[];
  query?: string;
  onQueryChange?: (q: string) => void;
}

const getItemIcon = (type: KnowledgeBaseItem['type']) => {
  switch (type) {
    case 'Article':
      return FileText;
    case 'Video':
      return Video;
    case 'Workflow':
      return Workflow;
    default:
      return Book;
  }
};

export function CommandPalette({ open, onOpenChange, onItemSelect, shows, query, onQueryChange }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [remoteResults, setRemoteResults] = useState<any[]>([]);

  // Get all searchable items from current show as fallback when no query
  const localItems = (shows || []).flatMap(show =>
    show.sections.flatMap(section =>
      section.items.map(item => ({
        ...item,
        showName: show.name,
        showId: show.id,
        sectionName: section.title,
      }))
    )
  );

  // Remote search: query Next API when the user types
  useEffect(() => {
    if (!open) return;
    const q = (query ?? searchQuery).trim();
    if (!q) {
      setRemoteResults([]);
      setSelectedIndex(0);
      return;
    }
    const controller = new AbortController();
    const run = async () => {
      try {
        const res = await fetch(`/api/kb/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const json = await res.json();
        if (json?.ok && Array.isArray(json.data)) {
          const mapped = json.data.map((it: any) => ({
            id: it._id,
            title: it.title,
            description: it.description || '',
            type: (it.type as KnowledgeBaseItem['type']) || 'Article',
            // Prefer resolved show id; fall back to self so selection still works
            showId: it.showId || it._id,
            showName: it.parentTitle || '',
            sectionName: it.parentTitle || '',
          }));
          setRemoteResults(mapped);
          setSelectedIndex(0);
        } else {
          setRemoteResults([]);
        }
      } catch {
        setRemoteResults([]);
      }
    };
    const t = setTimeout(run, 250);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [open, query, searchQuery]);

  const showingRemote = Boolean((query ?? searchQuery).trim());
  const itemsToShow = showingRemote ? remoteResults.slice(0, 20) : localItems.slice(0, 8);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, searchQuery]);

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const total = itemsToShow.length || 1;
        setSelectedIndex((prev) => (prev + 1) % total);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const total = itemsToShow.length || 1;
        setSelectedIndex((prev) => (prev - 1 + total) % total);
        break;
      }
      case 'Enter': {
        e.preventDefault();
        const item = itemsToShow[selectedIndex];
        if (item) {
          onItemSelect(item.showId, item.id);
          onOpenChange(false);
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        onOpenChange(false);
        break;
    }
  }, [open, itemsToShow, selectedIndex, onItemSelect, onOpenChange]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-4xl bg-white border border-gray-200 shadow-lg flex" data-testid="command-palette">
        <div className="flex-1">
        <DialogTitle className="sr-only">Search Documentation</DialogTitle>
        <DialogDescription className="sr-only">
          Search through all documentation articles, workflows, and videos
        </DialogDescription>
        
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-200 px-4 py-3">
          <Search className="h-4 w-4 text-gray-400 mr-3" />
          <Input
            autoFocus
            value={query ?? searchQuery}
            onChange={(e) => (onQueryChange ? onQueryChange(e.target.value) : setSearchQuery(e.target.value))}
            placeholder="Search documentation..."
            className="flex-1 border-0 bg-transparent text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
            data-testid="search-input"
          />
          {(query ?? searchQuery) && (
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-xs font-medium text-gray-500">
              Esc
            </kbd>
          )}
        </div>

        {/* Ask AI Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 w-full text-left p-2 rounded hover:bg-blue-50">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="font-medium">
              {searchQuery ? `Ask AI about "${searchQuery}"` : "Ask AI"}
            </span>
          </button>
        </div>

        {/* Recently Asked Section */}
        {!searchQuery && (
          <div>
            <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">RECENTLY ASKED</div>
            <div className="p-2">
              <div className="flex items-center space-x-2 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                </svg>
                <span>Understanding Camera Setup...</span>
              </div>
              <div className="flex items-center space-x-2 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                </svg>
                <span>Audio Equipment Best Practices</span>
              </div>
            </div>
          </div>
        )}

        {/* Docs Section */}
        <div>
          <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">DOCS</div>
          <div className="max-h-60 overflow-y-auto">
            {itemsToShow.length === 0 && (query ?? searchQuery) ? (
              <div className="p-4 text-center text-sm text-gray-500" data-testid="no-results">
                No results found.
              </div>
            ) : (
              <div className="p-2">
                {itemsToShow.map((item, index) => {
                  const Icon = getItemIcon(item.type);
                  return (
                    <button
                      key={`${item.showId}-${item.id}`}
                      onClick={() => {
                        onItemSelect(item.showId, item.id);
                        onOpenChange(false);
                      }}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        "w-full text-left p-2 rounded transition-colors hover:bg-gray-50",
                        index === selectedIndex && "bg-gray-50"
                      )}
                      data-testid={`search-result-${item.id}`}
                    >
                      <div className="flex items-start space-x-2">
                        <Icon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
                            {item.title}
                          </h4>
                          <div className="text-xs text-gray-500">
                            {item.showName} &gt; {item.sectionName}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-white px-1 font-mono text-xs">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-white px-1 font-mono text-xs">
                ↵
              </kbd>
              <span>Select</span>
            </div>
          </div>
        </div>
        </div>
        
        {/* Preview Panel */}
        {hoveredItem && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
            <div className="text-xs text-gray-500 mb-2">{hoveredItem.showName} &gt; {hoveredItem.sectionName}</div>
            <h3 className="font-medium text-gray-900 mb-3">{hoveredItem.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{hoveredItem.description}</p>
            
            {hoveredItem.type === 'Workflow' && (
              <div className="bg-white rounded p-3 border">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Preview</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs text-blue-600 font-medium">1</span>
                    </div>
                    <span className="text-xs text-gray-600">Camera positioning setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs text-blue-600 font-medium">2</span>
                    </div>
                    <span className="text-xs text-gray-600">Audio equipment configuration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-medium">3</span>
                    </div>
                    <span className="text-xs text-gray-500">Lighting setup...</span>
                  </div>
                </div>
              </div>
            )}
            
            {hoveredItem.type === 'Article' && (
              <div className="bg-white rounded p-3 border">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Article contents</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Professional camera setup guidelines</p>
                  <p>• Equipment requirements and specifications</p>
                  <p>• Best practices for video recording</p>
                  <p className="text-gray-500">...and more</p>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">{hoveredItem.readTime}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{hoveredItem.type}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
