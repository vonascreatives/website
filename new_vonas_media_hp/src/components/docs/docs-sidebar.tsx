"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { NavigationItem } from '@/lib/sanity-queries'
import DocsSearch from './docs-search'
import DocsMenu from '../docs-menu'

interface DocsSidebarProps {
  navigation: NavigationItem[]
  className?: string
}

interface SubLinkProps extends NavigationItem {
  level: number
  isSheet?: boolean
}

function SubLink({ title, href, items, noLink, level, isSheet, tag }: SubLinkProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(level === 0)

  useEffect(() => {
    if (pathname && (pathname === href || pathname.includes(href))) {
      setIsOpen(true)
    }
  }, [href, pathname])

  const isActive = pathname === href
  const isParentActive = pathname && pathname.startsWith(href) && href !== '/docs'

  const LinkComponent = (
    <Link
      href={href}
      className={cn(
        'block w-full text-left transition-colors hover:text-foreground',
        isActive
          ? 'text-primary dark:font-medium font-semibold'
          : 'text-muted-foreground',
        isParentActive && !isActive && 'text-foreground'
      )}
    >
      {title}
      {tag && (
        <span className="dark:bg-blue-700 bg-blue-500 rounded-md px-1.5 py-0.5 mx-2 text-xs text-white !font-normal">
          {tag}
        </span>
      )}
    </Link>
  )

  const titleOrLink = !noLink ? (
    LinkComponent
  ) : (
    <h4 className="font-medium sm:text-sm text-primary">
      {title}
      {tag && (
        <span className="dark:bg-blue-700 bg-blue-500 rounded-md px-1.5 py-0.5 mx-2 text-xs text-white !font-normal">
          {tag}
        </span>
      )}
    </h4>
  )

  if (!items || items.length === 0) {
    return <div className="flex flex-col">{titleOrLink}</div>
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full pr-5">
          <div className="flex items-center justify-between cursor-pointer w-full">
            <span className="w-[95%] overflow-hidden text-ellipsis text-start">
              {titleOrLink}
            </span>
            <span className="sm:ml-0 -mr-1.5">
              {!isOpen ? (
                <ChevronRight className="h-[0.9rem] w-[0.9rem]" />
              ) : (
                <ChevronDown className="h-[0.9rem] w-[0.9rem]" />
              )}
            </span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div
            className={cn(
              'flex flex-col items-start sm:text-sm dark:text-stone-300/85 text-stone-800 ml-0.5 mt-2.5 gap-3',
              level > 0 && 'pl-4 border-l ml-1.5'
            )}
          >
            {items.map((innerLink) => {
              const modifiedItems = {
                ...innerLink,
                href: innerLink.href.startsWith('/docs') ? innerLink.href : `${href}${innerLink.href}`,
                level: level + 1,
                isSheet,
              }
              return <SubLink key={modifiedItems.href} {...modifiedItems} />
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export function DocsSidebar({ navigation, className }: DocsSidebarProps) {
  const pathname = usePathname()
  
  if (!pathname || !pathname.startsWith('/knowledge-base')) return null

  return (
    <aside className={cn(
      'md:flex hidden w-[20rem] sticky top-16 flex-col h-[93.75vh] overflow-y-auto',
      className
    )}>
      <div className="px-4 py-4 border-b border-border">
        <DocsSearch className="w-full" />
      </div>
      <ScrollArea className="py-4 px-2">
        <DocsMenu />
      </ScrollArea>
    </aside>
  )
}

// Mobile Sheet Sidebar
export function MobileDocsSidebar({ navigation }: { navigation: NavigationItem[] }) {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <div className="px-4 py-4 border-b border-border">
        <DocsSearch className="w-full" />
      </div>
      <div className="ml-2 pl-5">
        <DocsMenu isSheet={true} />
      </div>
    </div>
  )
}
