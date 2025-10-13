import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Menu, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommandPalette } from '@/components/ui/command-palette';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import type { Show } from '@/data/knowledge-base-data';
import { useRouter } from 'next/navigation';

interface TopNavigationProps {
  onShowSelect: (showId: string) => void;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onItemSelect: (showId: string, itemId: string) => void;
  shows?: Show[];
  sections?: Array<{ _id: string; title: string; slug: { current: string } }>;
  companyChildren?: Array<{ _id: string; title: string; slug: { current: string } }>;
  showsChildren?: Array<{ _id: string; title: string; slug: { current: string } }>;
  productionChildren?: Array<{ _id: string; title: string; slug: { current: string } }>;
  toolsChildren?: Array<{ _id: string; title: string; slug: { current: string } }>;
  partnersChildren?: Array<{ _id: string; title: string; slug: { current: string } }>;
}

// Helper to trim prefixed titles like "Shows / Off the Record"
function getCleanTitle(title: string): string {
  if (!title) return ''
  const parts = title.split(' / ')
  return parts.length > 1 ? parts[parts.length - 1] : title
}

export function TopNavigation({ 
  onShowSelect, 
  onToggleSidebar, 
  searchQuery, 
  onSearchChange,
  onItemSelect,
  shows = [],
  sections = [],
  companyChildren = [],
  showsChildren = [],
  productionChildren = [],
  toolsChildren = [],
  partnersChildren = [],
}: TopNavigationProps) {
  const router = useRouter();
  const [companyDropdown, setCompanyDropdown] = useState(false);
  const [showsDropdown, setShowsDropdown] = useState(false);
  const [productionDropdown, setProductionDropdown] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const [partnersDropdown, setPartnersDropdown] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Handle cmd+k shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 h-14 flex items-center px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 hover:bg-muted"
            onClick={onToggleSidebar}
            data-testid="button-toggle-sidebar"
          >
            <Menu className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <Video className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-gray-900" data-testid="text-brand-name">ProductionDocs</span>
          </Link>
        </div>

        {/* Main Navigation - dynamic dropdowns from CMS */}
        <div className="hidden lg:flex items-center space-x-8">
          {sections.map((section) => {
            const sectionTitle = section.title

            if (sectionTitle === 'Company' && companyChildren.length > 0) {
              return (
                <div
                  key={section._id}
                  className="dropdown relative"
                  onMouseEnter={() => setCompanyDropdown(true)}
                  onMouseLeave={() => setCompanyDropdown(false)}
                >
                  <button
                    className="text-sm text-gray-900 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    data-testid="button-company-dropdown"
                    onClick={() => setCompanyDropdown((v) => !v)}
                  >
                    <span>{sectionTitle}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className={`absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${companyDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {companyChildren.map((child) => (
                      <a
                        key={child._id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onShowSelect(child._id)
                          setCompanyDropdown(false)
                        }}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        data-testid={`link-company-${child.slug.current}`}
                      >
                        {getCleanTitle(child.title)}
                      </a>
                    ))}
                  </div>
                </div>
              )
            }

            if (sectionTitle === 'Shows' && showsChildren.length > 0) {
              return (
                <div
                  key={section._id}
                  className="dropdown relative"
                  onMouseEnter={() => setShowsDropdown(true)}
                  onMouseLeave={() => setShowsDropdown(false)}
                >
                  <button
                    className="text-sm text-gray-900 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    data-testid="button-shows-dropdown"
                    onClick={() => setShowsDropdown((v) => !v)}
                  >
                    <span>{sectionTitle}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className={`absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${showsDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {showsChildren.map((show) => (
                      <a
                        key={show._id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onShowSelect(show._id)
                          setShowsDropdown(false)
                        }}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        data-testid={`link-show-${show.slug.current}`}
                      >
                        {getCleanTitle(show.title)}
                      </a>
                    ))}
                  </div>
                </div>
              )
            }

            if (sectionTitle === 'Production' && productionChildren.length > 0) {
              return (
                <div key={section._id} className="dropdown relative" onMouseEnter={()=>setProductionDropdown(true)} onMouseLeave={()=>setProductionDropdown(false)}>
                  <button className="text-sm text-gray-900 hover:text-blue-600 transition-colors flex items-center space-x-1" onClick={()=>setProductionDropdown(v=>!v)}>
                    <span>{sectionTitle}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                  <div className={`absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${productionDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {productionChildren.map((child) => (
                      <a key={child._id} href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={(e)=>{e.preventDefault(); onShowSelect(child._id); setProductionDropdown(false)}}>
                        {getCleanTitle(child.title)}
                      </a>
                    ))}
                  </div>
                </div>
              )
            }

            if (sectionTitle === 'Tools' && toolsChildren.length > 0) {
              return (
                <div key={section._id} className="dropdown relative" onMouseEnter={()=>setToolsDropdown(true)} onMouseLeave={()=>setToolsDropdown(false)}>
                  <button className="text-sm text-gray-900 hover:text-blue-600 transition-colors flex items-center space-x-1" onClick={()=>setToolsDropdown(v=>!v)}>
                    <span>{sectionTitle}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                  <div className={`absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${toolsDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {toolsChildren.map((child) => (
                      <a key={child._id} href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={(e)=>{e.preventDefault(); onShowSelect(child._id); setToolsDropdown(false)}}>
                        {getCleanTitle(child.title)}
                      </a>
                    ))}
                  </div>
                </div>
              )
            }

            if (sectionTitle === 'Partners' && partnersChildren.length > 0) {
              return (
                <div key={section._id} className="dropdown relative" onMouseEnter={()=>setPartnersDropdown(true)} onMouseLeave={()=>setPartnersDropdown(false)}>
                  <button className="text-sm text-gray-900 hover:text-blue-600 transition-colors flex items-center space-x-1" onClick={()=>setPartnersDropdown(v=>!v)}>
                    <span>{sectionTitle}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                  <div className={`absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${partnersDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {partnersChildren.map((child) => (
                      <a key={child._id} href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={(e)=>{e.preventDefault(); onShowSelect(child._id); setPartnersDropdown(false)}}>
                        {getCleanTitle(child.title)}
                      </a>
                    ))}
                  </div>
                </div>
              )
            }
            
            return (
              <a
                key={section._id}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {sectionTitle}
              </a>
            )
          })}
        </div>

        {/* Search and User */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden lg:flex items-center space-x-2 text-muted-foreground bg-muted/50 border-border hover:bg-muted"
            data-testid="button-search-trigger"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-secondary transition-colors p-0"
                data-testid="button-user-profile"
                aria-label="User menu"
              >
                <User className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e)=>e.preventDefault()}>Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={(e)=>e.preventDefault()}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e)=>e.preventDefault()}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onItemSelect={(showId, itemId) => {
          onShowSelect(showId);
        onItemSelect(showId, itemId);
        router.push(`/kb/item/${itemId}`);
        }}
        shows={shows}
      />
    </nav>
  );
}
