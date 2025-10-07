# Knowledge Base Structure Guide

## 🎯 CURRENT WORKING SETUP (DO NOT CHANGE)

**Web Version**: ✅ WORKING PERFECTLY  
**Local Version**: ⚠️ Use web version instead  
**Database**: 42 clean documents total  

## 📁 Current Structure

```
Knowledge Base/
├── 🏢 Company/
│   ├── About & Company Info
│   ├── Policies & SOPs  
│   ├── Team & HR
│   ├── Interns & Training
│   ├── Freelancers
│   └── All Company Documents
├── 🎬 Production/
│   ├── Pre-Production
│   ├── Production (Shoots)  
│   ├── Post-Production
│   └── All Production Documents
├── 📺 Shows/
│   ├── OTR/
│   │   ├── About (order: 0) ⭐ NEW
│   │   ├── Pre-Production
│   │   ├── Production
│   │   ├── Post-Production
│   │   ├── Distribution
│   │   ├── Visual Identity
│   │   └── Other (order: 999) ⭐ NEW
│   ├── Skyline/ (same structure)
│   ├── ATB/ (About + Other only)
│   ├── Tatak/ (About + Other only)  
│   ├── Passions/ (About + Other only)
│   └── All Shows Documents
├── 🛠️ Tools/
│   ├── Editing & Design
│   ├── Automation & Data
│   ├── Comms & Ops
│   └── All Tools Documents
├── 🤝 Partners/
│   ├── Influencers
│   ├── Brands  
│   ├── Content Creators
│   └── All Partners Documents
└── 📋 All KB Documents
```

## ✅ What's Working

- **Hierarchical Navigation**: Parent-child relationships via `parent._ref`
- **Show Structure**: All shows have About (first) and Other (last) sections
- **Clean IDs**: Consistent naming like `kb.shows.otr.about`
- **Proper Ordering**: About=0, Other=999, everything else in between
- **Web Interface**: Perfect navigation and folder opening

## 🔧 Technical Details

**Schema**: `kbItem` type with:
- `kind`: "section" | "page" | "show"  
- `parent`: Reference to parent folder
- `order`: Number for sorting (0=first, 999=last)

**Desk Structure**: Uses `deskStructureComplete.tsx`  
**Database**: Sanity production dataset, project ID: 5cywtc7a

## 🚨 CRITICAL: DO NOT CHANGE

- ❌ Don't modify the data structure
- ❌ Don't change desk structure files  
- ❌ Don't migrate to other plugins
- ✅ Only use web version for editing
- ✅ Keep current parent-child approach

## 📝 Adding New Content

### New Show:
1. Create show document: `kb.shows.newshow`
2. Add About section: `kb.shows.newshow.about` (order: 0)
3. Add Other section: `kb.shows.newshow.other` (order: 999)
4. Add production phases as needed (order: 1-10)

### New Section in Existing Folder:
1. Create with proper parent reference
2. Set appropriate order number  
3. Use consistent naming: `parent.child`

## 🎨 Approved Optimizations (Future)

**Interface** (Safe to implement):
- Icons for folders
- Descriptions for sections
- Better search in "All Documents" views

**Navigation** (Safe to implement):  
- Breadcrumbs showing location
- "Create new document here" buttons
- Favorites/bookmarks

**Content** (Safe to implement):
- Related content suggestions
- Preview cards instead of just titles
- Bulk operations for multiple docs

**Performance** (Safe to implement):
- Better caching
- Search indexing optimization
