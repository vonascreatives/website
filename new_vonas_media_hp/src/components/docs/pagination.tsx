import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PaginationItem {
  title: string
  href: string
}

interface PaginationProps {
  previous?: PaginationItem
  next?: PaginationItem
  className?: string
}

export function Pagination({ previous, next, className }: PaginationProps) {
  if (!previous && !next) {
    return null
  }

  return (
    <div className={cn(
      'flex items-center justify-between pt-8 mt-8 border-t',
      className
    )}>
      <div className="flex-1">
        {previous && (
          <Link href={previous.href}>
            <Button variant="ghost" className="h-auto p-4 justify-start">
              <div className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground mb-1">
                    Previous
                  </div>
                  <div className="font-medium">
                    {previous.title}
                  </div>
                </div>
              </div>
            </Button>
          </Link>
        )}
      </div>
      
      <div className="flex-1 flex justify-end">
        {next && (
          <Link href={next.href}>
            <Button variant="ghost" className="h-auto p-4 justify-end">
              <div className="flex items-center">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">
                    Next
                  </div>
                  <div className="font-medium">
                    {next.title}
                  </div>
                </div>
                <ChevronRight className="ml-2 h-4 w-4" />
              </div>
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
