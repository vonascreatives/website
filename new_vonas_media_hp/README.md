# Vonas Media - Creator Portfolio Platform

A Next.js application built with Sanity CMS for managing content creators and brand collaborations, based on the Liko Creative Agency Template.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local .env.local.backup
   # Edit .env.local with your Sanity write token
   ```

3. **Generate Sanity Write Token:**
   ```bash
   ./setup-token.sh
   ```

4. **Run migration (if needed):**
   ```bash
   node migrate-creators.js
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── creators/          # Creators listing page
│   ├── creators/[slug]/   # Individual creator detail pages
│   ├── api/               # API routes
│   │   ├── reviews/       # Review submission endpoint
│   │   ├── shortlist/     # Shortlist management endpoint
│   │   └── checkout/      # Checkout/contact endpoint
├── sanity/                # Sanity CMS configuration
│   ├── schemas/           # Content schemas
│   │   ├── creator.js     # Main creator schema
│   │   ├── brandCollaboration.js
│   │   ├── review.js
│   │   └── shortlist.js
├── components/            # React components
├── lib/                   # Utilities and configurations
├── scripts/               # Migration and utility scripts
└── public/               # Static assets
```

## 🗄️ Database Migration

### Migration Overview
The project includes a migration script to convert legacy `exclusiveCreator` documents to the new `creator` schema.

### Pre-Migration Checklist
- [x] Sanity schemas defined
- [x] Migration script created
- [x] Preview tested (12 documents found)
- [ ] Write token configured

### Running Migration

1. **Preview migration (dry run):**
   ```bash
   node test-migration-preview.js
   ```

2. **Run actual migration:**
   ```bash
   node migrate-creators.js
   ```

### Migration Details
The script converts:
- **Niche mapping:** Legacy niches → mainCategory enums
- **Platform metrics:** Normalized follower/engagement data
- **Availability:** String values → structured format
- **Images:** Added alt text and proper references
- **Social links:** Structured social media profiles

## 🎨 UI Components

### Creators Grid Page (`/creators`)
- **Sidebar filters:** Follower count, niches, platforms, location
- **Creator cards:** Profile images, metrics, heart/contact buttons
- **Sorting options:** Followers, alphabetical, recently added
- **Responsive design:** Mobile-friendly layout

### Creator Detail Page (`/creators/[slug]`)
- **Three-tab layout:** About, Selected Work, Reviews
- **Social buttons:** Conditional display based on available links
- **Metrics table:** Platform-specific follower/engagement data
- **Contact integration:** Links to checkout flow

### Checkout/Contact Form
- **Project brief:** Brand name, contact info, message
- **File uploads:** Up to 10 files, 10MB max each
- **Budget/timeline:** Structured project requirements
- **Integration:** Updates shortlist with project details

## 🔌 API Routes

### `/api/shortlist`
- **POST:** Add creator to shortlist
- **GET:** Retrieve user's shortlist
- **DELETE:** Remove from shortlist
- **Features:** Rate limiting, validation, security tokens

### `/api/reviews`
- **POST:** Submit creator review
- **GET:** Fetch creator reviews (with pagination)
- **Features:** Moderation status, rating validation

### `/api/checkout`
- **POST:** Submit project brief with file attachments
- **Features:** File upload to Sanity assets, shortlist updates

## 🛡️ Security Features

- **Rate limiting:** 10 requests per minute per IP
- **Input validation:** Zod schemas for all endpoints
- **File restrictions:** Type and size limits for uploads
- **CORS protection:** Configured for production domains
- **Environment isolation:** Separate tokens for read/write access

## 🎯 Content Management

### Sanity Schemas

#### Creator Schema
```javascript
{
  name: 'creator',
  fields: [
    'name', 'slug', 'headline', 'bio',
    'mainCategory', 'niches', 'location',
    'availability', 'featured', 'images',
    'socialLinks', 'platforms', 'packages',
    'brandCollaborations', 'seo'
  ]
}
```

#### Review Moderation
Reviews support moderation workflow:
- `pending` - Awaiting review
- `approved` - Published on site  
- `rejected` - Hidden from public

## 🚀 Deployment

### Environment Variables
```bash
# Required for all environments
NEXT_PUBLIC_SANITY_PROJECT_ID=5cywtc7a
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03

# Required for API routes and migration
SANITY_WRITE_TOKEN=your-write-token-here
```

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run type-check
```

## 🔍 Testing

### Migration Testing
```bash
# Preview migration changes
node test-migration-preview.js

# Test API endpoints locally
curl -X POST http://localhost:3000/api/shortlist \
  -H "Content-Type: application/json" \
  -d '{"creatorId": "test-id"}'
```

### UI Testing
- Navigate to `/creators` to test filtering and cards
- Test creator detail pages with `/creators/[slug]`
- Verify checkout flow functionality
- Check responsive design on mobile devices

## 🔄 Migration Status

**Current Status:**
- ✅ Schema definitions complete
- ✅ Migration script ready
- ✅ 12 exclusiveCreator documents identified
- ✅ UI components functional
- ⏳ Awaiting write token for migration execution

**Post-Migration Tasks:**
- [ ] Verify all creator data migrated correctly
- [ ] Test filtering with real data
- [ ] Update any hardcoded references
- [ ] Performance optimization if needed

## 📞 Support

For questions or issues:
- Check the migration logs for data conversion issues
- Verify environment variables are properly set
- Review Sanity studio for content management
- Test API endpoints with proper authentication
