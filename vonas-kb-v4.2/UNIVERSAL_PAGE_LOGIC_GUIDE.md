# Universal Page Logic Implementation Guide

## 🎯 Key Achievement: Same Logic for All Pages

Whether a user clicks:
- **"Off the Record"** under Shows dropdown, OR
- **"Company About"** under Company dropdown, OR  
- **Any other page**

**They get the EXACT SAME rendering pattern:**

```
Page Title → Left Sidebar (Sections) → Main Content (Items in Selected Section)
```

## 🏗️ Architecture Overview

### Sanity Structure (Flat but Logical)
```
Single Collection: kbItem
├── itemType: 'page'    → Top-level pages (Off the Record, Company, etc.)
├── itemType: 'section' → Sections within pages (Pre-Production, About, etc.) 
└── itemType: 'item'    → Individual content items
```

### Examples in Sanity:

**Shows Category:**
- `Off the Record` (page) → `category: "shows"`, `itemType: "page"`
- `Pre-Production` (section) → `parentPage: "off-the-record"`, `itemType: "section"`
- `Equipment Setup` (item) → `parentPage: "off-the-record"`, `section: "pre-production"`

**Company Category:**
- `Company` (page) → `category: "company"`, `itemType: "page"`
- `About` (section) → `parentPage: "company"`, `itemType: "section"`  
- `Our Story` (item) → `parentPage: "company"`, `section: "about"`

## 🔄 Universal Flow

### 1. Top Navigation Dropdown
```typescript
// Shows dropdown
"Shows" → ["Off the Record", "Passions", "Tech Talks", "Weekly Wrap"]

// Company dropdown  
"Company" → ["Company About", "Mission", "Values"]
```

### 2. Page Selection (Universal)
```typescript
// Whether user clicks "Off the Record" OR "Company About"
selectShow(pageSlug) // Same function, same logic
```

### 3. Data Fetching (Universal Queries)
```groq
// Get sections for ANY page
*[itemType == "section" && parentPage == $pageSlug]

// Get items for ANY section  
*[itemType == "item" && parentPage == $pageSlug && section == $sectionSlug]
```

### 4. UI Rendering (Identical Components)
```typescript
// Same components regardless of page
<TopNavigation /> // Dropdowns for all categories
<Sidebar />       // Sections for current page  
<MainContent />   // Items in selected section
```

## 📱 Component Behavior

### TopNavigation
- **Shows Category**: Dropdown with show pages
- **Company Category**: Dropdown with company pages  
- **All Categories**: Same dropdown logic, different data

### Sidebar (Universal Logic)
```typescript
// For "Off the Record" page
sections: ["Pre-Production", "Shooting", "Post-Production", "Distribution"]

// For "Company" page  
sections: ["About", "Mission", "Values", "Leadership"]

// Same rendering logic, different section data
```

### MainContent (Universal Logic)
```typescript
// Whether showing "Equipment Setup" from OTR or "Our Story" from Company
// Same component, same props, same rendering logic
<MainContent 
  item={selectedItem}           // Could be any item
  relatedArticles={related}     // From same section
/>
```

## 🚀 Benefits Achieved

### 1. **Code Reusability**
- One set of components handles all page types
- No special cases for different categories
- Easy to maintain and extend

### 2. **Consistent UX**
- Users learn the pattern once, applies everywhere  
- Predictable navigation across all categories
- Same interactions regardless of content type

### 3. **Easy Content Management**
- Add new pages without frontend changes
- Same content creation flow in Sanity
- Flat structure is easy to understand

### 4. **Scalable Architecture**
```typescript
// Add new category/page - zero frontend changes needed
{
  title: "New Product Line",
  category: "tools", 
  itemType: "page"
  // Automatically gets sections + items support
}
```

## 🎛️ Implementation Details

### Hook: `useKnowledgeBaseUniversal`
```typescript
// Universal page selection
const selectShow = async (pageSlug: string) => {
  // Works for "off-the-record", "company", "production-workflow", etc.
  const virtualShow = await createVirtualShow(pageSlug)
  setCurrentShow(virtualShow)
}

// Universal section/item structure
const virtualShow = {
  id: pageSlug,           // "off-the-record" or "company"
  name: pageTitle,        // "Off the Record" or "Company"  
  sections: [             // Pre-Production OR About
    {
      id: sectionSlug,
      title: sectionTitle,
      items: [...]          // Equipment Setup OR Our Story
    }
  ]
}
```

### Schema Fields (Critical)
```typescript
// These fields enable universal logic
itemType: 'page' | 'section' | 'item'  // What type of content
parentPage: string                       // Which page does this belong to
section: string                         // Which section (for items only)
category: string                        // Top navigation grouping
```

### GROQ Queries (Universal)
```groq
// Get ANY page
*[itemType == "page" && slug.current == $slug][0]

// Get sections for ANY page
*[itemType == "section" && parentPage == $pageSlug] 

// Get items for ANY section
*[itemType == "item" && parentPage == $pageSlug && section == $section]
```

## ✅ Testing Scenarios

### Scenario 1: Off the Record (Shows)
1. **Click**: "Off the Record" under Shows dropdown
2. **Result**: Page loads with OTR sections in sidebar
3. **Sections**: Pre-Production, Shooting, Post-Production, Distribution
4. **Items**: Equipment Setup, Lighting Guide, etc. in main content

### Scenario 2: Company About (Company)
1. **Click**: "Company About" under Company dropdown  
2. **Result**: Page loads with Company sections in sidebar
3. **Sections**: About, Mission, Values, Leadership  
4. **Items**: Our Story, Company History, etc. in main content

### Scenario 3: Universal Verification
1. **Same Components**: ✅ TopNavigation, Sidebar, MainContent
2. **Same Data Flow**: ✅ selectShow() → createVirtualShow() → sections/items
3. **Same UI Pattern**: ✅ Page → Sections → Items
4. **Same Logic**: ✅ No special cases or conditional rendering

## 🎯 Success Criteria Met

✅ **Universal Page Logic**: Same rendering whether clicking OTR or Company  
✅ **Flat Sanity Structure**: Single collection with logical relationships  
✅ **Design Preserved**: Zero visual changes, existing components work  
✅ **Scalable**: Add new pages/shows without frontend changes  
✅ **No Emojis**: Clean, professional Sanity schema  
✅ **Consistent UX**: Predictable navigation pattern across all content