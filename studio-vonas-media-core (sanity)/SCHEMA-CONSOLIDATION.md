# Schema Consolidation: Channel → YouTube ID

## Problem Solved
- **Schema Conflicts**: `brandCollaboration` and `referencedVideo` types were referencing the archived `channel` document type
- **Duplicate Functionality**: Both `channel` and `youtubeId` served similar purposes for managing channel information

## Solution Implemented
Instead of maintaining separate `channel` and `youtubeId` types, we consolidated everything into `youtubeId` which already had comprehensive channel management features.

### Changes Made:

1. **Archived Schema Types:**
   - `channel.ts` → moved to `schemaTypes/archive/`
   - `youtubeShow.ts` → moved to `schemaTypes/archive/`

2. **Updated References:**
   - `brandCollaboration.linkedChannels` now references `youtubeId` instead of `channel`
   - `referencedVideo.relatedChannel` now references `youtubeId` instead of `channel`

3. **Field Mapping:**
   - `channel.name` → `youtubeId.channel_name`
   - All other channel functionality preserved in `youtubeId`

4. **Updated Desk Structure:**
   - All desk structure files updated to reference `youtubeId` instead of `channel`
   - Removed references to `youtubeShow` which was unused
   - Studio navigation now shows "YouTube Channels" pointing to `youtubeId` documents

### Benefits:
- ✅ **No Schema Conflicts**: All references properly resolved
- ✅ **Single Source of Truth**: One document type for channel management
- ✅ **Richer Data Model**: `youtubeId` has more comprehensive channel information
- ✅ **Data Preserved**: All existing content maintained

### Data Status:
- **12 Creators**: All restored with full profiles and metrics
- **13 YouTube Channels**: All restored with detailed information
- **No Data Loss**: Complete restoration from backups

## Current Document Types
The schema now uses:
- `youtubeId` - Complete YouTube channel management (replaces both `channel` and `youtubeShow`)
- `creator` - Individual creator profiles
- All other document types unchanged