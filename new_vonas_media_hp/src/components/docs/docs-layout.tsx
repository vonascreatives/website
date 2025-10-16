"use client"

import { ReactNode } from 'react'
import { DocsSidebar, MobileDocsSidebar } from './docs-sidebar'
import { TableOfContents } from './table-of-contents'
import { NavigationItem } from '@/lib/sanity-queries'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  title: string
  level: number
}

interface DocsLayoutProps {
  children: ReactNode
  navigation: NavigationItem[]
  toc?: TocItem[]
  className?: string
}

export function DocsLayout({ children, navigation, toc = [], className }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <DocsSidebar navigation={navigation} />
      
      {/* Mobile Menu */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="py-6">
              <MobileDocsSidebar navigation={navigation} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className={cn(
        'flex-1 md:ml-0 ml-0',
        'max-w-none',
        className
      )}>
        <div className="flex">
          {/* Content Area */}
          <div className="flex-1 px-6 md:px-8 py-6">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </div>
          
          {/* Table of Contents */}
          {toc && toc.length > 0 && (
            <TableOfContents toc={toc} />
          )}
        </div>
      </main>
    </div>
  )
}
