"use client"

import { PortableText, PortableTextComponents } from '@portabletext/react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

// Code Block Component
function CodeBlock({ value }: { value: any }) {
  const [copied, setCopied] = useState(false)
  const { code, language, title, filename, showLineNumbers = true, allowCopy = true } = value

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border bg-zinc-950 dark:bg-zinc-900">
      {(title || filename) && (
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2 text-sm">
          <span className="text-zinc-300">
            {title && <span className="font-medium">{title}</span>}
            {filename && (
              <span className={cn("font-mono", title && "ml-2 text-zinc-400")}>
                {filename}
              </span>
            )}
          </span>
          {allowCopy && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          lineNumberStyle={{
            color: '#6b7280',
            paddingRight: '1rem',
            minWidth: '2.5rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
        {allowCopy && !title && !filename && (
          <button
            onClick={copyToClipboard}
            className="absolute right-2 top-2 rounded bg-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>
        )}
      </div>
    </div>
  )
}

// Callout Component
function Callout({ value }: { value: any }) {
  const { type, title, content, collapsible, defaultExpanded } = value
  const [isExpanded, setIsExpanded] = useState(defaultExpanded ?? true)

  const typeConfig = {
    note: {
      icon: '💡',
      className: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
      titleClassName: 'text-blue-900 dark:text-blue-100',
      contentClassName: 'text-blue-800 dark:text-blue-200'
    },
    warning: {
      icon: '⚠️',
      className: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30',
      titleClassName: 'text-yellow-900 dark:text-yellow-100',
      contentClassName: 'text-yellow-800 dark:text-yellow-200'
    },
    danger: {
      icon: '❌',
      className: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30',
      titleClassName: 'text-red-900 dark:text-red-100',
      contentClassName: 'text-red-800 dark:text-red-200'
    },
    success: {
      icon: '✅',
      className: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30',
      titleClassName: 'text-green-900 dark:text-green-100',
      contentClassName: 'text-green-800 dark:text-green-200'
    },
    tip: {
      icon: '💡',
      className: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30',
      titleClassName: 'text-purple-900 dark:text-purple-100',
      contentClassName: 'text-purple-800 dark:text-purple-200'
    },
    info: {
      icon: 'ℹ️',
      className: 'border-cyan-200 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950/30',
      titleClassName: 'text-cyan-900 dark:text-cyan-100',
      contentClassName: 'text-cyan-800 dark:text-cyan-200'
    },
    important: {
      icon: '🔥',
      className: 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30',
      titleClassName: 'text-orange-900 dark:text-orange-100',
      contentClassName: 'text-orange-800 dark:text-orange-200'
    }
  }

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.note
  const displayTitle = title || type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <div className={cn('my-6 rounded-lg border p-4', config.className)}>
      {collapsible ? (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn('flex w-full items-center gap-2 text-left font-medium', config.titleClassName)}
          >
            <span>{config.icon}</span>
            <span>{displayTitle}</span>
            <span className="ml-auto">{isExpanded ? '−' : '+'}</span>
          </button>
          {isExpanded && (
            <div className={cn('mt-3', config.contentClassName)}>
              <PortableText value={content} components={components} />
            </div>
          )}
        </>
      ) : (
        <>
          <div className={cn('flex items-center gap-2 font-medium', config.titleClassName)}>
            <span>{config.icon}</span>
            <span>{displayTitle}</span>
          </div>
          <div className={cn('mt-2', config.contentClassName)}>
            <PortableText value={content} components={components} />
          </div>
        </>
      )}
    </div>
  )
}

// Image Component
function DocsImage({ value }: { value: any }) {
  const { asset, alt, caption } = value
  
  if (!asset) return null

  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-lg border">
        <Image
          src={asset.url}
          alt={alt || ''}
          width={asset.metadata?.dimensions?.width || 800}
          height={asset.metadata?.dimensions?.height || 600}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Table Component
function DocsTable({ value }: { value: any }) {
  const { rows, headers } = value
  
  if (!rows || rows.length === 0) return null

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        {headers && (
          <thead>
            <tr className="bg-muted/50">
              {headers.map((header: string, index: number) => (
                <th key={index} className="border border-border px-4 py-2 text-left font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex} className="even:bg-muted/25">
              {row.map((cell: string, cellIndex: number) => (
                <td key={cellIndex} className="border border-border px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// PortableText Components Configuration
const components: PortableTextComponents = {
  types: {
    docsCodeBlock: CodeBlock,
    docsCallout: Callout,
    docsImage: DocsImage,
    docsTable: DocsTable,
    // Handle generic block types from fallback data
    block: ({ value }) => {
      const style = value?.style || 'normal'
      const children = value?.children || []
      
      // Render children as text
      const text = children.map((child: any) => child.text || '').join('')
      
      switch (style) {
        case 'h1':
          const h1Id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
          return <h1 id={h1Id} className="scroll-m-20 text-4xl font-bold tracking-tight mb-6 mt-8">{text}</h1>
        case 'h2':
          const h2Id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
          return <h2 id={h2Id} className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4 mt-8 border-b pb-2">{text}</h2>
        case 'h3':
          const h3Id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
          return <h3 id={h3Id} className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6">{text}</h3>
        case 'h4':
          const h4Id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
          return <h4 id={h4Id} className="scroll-m-20 text-xl font-semibold tracking-tight mb-2 mt-4">{text}</h4>
        default:
          return <p className="mb-4 leading-7">{text}</p>
      }
    },
  },
  block: {
    normal: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
    // Handle fallback block types
    block: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
    h1: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
      return (
        <h1 id={id} className="scroll-m-20 text-4xl font-bold tracking-tight mb-6 mt-8">
          {children}
        </h1>
      )
    },
    h2: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
      return (
        <h2 id={id} className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4 mt-8 border-b pb-2">
          {children}
        </h2>
      )
    },
    h3: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
      return (
        <h3 id={id} className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6">
          {children}
        </h3>
      )
    },
    h4: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
      return (
        <h4 id={id} className="scroll-m-20 text-xl font-semibold tracking-tight mb-2 mt-4">
          {children}
        </h4>
      )
    },
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-border pl-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        {children}
      </code>
    ),
    underline: ({ children }) => <u className="underline">{children}</u>,
    'strike-through': ({ children }) => <s className="line-through">{children}</s>,
    link: ({ children, value }) => {
      const { href, blank } = value
      const isExternal = href?.startsWith('http')
      
      if (isExternal) {
        return (
          <a
            href={href}
            target={blank ? '_blank' : undefined}
            rel={blank ? 'noopener noreferrer' : undefined}
            className="font-medium text-primary underline underline-offset-4 hover:no-underline"
          >
            {children}
          </a>
        )
      }
      
      return (
        <Link
          href={href || '#'}
          className="font-medium text-primary underline underline-offset-4 hover:no-underline"
        >
          {children}
        </Link>
      )
    },
  },
}

// Main PortableText Renderer Component
export function PortableTextRenderer({ content }: { content: any[] }) {
  if (!content || content.length === 0) {
    return null
  }

  return (
    <div className="prose prose-zinc dark:prose-invert prose-code:font-normal prose-code:font-code dark:prose-code:bg-stone-900/25 prose-code:bg-stone-50 prose-pre:bg-background prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 dark:prose-code:text-white prose-code:text-stone-800 prose-code:p-[0.085rem] prose-code:rounded-md prose-code:border pt-2 !min-w-full prose-img:rounded-md prose-img:border prose-code:before:content-none prose-code:after:content-none prose-code:px-1.5 prose-code:overflow-x-auto !max-w-[500px] prose-img:my-3 prose-h2:my-4 prose-h2:mt-8 prose-code:break-all md:prose-code:break-normal prose-td:px-4">
      <PortableText value={content} components={components} />
    </div>
  )
}
