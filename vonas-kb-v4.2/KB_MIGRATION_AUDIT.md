KB Migration Audit and Fix Plan

Summary
- Dataset now uses `_type == "kb"`; legacy `_type == "kbItem"` returns 0 docs.
- Category is a reference to `knowledgeCategory` with slugs like:
  - company-foundation, team-management, content-production, tools-systems, external-collaboration, policies-procedures, show-specific.
- Only two `kb` docs exist currently (both `kind: "page"`), sampled via scripts/query-sanity.cjs.

Detected Issues
- Sanity queries used `_type == "kbItem"` across lib and API, yielding no data.
- Top menu children endpoints (company/team/production/tools/partners) filtered by string `category` or slug prefixes; incompatible with new category refs.
- Missing policies API route; `policiesChildren` always empty in UI.
- CommandPalette (search) assumed a global `shows` variable; no data passed → search broken.
- FAQ relied on item-by-id query using `kbItem`; never resolved → FAQ didn’t render.
- Debug/tree utilities also bound to `kbItem`.

Changes Implemented
- Updated all GROQ to `_type == "kb"` in:
  - lib/sanity.ts (shows/pages/sections/items/itemById/itemBySlug/search).
  - src/app/api/kb: company, team, production, tools, partners, shows, page/[id], tree, item, search.
- Adjusted category filters to new slugs via `category->slug.current` mapping:
  - company-foundation, team-management, content-production, tools-systems, external-collaboration, policies-procedures.
- Added new `/api/kb/policies` route and wired it into `use-knowledge-base-flat` loader.
- Fixed CommandPalette data flow:
  - CommandPalette now accepts a `shows: Show[]` prop.
  - TopNavigation passes the current `selectedShow` as `[selectedShow]` so search indexes the visible items.
- Updated debug page and tree endpoint to use `kb`.

Notes and Next Steps
- Shows: If you want dynamic show folders via `kb(kind=="show")`, create those docs; endpoint still falls back to `youtubeShow` when absent.
- FAQ: Ensure `kb` schema includes `faqs` (array of refs/objects) if you want them populated; the item-by-id query resolves `faqs[]->` and UI renders when present.
- Sanity schemas in repo still define `kbItem.ts` (flat model). Consider adding a `kb.ts` schema that matches the deployed dataset for local Studio consistency.
- Legacy Vite client code under `client/` isn’t used by Next.js app; safe to ignore for this frontend.

Validation
- `npm run dev` should load menu dropdowns from updated endpoints; `Policies` now populated when data exists.
- CommandPalette opens with ⌘K and searches within the currently selected page’s sections/items.
- Selecting an item triggers `/api/kb/item/:id` and renders `content`, `steps`, `checklist`, `attachments`, and `faqs` when available.

