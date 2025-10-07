# KNOWLEDGE BASE STATE DOCUMENTATION
**BACKUP DATE**: 2025-09-08 18:41:09
**TOTAL DOCUMENTS**: 52 kbItem documents found

## 🚨 CURRENT STATE ANALYSIS
**PROBLEM**: Mixed state with duplicates and test documents
- ✅ GOOD: Core folder structure exists (Company, Production, Shows, Tools, Partners)
- ❌ PROBLEM: Test documents and drafts mixed in
- ❌ PROBLEM: Orphaned documents with wrong naming conventions
- ❌ PROBLEM: Some draft sections mixed with published ones

## 📊 DOCUMENT BREAKDOWN

### ROOT FOLDERS (Working):
- kb.company (Company)
- kb.production (Production) 
- kb.shows (Shows)
- kb.tools (Tools)
- kb.partners (Partners)

### SHOWS STRUCTURE (Mostly Working):
- kb.shows.otr (OTR) - 7 sections
- kb.shows.skyline (Skyline) - 7 sections  
- kb.shows.atb (ATB) - 2 sections (About + Other)
- kb.shows.tatak (Tatak) - 2 sections (About + Other)
- kb.shows.passions (Passions) - 2 sections (About + Other)

### CONTENT DOCUMENTS (5 total):
- otr-content-1: OTR Recording Protocol
- otr-content-2: OTR Guest Preparation Checklist  
- otr-content-3: 10-Step Video Editing Workflow for OTR
- otr-content-4: OTR YouTube Distribution Strategy
- otr-content-5: OTR Brand Guidelines - Visual Identity

### PROBLEMS TO CLEAN:
- kbItem.youtube-shows (orphaned, wrong naming)
- drafts.104fe0e5-081a-411d-851b-8cb130a1846a (draft test)
- drafts.kb.shows.otr.about (duplicate draft)
- drafts.kb.shows.atb.about (duplicate draft)
- 104fe0e5-081a-411d-851b-8cb130a1846a (test document)
- 6e40455e-ddfb-4b7b-ac1b-69fc4d537656 (test document)

## 🎯 RESTORATION PLAN
1. Keep all kb.* documents with proper parent-child structure
2. Keep the 5 content documents (otr-content-*)
3. Delete all test documents and drafts
4. Delete orphaned items
5. Rebuild with optimizations

## 📁 TARGET STRUCTURE (Clean)
```
Knowledge Base/
├── Company/
│   ├── Freelancers
│   ├── Interns  
│   └── (other Company sections)
├── Production/
│   ├── Pre-Production
│   ├── Production (Shoots)
│   └── Post-Production
├── Shows/
│   ├── OTR/
│   │   ├── About (0)
│   │   ├── Pre-Production (1) + content
│   │   ├── Production (2) + content
│   │   ├── Post-Production (3) + content  
│   │   ├── Distribution (4) + content
│   │   ├── Visual Identity (5) + content
│   │   └── Other (999)
│   ├── Skyline/ (same structure)
│   ├── ATB/ (About + Other)
│   ├── Tatak/ (About + Other)
│   └── Passions/ (About + Other)
├── Tools/
│   ├── Editing & Design
│   ├── Automation & Data
│   └── Comms & Ops
└── Partners/
    ├── Influencers
    ├── Brands
    └── Content Creators
```

## 🔄 RESTORATION COMMANDS
To restore from this backup:
```bash
npx sanity dataset import archive/kb-full-backup-20250908-184109/complete-database-backup.ndjson production --replace
```
