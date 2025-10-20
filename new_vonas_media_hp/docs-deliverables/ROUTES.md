# URL Routes & Dynamic Routes Documentation

## Overview
This document outlines all URL patterns, dynamic routes, and slug rules for the Vonas Media website. The application uses Next.js 13+ App Router with file-based routing.

---

## Table of Contents
1. [Static Routes](#static-routes)
2. [Dynamic Routes](#dynamic-routes)
3. [Slug Generation Rules](#slug-generation-rules)
4. [API Routes](#api-routes)
5. [Route Groups](#route-groups)

---

## Static Routes

### Public Pages

| Route | File Path | Description |
|-------|-----------|-------------|
| `/` | `src/app/page.tsx` | Homepage redirect |
| `/home-1` | `src/app/(homes)/home-1/page.tsx` | Main homepage |
| `/about` | `src/app/about/page.tsx` | About page |
| `/contact` | `src/app/contact/page.tsx` | Contact page |
| `/faq` | `src/app/faq/page.tsx` | FAQ section |
| `/pricing` | `src/app/pricing/page.tsx` | Pricing plans |

### Content Pages

| Route | File Path | Description |
|-------|-----------|-------------|
| `/channels` | `src/app/channels/page.tsx` | All channels listing |
| `/creators` | `src/app/creators/page.tsx` | Creator directory |
| `/news` | `src/app/news/page.tsx` | News/blog listing |
| `/knowledge-base` | `src/app/knowledge-base/page.tsx` | Documentation hub |
| `/brand` | `src/app/brand/page.tsx` | Brand collaboration page |

### Authentication & Account

| Route | File Path | Description |
|-------|-----------|-------------|
| `/login` | `src/app/login/page.tsx` | User login |
| `/register` | `src/app/register/page.tsx` | User registration |
| `/account` | `src/app/account/page.tsx` | User dashboard |

### E-commerce (Legacy from template)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/shop` | `src/app/(shop)/page.tsx` | Shop listing |
| `/cart` | `src/app/cart/page.tsx` | Shopping cart |
| `/checkout` | `src/app/checkout/page.tsx` | Checkout process |
| `/wishlist` | `src/app/wishlist/page.tsx` | Saved items |
| `/shortlist` | `src/app/shortlist/page.tsx` | Shortlisted items |

---

## Dynamic Routes

### Channel Details

**Pattern**: `/channels/[slug]`  
**File**: `src/app/channels/[slug]/page.tsx`

**Example URLs**:
- `/channels/off-the-record`
- `/channels/frmwrkd`
- `/channels/island-influencers`

**Data Source**: Sanity `youtubeId` collection  
**Slug Field**: `slug.current`

**Route Parameters**:
```typescript
params: {
  slug: string
}
```

**Query Logic**:
```groq
*[_type == "youtubeId" && slug.current == $slug][0]
```

### Creator Details

**Pattern**: `/creators/[slug]`  
**File**: `src/app/creators/[slug]/page.tsx`

**Example URLs**:
- `/creators/kai-chen`
- `/creators/maya-rodriguez`
- `/creators/alex-thompson`

**Data Source**: Sanity `exclusiveCreator` collection  
**Slug Field**: `slug.current`

**Route Parameters**:
```typescript
params: {
  slug: string
}
```

**Query Logic**:
```groq
*[_type == "exclusiveCreator" && slug.current == $slug][0]
```

### News Article Details

**Pattern**: `/news/[slug]`  
**File**: `src/app/news/[slug]/page.tsx`

**Example URLs**:
- `/news/future-of-content-creation-2024`
- `/news/building-authentic-brand-partnerships`

**Data Source**: Sanity `post` collection  
**Slug Field**: `slug.current`

**Route Parameters**:
```typescript
params: {
  slug: string
}
```

**Query Logic**:
```groq
*[_type == "post" && slug.current == $slug][0]
```

### Use Case/Portfolio Details

**Pattern**: `/portfolio-details-1` (currently static)  
**Planned**: `/use-cases/[slug]`

**Example URLs** (Future):
- `/use-cases/ecommerce-platform-redesign`
- `/use-cases/brand-identity-refresh`

**Data Source**: Sanity `useCase` collection  
**Slug Field**: `slug.current`

**Query Logic**:
```groq
*[_type == "useCase" && slug.current == $slug][0]
```

### Knowledge Base Articles

**Pattern**: `/knowledge-base/[slug]`  
**File**: `src/app/knowledge-base/[slug]/page.tsx`

**Example URLs**:
- `/knowledge-base/content-strategy-framework`
- `/knowledge-base/channel-launch-playbook`
- `/knowledge-base/adobe-premiere-pro-essentials`

**Data Source**: Sanity `knowledgeBase` collection  
**Slug Field**: `slug.current`

**Route Parameters**:
```typescript
params: {
  slug: string
}
```

**Query Logic**:
```groq
*[_type == "knowledgeBase" && slug.current == $slug][0]
```

---

## Slug Generation Rules

### General Slug Rules

All slugs must follow these conventions:

1. **Lowercase only**: `my-awesome-channel` ✓, `My-Awesome-Channel` ✗
2. **Hyphens for spaces**: Use `-` between words
3. **No special characters**: Remove `!@#$%^&*()+=[]{}|;:'",.<>?`
4. **No leading/trailing hyphens**: `my-channel` ✓, `-my-channel-` ✗
5. **No consecutive hyphens**: `my-channel` ✓, `my--channel` ✗
6. **Alphanumeric and hyphens only**: `channel-2024` ✓, `channel_2024` ✗

### Slug Generation Function

```typescript
function generateSlug(text: string): string {
  return text
    .toLowerCase()                      // Convert to lowercase
    .replace(/\s+/g, '-')              // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')        // Remove special characters
    .replace(/-+/g, '-')               // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');            // Remove leading/trailing hyphens
}
```

### Schema-Specific Slug Sources

| Schema | Source Field | Example Input | Generated Slug |
|--------|--------------|---------------|----------------|
| `useCase` | `title` | "E-commerce Platform Redesign" | `ecommerce-platform-redesign` |
| `affiliateLink` | `offerText` | "Get 50% off Canva Pro!" | `get-50-off-canva-pro` |
| `award` | `title` | "FWA Site of the Day" | `fwa-site-of-the-day` |
| `exclusiveCreator` | `name` | "Kai Chen" | `kai-chen` |
| `youtubeId` | `channel_name` | "Off the Record" | `off-the-record` |
| `post` | `title` | "Building Authentic Partnerships" | `building-authentic-partnerships` |
| `knowledgeBase` | `title` | "Content Strategy Framework" | `content-strategy-framework` |

### Unique Slug Requirements

**Slugs must be unique within each schema type**:
- ✓ `/channels/island-influencers` and `/creators/island-influencers` (different schemas)
- ✗ `/channels/island-influencers` and `/channels/island-influencers-2` (duplicate prevention)

**Sanity Validation**:
Sanity Studio automatically:
1. Generates slug from source field
2. Checks for uniqueness within schema
3. Prevents duplicate slugs
4. Allows manual editing with same rules

### Handling Duplicates

If a slug already exists, append a number:
- Original: `content-strategy`
- Duplicate 1: `content-strategy-1`
- Duplicate 2: `content-strategy-2`

---

## API Routes

### Sanity Webhook Endpoints

**Pattern**: `/api/sanity/[endpoint]`  
**Purpose**: Handle Sanity webhooks and revalidation

| Endpoint | File | Method | Purpose |
|----------|------|--------|---------|
| `/api/sanity/revalidate` | `src/app/api/sanity/revalidate/route.ts` | POST | Trigger ISR revalidation |

### Internal API Routes

| Route | File | Method | Purpose |
|-------|------|--------|---------|
| `/api/contact` | `src/app/api/contact/route.ts` | POST | Contact form submission |
| `/api/subscribe` | `src/app/api/subscribe/route.ts` | POST | Newsletter subscription |

---

## Route Groups

Next.js route groups organize files without affecting URLs.

### Current Route Groups

**Group**: `(homes)`  
**Purpose**: Multiple homepage variations  
**Files**:
- `src/app/(homes)/home-1/page.tsx` → `/home-1`
- `src/app/(homes)/home-2/page.tsx` → `/home-2` (if exists)

**Group**: `(shop)`  
**Purpose**: E-commerce pages (legacy template)  
**Files**:
- `src/app/(shop)/page.tsx` → `/shop`
- `src/app/(shop)/[id]/page.tsx` → `/shop/[id]`

**Group**: `(about)`  
**Purpose**: About-related pages  
**Files**:
- `src/app/(about)/page.tsx` → `/about`

**Group**: `(portfolio)`  
**Purpose**: Portfolio variations  
**Files**:
- `src/app/(portfolio)/portfolio-details-1/page.tsx` → `/portfolio-details-1`

### Route Group Conventions

Parentheses in folder names:
- **Don't affect URL structure**: `(homes)/home-1` → `/home-1`
- **Organize related pages**: Keep similar pages together
- **Share layouts**: Apply common layouts to grouped routes
- **Scope middleware**: Apply logic to specific route groups

---

## Special Routes

### Not Found Page

**Route**: Any non-existent URL  
**File**: `src/app/not-found.tsx`  
**Status**: 404

### Robots.txt

**Route**: `/robots.txt`  
**File**: `src/app/robots.ts`  
**Type**: Dynamic generation  
**Purpose**: SEO crawler instructions

### Sitemap

**Route**: `/sitemap.xml`  
**File**: `src/app/sitemap.ts`  
**Type**: Dynamic generation  
**Purpose**: Search engine sitemap

---

## URL Best Practices

### SEO-Friendly URLs

✓ **Good URLs**:
- `/creators/kai-chen` - Clear, descriptive
- `/news/future-of-content-creation` - Readable
- `/knowledge-base/adobe-premiere-pro-essentials` - Descriptive

✗ **Avoid**:
- `/creators/123` - Non-descriptive IDs
- `/news/article?id=456` - Query parameters for main content
- `/kb/apr-ess` - Unclear abbreviations

### URL Length

- **Ideal**: 50-60 characters
- **Maximum**: 100 characters
- **Avoid**: Overly long URLs with unnecessary words

### Keyword Placement

Place important keywords early in the slug:
- ✓ `content-strategy-framework`
- ✓ `channel-launch-playbook`
- ✗ `the-complete-guide-to-content-strategy-framework-2024`

---

## Route Parameters & Query Strings

### Dynamic Route Params

**Access in Server Components**:
```typescript
// src/app/channels/[slug]/page.tsx
export default async function ChannelPage({
  params
}: {
  params: { slug: string }
}) {
  const slug = params.slug;
  // Fetch data using slug
}
```

**Access in Client Components**:
```typescript
'use client';
import { useParams } from 'next/navigation';

export default function Component() {
  const params = useParams();
  const slug = params.slug as string;
}
```

### Query String Parameters

**Example**: `/creators?category=fashion&sort=popular`

**Access in Server Components**:
```typescript
export default async function CreatorsPage({
  searchParams
}: {
  searchParams: { category?: string; sort?: string }
}) {
  const category = searchParams.category;
  const sort = searchParams.sort;
}
```

**Access in Client Components**:
```typescript
'use client';
import { useSearchParams } from 'next/navigation';

export default function Component() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const sort = searchParams.get('sort');
}
```

---

## Navigation Helpers

### Link Component

```typescript
import Link from 'next/link';

// Static route
<Link href="/about">About Us</Link>

// Dynamic route
<Link href={`/creators/${creator.slug.current}`}>
  View Profile
</Link>

// With query params
<Link href="/creators?category=fashion">
  Fashion Creators
</Link>
```

### Programmatic Navigation

```typescript
'use client';
import { useRouter } from 'next/navigation';

export default function Component() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/creators/kai-chen');
    // or
    router.replace('/about'); // No history entry
  };
}
```

---

## Redirects & Rewrites

### Next.js Config Redirects

**File**: `next.config.mjs`

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home-1',
        permanent: true,
      },
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ]
  },
}
```

### Common Redirect Patterns

| Old URL | New URL | Type |
|---------|---------|------|
| `/` | `/home-1` | Permanent (301) |
| `/blog/:slug` | `/news/:slug` | Permanent (301) |
| `/case-studies/:slug` | `/use-cases/:slug` | Permanent (301) |

---

## Route Middleware

### Protected Routes

Routes requiring authentication:
- `/account/*` - User dashboard
- `/checkout` - Checkout process
- `/wishlist` - Saved items

**Middleware File**: `src/middleware.ts`

```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (!token && request.nextUrl.pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/account/:path*', '/checkout', '/wishlist']
};
```

---

## URL Canonicalization

### Trailing Slashes

**Current Behavior**: No trailing slashes  
**Enforced by**: Next.js default

- ✓ `/about`
- ✗ `/about/`
- ✓ `/channels/frmwrkd`
- ✗ `/channels/frmwrkd/`

### Case Sensitivity

**All URLs are case-insensitive** through normalization:
- `/Channels/FRMWRKD` → redirects to → `/channels/frmwrkd`

---

## Dynamic Route Generation

### Generate Static Params

For static site generation of dynamic routes:

```typescript
// src/app/channels/[slug]/page.tsx
export async function generateStaticParams() {
  const channels = await sanityClient.fetch(`
    *[_type == "youtubeId"]{ "slug": slug.current }
  `);
  
  return channels.map((channel) => ({
    slug: channel.slug,
  }));
}
```

**Applies to**:
- `/channels/[slug]`
- `/creators/[slug]`
- `/news/[slug]`
- `/use-cases/[slug]` (future)
- `/knowledge-base/[slug]`

---

## Route Testing Checklist

### For Each New Route

- [ ] Route resolves correctly
- [ ] Dynamic params work
- [ ] 404 page shows for invalid slugs
- [ ] SEO meta tags present
- [ ] Canonical URL set
- [ ] Open Graph tags configured
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Error boundaries handle failures

### URL Testing Examples

```bash
# Static routes
http://localhost:3000/about
http://localhost:3000/contact
http://localhost:3000/faq

# Dynamic routes
http://localhost:3000/channels/off-the-record
http://localhost:3000/creators/kai-chen
http://localhost:3000/news/future-of-content-creation

# Query parameters
http://localhost:3000/creators?category=fashion
http://localhost:3000/creators?category=fashion&sort=popular

# Invalid routes (should 404)
http://localhost:3000/invalid-route
http://localhost:3000/channels/non-existent-slug
```

---

## Common Issues & Solutions

### Issue: Route Not Found

**Symptoms**: 404 error on valid URL  
**Causes**:
- File not in correct directory
- Missing `page.tsx` file
- Route group affecting path

**Solution**:
- Verify file structure matches URL pattern
- Check for typos in folder names
- Ensure `page.tsx` exports default component

### Issue: Slug Conflicts

**Symptoms**: Wrong content showing for slug  
**Causes**:
- Duplicate slugs in Sanity
- Slug not unique across schema

**Solution**:
- Check Sanity for duplicate slugs
- Regenerate unique slug
- Add numeric suffix if needed

### Issue: Dynamic Route Not Rendering

**Symptoms**: Blank page or loading indefinitely  
**Causes**:
- Data fetching error
- Missing params
- Incorrect GROQ query

**Solution**:
- Add error boundary
- Log params to verify
- Test GROQ query in Sanity Vision
- Add loading state

---

**Last Updated**: October 2025  
**Next.js Version**: 15.5.5  
**Routing System**: App Router (Next.js 13+)
