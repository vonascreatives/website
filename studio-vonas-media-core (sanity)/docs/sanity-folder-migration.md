# Migration: `sanity.folder` to `vonas.folder`

**Date:** February 2026
**Requested by:** Sanity Engineering Team
**Project:** Vonas Media Core (ID: `5cywtc7a`)

## Background

The Sanity engineering team reached out to request that we stop using the `sanity.folder` document type. They want to reserve the `sanity.` namespace for system documents going forward. Our project had 4 documents of this type that needed to be migrated to a new name.

## What Changed

### Document Type Rename

| Before | After |
|--------|-------|
| `sanity.folder` | `vonas.folder` |

### Migrated Documents

| Document ID | Title |
|---|---|
| `folder-postproduction` | Post-Production |
| `folder-postproduction-editing` | Editing |
| `folder-youtube` | YouTube |
| `folder-youtube-offtherecord` | Off The Record |

### Files Created/Modified

- **`schemaTypes/vonasFolder.ts`** - New schema definition for `vonas.folder`
- **`schemaTypes/index.ts`** - Registered `vonasFolder` in the schema types array
- **`scripts/remove-sanity-folders.js`** - Migration script (renames `sanity.folder` -> `vonas.folder`)

## How to Run the Migration

From the `studio-vonas-media-core (sanity)` directory:

```bash
# Dry run - shows documents that will be migrated (no changes made)
node scripts/remove-sanity-folders.js

# Actual migration - renames documents in the production dataset
node scripts/remove-sanity-folders.js --migrate
```

Requires `SANITY_API_TOKEN` in `.env.mcp`.

## Verification

After running the migration, verify in Sanity Studio Vision:

```groq
// Should return 0 results
*[_type == "sanity.folder"]

// Should return 4 results
*[_type == "vonas.folder"]
```

## Notes

- The `sanity.folder` documents were originally created on August 28, 2025 for organizing knowledge base content
- No active application code (GROQ queries, components) references `sanity.folder` - these documents were only used for Studio organization
- The `vonas.` prefix is project-specific and avoids the reserved `sanity.` namespace
