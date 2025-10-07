# Sanity CMS Integration Plan for vonas-kb-v4.2

## Current Analysis

### Existing Sanity Structure Issues
**Current schemas have complex hierarchy and naming issues:**

- `kbItem.ts` - Complex hierarchical structure with parent/child references, multiple item types with emojis (📁 Folder, 📄 Document, 📺 YouTube Show, etc.)
- `kbCategory.ts` - Top-level categories with emoji icons
- `knowledgeBase.ts` - Overlapping functionality with kbItem
- Multiple conflicting schemas: `knowledgeBaseSimple.ts`, `knowledgeCategory.ts`, `knowledgeTag.ts`

**Problems:**
1. Too many emojis in schema definitions
2. Complex nested hierarchy (KB -> By Category -> 1. Company Foundation)
3. Multiple overlapping schemas causing confusion
4. Long naming conventions

### Desired Navigation Structure

**Top Navigation:** Company, Team, Production, Shows, Tools, Partners, Policies

**Navigation Examples:**
- **Top menu "Shows"** → Dropdown shows: "Off the Record", "Passions", "Tech Talks", "Weekly Wrap"
- **Click "Off the Record"** → Goes to OTR page with sections: "Pre-Production", "Shooting", "Post-Production", "Distribution"
- **Click "Company"** → Goes to Company page with sections: "About", "Mission", "Values", etc.

**Key Requirement: Consistent Page Logic**
- Whether you click "Off the Record" under Shows OR "About" under Company
- Same rendering logic: Page → Sections → Items under each section
- Flat Sanity structure but logical grouping for UI

### Current Next.js App Structure
- Uses `useKnowledgeBase` hook for data management
- Has TopNavigation, Sidebar, MainContent components
- Already structured for flat navigation pattern
- Uses React/Next.js 15 with Tailwind CSS

## New Simplified Schema Design

### Updated Schema Design (Flat Structure with Logical Grouping)

```typescript
// Single kbItem schema that supports both pages and sections
fields: [
  title: string (required) // No emojis, short names
  slug: slug (required)
  category: 'company' | 'team' | 'production' | 'shows' | 'tools' | 'partners' | 'policies'
  
  // NEW: Support for logical grouping
  parentPage: string // e.g., "off-the-record", "company-about" 
  section: string // e.g., "pre-production", "shooting", "about-us"
  itemType: 'page' | 'section' | 'item' // Type of content
  
  content: rich text
  status: 'draft' | 'published' | 'archived'  
  order: number
  hidden: boolean
]
```

**Examples in Sanity:**
- `Off the Record` (page): category="shows", itemType="page", parentPage=null
- `Pre-Production` (section): category="shows", parentPage="off-the-record", itemType="section"
- `Equipment Setup` (item): category="shows", parentPage="off-the-record", section="pre-production", itemType="item"

**Same for Company:**
- `Company` (page): category="company", itemType="page"  
- `About` (section): category="company", parentPage="company", itemType="section"
- `Our Story` (item): category="company", parentPage="company", section="about", itemType="item"

### Simplified Categories
Replace current complex categories with simple enum:
- Company (was "1. Company Foundations 🏢")
- Team (was "Team Management 👥") 
- Production (was "Production Workflows 🎬")
- Shows (was "YouTube Shows 📺")
- Tools (was "Tools & Resources 🛠️")
- Partners (was "Partner Relations 🤝")
- Policies (was "Policies & Guidelines 📋")

## Integration Strategy

### Phase 1: Schema Simplification
1. Remove emoji-heavy schemas
2. Create single simplified `kbItem` schema
3. Remove complex parent/child relationships
4. Use flat category system

### Phase 2: Data Migration
1. Export existing KB data
2. Clean and flatten structure
3. Remove emojis from titles
4. Assign simple categories
5. Import into new simplified schema

### Phase 3: Frontend Integration - Universal Page Logic
**Key Principle: Same Logic for All Pages**

Whether user clicks:
- "Off the Record" under Shows, OR  
- "About" under Company, OR
- Any other page

**Same Rendering Pattern:**
1. **Page Title** (e.g., "Off the Record" or "Company")
2. **Left Sidebar** shows sections (e.g., "Pre-Production", "Shooting" OR "About", "Mission")  
3. **Main Content** shows items within selected section
4. **Same component logic** regardless of category

### Phase 4: Navigation Implementation
**Top Navigation Dropdown:**
- "Shows" → "Off the Record", "Passions", "Tech Talks", "Weekly Wrap"
- "Company" → "About", "Mission", "Values" (if we create company pages)
- Clicking any dropdown item goes to that page

**Universal Page Structure:**
```
/kb/off-the-record → Shows OTR sections in sidebar
/kb/company-about → Shows company sections in sidebar  
/kb/production-workflow → Shows production sections in sidebar
```

**Left Sidebar (Universal Logic):**
- Shows sections for current page
- Items within selected section  
- Active item highlighted
- Built from kbItem data filtered by parentPage

## Key Principles

### Universal Page Logic (CRITICAL REQUIREMENT)
- **Same rendering logic** whether you click "Off the Record" OR "Company About"
- **Same component structure**: Page → Sidebar with Sections → Main Content with Items
- **Same data flow**: Query by parentPage/section → Display in identical UI pattern
- **Flat Sanity structure** but logical grouping via parentPage/section fields

### One Collection, Multiple Item Types
- **Single `kbItem` collection** for everything
- **itemType field** differentiates: 'page', 'section', 'item'  
- **parentPage/section fields** create logical relationships
- **No complex nesting** in Sanity - relationships via string references

### Data Safety
- Queries use `hidden != true` filter
- Dereference potential references safely
- No raw objects in frontend
- Max-width layout preserved

### Design Preservation
- **CRITICAL: Do not change visual design**
- Keep existing component structure
- Maintain current styling and layouts
- Only change data source from static to Sanity CMS

## Implementation Steps

1. ✅ Create new folder and clone repository
2. ✅ Analyze current Sanity structure  
3. ✅ Understand desired menu structure from screenshot
4. ✅ Create this markdown plan
5. ✅ Update Sanity schemas (remove emojis, simplify structure)
6. 📍 **Current:** Update schema to support universal page logic
7. Implement bridge hook with section/item grouping
8. Create data migration scripts with proper itemType structure
9. Update navigation to support dropdown → page → sections pattern  
10. Test universal rendering: OTR and Company pages use identical logic
11. Ensure adding new shows/pages requires minimal frontend changes

## ✅ Completed: New Simplified Schema

### Created Files:
- `sanity.config.ts` - Main Sanity configuration
- `sanity/schemas/kbItem.ts` - Single simplified schema (no emojis)
- `sanity/schemas/index.ts` - Schema exports
- `lib/sanity.ts` - Sanity client and GROQ queries
- `.env.local.example` - Environment variables template

### New Schema Features:
- **Single `kbItem` schema** instead of multiple overlapping ones
- **No emojis** in schema definitions or preview
- **Flat category system**: company, team, production, shows, tools, partners, policies
- **Clean field names**: title, description, content, type, tags, readTime
- **Rich content support**: text, images, files, links
- **Status management**: draft, published, archived
- **Order control**: numeric sorting within categories

## Success Criteria
- Simplified Sanity schema with no emojis
- Flat navigation structure (KB -> Company, not KB -> Category -> Company)
- Design remains unchanged
- Easy content management in Sanity Studio
- Scalable: adding new content requires minimal/no frontend changes