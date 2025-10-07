# KB Schema v5 (Sanity) — Short Names, No Emojis, Flat Model

Goals
- Clean, short labels (no emojis) everywhere in Studio
- Single KB item type with parent reference (flat documents, logical tree)
- Consistent field names for simple front-end queries
- Safe filtering: hidden != true for all public views
- Keep image handling aligned with rules (content images in Sanity; system assets in /public)

Content Types
- kbItem: Core node (section or page)
- kbCategory: Top-level category for navigation grouping
- youtubeShow: Show entity referenced by kbItem (optional)
- knowledgeTag (optional, unchanged)

kbItem Fields
- title (string, required) — short, no emojis
- slug (slug, required) — from title
- kind (string, required) — one of: section | page
- parent (reference -> kbItem, optional) — defines the logical tree
- category (reference -> kbCategory, required) — top-level grouping (Company, Interns, Freelancers, Production, Shows, Tools, Partners)
- youtubeShow (reference -> youtubeShow, optional) — used for the “YouTube Shows” top menu and show landing pages
- description (text, optional, short)
- content (portable text, optional)
- overviewSteps (array of objects: {step, details?}) — for numbered UI
- order (number, default 100)
- hidden (boolean, default false) — exclude from UI when true
- status (string, default draft) — draft | published | archived
- lastUpdated (datetime, auto)

kbCategory Fields
- name (string, required)
- slug (slug, required)
- description (text, optional)
- order (number, default 100)
- isActive (boolean, default true)
Note: No icons/emojis in labels or previews.

youtubeShow Fields
- title (string, required)
- slug (slug, required)
- description (text, optional)
- thumbnail (image with alt)
- order (number)
Note: No emojis in previews.

Front-end Behavior (Contracts)
- Sidebar (on /kb/[slug])
  - Compute top ancestor by following parent->_id until null
  - Query all descendants where hidden != true
  - Render: Overview (current node) + children tree (indented)
- KB index (/kb)
  - List top-level sections: *[_type == "kbItem" && kind == "section" && !defined(parent) && hidden != true] | order(order asc, title asc)
- Top navigation dropdowns
  - Use kbCategory for primary grouping (order asc, isActive == true)
  - “YouTube Shows” top item: list youtubeShow ordered by order; clicking goes to show page
  - Show page left sidebar: children sections under that show only (see query below)

Key GROQ Patterns
- Fetch current node and ancestry path
  *[_type == "kbItem" && slug.current == $slug && hidden != true][0]{
    _id, title, "slug": slug.current, parent->{_id, title, slug}, kind, order
  }

- Fetch children for sidebar
  *[_type == "kbItem" && parent._ref == $id && hidden != true]{
    _id, title, "slug": slug.current, kind, order
  } | order(order asc, title asc)

- Top-level sections
  *[_type == "kbItem" && kind == "section" && !defined(parent._ref) && hidden != true]{
    _id, title, "slug": slug.current, order
  } | order(order asc, title asc)

- Show dropdown
  *[_type == "youtubeShow"]{title, "slug": slug.current, order} | order(order asc, title asc)

- Show page sections
  *[_type == "kbItem" && youtubeShow._ref == $showId && kind == "section" && !defined(parent._ref) && hidden != true]{
    _id, title, "slug": slug.current, order
  } | order(order asc, title asc)

- Descendants under a show section (one level for sidebar)
  *[_type == "kbItem" && parent._ref == $sectionId && hidden != true]{
    _id, title, "slug": slug.current, kind, order
  } | order(order asc, title asc)

Data & Authoring Guidelines
- Titles: concise, no emojis
- Use kind = section for navigational nodes; kind = page for content pages
- Avoid deep nesting unless needed; 2–3 levels max for usability
- Use hidden = true to draft structure without exposing it
- Assign category for every kbItem to keep top menus consistent
- For shows, also set youtubeShow to scope KB under a show landing page

Studio Desk Structure (Overview)
- Knowledge Base
  - Tree (Top-level) — kbItem where parent is not set
  - By Category — kbCategory -> kbItems
  - By Show — youtubeShow -> kbItems
  - FAQs (unchanged)
- No titles or previews use emojis

Migration Notes
- Add parent, kind, hidden to kbItem
- Ensure deskStructure filters pivot to parent and kind; remove itemType usages
- Remove emoji icons/previews from docsPage/docsSection/knowledgeTag/knowledgeCategory
- Keep existing content intact; new fields default benignly

Rules Alignment
- Images for content are in Sanity; static/system assets remain in /public
- Next.js template UI not altered; KB appears in footer only; navigation order preserved
- Relationships use reference and array-of-reference fields; dereference with -> in queries

Done Criteria
- All Studio labels/previews have no emojis
- kbItem supports parent-based tree; front-end can compute ancestry/descendants
- Desk structure shows Tree, By Category, and By Show without emojis
- GROQ examples provided use hidden != true and ->

