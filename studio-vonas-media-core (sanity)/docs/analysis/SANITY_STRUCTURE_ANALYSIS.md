# Sanity Structure Analysis & Redesign Plan

## Current Structure Problems

### 1. **Too Many Emojis & Long Names**
**File:** `kbItem.ts` (lines 59-64)
```typescript
itemType: {
  options: {
    list: [
      {title: '📁 Folder', value: 'folder'},
      {title: '📄 Document', value: 'document'},
      {title: '📺 YouTube Show', value: 'youtube-show'},
      {title: '🎬 Production Stage', value: 'production-stage'},
      {title: '❓ FAQ', value: 'faq'},
    ]
  }
}
```
**Problem:** User wants clean names without emojis

### 2. **Complex Hierarchy System**
**File:** `kbItem.ts` (lines 45-50)
```typescript
parent: {
  title: 'Parent Folder',
  type: 'reference',
  to: [{type: 'kbItem'}], // Creates parent/child nesting
}
```
**Current Flow:** KB → By Category → Company Foundation
**Target Flow:** KB → Company (flat structure)

### 3. **Over-Complex Schema (295 lines)**
**File:** `kbItem.ts` includes:
- Auto-folder rules (lines 248-276)
- Automation fields (lines 277-294)
- Complex content arrays
- Production stage automation
- Keyword triggers
- Target folder assignments

**Problem:** Way too complex for simple flat structure needs

## Target Structure (From Screenshot Analysis)

### Top Navigation (Clean & Short)
```
Company | Team | Production | Shows | Tools | Partners | Policies
```
**Note:** "Company" NOT "Company Foundation" - shorter names

### Left Sidebar Structure
```
Pre-Production
├── Concept Development  
├── Script Writing
├── Guest Coordination
└── Research & Prep

Shooting
├── Equipment Setup
├── Lighting Guide  
├── Audio Recording
└── Multiple Camera Angles

Post-Production

Distribution
```

### Main Content Area - Step-by-Step Rendering
```
Audio Mixing
├── 1. Camera Positioning
├── 2. Audio Equipment Setup  
├── 3. Lighting Configuration
├── 4. Camera Settings Configuration
├── 5. Final Testing & Rehearsal
└── 6. Backup Systems Verification
```

## Required Schema Simplification

### New Simple Structure
**Eliminate:**
- Parent/child references (no hierarchy)
- Emojis in all titles
- Auto-folder rules
- Complex automation
- Keyword triggers
- 200+ lines of unnecessary fields

**Keep Only:**
- `title` (short names)
- `slug`
- `category` (reference to top-level categories)
- `content` (rich text)
- `overviewSteps` (for numbered workflow steps)  
- `order`
- `status`

### Categories (Top Level Only)
```
- Company (not "Company Foundation")
- Team  
- Production
- Shows
- Tools
- Partners
- Policies
```

## Data Flow Strategy

### One Folder / One Collection / One Page Approach
1. **Categories** = Top navigation items (Company, Team, etc.)
2. **Articles** = Individual pages with step-by-step content
3. **No nesting** = Flat structure only

### Universal Page Logic
- Clicking "Company" loads all Company articles
- Clicking "Shows" → "Off the Record" uses same rendering logic
- Adding new YouTube Show requires minimal/no frontend changes
- Same component renders all content types

### Step-by-Step Content Rendering
- Use `overviewSteps` array for numbered workflow items
- Transform into numbered UI components (1., 2., 3.)
- Maintain design exactly as shown in screenshot

## UPDATED: Schema Changes Completed ✅

### ✅ Phase 1: Schema Cleanup (COMPLETED)
- **✅ Removed emojis** from kbItem.ts and kbCategory.ts
- **✅ Simplified kbItem** from 375 lines to 180 lines (52% reduction)
- **✅ Removed parent/child references** (no more hierarchy)
- **✅ Removed automation complexity** (auto-folder rules, keyword triggers, etc.)
- **✅ Clean field structure:**
  - `title` (short, clean names)
  - `slug` 
  - `description`
  - `content` (rich text)
  - `overviewSteps` (for numbered workflow UI)
  - `category` (reference to top-level only)
  - `youtubeShow` (optional)
  - `status` (draft/published/archived)
  - `order` & `lastUpdated`

### New Schema Structure
```typescript
// kbItem.ts - NOW CLEAN & SIMPLE (180 lines vs 375)
fields: [
  title,           // "Audio Mixing" (not "🎵 Audio Mixing Guidelines")
  slug,            
  description,     
  order,           
  content,         // Rich text body
  overviewSteps,   // [{step: "Camera Positioning", details: "Set up..."}]
  category,        // Reference to kbCategory
  youtubeShow,     // Optional reference
  status,          // draft/published/archived
  lastUpdated      // Auto timestamp
]

// kbCategory.ts - NOW CLEAN (no emojis)
fields: [
  title,           // "Company" (not "🏢 Company Foundation")
  slug,
  description,
  order
]
```

### Phase 2: Test Sanity Studio (CURRENT STEP)
- Start Sanity Studio to verify schemas work
- Check that old data still loads
- Confirm clean UI without emojis

### Phase 3: Frontend Integration (AFTER SANITY COMPLETE)
- Connect to simplified schema
- Implement universal page logic  
- Preserve exact design from KB_v4

## Current Status: SANITY SCHEMAS READY ✅
- **kbItem.ts**: Cleaned, simplified, no emojis, flat structure
- **kbCategory.ts**: Cleaned, no emojis  
- **Ready for testing in Sanity Studio**

## Success Criteria Progress
- ✅ **DONE:** Clean names without emojis
- ✅ **DONE:** Simplified schema structure
- ✅ **DONE:** Removed complex hierarchy 
- ✅ **DONE:** Flat structure support (category reference only)
- 🔄 **NEXT:** Test Sanity Studio with new schemas
- ⏳ **LATER:** Frontend integration (after Sanity complete)