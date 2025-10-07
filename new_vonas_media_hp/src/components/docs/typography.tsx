import { cn } from '@/lib/utils'

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function Typography({ children, className }: TypographyProps) {
  return (
    <div
      className={cn(
        // Base prose styles
        'prose prose-gray dark:prose-invert max-w-none',
        // Headings
        'prose-headings:scroll-mt-20 prose-headings:font-semibold',
        'prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight',
        'prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:mt-10 prose-h2:mb-4',
        'prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-8 prose-h3:mb-3',
        'prose-h4:text-lg prose-h4:font-semibold prose-h4:tracking-tight prose-h4:mt-6 prose-h4:mb-2',
        // Links
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-a:font-medium prose-a:decoration-primary/50',
        // Code
        'prose-code:text-sm prose-code:font-medium',
        'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md',
        'prose-code:before:content-none prose-code:after:content-none',
        // Pre/Code blocks
        'prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:p-4',
        'prose-pre:overflow-x-auto prose-pre:text-sm',
        // Blockquotes
        'prose-blockquote:border-l-4 prose-blockquote:border-primary/20',
        'prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4',
        'prose-blockquote:rounded-r-lg prose-blockquote:not-italic',
        'prose-blockquote:text-foreground/90',
        // Lists
        'prose-ul:my-4 prose-ol:my-4',
        'prose-li:my-1 prose-li:text-muted-foreground',
        // Tables
        'prose-table:border-collapse prose-table:border prose-table:border-border',
        'prose-th:border prose-th:border-border prose-th:bg-muted/50 prose-th:px-4 prose-th:py-2',
        'prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2',
        // Images
        'prose-img:rounded-lg prose-img:border prose-img:shadow-sm',
        // Strong/Bold
        'prose-strong:font-semibold prose-strong:text-foreground',
        // Emphasis/Italic
        'prose-em:text-muted-foreground',
        // Paragraphs
        'prose-p:text-muted-foreground prose-p:leading-7',
        // HR
        'prose-hr:border-border prose-hr:my-8',
        className
      )}
    >
      {children}
    </div>
  )
}