import type { Metadata } from 'next'
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import './globals.css'

export const metadata: Metadata = {
  title: 'ProjectionDocs - Knowledge Base',
  description: 'Modern documentation and knowledge base interface for production teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans" style={{ overscrollBehaviorX: 'auto' }} suppressHydrationWarning>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
