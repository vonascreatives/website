# Implementation Guide - Vonas Media Website

## 🎯 Purpose
This guide provides technical details for developers working on merging the Knowledge Base into the Homepage and cleaning up the codebase.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│                 github.com/vonascreatives/website           │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌───▼────────┐ ┌─▼──────────────┐
        │   Branch:    │ │  Branch:   │ │    Branch:     │
        │   homepage   │ │     kb     │ │    studio      │
        └──────────────┘ └────────────┘ └────────────────┘
                │             │             │
        ┌───────▼──────┐ ┌───▼────────┐ ┌─▼──────────────┐
        │ new_vonas_   │ │ vonas-kb-  │ │ studio-vonas-  │
        │ media_hp     │ │ v4.2       │ │ media-core     │
        │              │ │            │ │                │
        │ Next.js App  │ │ Next.js KB │ │ Sanity Studio  │
        └──────┬───────┘ └─────┬──────┘ └────────┬───────┘
               │               │                  │
               └───────────────┴──────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Sanity CMS      │
                    │   (Cloud Hosted)  │
                    └───────────────────┘
```

---

## 📂 Detailed Folder Structure

### 1. Homepage Project (`new_vonas_media_hp/`)

```
new_vonas_media_hp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (routes)/          # Route groups
│   │   ├── api/               # API endpoints
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── ui/               # shadcn/ui components
│   │   └── sections/         # Page sections
│   ├── lib/                   # Utilities
│   │   ├── sanity.ts         # Sanity client (SERVER-SIDE)
│   │   ├── utils.ts          # Helper functions
│   │   └── queryClient.ts    # React Query setup
│   ├── hooks/                 # Custom React hooks
│   ├── data/                  # Static data & types
│   └── types/                 # TypeScript definitions
├── public/                    # Static assets
├── sanity/                    # Sanity schemas (if any)
├── .env.local                 # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── package.json              # Dependencies
```

### 2. Knowledge Base Project (`vonas-kb-v4.2/`)

```
vonas-kb-v4.2/
├── src/
│   ├── app/
│   │   ├── kb/               # Knowledge base routes
│   │   │   ├── page.tsx      # KB home
│   │   │   └── item/[id]/    # Article pages
│   │   ├── api/
│   │   │   └── kb/           # KB-specific API routes
│   │   └── globals.css
│   ├── components/
│   │   ├── content/          # KB content components
│   │   │   ├── main-content.tsx
│   │   │   ├── step-counter.tsx
│   │   │   ├── workflow-steps.tsx
│   │   │   └── related-articles.tsx
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   └── top-navigation.tsx
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/
│   │   ├── use-knowledge-base.tsx
│   │   └── use-knowledge-base-sanity.tsx
│   ├── lib/
│   │   └── sanity.ts         # Sanity client
│   └── types/
│       └── knowledge-base.ts
├── sanity/                    # KB-specific schemas
│   └── schemas/
│       ├── kb.ts
│       └── kbItem.ts
├── shared/                    # Cross-cutting code
│   └── schema.ts             # Drizzle ORM schema
└── package.json
```

### 3. Sanity Studio (`studio-vonas-media-core (sanity)/`)

```
studio-vonas-media-core (sanity)/
├── schemaTypes/              # All CMS schemas
│   ├── knowledgeBase.ts     # KB main schema
│   ├── kbItem.ts            # KB article schema
│   ├── kbCategory.ts        # KB categories
│   ├── kbTag.ts             # KB tags
│   ├── creator.ts           # Creator profiles
│   ├── channel.ts           # YouTube channels
│   ├── post.ts              # Blog posts
│   ├── teamMember.ts        # Team profiles
│   ├── jobBoard.ts          # Job postings
│   ├── faq.ts               # FAQ items
│   ├── objects/             # Reusable schema objects
│   │   ├── richBody.ts      # Rich text content
│   │   ├── seoFields.ts     # SEO metadata
│   │   ├── socialLinks.ts   # Social media links
│   │   └── kbModules.ts     # KB content modules
│   └── index.ts             # Schema registry
├── studio/                   # Studio customizations
│   ├── actions/             # Custom actions
│   ├── components/          # Custom UI components
│   └── structure/           # Custom structure
├── scripts/                  # Utility scripts
├── sanity.config.ts         # Studio configuration
├── sanity.cli.ts            # CLI configuration
└── package.json
```

---

## 🔧 Key Technologies

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **React Query** - Data fetching & caching
- **Lucide React** - Icon library

### CMS & Data
- **Sanity.io** - Headless CMS
- **GROQ** - Query language for Sanity
- **Drizzle ORM** - Database toolkit (if using SQL)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

---

## 🔌 API Routes Structure

### Homepage API Routes
```
/api/
├── sanity/              # Sanity data fetching
├── creators/            # Creator data
├── channels/            # Channel data
├── posts/               # Blog posts
└── jobs/                # Job board
```

### Knowledge Base API Routes (to merge)
```
/api/kb/
├── categories/          # GET all categories
├── category/[id]/       # GET category with articles
├── item/[id]/           # GET single article
├── search/              # POST search query
├── tree/                # GET full KB tree structure
├── shows/               # GET YouTube shows
├── company/             # GET company knowledge
├── team/                # GET team info
├── tools/               # GET tools/resources
└── policies/            # GET policies
```

---

## 🎨 Component Patterns

### Knowledge Base Components

#### 1. Main Content Component
```typescript
// src/components/content/main-content.tsx
// Renders KB article content with:
// - Intro section (gray background)
// - Rich text body
// - Embedded media (Guidde, videos)
// - Step-by-step instructions
// - Code blocks
```

#### 2. Step Counter Component
```typescript
// src/components/content/step-counter.tsx
// Displays numbered steps with:
// - Step number badge
// - Step title
// - Step description
// - Optional media
```

#### 3. Workflow Steps Component
```typescript
// src/components/content/workflow-steps.tsx
// Shows process workflows with:
// - Checklist items
// - Progress tracking
// - Collapsible sections
```

#### 4. Sidebar Navigation
```typescript
// src/components/layout/sidebar.tsx
// KB navigation with:
// - Category tree
// - Article list
// - Search integration
// - Active state tracking
```

#### 5. Command Palette (Cmd+K)
```typescript
// src/components/ui/command-palette.tsx
// Quick search with:
// - Fuzzy search
// - Keyboard navigation
// - Quick preview
// - Category filtering
```

---

## 🗃️ Sanity Schema Details

### Knowledge Base Schema

#### Main KB Document (`knowledgeBase.ts`)
```typescript
{
  name: 'knowledgeBase',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'description', type: 'text' },
    { name: 'category', type: 'reference', to: [{ type: 'kbCategory' }] },
    { name: 'tags', type: 'array', of: [{ type: 'reference', to: [{ type: 'kbTag' }] }] },
    { name: 'intro', type: 'text' },              // Gray highlighted section
    { name: 'body', type: 'richBody' },           // Main content
    { name: 'steps', type: 'array', of: [{ type: 'workflowStep' }] },
    { name: 'relatedArticles', type: 'array', of: [{ type: 'reference' }] },
    { name: 'guideUrl', type: 'url' },            // Guidde recording URL
    { name: 'videoUrl', type: 'url' },            // Embedded video
    { name: 'permissions', type: 'string' },       // 'public' | 'freelancer' | 'core'
    { name: 'seo', type: 'seoFields' }
  ]
}
```

#### Rich Body Object (`objects/richBody.ts`)
```typescript
{
  name: 'richBody',
  type: 'array',
  of: [
    { type: 'block' },                    // Rich text
    { type: 'image' },                    // Images
    { type: 'code' },                     // Code blocks
    { type: 'guiddeEmbed' },              // Guidde recordings
    { type: 'videoEmbed' },               // Video embeds
    { type: 'callout' },                  // Info boxes
    { type: 'table' }                     // Tables
  ]
}
```

#### Workflow Step Object
```typescript
{
  name: 'workflowStep',
  type: 'object',
  fields: [
    { name: 'stepNumber', type: 'number' },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'image', type: 'image' },
    { name: 'videoUrl', type: 'url' },
    { name: 'checklist', type: 'array', of: [{ type: 'string' }] }
  ]
}
```

---

## 🔄 Merge Implementation Plan

### Phase 1: Preparation (Week 1)
**Goal:** Understand both codebases

1. **Audit Components**
   ```bash
   # List all components in both projects
   find new_vonas_media_hp/src/components -name "*.tsx" > homepage-components.txt
   find vonas-kb-v4.2/src/components -name "*.tsx" > kb-components.txt
   
   # Compare for duplicates
   comm -12 <(sort homepage-components.txt) <(sort kb-components.txt)
   ```

2. **Audit Dependencies**
   ```bash
   # Compare package.json files
   diff new_vonas_media_hp/package.json vonas-kb-v4.2/package.json
   ```

3. **Map API Routes**
   - Document all endpoints in both projects
   - Identify conflicts or duplicates
   - Plan unified API structure

4. **Identify Shared Code**
   - Sanity client configurations
   - Utility functions
   - Type definitions
   - UI components

### Phase 2: Setup Merge Environment (Week 1-2)
**Goal:** Prepare homepage to receive KB code

1. **Create KB Route Structure**
   ```bash
   cd new_vonas_media_hp/src/app
   mkdir -p kb/item/[id]
   mkdir -p kb/category/[slug]
   mkdir -p kb/search
   ```

2. **Copy KB-Specific Components**
   ```bash
   # Copy KB content components
   cp -r vonas-kb-v4.2/src/components/content/* \
         new_vonas_media_hp/src/components/content/
   
   # Merge UI components (check for duplicates first)
   # Manual merge required for conflicts
   ```

3. **Merge API Routes**
   ```bash
   # Copy KB API routes
   cp -r vonas-kb-v4.2/src/app/api/kb/* \
         new_vonas_media_hp/src/app/api/kb/
   ```

4. **Unify Sanity Client**
   - Compare both `lib/sanity.ts` files
   - Merge query functions
   - Ensure consistent configuration
   - Test all queries work

### Phase 3: Integration (Week 2)
**Goal:** Make KB work within homepage

1. **Update Imports**
   - Fix all import paths
   - Update component references
   - Adjust API route calls

2. **Merge Hooks**
   ```typescript
   // Combine KB hooks into homepage hooks
   // new_vonas_media_hp/src/hooks/use-knowledge-base.tsx
   ```

3. **Update Navigation**
   - Add KB links to main navigation
   - Integrate KB sidebar
   - Update breadcrumbs

4. **Merge Types**
   ```typescript
   // Combine type definitions
   // new_vonas_media_hp/src/types/index.ts
   ```

5. **Update Layouts**
   - Ensure KB pages use correct layout
   - Add KB-specific layout if needed
   - Test responsive design

### Phase 4: Testing (Week 2-3)
**Goal:** Verify everything works

1. **Component Testing**
   - Test each KB component renders
   - Verify data fetching works
   - Check responsive design
   - Test Command+K search

2. **Route Testing**
   - Test all KB routes load
   - Verify dynamic routes work
   - Check 404 handling
   - Test navigation flow

3. **API Testing**
   - Test all KB API endpoints
   - Verify data structure
   - Check error handling
   - Test search functionality

4. **Integration Testing**
   - Test homepage → KB navigation
   - Verify shared components work
   - Check global state management
   - Test authentication (if applicable)

### Phase 5: Cleanup (Week 3)
**Goal:** Remove redundant code

1. **Remove Standalone KB Project**
   ```bash
   # After verifying everything works in merged version
   # Archive the standalone KB project
   mv vonas-kb-v4.2 archive/vonas-kb-v4.2-archived
   ```

2. **Clean Dependencies**
   ```bash
   # Remove unused packages
   npm uninstall <unused-packages>
   
   # Update package.json
   npm install
   ```

3. **Remove Duplicate Code**
   - Delete duplicate components
   - Remove unused utilities
   - Clean up type definitions

4. **Update Documentation**
   - Update README
   - Document new structure
   - Add migration notes

---

## 🧪 Testing Checklist

### Functionality Tests
- [ ] KB home page loads
- [ ] Article pages load with correct data
- [ ] Category filtering works
- [ ] Search functionality works
- [ ] Command+K palette opens and searches
- [ ] Sidebar navigation works
- [ ] Breadcrumbs are correct
- [ ] Related articles display
- [ ] Step-by-step components render
- [ ] Guidde embeds work
- [ ] Video embeds work
- [ ] Code blocks render correctly
- [ ] Images load properly
- [ ] Links work correctly
- [ ] 404 pages show for invalid routes

### Integration Tests
- [ ] Homepage navigation includes KB links
- [ ] Can navigate from homepage to KB
- [ ] Can navigate from KB back to homepage
- [ ] Shared components work in both contexts
- [ ] Global styles apply correctly
- [ ] SEO metadata is correct
- [ ] API routes respond correctly
- [ ] Error handling works

### Performance Tests
- [ ] Pages load quickly
- [ ] Images are optimized
- [ ] Code splitting works
- [ ] No console errors
- [ ] No memory leaks
- [ ] Search is responsive

### Responsive Tests
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Sidebar collapses on mobile
- [ ] Command palette works on mobile
- [ ] Touch interactions work

---

## 🐛 Common Issues & Solutions

### Issue 1: Import Path Errors
**Problem:** Components can't find imports after merge  
**Solution:** Update `tsconfig.json` paths and fix imports
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### Issue 2: Duplicate Components
**Problem:** Same component exists in both projects  
**Solution:** Compare implementations, keep best version, update imports

### Issue 3: Sanity Client Conflicts
**Problem:** Different Sanity configurations  
**Solution:** Unify into single client with all queries

### Issue 4: Style Conflicts
**Problem:** CSS classes conflict between projects  
**Solution:** Use Tailwind's layer system and unique class prefixes

### Issue 5: API Route Conflicts
**Problem:** Same route path in both projects  
**Solution:** Merge logic or rename routes

---

## 📚 Useful Commands

### Development
```bash
# Run homepage
cd new_vonas_media_hp && npm run dev

# Run Sanity Studio
cd "studio-vonas-media-core (sanity)" && npm run dev

# Type check
npm run check

# Build for production
npm run build

# Start production server
npm start
```

### Debugging
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Find unused dependencies
npx depcheck

# Analyze bundle size
npm run build && npx @next/bundle-analyzer
```

### Git Workflow
```bash
# Create feature branch for merge work
git checkout -b feature/merge-kb-into-homepage

# Commit frequently
git add .
git commit -m "feat: migrate KB components to homepage"

# Push to remote
git push origin feature/merge-kb-into-homepage
```

---

## 🔐 Environment Variables Reference

### Required Variables
```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_ga_id

# Optional: Search
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_key

# Optional: Vector Store (future)
VECTOR_STORE_API_KEY=your_key
```

---

## 📖 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Sanity Docs](https://www.sanity.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Sanity Queries
- [GROQ Query Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [GROQ Playground](https://www.sanity.io/docs/groq)

### Next.js Patterns
- [App Router Migration](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Last Updated:** 2025-10-07  
**Version:** 1.0  
**Status:** Ready for implementation
