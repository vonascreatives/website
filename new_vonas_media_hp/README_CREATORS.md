# Vonas Media Creator Platform

This document provides setup instructions and documentation for the creator platform features built with Next.js and Sanity CMS.

## 🚀 Quick Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=5cywtc7a
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03

# Sanity Write Token (for API routes only - scoped permissions required)
SANITY_WRITE_TOKEN=your-write-token-here
```

### 2. Generate Sanity Write Token

1. Go to [Sanity Management](https://manage.sanity.io/)
2. Select your project (`5cywtc7a`)
3. Go to API → Tokens
4. Create a new token with **Editor** permissions
5. Scope it to only allow writes to these document types:
   - `creator`
   - `creatorReview` 
   - `shortlist`
   - File assets (for uploads)

### 3. Deploy Sanity Schema Updates

```bash
cd "studio-vonas-media-core (sanity)"
npm install
npm run deploy
```

### 4. Start Development

```bash
cd new_vonas_media_hp
npm install
npm run dev
```

## 📋 Schema Overview

### Core Document Types

#### Creator
- **Purpose**: Main creator profiles with metrics, work samples, and ratings
- **Key Fields**: name, mainCategory, mainPlatform, metrics[], selectedWork[], socialLinks
- **Replaces**: `exclusiveCreator` (migration needed)

#### Creator Review
- **Purpose**: User reviews for creators with moderation workflow
- **Key Fields**: rating (1-5), body, tags[], status (pending/approved/rejected)
- **Moderation**: All reviews start as 'pending', require manual approval

#### Shortlist  
- **Purpose**: Brand's saved creators for project inquiries
- **Key Fields**: sessionId, creators[], brief (project details), status
- **Workflow**: Draft → Submitted → Under Review → Quoted

#### Brand Collaboration
- **Purpose**: Existing brand/client information (unchanged)
- **Usage**: Referenced in creator selectedWork for portfolio items

### Object Types

#### imageWithAlt
- **Purpose**: Structured image with alt text for accessibility
- **Fields**: image (Sanity image), alt (string, required)
- **Usage**: All creator images use this type

## 🔄 Migration Process

### From exclusiveCreator to creator

The system supports both schema during transition. To migrate:

1. **Automatic Field Mapping**:
   - `niche` (string) → `mainCategory` (enum)
   - `niches[]` → keep as sub-categories
   - `heroImage[0]` → `heroImage` (single imageWithAlt)
   - `metrics[]` → keep structure, add `mainPlatform` as highest follower platform

2. **Manual Steps**:
   ```bash
   # In Sanity Studio, run this GROQ mutation for each creator:
   *[_type == "exclusiveCreator"] {
     _id,
     name,
     slug,
     "mainCategory": select(
       niche == "tech" => "Technology",
       niche == "lifestyle" => "Lifestyle", 
       niche == "fashion" => "Fashion & Style",
       niche == "beauty" => "Beauty & Makeup",
       niche in ["fitness", "health"] => "Fitness & Health",
       niche == "food" => "Food & Cooking",
       niche == "travel" => "Travel & Adventure",
       niche == "gaming" => "Gaming",
       niche in ["entertainment", "comedy"] => "Comedy & Entertainment",
       niche == "art" => "Art & Design",
       niche == "music" => "Music",
       niche == "business" => "Business & Finance",
       "Lifestyle" // default
     ),
     niches,
     "mainPlatform": select(
       count(metrics[platform == "YouTube"]) > 0 => "YouTube",
       count(metrics[platform == "Instagram"]) > 0 => "Instagram", 
       count(metrics[platform == "TikTok"]) > 0 => "TikTok",
       "YouTube" // default
     ),
     metrics,
     totalFollowers,
     "heroImage": heroImage[0],
     // ... other fields
   }
   ```

## 🛠 API Routes

### `/api/shortlist`

**GET** `?sessionId=uuid`
- Returns user's shortlist with populated creator data
- Used for: Heart states, checkout preview

**POST** 
```json
{
  "sessionId": "uuid",
  "creatorId": "creator-id", 
  "action": "add" | "remove"
}
```
- Adds/removes creator from shortlist
- Rate limited: 30 requests/minute per IP

### `/api/reviews`

**GET** `?creatorId=id&page=1&limit=10`
- Returns approved reviews for a creator
- Paginated results with metadata

**POST**
```json
{
  "creatorId": "creator-id",
  "rating": 5,
  "title": "Great collaboration",
  "body": "Excellent work quality...",
  "tags": ["professional", "creative"],
  "authorName": "John Doe",
  "authorEmail": "john@company.com",
  "authorCompany": "Acme Corp",
  "honeypot": "" // Anti-spam, must be empty
}
```
- Creates review with 'pending' status
- Rate limited: 3 reviews per 5 minutes per IP
- Anti-spam: honeypot field, content sanitization, duplicate prevention

### `/api/checkout`

**GET** `?sessionId=uuid`
- Returns shortlist for checkout preview

**POST** (multipart/form-data)
```
sessionId: uuid
brandName: "Acme Corp"
contactEmail: "john@acme.com" 
contactName: "John Doe"
message: "Project description..."
budget: "10k-25k"
timeline: "1-3-months"
files: File[] // max 10 files, 10MB each, png/jpg/pdf/doc/docx
```
- Submits project brief with file attachments
- Updates shortlist status to 'submitted'
- Rate limited: 5 submissions per hour per IP

## 🎨 Frontend Components

### Creator Grid (`/creators`)

**Key Features**:
- Liko template design matching
- Hover overlay: Name (left) + Formatted followers (right)
- Heart icon for shortlist add/remove
- "Select Creator" action button
- Filter sidebar with real Sanity data

**Filter Options**:
- Main Category (Fashion, Beauty, Tech, etc.)
- Main Platform (YouTube, Instagram, TikTok, Twitter)
- Sub-Niches (populated from creator data)

### Creator Detail (`/creators/[slug]`)

**3 Tabs** (exactly as specified):
1. **About**: Bio, metrics, availability, social buttons (only if links exist)
2. **Selected Work**: Portfolio grid with brand logos, project links
3. **Reviews**: Approved reviews + rating summary + "Add Review" modal

**Social Buttons**: Only render if corresponding URL exists:
- YouTube → socialLinks.youtube
- Instagram → socialLinks.instagram  
- TikTok → socialLinks.tiktok
- Twitter → socialLinks.twitter

### Shortlist/Heart System

**Client-Side State**:
- localStorage sync for persistence
- Heart filled/unfilled states
- Session ID generated on first interaction

**Server Sync**:
- API calls on heart click
- Contact button also adds to shortlist
- Checkout shows all shortlisted creators

### Checkout Flow

**Multi-Step Process**:
1. Review shortlisted creators
2. Fill project brief form
3. Upload supporting files (optional)
4. Submit for review
5. Confirmation with tracking ID

## 🔍 GROQ Queries

### Filter Aggregations
```groq
{
  "categories": array::unique(*[_type == "creator"].mainCategory),
  "platforms": array::unique(*[_type == "creator"].mainPlatform), 
  "niches": array::unique(*[_type == "creator"].niches[])
}
```

### Creators with Filters
```groq
*[_type == "creator"
  && (!defined($mainCategory) || mainCategory == $mainCategory)
  && (!defined($mainPlatform) || mainPlatform == $mainPlatform)
  && (!defined($niche) || $niche in niches[])
]{
  _id, name, slug, featured, mainCategory, mainPlatform,
  "image": heroImage.image.asset->url,
  "followers": coalesce(totalFollowers, sum(metrics[].followers))
} | order(featured desc, name asc) [$offset...$end]
```

### Creator Detail
```groq
*[_type == "creator" && slug.current == $slug][0]{
  _id, name, slug, headline, 
  "heroImage": heroImage.image.asset->url,
  gallery[]{ "image": image.asset->url, "alt": alt },
  bio, mainCategory, niches, mainPlatform, metrics,
  "totalFollowers": coalesce(totalFollowers, sum(metrics[].followers)),
  availability, languages,
  selectedWork[]{
    title, link, "thumb": thumb.image.asset->url, date,
    "brand": brand->{ 
      "name": coalesce(brandName, name), 
      "logo": logo[0].image.asset->url 
    }
  },
  socialLinks, ratingAverage, ratingCount
}
```

### Approved Reviews
```groq
*[_type == "creatorReview" && creator._ref == $creatorId && status == "approved"] 
| order(_createdAt desc) {
  rating, title, body, tags, authorName, authorCompany, _createdAt
}
```

## 🛡 Security & Anti-Spam

### Rate Limiting
- **Reviews**: 3 per 5 minutes per IP
- **Shortlist**: 30 per minute per IP  
- **Checkout**: 5 per hour per IP
- **Storage**: In-memory Map (use Redis in production)

### Input Validation
- **Email validation**: RFC compliant regex
- **Content sanitization**: Strip HTML, replace links with [LINK]
- **File validation**: Type checking, size limits (10MB), count limits (10 files)
- **Honeypot**: Hidden field must remain empty

### Review Moderation
1. All reviews created with `status: 'pending'`
2. Manual approval required in Sanity Studio
3. On approval, creator ratings auto-update via GROQ aggregation
4. Spam detection: IP tracking, duplicate prevention, content analysis

## 📊 Moderation Workflow

### Sanity Studio Views

**Pending Reviews**:
- Filter: `*[_type == "creatorReview" && status == "pending"]`
- Sort: Newest first
- Actions: Approve, Reject, Mark as Spam

**Shortlists**:
- Filter: `*[_type == "shortlist" && status == "submitted"]`
- Sort: Recently submitted  
- Actions: Move to Under Review, Add internal notes

### Rating Updates

When approving a review, manually run this GROQ mutation to update creator ratings:

```groq
// Get aggregated rating data
*[_type == "creator" && _id == $creatorId][0] {
  _id,
  "approvedReviews": *[_type == "creatorReview" && creator._ref == ^._id && status == "approved"] {
    rating
  },
  "avgRating": math::avg(*[_type == "creatorReview" && creator._ref == ^._id && status == "approved"].rating),
  "reviewCount": count(*[_type == "creatorReview" && creator._ref == ^._id && status == "approved"])
}

// Then patch the creator:
sanity.patch(creatorId)
  .set({
    ratingAverage: avgRating,
    ratingCount: reviewCount
  })
  .commit()
```

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] Deploy Sanity schema updates
- [ ] Generate and configure write token with correct permissions
- [ ] Test all API routes with rate limiting
- [ ] Verify file upload functionality (10MB limit)
- [ ] Test review moderation workflow
- [ ] Confirm email validation and anti-spam measures

### Post-Launch Monitoring
- [ ] Monitor API rate limits and adjust as needed
- [ ] Review pending reviews daily
- [ ] Track shortlist conversion rates
- [ ] Monitor file upload storage usage
- [ ] Check for spam patterns and adjust filtering

## 🔧 Development Commands

```bash
# Start development
npm run dev

# Build for production  
npm run build

# Run linting
npm run lint

# Sanity Studio (in studio directory)
npm run dev        # Local studio
npm run deploy     # Deploy schema changes
```

## 📱 Template Compliance

This implementation maintains **pixel-perfect** compliance with the Liko Creative Agency Portfolio Template:

- **Typography**: Uses existing template font sizes and weights
- **Spacing**: Preserves template margins, padding, and grid systems
- **Buttons**: Reuses template button classes and hover states
- **Colors**: Maintains template color palette and gradients
- **Animations**: Preserves template hover and transition effects
- **Layout**: Follows template layout patterns exactly

### No Custom CSS Added
All styling uses existing template classes. The only additions are:
- Utility functions (follower count formatting)
- API route handlers
- Sanity schema definitions
- React component logic (no styling)

This ensures the implementation looks identical to the original Liko template while adding the required creator platform functionality.
