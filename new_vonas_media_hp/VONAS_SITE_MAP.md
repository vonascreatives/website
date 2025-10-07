# VONAS MEDIA SITE MAP - COMPLETE BREAKDOWN

## 🏗️ ARCHITECTURE OVERVIEW

**Template Source:** Liko Creative Agency Portfolio Template (Next.js)  
**CMS:** Sanity (read-only, CDN-based with fallbacks)  
**Approach:** Mixed Static/CMS for optimal performance  
**Design Rule:** Absolute design lock - NO CSS/JS changes  

---

## 📄 PAGE-BY-PAGE BREAKDOWN

### 1. HOME PAGE (`/`)
**Liko Template Used:** `Main Home` (`/src/pages/homes/home-1.tsx`)  
**Route:** `/src/app/page.tsx` → `/src/app/(homes)/home-1/page.tsx`  

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **Hero Banner** | STATIC | Hard-coded text | None | "Content Channel Lab" + brand messaging |
| **Video Area** | STATIC | Template component | None | Keep as-is |
| **Brand Section** | STATIC | Hard-coded text | None | "Brands We've Built With" |
| **Service Section** | STATIC | Hard-coded text | None | 4 services: Channel Building, Creator Support, etc. |
| **Project Gallery** | **CMS** | Dynamic channels | `channel` | **3-6 channel cards with YouTube thumbnails** |
| **Award Section** | STATIC | Template component | None | Keep as-is |
| **Team Slider** | **CMS** | Dynamic creators | `exclusiveCreator` | **8 featured exclusive creators** |
| **Testimonials** | **CMS/STATIC** | Client reviews | Could be `testimonial` | Brand partner feedback |

**CMS Integration Points:**
- `ProjectOne` component → channels from Sanity
- `TeamOne` component → exclusiveCreator from Sanity
- Static fallbacks maintain exact word counts

---

### 2. ABOUT PAGE (`/about`)
**Liko Template Used:** `About Us` (`/src/pages/about/about-us.tsx`)  
**Route:** `/src/app/about/page.tsx`

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **Hero Section** | STATIC | Hard-coded text | None | "Building Channel Culture" |
| **Image Gallery** | STATIC | Template images | None | Keep template photos |
| **About Content** | STATIC | Hard-coded text | None | "We are a content-first media lab..." |
| **What We Do Lists** | STATIC | Hard-coded lists | None | Channel Building, Content Strategy, etc. |
| **Team Section** | **CMS** | Dynamic team members | `teamMember` | Internal company team (different from creators) |
| **Fun Facts** | **CMS/STATIC** | Company stats | Calculated from CMS | Total channels, creators, followers |
| **Brand Carousel** | STATIC | Template component | None | Keep as-is |
| **Awards** | STATIC | Template component | None | Keep as-is |

**CMS Integration Points:**
- `TeamOne` component → exclusiveCreator data
- `FunFactOne` → calculated stats from channels/creators

---

### 3. CHANNELS LIST PAGE (`/channels`)
**Liko Template Used:** `Image Slider` (`Home-7` - `/src/pages/homes/home-7.tsx`)  
**Route:** `/src/app/channels/page.tsx`

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **Studio Panels** | **CMS** | Dynamic channels | `channel` | **Each panel = 1 channel** |
| **Panel 1-5** | **CMS** | Channel content | `channel[]` | **Simple: Name + Image connected with YouTube Channel ID** |
| **Channel Numbers** | **STATIC** | Simple metrics | None | **YT Channels, Videos, Creators, Years, Social Channels** |

**CMS Integration Points:**
- `HomeSevenMain` component receives `channels` prop
- `StudioPanelOne` through `StudioPanelFive` → channel data  
- Each panel displays: **channel name, logo/image** (simple approach)
- Channel numbers section: static company stats, not per-channel metrics

---

### 4. CHANNEL DETAIL PAGE (`/channels/[slug]`) - **YouTube Channel Identity**
**Liko Template Used:** `Costume Light` (`/src/pages/portfolio/details/portfolio-custom-light-main.tsx`)  
**Route:** `/src/app/channels/[slug]/page.tsx`
**Data Source:** `youtubeId` collection from Sanity

#### SECTIONS BREAKDOWN (Maps directly to `youtubeId` schema):

**1. Hero / Intro Section:**
| Field | CMS Field | Type | Description |
|-------|-----------|------|-------------|
| Channel Number | `channel_number` | string | Display number ("01", "02", etc.) |
| Category | `category` | string | Content category from predefined list |
| Channel Name | `channel_name` | string | Official YouTube channel name |
| Description | `intro_description` | richBody | Short channel description |
| CTA Button | `cta_button_url` | url | Direct link to YouTube channel |

**2. Side Info:**
| Field | CMS Field | Type | Description |
|-------|-----------|------|-------------|
| Creator Name | `channel` | string | Channel owner/main creator |
| Start Date | `date_started` | date | Channel launch date |
| Focus Areas | `focus` | array of strings | Content focus tags |
| Social Links | `share_links` | object | All platform URLs (YouTube, IG, TikTok, etc.) |

**3. Visual Identity Section:**
| Field | CMS Field | Type | Description |
|-------|-----------|------|-------------|
| Identity Subtitle | `visual_identity_subtitle` | string | Section header text |
| Identity Description | `visual_identity_description` | richBody | Visual style explanation |
| Key Bullets | `visual_identity_bullets` | array of strings | Branding key points |
| Typography | `typography` | array of objects | Font names & usage |
| Color Palette | `colors` | array of objects | Brand colors with hex codes |
| Identity Images | `visual_identity_images` | array of imageWithAlt | Logos, banners, samples |

**4. Concept Section:**
| Field | CMS Field | Type | Description |
|-------|-----------|------|-------------|
| Concept Subtitle | `concept_subtitle` | string | Section header text |
| Core Concept | `concept_text_block_1` | richBody | Main channel philosophy |
| Additional Details | `concept_text_block_2` | richBody | Target audience, inspiration |
| Concept Images | `concept_images` | array of imageWithAlt | Screenshots, BTS, video stills |

**CMS Integration:**
- Query: `*[_type == "youtubeId" && slug.current == $slug][0]`
- Component receives full `youtubeId` document
- All content dynamically populated from Sanity
- Template maintains Liko Costume Light styling

---

### 5. CREATORS LIST PAGE (`/creators`)
**Liko Template Used:** `Shop Page` (`/src/pages/shop/shop-main.tsx`)  
**Route:** `/src/app/creators/page.tsx`

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **Page Header** | STATIC | Hard-coded text | None | "Our Creators" title |
| **Filter Sidebar** | **CMS-DERIVED** | From creator data | `exclusiveCreator.niches` | Dynamic filter options |
| **Creator Grid** | **CMS** | Dynamic creators | `exclusiveCreator` | **Card grid of all creators** |
| **Creator Cards** | **CMS** | Individual creators | `exclusiveCreator` | Name, image, followers, niches |
| **Pagination** | **CMS-DERIVED** | From creator count | Calculated | Based on total creator count |

**REMAPPING (Shop → Creators):**
| Original Shop Field | Vonas Creator Field | CMS Source | Notes |
|-------------------|-------------------|------------|--------|
| Product Title | Creator Name | `name` | "Kai Chen", "Mara Santos" |
| Price | Follower Count | `totalFollowers` | "120K Followers" not "$120" |
| Category Filter | Niche Tags | `niches[]` | "Documentary", "Streetwear" |
| Brand Filter | Platform | `metrics[].platform` | "YouTube", "TikTok", "Instagram" |
| Product Image | Creator Photo | `heroImage` | Profile/headshot |
| Add to Cart | Request Collaboration | Static CTA | Links to `/contact?creator=[slug]` |

**CMS Integration Points:**
- `ShopMain` receives `creators` prop
- Filter options generated from unique `niches` values
- No commerce logic - pure creator showcase

---

### 6. CREATOR DETAIL PAGE (`/creators/[slug]`)
**Liko Template Used:** `Shop Details 2` (`/src/pages/shop/shop-details-2-main.tsx`)  
**Route:** `/src/app/creators/[slug]/page.tsx`

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **Creator Hero** | **CMS** | Single creator | `exclusiveCreator` by slug | Name, headline, hero image |
| **Image Gallery** | **CMS** | Creator photos | `exclusiveCreator.gallery[]` | Multiple creator photos |
| **Stats Section** | **CMS** | Platform metrics | `exclusiveCreator.metrics[]` | Per-platform follower counts |
| **Bio Section** | **CMS** | Creator info | `exclusiveCreator.bio` | Rich text about creator |
| **Packages Section** | **CMS** | Service packages | `exclusiveCreator.packages[]` | Collaboration packages |
| **Availability** | **CMS** | Creator status | `exclusiveCreator.availability` | "Open", "Limited", "Closed" |
| **Contact CTA** | STATIC | Contact button | None | "Request Collaboration" → `/contact?creator=[slug]` |

**REMAPPING (Shop Details → Creator Profile):**
| Original Shop Field | Vonas Creator Field | CMS Source | Notes |
|-------------------|-------------------|------------|--------|
| Product Gallery | Creator Gallery | `gallery[]` | Multiple photos |
| Price/Variants | Follower Metrics | `metrics[]` | Platform-specific stats |
| Product Description | Creator Bio | `bio` | Rich text biography |
| SKU/Specs | Packages/Services | `packages[]` | Collaboration offerings |
| Add to Cart | Request Collaboration | Static | Contact form CTA |
| Reviews | Case Studies | Could be `casestudies` | Featured work examples |

---

### 7. NEWS LIST PAGE (`/news`)
**Liko Template Used:** `Classic Sidebar` (`/src/pages/blog/blog-classic.tsx`)  
**Route:** `/src/app/news/page.tsx`

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **Page Header** | STATIC | Hard-coded text | None | "News & Updates" |
| **Blog Grid** | **CMS** | Dynamic articles | `post` | Article cards with excerpts |
| **Sidebar** | STATIC/CMS | Mixed content | Various | Recent posts, categories, search |
| **Article Cards** | **CMS** | Individual posts | `post` | Title, excerpt, date, author |
| **Pagination** | **CMS-DERIVED** | From post count | Calculated | Based on total articles |

**CMS Integration Points:**
- `BlogClassicMain` receives `articles` prop
- Sidebar can show recent posts from same CMS data
- Article cards link to `/news/[slug]`

---

### 8. NEWS DETAIL PAGE (`/news/[slug]`)
**Liko Template Used:** `Post Single` (`/src/pages/blog/blog-details.tsx`)  
**Route:** `/src/app/news/[slug]/page.tsx`

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **Article Header** | **CMS** | Single article | `post` by slug | Title, date, author, featured image |
| **Article Content** | **CMS** | Article body | `post.content` | Rich text content |
| **Article Meta** | **CMS** | Post metadata | `post` fields | Publish date, author, categories |
| **Related Posts** | **CMS** | Similar articles | `post` query | Other recent articles |
| **Share Buttons** | STATIC | Social sharing | None | Template share component |

**CMS Integration Points:**
- `BlogDetailsMain` receives single `article` prop
- Dynamic routing finds article by slug
- Related posts from same CMS collection

---

### 9. FAQ PAGE (`/faq`)
**Liko Template Used:** `FAQ` (`/src/pages/faq/faq-main.tsx`)  
**Route:** `/src/app/faq/page.tsx`

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **FAQ Header** | STATIC | Hard-coded text | None | "Frequently Asked Questions" |
| **FAQ Accordion** | STATIC | Hard-coded Q&A | None | 6 Vonas-specific questions |
| **FAQ Sidebar** | STATIC | Hard-coded text | None | Contact info, search |
| **Search Function** | STATIC | Template feature | None | Client-side FAQ search |

**Static FAQ Content:**
1. "Do you only work with exclusive creators?"
2. "Can brands build a channel with you?"
3. "What types of content do you focus on?"
4. "Are you a production house or an agency?"
5. "How do you select creators to work with?"
6. "What makes your approach different?"

---

### 10. CONTACT PAGE (`/contact`)
**Liko Template Used:** `Contact` (`/src/pages/contact/contact.tsx`)  
**Route:** `/src/app/contact/page.tsx`

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **Contact Header** | STATIC | Hard-coded text | None | "Get in touch" |
| **Contact Form** | STATIC | Template form | None | Name, email, message fields |
| **Contact Info** | STATIC | Vonas details | None | Email, phone, address |
| **Location Cards** | STATIC | Company info | None | Philippines HQ, Collaboration, Careers |
| **Social Links** | STATIC | Social media | None | YouTube, Instagram, TikTok, Twitter |

**Contact Information:**
- **General:** hello@vonas-media.com
- **Collaborations:** collab@vonas-media.com  
- **Careers:** jobs@vonas-media.com
- **Location:** Content Channel Lab, Manila, Philippines

---

### 11. KNOWLEDGE BASE PAGE (`/knowledge`)
**Template Used:** `AriaDocs` (NOT Liko - separate template)  
**Route:** `/src/app/knowledge/page.tsx`

#### SECTIONS BREAKDOWN:
| Section | Type | Content Source | CMS Collection | Notes |
|---------|------|----------------|----------------|--------|
| **Documentation Layout** | STATIC | AriaDocs template | None | Native AriaDocs design |
| **Knowledge Articles** | **CMS** | Documentation | `knowledgeBase` | Industry insights, case studies |
| **Navigation Sidebar** | **CMS-DERIVED** | From content | `knowledgeBase` categories | Auto-generated from articles |
| **Search Function** | STATIC | AriaDocs feature | None | Built-in documentation search |

**Special Notes:**
- **Only linked in footer** (not header navigation)
- Maintains AriaDocs native styling (no Liko design applied)
- Used for industry research, insights, case studies

---

## 🔄 CMS INTEGRATION SUMMARY

### Sanity Collections Used:
1. **`channel`** - Simple channel info (name, logo, basic metrics)
2. **`youtubeId`** - **Detailed YouTube channel identity** (hero, visual identity, concept, typography, colors)
3. **`exclusiveCreator`** - Creator profiles, follower counts, collaboration packages
4. **`teamMember`** - Internal company team (different from creators)
5. **`post`** - News articles, blog content
6. **`knowledgeBase`** - Documentation, industry insights

### Calculated/Dynamic Data:
- **Company Stats:** Total channels, creators, followers (calculated from collections)
- **Filter Options:** Niches, platforms (derived from creator/channel data)
- **Related Content:** Recent posts, similar creators (algorithmic)

### Fallback Strategy:
- All CMS calls have static fallbacks maintaining exact word counts
- Site fully functional without Sanity connection
- Graceful degradation preserves design integrity

---

## 🎯 STATIC vs CMS BREAKDOWN BY SECTION

### STATIC SECTIONS (Never change):
- All hero banners (text content)
- Navigation menus
- Footer content  
- Service descriptions
- FAQ questions/answers
- Contact information
- Brand messaging
- Call-to-action buttons

### CMS SECTIONS (Dynamic content):
- Channel cards/listings
- Creator profiles/listings  
- News articles
- Team member data
- Platform metrics
- Knowledge base articles
- Client testimonials
- Company statistics

### MIXED SECTIONS (Static layout + CMS data):
- Project galleries (static layout, dynamic channel content)
- Creator grids (static filters, dynamic creator cards)
- News lists (static sidebar, dynamic articles)

This approach ensures **design consistency** while enabling **content flexibility** through the CMS integration.
