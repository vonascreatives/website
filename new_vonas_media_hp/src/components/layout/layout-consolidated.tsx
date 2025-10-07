'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavigationItem } from '@/lib/sanity-queries';

// Base layout props
interface BaseLayoutProps {
  children: ReactNode;
  className?: string;
}

// Sidebar layout props
interface SidebarLayoutProps extends BaseLayoutProps {
  sidebar: ReactNode;
  sidebarWidth?: 'sm' | 'md' | 'lg' | 'xl';
  sidebarPosition?: 'left' | 'right';
  mobileSidebarTrigger?: ReactNode;
  collapsible?: boolean;
}

// Two column layout props
interface TwoColumnLayoutProps extends BaseLayoutProps {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
  leftColumnWidth?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  responsive?: boolean;
}

// Three column layout props
interface ThreeColumnLayoutProps extends BaseLayoutProps {
  leftColumn: ReactNode;
  centerColumn: ReactNode;
  rightColumn: ReactNode;
  leftWidth?: 1 | 2 | 3 | 4;
  centerWidth?: 4 | 6 | 8;
  rightWidth?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

// Container layout props
interface ContainerLayoutProps extends BaseLayoutProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

// Docs layout props (specialized)
interface TocItem {
  id: string;
  title: string;
  level: number;
}

// NavigationItem is imported from sanity-queries

interface DocsLayoutProps extends BaseLayoutProps {
  navigation: NavigationItem[];
  toc?: TocItem[];
  showMobileMenu?: boolean;
}

// Knowledge base layout props (specialized)
interface KnowledgeLayoutProps extends BaseLayoutProps {
  menu: ReactNode;
  content: ReactNode;
  showMobileMenu?: boolean;
}

// Utility functions for responsive classes
const getSidebarWidthClasses = (width: string) => {
  const widths = {
    sm: 'w-64',
    md: 'w-72',
    lg: 'w-80',
    xl: 'w-96'
  };
  return widths[width as keyof typeof widths] || widths.md;
};

const getGapClasses = (gap: string) => {
  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };
  return gaps[gap as keyof typeof gaps] || gaps.md;
};

const getMaxWidthClasses = (maxWidth: string) => {
  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };
  return widths[maxWidth as keyof typeof widths] || widths['7xl'];
};

const getPaddingClasses = (padding: string) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };
  return paddings[padding as keyof typeof paddings] || paddings.md;
};

// Container Layout Component
export function ContainerLayout({
  children,
  maxWidth = '7xl',
  padding = 'md',
  centered = true,
  className
}: ContainerLayoutProps) {
  return (
    <div className={cn(
      'container',
      getMaxWidthClasses(maxWidth),
      getPaddingClasses(padding),
      centered && 'mx-auto',
      className
    )}>
      {children}
    </div>
  );
}

// Sidebar Layout Component
export function SidebarLayout({
  children,
  sidebar,
  sidebarWidth = 'md',
  sidebarPosition = 'left',
  mobileSidebarTrigger,
  collapsible = true,
  className
}: SidebarLayoutProps) {
  const sidebarClasses = cn(
    'hidden md:flex md:flex-col md:fixed md:inset-y-0',
    getSidebarWidthClasses(sidebarWidth),
    sidebarPosition === 'right' ? 'md:right-0' : 'md:left-0'
  );

  const mainClasses = cn(
    'flex-1',
    sidebarPosition === 'right' ? 'md:mr-0' : 'md:ml-0',
    `md:${sidebarPosition === 'right' ? 'pr' : 'pl'}-${sidebarWidth === 'sm' ? '64' : sidebarWidth === 'md' ? '72' : sidebarWidth === 'lg' ? '80' : '96'}`
  );

  return (
    <div className={cn('flex min-h-screen', className)}>
      {/* Desktop Sidebar */}
      <div className={sidebarClasses}>
        <ScrollArea className="flex-1">
          {sidebar}
        </ScrollArea>
      </div>

      {/* Mobile Menu */}
      {collapsible && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              {mobileSidebarTrigger || (
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              )}
            </SheetTrigger>
            <SheetContent side={sidebarPosition} className="w-80 p-0">
              <div className="py-6">
                <ScrollArea className="h-full">
                  {sidebar}
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Main Content */}
      <main className={mainClasses}>
        {children}
      </main>
    </div>
  );
}

// Two Column Layout Component
export function TwoColumnLayout({
  children,
  leftColumn,
  rightColumn,
  leftColumnWidth = 6,
  gap = 'md',
  alignItems = 'start',
  responsive = true,
  className
}: TwoColumnLayoutProps) {
  const rightColumnWidth = 12 - leftColumnWidth;
  
  return (
    <div className={cn('container', className)}>
      <div className={cn(
        'row',
        getGapClasses(gap),
        `items-${alignItems}`,
        responsive && 'flex-col md:flex-row'
      )}>
        <div className={`col-xl-${leftColumnWidth} col-lg-${leftColumnWidth} ${responsive ? 'col-12' : ''}`}>
          {leftColumn}
        </div>
        <div className={`col-xl-${rightColumnWidth} col-lg-${rightColumnWidth} ${responsive ? 'col-12' : ''}`}>
          {rightColumn}
        </div>
      </div>
      {children}
    </div>
  );
}

// Three Column Layout Component
export function ThreeColumnLayout({
  children,
  leftColumn,
  centerColumn,
  rightColumn,
  leftWidth = 3,
  centerWidth = 6,
  rightWidth = 3,
  gap = 'md',
  responsive = true,
  className
}: ThreeColumnLayoutProps) {
  return (
    <div className={cn('container', className)}>
      <div className={cn(
        'row',
        getGapClasses(gap),
        responsive && 'flex-col lg:flex-row'
      )}>
        <div className={`col-xl-${leftWidth} col-lg-${leftWidth} ${responsive ? 'col-12' : ''}`}>
          {leftColumn}
        </div>
        <div className={`col-xl-${centerWidth} col-lg-${centerWidth} ${responsive ? 'col-12' : ''}`}>
          {centerColumn}
        </div>
        <div className={`col-xl-${rightWidth} col-lg-${rightWidth} ${responsive ? 'col-12' : ''}`}>
          {rightColumn}
        </div>
      </div>
      {children}
    </div>
  );
}

// Docs Layout Component (Specialized)
export function DocsLayout({
  children,
  navigation,
  toc = [],
  showMobileMenu = true,
  className
}: DocsLayoutProps) {
  // Import components dynamically to avoid circular dependencies
  const DocsSidebar = React.lazy(() => import('@/components/docs/docs-sidebar').then(m => ({ default: m.DocsSidebar })));
  const MobileDocsSidebar = React.lazy(() => import('@/components/docs/docs-sidebar').then(m => ({ default: m.MobileDocsSidebar })));
  const TableOfContents = React.lazy(() => import('@/components/docs/table-of-contents').then(m => ({ default: m.TableOfContents })));

  return (
    <div className={cn('flex min-h-screen', className)}>
      {/* Desktop Sidebar */}
      <React.Suspense fallback={<div className="w-80 bg-gray-50 animate-pulse" />}>
        <DocsSidebar navigation={navigation} />
      </React.Suspense>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="py-6">
                <React.Suspense fallback={<div className="animate-pulse bg-gray-100 h-full" />}>
                  <MobileDocsSidebar navigation={navigation} />
                </React.Suspense>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-0 ml-0 max-w-none">
        <div className="flex">
          {/* Content Area */}
          <div className="flex-1 px-6 md:px-8 py-6">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </div>
          
          {/* Table of Contents */}
          {toc && toc.length > 0 && (
            <React.Suspense fallback={<div className="w-64 bg-gray-50 animate-pulse" />}>
              <TableOfContents toc={toc} />
            </React.Suspense>
          )}
        </div>
      </main>
    </div>
  );
}

// Knowledge Base Layout Component (Specialized)
export function KnowledgeLayout({
  children,
  menu,
  content,
  showMobileMenu = true,
  className
}: KnowledgeLayoutProps) {
  return (
    <SidebarLayout
      sidebar={menu}
      sidebarWidth="md"
      collapsible={showMobileMenu}
      className={className}
    >
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {content}
        </div>
        {children}
      </div>
    </SidebarLayout>
  );
}

// Grid Layout Component
interface GridLayoutProps extends BaseLayoutProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  items: ReactNode[];
}

export function GridLayout({
  children,
  columns = 3,
  gap = 'md',
  responsive = true,
  items,
  className
}: GridLayoutProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={cn(
      'grid',
      responsive ? gridCols[columns] : `grid-cols-${columns}`,
      getGapClasses(gap),
      className
    )}>
      {items.map((item, index) => (
        <div key={index}>
          {item}
        </div>
      ))}
      {children}
    </div>
  );
}

// Export all layout components
export {
  type BaseLayoutProps,
  type SidebarLayoutProps,
  type TwoColumnLayoutProps,
  type ThreeColumnLayoutProps,
  type ContainerLayoutProps,
  type DocsLayoutProps,
  type KnowledgeLayoutProps,
  type GridLayoutProps
};