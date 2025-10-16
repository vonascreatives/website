'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Typography } from '@/components/typography';

interface KnowledgeItem {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: any[];
  category: string;
  tags: string[];
  lastUpdated: string;
  author: string;
}

interface AriaKnowledgeLayoutProps {
  knowledgeData: KnowledgeItem[];
  categories: string[];
}

interface KnowledgeMenuProps {
  knowledgeData: KnowledgeItem[];
  categories: string[];
  selectedItem: KnowledgeItem | null;
  onItemSelect: (item: KnowledgeItem) => void;
}

function KnowledgeMenu({ knowledgeData, categories, selectedItem, onItemSelect }: KnowledgeMenuProps) {
  return (
    <div className="space-y-4">
      {/* Getting Started Section */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-2">Getting Started</h3>
        <div className="space-y-1">
          {knowledgeData.slice(0, 3).map((item) => (
            <button
              key={item._id}
              onClick={() => onItemSelect(item)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedItem?._id === item._id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      {categories.map((category) => {
        const categoryItems = knowledgeData.filter(item => 
          item.tags?.some((tag: string) => tag.toLowerCase() === category.toLowerCase())
        );
        
        if (categoryItems.length === 0) return null;
        
        return (
          <div key={category}>
            <h3 className="font-semibold text-sm text-foreground mb-2">{category}</h3>
            <div className="space-y-1">
              {categoryItems.map((item) => (
                <button
                  key={item._id}
                  onClick={() => onItemSelect(item)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                    selectedItem?._id === item._id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KnowledgeLeftbar({ knowledgeData, categories, selectedItem, onItemSelect }: KnowledgeMenuProps) {
  return (
    <aside className="fixed top-0 left-0 z-30 hidden h-screen w-full shrink-0 md:sticky md:block md:w-80">
      <ScrollArea className="relative overflow-hidden h-full py-6 pr-6 lg:py-8">
        <div className="w-full">
          <KnowledgeMenu 
            knowledgeData={knowledgeData}
            categories={categories}
            selectedItem={selectedItem}
            onItemSelect={onItemSelect}
          />
        </div>
      </ScrollArea>
    </aside>
  );
}

function renderSanityContent(body: any[]): React.ReactNode {
  if (!body || !Array.isArray(body)) return null;
  
  return body.map((block, index) => {
    if (block._type === 'block') {
      const text = block.children?.map((child: any) => child.text).join('') || '';
      
      switch (block.style) {
        case 'h1':
          return <h1 key={index} className="text-3xl font-bold mb-4">{text}</h1>;
        case 'h2':
          return <h2 key={index} className="text-2xl font-semibold mb-3">{text}</h2>;
        case 'h3':
          return <h3 key={index} className="text-xl font-semibold mb-2">{text}</h3>;
        default:
          return <p key={index} className="mb-4 text-muted-foreground leading-relaxed">{text}</p>;
      }
    }
    return null;
  });
}

export default function AriaKnowledgeLayout({ knowledgeData, categories }: AriaKnowledgeLayoutProps) {
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(
    knowledgeData.length > 0 ? knowledgeData[0] : null
  );

  return (
    <div className="flex w-full">
      <KnowledgeLeftbar 
        knowledgeData={knowledgeData}
        categories={categories}
        selectedItem={selectedItem}
        onItemSelect={setSelectedItem}
      />
      
      <main className="flex-1 md:ml-6">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          {selectedItem ? (
            <article className="max-w-4xl">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{selectedItem.title}</h1>
                {selectedItem.excerpt && (
                  <p className="text-xl text-muted-foreground mb-6">{selectedItem.excerpt}</p>
                )}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedItem.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <Typography>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {renderSanityContent(selectedItem.body)}
                </div>
              </Typography>
              
              {selectedItem.author && (
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    By <span className="font-medium text-foreground">{selectedItem.author}</span>
                  </p>
                </div>
              )}
            </article>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Welcome to the Knowledge Base</h2>
              <p className="text-muted-foreground mb-6">
                Select an article from the sidebar to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
