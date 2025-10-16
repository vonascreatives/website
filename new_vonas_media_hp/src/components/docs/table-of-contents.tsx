"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'

interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  toc: TocItem[]
  className?: string
}

export function TableOfContents({ toc, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    )

    // Observe all headings
    toc.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      toc.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [toc])

  // Calculate reading progress
  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', calculateProgress)
    calculateProgress() // Initial calculation

    return () => window.removeEventListener('scroll', calculateProgress)
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  if (!toc || toc.length === 0) {
    return null
  }

  return (
    <nav 
      className={cn(
        'xl:flex toc hidden w-[20rem] py-9 sticky top-16 h-[96.95vh] pl-6',
        className
      )}
      aria-label="Table of contents"
    >
      <div className="flex flex-col gap-4 w-full pl-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">On this page</h3>
            <span className="text-xs text-muted-foreground" aria-label={`Reading progress: ${Math.round(readingProgress)} percent`}>
              {Math.round(readingProgress)}%
            </span>
          </div>
          <Progress 
            value={readingProgress} 
            className="h-1" 
            aria-label="Reading progress"
          />
        </div>
        
        <ScrollArea className="pb-2 pt-0.5 overflow-y-auto">
          <ul className="flex flex-col gap-1.5" role="list">
            {toc.map((item) => {
              const isActive = activeId === item.id
              const indent = (item.level - 1) * 12 // 12px per level
              
              return (
                <li key={item.id} role="listitem">
                  <button
                    onClick={() => handleClick(item.id)}
                    className={cn(
                      'text-left text-sm transition-all duration-200 hover:text-foreground rounded-md px-2 py-1.5 w-full',
                      isActive
                        ? 'text-foreground font-medium bg-primary/10 border-l-2 border-primary'
                        : 'text-muted-foreground hover:bg-muted/50 border-l-2 border-transparent',
                      'hover:border-muted-foreground/30'
                    )}
                    style={{ marginLeft: `${indent}px` }}
                    aria-current={isActive ? 'location' : undefined}
                    aria-label={`Go to section: ${item.title}`}
                  >
                    <span className="block truncate">{item.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      </div>
    </nav>
  )
}

// Hook for generating TOC from content
export function useTocObserver(toc: TocItem[]) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    )

    // Observe all headings
    toc.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      toc.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [toc])

  return activeId
}
