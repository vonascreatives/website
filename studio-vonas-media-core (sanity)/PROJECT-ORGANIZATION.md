# Project Organization Guide

This document outlines the organized folder structure for the Sanity studio project.

## Folder Structure

### 📁 **docs/** - Project Documentation
All markdown documentation files organized by type:

- **docs/analysis/** - Analysis reports and scans
  - ABOUT-PAGE-ANALYSIS.md
  - CHANNELS-PAGE-ALL-IMAGES.md
  - CHANNELS-PAGE-CORRECTED.md
  - CHANNELS-PAGE-DEEP-SCAN.md
  - COMPLETE-PAGES-ANALYSIS.md
  - COMPLETE-SITE-ANALYSIS.md
  - CONTACT-PAGE-DEEP-SCAN.md
  - CORRECTED-HOMEPAGE-IMAGES.md
  - CURRENT_FOLDER_STRUCTURE.md
  - SANITY_STRUCTURE_ANALYSIS.md

- **docs/guides/** - How-to guides and references
  - CONTENT-CREATION-GUIDE.md
  - HIERARCHICAL_KNOWLEDGE_BASE_GUIDE.md
  - IMAGE-UPLOAD-GUIDE.md
  - STUDIO-ACCESS-GUIDE.md
  - groq-queries.md

- **docs/implementation/** - Implementation and setup documentation
  - CHANNELS-PAGE-CMS-INTEGRATION-COMPLETE.md
  - DATA_CLEANUP_NEEDED.md
  - DEPLOYMENT-SUMMARY.md
  - HOMEPAGE-CMS-INTEGRATION-COMPLETE.md
  - HOMEPAGE-IMAGES-COMPLETE.md
  - HOMEPAGE-IMAGES-README.md
  - HOMEPAGE-STATIC-ASSETS-CMS-DOCUMENTATION.md
  - KB-SCHEMA-V5.md
  - KNOWLEDGE_BASE_IMPLEMENTATION.md
  - MANUAL-FIX-CREATORS.md
  - SETUP_COMPLETE.md

### 📁 **scripts/** - Utility Scripts
All JavaScript utility scripts organized by function:

- **scripts/analysis/** - Data analysis and inspection
  - analyze-*.js files
  - audit-*.js files
  - check-*.js files
  - debug-*.js files
  - fetch-kb.js
  - query-*.js files

- **scripts/cleanup/** - Data cleanup and maintenance
  - clean-*.js files
  - cleanup-*.js files
  - remove-duplicates.js

- **scripts/migration/** - Data migration and updates
  - fix-*.js files
  - manage-*.js files
  - migrate-*.js files
  - restore-*.js files
  - run-migration.js
  - update-*.js files

- **scripts/upload/** - Data upload and creation
  - add-*.js files
  - create-*.js files
  - finish-brand-logos.js
  - generate-token.js
  - import-dummy-data.js
  - upload-*.js files
  - upsert-*.js files

- **scripts/verification/** - Testing and verification
  - test-*.js files
  - verify-*.js files

### 📁 **data/** - Data Files
All data import/export files:

- **data/imports/** - NDJSON and JSON data files
  - kb-exact-structure.ndjson *(Important: Contains proper KB structure)*
  - update-kb-with-folders.ndjson *(Important: KB content with folders)*
  - creator-*.ndjson files
  - dummy-data.ndjson
  - media-*.ndjson files
  - All other import data files

### 📁 **archive/** - Archived Files
- Old distribution folders and deprecated files
- dist 2/ (old build folder)

### 📁 **temp/** - Temporary Files
- Working directory for temporary files during operations

## Important Files in Root Directory

**Core Project Files** (remain in root):
- README.md - Main project documentation
- package.json - Dependencies and scripts
- sanity.config.ts - Main Sanity configuration
- sanity.cli.ts - CLI configuration
- deskStructure.ts - Studio desk structure
- schemaTypes/ - Schema definitions
- node_modules/ - Dependencies
- .env.* - Environment configuration files

**Backup Files**:
- backup-before-restore.tar.gz - Full backup before KB cleanup

## Usage Notes

1. **Scripts**: All utility scripts are now categorized by function. Use the appropriate subfolder when creating new scripts.

2. **Documentation**: All analysis, guides, and implementation docs are organized in `docs/` with clear categorization.

3. **Data Files**: Import files are in `data/imports/`. The most important files for KB restoration are:
   - `kb-exact-structure.ndjson`
   - `update-kb-with-folders.ndjson`

4. **Finding Files**: Use the folder structure to quickly locate scripts or documentation by their purpose rather than searching through a flat file structure.

## Maintenance

- Add new scripts to the appropriate `scripts/` subfolder
- Add new documentation to the appropriate `docs/` subfolder  
- Keep data files in `data/imports/` or `data/exports/` as appropriate
- Use `temp/` for temporary working files that can be safely deleted

---
*This organization was completed on September 4, 2024, organizing 67 JavaScript files and 27 Markdown files into a clean, maintainable structure.*
