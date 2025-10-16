'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { DocsPage } from '@/lib/sanity-docs';
import Toc from '@/components/toc';

interface DocsPageProps {
  page: DocsPage;
  tableOfContents?: Array<{
    href: string;
    level: number;
    text: string;
  }>;
  previousNext?: {
    prev: { title: string; href: string } | null;
    next: { title: string; href: string } | null;
  };
}

// Portable Text components for rendering Sanity content
const portableTextComponents = {
  types: {
    docsCodeBlock: ({ value }: { value: any }) => (
      <div className="my-8">
        {value.title && (
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-t-xl">
            {value.title}
          </div>
        )}
        <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-6 rounded-xl overflow-x-auto shadow-sm">
          <code className={`language-${value.language || 'text'} text-sm font-mono leading-relaxed`}>
            {value.code}
          </code>
        </pre>
      </div>
    ),
    docsCallout: ({ value }: { value: any }) => {
      const typeStyles = {
        note: 'bg-blue-50 border-l-4 border-blue-400 text-blue-900 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-200',
        warning: 'bg-amber-50 border-l-4 border-amber-400 text-amber-900 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-200',
        danger: 'bg-red-50 border-l-4 border-red-400 text-red-900 dark:bg-red-900/20 dark:border-red-500 dark:text-red-200',
        success: 'bg-green-50 border-l-4 border-green-400 text-green-900 dark:bg-green-900/20 dark:border-green-500 dark:text-green-200',
        tip: 'bg-purple-50 border-l-4 border-purple-400 text-purple-900 dark:bg-purple-900/20 dark:border-purple-500 dark:text-purple-200',
        info: 'bg-cyan-50 border-l-4 border-cyan-400 text-cyan-900 dark:bg-cyan-900/20 dark:border-cyan-500 dark:text-cyan-200',
        important: 'bg-orange-50 border-l-4 border-orange-400 text-orange-900 dark:bg-orange-900/20 dark:border-orange-500 dark:text-orange-200'
      };

      return (
        <div className={`my-8 p-6 rounded-xl shadow-sm ${typeStyles[value.type as keyof typeof typeStyles] || typeStyles.note}`}>
          {value.title && (
            <div className="font-semibold mb-3 text-lg">{value.title}</div>
          )}
          <div className="prose prose-sm max-w-none leading-relaxed">
            <PortableText value={value.content} />
          </div>
        </div>
      );
    },
    docsImage: ({ value }: { value: any }) => (
      <div className="my-10">
        <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-100 dark:bg-gray-800">
          <Image
            src={value.image.asset.url}
            alt={value.image.alt || ''}
            width={800}
            height={400}
            className={`w-full h-auto transition-transform duration-300 hover:scale-105 ${
              value.rounded ? 'rounded-lg' : ''
            } ${
              value.border ? 'border border-gray-200 dark:border-gray-700' : ''
            } ${
              value.shadow ? 'shadow-lg' : ''
            }`}
          />
        </div>
        {value.caption && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center italic">
            {value.caption}
          </p>
        )}
      </div>
    ),
    docsTable: ({ value }: { value: any }) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {value.title && (
          <h4 className="text-lg font-semibold mb-4 px-6 pt-4">{value.title}</h4>
        )}
        <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${
          value.bordered ? 'border border-gray-200 dark:border-gray-700' : ''
        }`}>
          {value.headers && value.headers.length > 0 && (
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {value.headers.map((header: string, index: number) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className={`bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 ${
            value.striped ? 'divide-y divide-gray-200 dark:divide-gray-700' : ''
          }`}>
            {value.rows?.map((row: any[], rowIndex: number) => (
              <tr key={rowIndex} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${value.striped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
                {row.map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <PortableText value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {value.caption && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 px-6 pb-4 italic">
            {value.caption}
          </p>
        )}
      </div>
    )
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-12 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-5 mt-10 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6 leading-tight">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-400 dark:border-blue-500 pl-6 py-2 italic text-gray-600 dark:text-gray-400 my-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside space-y-3 mb-6 text-gray-700 dark:text-gray-300 ml-6">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside space-y-3 mb-6 text-gray-700 dark:text-gray-300 ml-6">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="leading-relaxed">{children}</li>
    )
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-800 dark:text-gray-200">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
        {children}
      </code>
    ),
    link: ({ children, value }: any) => (
      <Link
        href={value?.href || '#'}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-400 underline-offset-2 hover:decoration-2 transition-all duration-200"
      >
        {children}
      </Link>
    )
  }
};

function Breadcrumbs({ page }: { page: DocsPage }) {
  if (!page.breadcrumbs) return null;

  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link href="/docs" className="hover:text-gray-700 dark:hover:text-gray-300">
            Documentation
          </Link>
        </li>
        {page.section && (
          <>
            <li>
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-700 dark:text-gray-300">{page.section.title}</span>
            </li>
          </>
        )}
        <li>
          <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </li>
        <li>
          <span className="text-gray-900 dark:text-white font-medium">{page.title}</span>
        </li>
      </ol>
    </nav>
  );
}

function PageNavigation({ previousNext }: { previousNext?: DocsPageProps['previousNext'] }) {
  if (!previousNext || (!previousNext.prev && !previousNext.next)) return null;

  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
      <div>
        {previousNext.prev && (
          <Link
            href={previousNext.prev.href}
            className="group flex items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
          >
            <svg className="w-6 h-6 mr-4 text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Previous</div>
              <div className="font-semibold text-gray-900 dark:text-white">{previousNext.prev.title}</div>
            </div>
          </Link>
        )}
      </div>
      <div>
        {previousNext.next && (
          <Link
            href={previousNext.next.href}
            className="group flex items-center justify-end p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
          >
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Next</div>
              <div className="font-semibold text-gray-900 dark:text-white">{previousNext.next.title}</div>
            </div>
            <svg className="w-6 h-6 ml-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function DocsPageComponent({ page, tableOfContents, previousNext }: DocsPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Breadcrumbs page={page} />
            
            {/* Article Header */}
            <header className="mb-12">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {page.title}
              </h1>
              {page.description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  {page.description}
                </p>
              )}
              
              {/* Meta Information */}
              <div className="flex items-center space-x-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                {page.lastUpdated && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Last updated:</span>
                    <span className="ml-1">{new Date(page.lastUpdated).toLocaleDateString()}</span>
                  </div>
                )}
                {page.author && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {page.author.image && (
                      <Image
                        src={page.author.image.asset.url}
                        alt={page.author.image.alt || page.author.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    )}
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">By</span>
                    <span className="ml-1">{page.author.name}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Main Content */}
            <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20">
              <PortableText value={page.body} components={portableTextComponents} />
            </article>
            
            <PageNavigation previousNext={previousNext} />
          </div>
          
          {/* Table of Contents - Sticky Sidebar */}
          {page.tableOfContents && tableOfContents && tableOfContents.length > 0 && (
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Table of Contents
                  </h3>
                  <Toc path={`/docs/${page.slug.current}`} tocs={tableOfContents} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
