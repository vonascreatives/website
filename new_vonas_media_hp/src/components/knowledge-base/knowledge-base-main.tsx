"use client";
import React, { useState } from "react";

interface KnowledgeItem {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content: any[];
  category: string;
  tags: string[];
  lastUpdated: string;
  author: string;
}

interface Props {
  knowledgeItems?: KnowledgeItem[];
  categories?: string[];
}

const KnowledgeBaseMain = ({ knowledgeItems = [], categories = [] }: Props) => {
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const renderContent = (content: any[]) => {
    if (!content || !Array.isArray(content)) {
      return <p>No content available</p>;
    }
    return content.map((block, index) => {
      if (!block || !block._type) return null;
      
      switch (block._type) {
        case 'block':
          if (block.style === 'h3') {
            return (
              <h3 key={index} className="text-xl font-semibold mb-4 text-gray-900">
                {block.children?.map((child: any) => child.text).join('') || ''}
              </h3>
            );
          }
          return (
            <p key={index} className="mb-4 text-gray-700 leading-7">
              {block.children?.map((child: any) => child.text).join('') || ''}
            </p>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-52 bg-gray-50 border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Knowledge Base</h2>
          
          <nav className="space-y-1">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Getting Started
              </h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  !selectedItem 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Introduction
              </button>
            </div>

            {categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Categories
                </h3>
                {categories.map((category) => {
                  const categoryItems = knowledgeItems.filter(item => item.category === category);
                  return (
                    <div key={category} className="mb-4">
                      <div className="text-sm font-medium text-gray-900 px-3 py-2">
                        {category}
                      </div>
                      {categoryItems.map((item) => (
                        <button
                          key={item._id}
                          onClick={() => setSelectedItem(item)}
                          className={`w-full text-left px-6 py-2 text-sm rounded-md transition-colors ${
                            selectedItem?._id === item._id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-52">
        <div className="max-w-none px-8 py-12" style={{ marginRight: selectedItem ? '256px' : '0' }}>
          {selectedItem ? (
            // Article View
            <article>
              <div className="mb-6">
                <nav className="text-sm text-gray-500 mb-4">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Docs
                  </button>
                  <span className="mx-2">›</span>
                  <span>{selectedItem.category}</span>
                  <span className="mx-2">›</span>
                  <span>{selectedItem.title}</span>
                </nav>
              </div>

              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedItem.title}
                </h1>
                {selectedItem.excerpt && (
                  <p className="text-xl text-gray-600 leading-8">
                    {selectedItem.excerpt}
                  </p>
                )}
              </header>

              <div className="prose prose-lg max-w-none">
                {renderContent(selectedItem.content)}
              </div>

              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    {selectedItem.tags && selectedItem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    By {selectedItem.author}
                  </div>
                </div>
              </footer>
            </article>
          ) : (
            // Introduction/Overview
            <div>
              <header className="mb-12">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      Knowledge Base
                    </h1>
                    <p className="text-xl text-gray-600 leading-8">
                      Welcome to our knowledge base. Find guides, tutorials, and documentation to help you get the most out of our platform.
                    </p>
                  </div>
                  <a 
                    href="http://localhost:3001/docs" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                  >
                    Full Knowledge Base
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </header>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {knowledgeItems.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedItem(item)}
                    className="p-6 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-gray-600 text-sm leading-6 mb-4">
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{item.category}</span>
                      <span className="text-blue-600">Read more →</span>
                    </div>
                  </div>
                ))}
              </div>

              {knowledgeItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No articles available yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Only show when viewing an article */}
      {selectedItem && (
        <div className="w-64 bg-gray-50 border-l border-gray-200 fixed right-0 h-full overflow-y-auto">
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              On this page
            </h3>
            <nav className="space-y-2">
              <a href="#" className="block text-sm text-gray-700 hover:text-gray-900">
                Overview
              </a>
              {selectedItem.tags && selectedItem.tags.slice(0, 5).map((tag, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-sm text-gray-600 hover:text-gray-900 capitalize"
                >
                  {tag.replace(/-/g, ' ')}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseMain;