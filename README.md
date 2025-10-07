# Vonas Media Website - Project Overview

## 🎯 Project Status

**Current State:** Development - Requires cleanup, testing, and merging  
**Priority:** Merge Knowledge Base into Homepage, then clean and document

---

## 📁 Repository Structure

This repository contains **three separate projects** pushed as independent branches:

### 1. **`new_vonas_media_hp`** - Homepage (Main Project)
The primary Next.js application serving the public-facing website.

### 2. **`vonas-kb-v4.2`** - Knowledge Base (To Be Merged)
Standalone knowledge base application that needs to be integrated into the homepage.

### 3. **`studio-vonas-media-core`** - Sanity CMS Studio
The content management system (CMS) that serves as the database for both projects.

---

## 🚨 Important Notes

### Project History
- **Development Approach:** Vibe-coded and exploratory
- **Multiple Iterations:** 6+ knowledge base versions were tested to find the right feel
- **Current State:** Messy but functional - design and requirements are now clear
- **Testing Templates:** Contains experimental code and dummy data throughout

### What You DON'T Need
- Most folders are irrelevant testing templates
- Dummy content in CMS (all replaceable)
- Old knowledge base iterations
- Experimental components

### What You DO Need (3 Core Folders)
1. **`studio-vonas-media-core (sanity)/`** - CMS setup and schemas
2. **`vonas-kb-v4.2/`** - Knowledge base frontend (to merge)
3. **`new_vonas_media_hp/`** - Homepage frontend (main app)

---

## 🎯 Primary Tasks

### Phase 1: Cleanup & Documentation (FIRST PRIORITY)
1. **Clean up the codebase** for yourself
2. **Document everything** in a way you understand
3. **Remove irrelevant code** and testing templates
4. **Identify what's actually being used**

### Phase 2: Merge Knowledge Base into Homepage
- Currently separated as different projects
- Need to integrate `vonas-kb-v4.2` into `new_vonas_media_hp`
- Run everything through the homepage application
- Maintain knowledge base functionality within unified app

### Phase 3: Testing & Validation
- Test all components and pages
- Validate CMS integration
- Ensure embedded content works (Guidde recordings)
- Fix broken features (profile, etc.)

---

## 🗄️ CMS Collection Structure (Sanity)

The CMS is divided into **two main sections**:

### 📚 Knowledge Base (Top Section)
**Current Content:** All dummy data - completely replaceable

**Components:**
- YouTube Shows
- Company Knowledge Items
- Step-by-step guides with Guidde screen recordings
- Embedded video content

**Planned Features:**
- **Permission-based access:**
  - **Outside Users:** Limited knowledge base access
  - **Freelancers:** More permissions
  - **Core Team:** Full access
- Vector store for AI search (future enhancement)

**Content Structure:**
- Intro sections (highlighted in gray)
- Step components with checklists
- Embedded Guidde recordings (screen recordings with step-by-step instructions)
- Video URLs and embedded content

### 🏠 Homepage Collections (Bottom Section)
All homepage-related content and pages.

---

## ✨ Knowledge Base Features

### Working Features
- ✅ CMS integration with Sanity
- ✅ Command+K search bar (opens quick preview)
- ✅ Embedded code/content under "Pre-production"
- ✅ Specific component structure (intro, steps, checklists)
- ✅ Guidde screen recording integration

### Not Working / Needs Fixing
- ❌ AI search (requires vector store setup - future task)
- ❌ Profile functionality
- ❌ Other features to be identified during cleanup

### Content Components
1. **Intro Section** - Gray highlighted description
2. **Main Content** - Flexible content blocks
3. **Steps & Checklists** - Structured workflow components
4. **Embedded Media** - Guidde recordings, videos, code snippets

---

## 🛠️ Technical Stack

### Frontend (Homepage & KB)
- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **State Management:** React Query
- **Search:** Command+K palette

### CMS
- **Platform:** Sanity.io
- **Content Types:** Knowledge Base, YouTube Shows, Company Knowledge, Homepage Content
- **Media:** Guidde screen recordings, embedded videos

### Future Enhancements
- Vector store for AI-powered search
- Permission-based content access
- Enhanced profile features

---

## 📋 Getting Started

### Prerequisites
```bash
# Install dependencies (after cleanup)
npm install
```

### Environment Variables
Create `.env.local` files in each project:

**Homepage & Knowledge Base:**
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
```

**Sanity Studio:**
```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

### Running Projects

**Sanity Studio:**
```bash
cd "studio-vonas-media-core (sanity)"
npm run dev
# Opens at http://localhost:3333
```

**Homepage (after merge):**
```bash
cd new_vonas_media_hp
npm run dev
# Opens at http://localhost:3000
```

**Knowledge Base (standalone - before merge):**
```bash
cd vonas-kb-v4.2
npm run dev
```

---

## 🔄 Merge Strategy

### Goal
Integrate knowledge base into homepage as a unified application.

### Approach
1. **Audit both codebases** - identify shared vs. unique code
2. **Create `/kb` route** in homepage app
3. **Migrate KB components** to homepage component library
4. **Unify Sanity client** configuration
5. **Merge API routes** for KB data fetching
6. **Test all KB features** within homepage context
7. **Remove standalone KB project** once verified

---

## 📝 Documentation Tasks

### What to Document
1. **Folder structure** - what each directory contains
2. **Component inventory** - which components are actually used
3. **CMS schema** - how content types relate
4. **API routes** - what endpoints exist and their purpose
5. **Unused code** - mark for deletion
6. **Dependencies** - what packages are actually needed
7. **Configuration** - environment variables and settings

### Documentation Format
- Clear README files in each major directory
- Inline code comments for complex logic
- Architecture diagrams (optional but helpful)
- Setup and deployment guides

---

## ⚠️ Known Issues

1. **Code Organization:** Messy, needs cleanup
2. **Dummy Data:** All KB content is placeholder
3. **Separated Projects:** KB and Homepage need merging
4. **Testing Templates:** Multiple unused iterations present
5. **AI Search:** Not implemented yet (requires vector store)
6. **Profile Features:** Broken, needs fixing
7. **Permissions System:** Planned but not implemented

---

## 🎬 Guidde Integration

**What is Guidde?**  
Screen recording tool that creates step-by-step instructions with video.

**Usage in KB:**
- Primary method for supporting content
- Embedded via video URL
- Provides visual step-by-step guidance
- Can be enhanced with additional text content

---

## 🚀 Next Steps

### Immediate (Week 1)
1. ✅ Push all three projects to GitHub (COMPLETED)
2. ⏳ Clean up codebase and remove unused code
3. ⏳ Document current structure and components
4. ⏳ Create inventory of what's actually being used

### Short-term (Week 2-3)
1. ⏳ Plan merge strategy for KB into Homepage
2. ⏳ Begin integration work
3. ⏳ Test merged functionality
4. ⏳ Fix broken features (profile, etc.)

### Medium-term (Month 1-2)
1. ⏳ Implement permission-based access
2. ⏳ Add vector store for AI search
3. ⏳ Replace all dummy content with real data
4. ⏳ Polish UI/UX based on final design

---

## 📞 Support & Questions

For questions about:
- **CMS Structure:** Check Sanity Studio schemas
- **Component Usage:** Audit component directories
- **API Endpoints:** Review `/api` routes in both projects
- **Styling:** TailwindCSS + shadcn/ui documentation

---

## 🔐 Security Notes

- Never commit `.env` files
- Keep Sanity API tokens secure
- Use environment variables for all secrets
- Rotate tokens if accidentally exposed (GitHub token in commit history should be rotated)

---

## 📊 Project Metrics

- **Branches:** 3 (homepage, kb, studio)
- **Total Files:** ~2,173 files across all projects
- **Size:** ~84 MiB (excluding node_modules)
- **Knowledge Base Iterations:** 6+ versions tested
- **Current Version:** v4.2 (KB), v1 (Homepage)

---

**Last Updated:** 2025-10-07  
**Status:** Ready for cleanup and merge phase  
**Next Milestone:** Clean codebase + complete documentation
