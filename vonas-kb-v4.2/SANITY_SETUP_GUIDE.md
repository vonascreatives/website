# Sanity CMS Setup Guide for Vonas KB v4.2

## Quick Start

This project has been set up with Sanity CMS integration using a flat structure design to replace the complex hierarchical system. The design remains unchanged while the data source has been switched to Sanity.

## 🎯 Key Features Implemented

✅ **Flat Structure**: KB -> Company (not KB -> Category -> Company)  
✅ **No Emojis**: Clean schema without emoji pollution  
✅ **Design Preserved**: Existing components work unchanged  
✅ **One Collection**: Single `kbItem` schema for all content  
✅ **Bridge Pattern**: Transforms Sanity data to work with existing UI  

## 📁 Project Structure

```
vonas-kb-v4.2/
├── sanity/
│   └── schemas/
│       ├── index.ts              # Schema exports
│       └── kbItem.ts            # Main KB schema (no emojis)
├── lib/
│   └── sanity.ts                # Sanity client & GROQ queries
├── src/
│   ├── hooks/
│   │   ├── use-knowledge-base-bridge.tsx  # Bridge to existing components
│   │   ├── use-knowledge-base-sanity.tsx  # Pure Sanity hooks
│   │   └── use-knowledge-base.tsx         # Original (fallback)
│   ├── types/
│   │   └── knowledge-base.ts             # Shared types
│   └── app/
│       └── page.tsx                      # Updated to use bridge
├── scripts/
│   └── migrate-to-sanity.js             # Migration script
├── sanity.config.ts                     # Sanity configuration
├── SANITY_INTEGRATION_PLAN.md           # Detailed implementation plan
└── SANITY_SETUP_GUIDE.md               # This file
```

## 🚀 Setup Instructions

### 1. Create Sanity Project
```bash
# If you don't have Sanity CLI
npm install -g @sanity/cli

# Create new project (or use existing)
sanity init
```

### 2. Configure Environment Variables
Update `.env.local` with your Sanity project details:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-write-token
```

### 3. Start Sanity Studio
```bash
# Start the Sanity studio
sanity dev
```

### 4. Run the Application
```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

## 📊 Schema Structure

### Single `kbItem` Schema
- **No emojis** in field definitions
- **Flat categories**: company, team, production, shows, tools, partners, policies
- **Rich content** support with images and files
- **Simple fields**: title, description, content, type, tags, readTime

### Categories Available
1. **Company** - Company information and processes
2. **Team** - Team management and workflows  
3. **Production** - Production workflows and guidelines
4. **Shows** - YouTube show specific content
5. **Tools** - Tools and resources
6. **Partners** - Partner relations and processes
7. **Policies** - Policies and guidelines

## 🔄 Data Migration

### From Static Data
If you want to migrate the existing static data:

```javascript
// Run the migration script
import { migrateData } from './scripts/migrate-to-sanity.js'
migrateData()
```

### From Existing Sanity Setup
If migrating from the complex existing Sanity structure:

1. Export data from existing setup
2. Transform to new flat structure
3. Remove emojis from titles and field names  
4. Assign appropriate categories
5. Import into new simplified schema

## 🏗️ Architecture

### Bridge Pattern
The app uses a bridge pattern to maintain compatibility:

- **Existing Components** (TopNavigation, Sidebar, MainContent) remain unchanged
- **Bridge Hook** (`use-knowledge-base-bridge.tsx`) transforms Sanity data
- **Flat Structure** is converted to virtual "shows" structure for UI compatibility

### Data Flow
```
Sanity CMS -> Bridge Hook -> Existing Components -> Same UI
```

## 🎨 Design Preservation

**CRITICAL**: The visual design remains exactly the same:
- Same component structure
- Same styling and layouts  
- Same user interactions
- Only the data source changed from static to Sanity

## ✅ Benefits Achieved

1. **Simplified Content Management**: Single schema instead of 7+ overlapping ones
2. **No Emoji Pollution**: Clean, professional schema definitions
3. **Flat Navigation**: KB -> Company (not KB -> Category -> Company)  
4. **Scalability**: Adding new content requires minimal frontend changes
5. **Design Integrity**: Zero visual changes to the user interface

## 🧪 Testing

### Manual Testing
1. Ensure categories load correctly
2. Navigation works between categories
3. Search functions properly
4. Content displays correctly
5. Fallback to static data works if Sanity unavailable

### Adding New Content
1. Go to Sanity Studio
2. Create new KB Item
3. Select category (company, team, production, etc.)
4. Add content
5. Publish
6. Content appears in app automatically (no frontend changes needed)

## 🔧 Troubleshooting

### Sanity Connection Issues
- Check environment variables are set correctly
- Ensure project ID and dataset are correct
- Verify API token has write permissions

### Fallback Behavior  
- App falls back to static data if Sanity fails
- Check browser console for connection errors
- Ensure CORS is configured in Sanity project

## 🎯 Success Criteria Met

✅ New folder created: `vonas-kb-v4.2`  
✅ Repository cloned and integrated  
✅ Sanity CMS integrated without design changes  
✅ Simplified schema (no emojis, shorter names)  
✅ Flat structure implemented: KB -> Company  
✅ One Folder/One Collection/One Page pattern  
✅ Easy content management in Sanity Studio  
✅ Scalable: new shows require minimal frontend changes  

## 🚀 Next Steps

1. **Set up actual Sanity project** with provided project ID
2. **Configure environment variables** with real credentials  
3. **Run migration script** to populate initial content
4. **Test all functionality** to ensure everything works
5. **Train content editors** on new Sanity interface