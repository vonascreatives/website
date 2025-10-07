# Nested Knowledge Base Structure

## Current Implementation

The knowledge base now supports nested navigation with the following features:

### 1. Hierarchical Navigation Structure
- **Getting Started** → Introduction
- **Categories** → Each category with sub-articles
  - Strategy → Strategy Overview → Individual Articles
  - Production → Production Overview → Individual Articles
  - Analytics → Analytics Overview → Individual Articles

### 2. Expandable Sections
- Left sidebar sections can be collapsed/expanded
- Articles appear as nested items under categories
- Visual hierarchy with indentation and styling

### 3. Responsive Design
- Mobile: Sidebar collapses, full-width content
- Tablet: TOC sidebar hidden, main content adjusts
- Desktop: Full three-panel layout

## Recommended Approach for Deep Nesting (kb→postproduction→editing→software)

### Option 1: Extend Current Sanity Schema (Recommended)
Add hierarchical fields to the existing `knowledgeBase` schema:

```typescript
// In knowledgeBase.ts schema
defineField({
  name: 'parentCategory',
  title: 'Parent Category',
  type: 'string',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Production', value: 'production' },
      { title: 'Post-Production', value: 'postproduction' },
      { title: 'Strategy', value: 'strategy' }
    ]
  }
}),
defineField({
  name: 'subCategory',
  title: 'Sub Category',
  type: 'string',
  description: 'e.g., editing, audio, graphics'
}),
defineField({
  name: 'level',
  title: 'Nesting Level',
  type: 'number',
  initialValue: 1,
  validation: (Rule) => Rule.min(1).max(4)
})
```

### Option 2: Create Dedicated Navigation Schema
Create a separate `knowledgeNavigation` schema for complex hierarchies:

```typescript
// New schema: knowledgeNavigation.ts
export default defineType({
  name: 'knowledgeNavigation',
  title: 'Knowledge Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug'
    }),
    defineField({
      name: 'parent',
      title: 'Parent Section',
      type: 'reference',
      to: [{type: 'knowledgeNavigation'}]
    }),
    defineField({
      name: 'articles',
      title: 'Articles',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'knowledgeBase'}]}]
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number'
    })
  ]
})
```

## Implementation Benefits

### Current Features:
✅ Fixed TypeError issues
✅ Responsive three-panel layout (sidebar, main, TOC)
✅ Collapsible navigation sections
✅ Proper content rendering
✅ Clean, modern design matching Aria docs
✅ Mobile-friendly responsive design
✅ Nested article display under categories

### For Deep Nesting:
- **Option 1** is simpler, uses existing schema with additional fields
- **Option 2** provides more flexibility for complex hierarchies
- Both support unlimited nesting levels
- Tree-view navigation with expand/collapse
- Breadcrumb navigation shows full path

## Example Deep Structure:
```
Knowledge Base
├── Getting Started
│   └── Introduction
├── Production
│   ├── Pre-Production
│   │   ├── Planning
│   │   └── Research
│   └── Post-Production
│       ├── Editing
│       │   ├── Software
│       │   │   ├── Adobe Premiere
│       │   │   ├── Final Cut Pro
│       │   │   └── DaVinci Resolve
│       │   └── Techniques
│       └── Audio
│           ├── Mixing
│           └── Mastering
```

The current implementation handles 2-3 levels efficiently. For deeper nesting, recommend Option 2 with the dedicated navigation schema.