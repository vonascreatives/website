# Sanity Schema Documentation

## Overview
This document describes all Sanity CMS document types and their fields for the Vonas Media platform. Each schema defines how content is structured, validated, and displayed in the Sanity Studio.

---

## Table of Contents
1. [Use Case Schema](#use-case-schema)
2. [Affiliate Links Schema](#affiliate-links-schema)
3. [Award Schema](#award-schema)
4. [Fun Facts Schema](#fun-facts-schema)
5. [Studio Hero Schema](#studio-hero-schema)
6. [Studio Testimonials Schema](#studio-testimonials-schema)
7. [Studio Counter Stats Schema](#studio-counter-stats-schema)
8. [FAQ V2 Schema](#faq-v2-schema)

---

## Use Case Schema

**Schema Name**: `useCase`  
**Display Title**: Use Case  
**Purpose**: Showcase portfolio projects and case studies with detailed sections, images, and project information.

### Fields

#### Basic Information

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `title` | String | Yes | Main title of the use case (e.g., "E-commerce Platform Redesign") |
| `slug` | Slug | Yes | Auto-generated from title. Used in URLs (e.g., `/use-cases/ecommerce-platform-redesign`) |
| `subtitle` | String | No | Tagline or short description (e.g., "Effortless chic lifestyle") |
| `heroImage` | Image | Yes | Large background image for hero section. Supports hotspot positioning. Include alt text. |
| `websiteUrl` | URL | No | Link to live project website |
| `summary` | Text | Yes | Brief project description (3-5 sentences) |

#### Project Metadata

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `client` | String | Yes | Client or company name |
| `services` | String | Yes | Services provided (e.g., "Web Development, UI/UX Design") |
| `industry` | String | Yes | Industry sector (e.g., "Fashion", "Technology") |
| `date` | Date | Yes | Project completion date (format: MMMM YYYY) |

#### Content Sections

**Field**: `sections` (Array of objects)

Each section contains:

| Sub-field | Type | Required | Description |
|-----------|------|----------|-------------|
| `sectionTitle` | String | Yes | Heading for the section (e.g., "The Challenge") |
| `goal` | String | No | Section category or goal (e.g., "An introduction", "The problem") |
| `caseDetails` | Text | Yes | Detailed content explaining this aspect of the project. Supports line breaks. |

**Usage Example**:
- Section 1: Title: "The Challenge", Goal: "Introduction", Details: "Client needed modern platform..."
- Section 2: Title: "Our Solution", Goal: "Approach", Details: "We implemented a responsive design..."

#### Visual Assets

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `galleryImages` | Array[Image] | No | Multiple images for gallery carousel. Each image should have alt text and optional caption. |
| `fullWidthImage` | Image | No | Large showcase image displayed full-width across the page |
| `gridImageLeft` | Image | No | Left image in 2-column grid layout |
| `gridImageRight` | Image | No | Right image in 2-column grid layout |

#### Display & Status

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `displayOrder` | Number | Yes | Sort order (lower numbers appear first). Start from 1. |
| `featured` | Boolean | No | Mark as featured to show on homepage (default: false) |
| `isActive` | Boolean | No | Show/hide on website (default: true) |
| `tags` | Array[String] | No | Categories for filtering (e.g., ["branding", "web", "mobile"]) |

### How to Add a Use Case

1. **Navigate**: Sanity Studio → Use Cases → Create
2. **Required Fields First**:
   - Enter `title` (auto-generates slug)
   - Upload `heroImage` with descriptive alt text
   - Write compelling `summary` (3-5 sentences)
   - Fill in `client`, `services`, `industry`, `date`
   - Set `displayOrder` number
3. **Add Sections** (Click "Add item"):
   - Minimum 1 section, recommended 3-5
   - Each section needs `sectionTitle` and `caseDetails`
   - Use `goal` to categorize sections
4. **Add Images**:
   - `galleryImages`: Add 3-8 images for visual variety
   - Optional: Add `fullWidthImage`, `gridImageLeft`, `gridImageRight`
5. **Optional Settings**:
   - Check `featured` to display on homepage
   - Add `tags` for filtering
   - Ensure `isActive` is checked
6. **Publish**: Click green "Publish" button

### Validation Rules
- Title, hero image, and summary are mandatory
- Display order must be ≥ 1
- Gallery images should have alt text for accessibility
- Slug must be unique across all use cases

---

## Affiliate Links Schema

**Schema Name**: `affiliateLink`  
**Display Title**: Affiliate Links  
**Purpose**: Manage affiliate offers, commission links, and partner applications displayed on the website.

### Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `offerText` | String | Yes | Main offer text (e.g., "Get 50% off premium plan") |
| `slug` | Slug | Yes | Auto-generated from offerText |
| `appName` | String | Yes | Application or brand name (e.g., "Canva Pro", "Notion") |
| `year` | String | Yes | Year of offer (e.g., "2024", "2025") |
| `image` | Image | Yes | Featured image for the offer card. Include alt text. |
| `affiliateUrl` | URL | Yes | External affiliate link URL (must start with http:// or https://) |
| `hoverText` | String | No | Text on hover (default: "View Demo") |
| `displayOrder` | Number | Yes | Sort order, starting from 0 |
| `isActive` | Boolean | No | Toggle visibility (default: true) |
| `featured` | Boolean | No | Mark as featured item (default: false) |

### How to Add an Affiliate Link

1. **Navigate**: Sanity Studio → Affiliate Links → Create
2. **Enter Required Data**:
   - `offerText`: Clear, compelling offer description
   - `appName`: Brand or application name
   - `year`: Current year or campaign year
   - Upload `image`: High-quality product/brand image (1200×800px recommended)
   - `affiliateUrl`: Complete URL with tracking parameters
3. **Set Display**:
   - `displayOrder`: Set order (0 = first, 1 = second, etc.)
   - `hoverText`: Customize or leave as "View Demo"
   - Check `isActive` to show on site
   - Check `featured` for priority placement
4. **Publish**: Click "Publish" button

### Best Practices
- Use high-quality images (1200×800px min)
- Keep offerText concise (under 80 characters)
- Test affiliate URLs before publishing
- Update year annually
- Use consistent hover text across similar offers

---

## Award Schema

**Schema Name**: `award`  
**Display Title**: Award & Recognition  
**Purpose**: Display awards, recognitions, and accolades received by the agency.

### Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `title` | String | Yes | Award name (e.g., "Site of the Day", "Best Digital Agency") |
| `slug` | Slug | Yes | Auto-generated from title |
| `subtitle` | String | Yes | Count or subtitle (e.g., "x2", "x3", "Winner") |
| `awardDate` | Date | Yes | Date received (format: MMM DD, YYYY) |
| `image` | Image | Yes | Award logo (PNG with transparency recommended) |
| `organization` | String | No | Awarding organization (e.g., "FWA", "Awwwards") |
| `category` | String (dropdown) | No | Award category |
| `projectUrl` | URL | No | Link to awarded project or award page |
| `description` | Text | No | Brief description of the achievement |
| `displayOrder` | Number | Yes | Sort order (≥ 1) |
| `featured` | Boolean | No | Highlight this award (default: false) |
| `isActive` | Boolean | No | Show/hide (default: true) |

### Category Options
- Design
- Development
- Innovation
- Digital Excellence
- Site of the Day (SOTD)
- Other

### How to Add an Award

1. **Navigate**: Sanity Studio → Awards & Recognition → Create
2. **Core Information**:
   - `title`: Official award name
   - `subtitle`: Use "x2" format if won multiple times
   - `awardDate`: Select date received
   - Upload award `image` (logo or badge)
3. **Additional Details**:
   - `organization`: Awarding body name
   - `category`: Select from dropdown
   - `projectUrl`: Link to award announcement or project
   - `description`: 2-3 sentences about the achievement
4. **Display Settings**:
   - `displayOrder`: Set position
   - Check `featured` for homepage display
   - Ensure `isActive` is checked
5. **Publish**: Click "Publish"

### Tips
- Use transparent PNG logos for professional appearance
- Multiple wins: Use subtitle "x2", "x3", etc.
- Keep descriptions brief (under 150 characters)
- Featured awards appear prominently on homepage

---

## Fun Facts Schema

**Schema Name**: `funFact`  
**Display Title**: Fun Facts  
**Purpose**: Display company statistics and achievements (e.g., projects delivered, team size).

### Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `title` | String | Yes | Section title (e.g., "Agency Snapshots") |
| `subtitle` | String | No | Appears above title (default: "Fun Facts") |
| `facts` | Array[Object] | Yes | Statistics items (1-6 facts) |
| `isActive` | Boolean | No | Toggle visibility (default: true) |
| `pageLocation` | String (dropdown) | No | Where to display (default: about) |

### Facts Object Structure

Each fact in the `facts` array:

| Sub-field | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | String | Yes | Fact label (e.g., "PROJECTS DELIVERED", "TEAM MEMBERS") |
| `count` | Number | Yes | Numeric value (≥ 0) |
| `suffix` | String | No | Append to count (e.g., "+", "%", "K") (default: "+") |
| `displayOrder` | Number | Yes | Position in list (≥ 1) |

### Page Location Options
- About Page
- Home Page
- Multiple Pages (global)

### How to Add Fun Facts

1. **Navigate**: Sanity Studio → Fun Facts → Create (or Edit existing)
2. **Section Setup**:
   - `title`: Main heading for the stats section
   - `subtitle`: Optional label above title
   - `pageLocation`: Choose where to display
3. **Add Facts** (Click "Add item" in facts array):
   - `title`: UPPERCASE label (e.g., "YEARS OF EXCELLENCE")
   - `count`: Number only (e.g., 200, 5, 94)
   - `suffix`: "+", "%", "K", or leave blank
   - `displayOrder`: 1, 2, 3, 4, etc.
4. **Repeat**: Add 1-6 facts total
5. **Activate**: Check `isActive`
6. **Publish**: Save changes

### Example Configuration

```
Title: "Agency Snapshots"
Subtitle: "Fun Facts"
Facts:
  1. PROJECTS DELIVERED | 200 | + | Order: 1
  2. YEARS OF EXCELLENCE | 5 | + | Order: 2
  3. TEAM MEMBERS STRONG | 9 | + | Order: 3
  4. AGENCY GROWTH RATE | 194 | % | Order: 4
```

---

## Studio Hero Schema

**Schema Name**: `studioHero`  
**Display Title**: Studio Hero Section  
**Purpose**: Manage hero section images and content for studio-style homepage layouts.

### Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `title` | String | Yes | Hero title text (e.g., "Content Channel Lab") |
| `heroImageLeft` | Image | No | Large decorative image (left side) |
| `heroImageRight` | Image | No | Large decorative image (right side) |
| `shapeImage` | Image | No | Decorative shape element |
| `thumbnailImages` | Array[Image] | Yes | Exactly 4 thumbnail images for grid |
| `isActive` | Boolean | No | Toggle visibility (default: true) |
| `pageLocation` | String (dropdown) | No | Display location (default: studio-home) |

### Thumbnail Images Structure

Each thumbnail requires:

| Sub-field | Type | Required | Description |
|-----------|------|----------|-------------|
| Image | Image | Yes | The image asset |
| `alt` | String | Yes | Alt text for accessibility |
| `displayOrder` | Number | Yes | Position (1-4) |

### Page Location Options
- Studio Home
- Home Page
- Multiple Pages (global)

### How to Add Studio Hero

1. **Navigate**: Sanity Studio → Studio Hero Section → Create
2. **Title**: Enter hero section title
3. **Main Images**:
   - Upload `heroImageLeft` (large format, 1200×1600px)
   - Upload `heroImageRight` (large format, 1200×1600px)
   - Upload `shapeImage` (decorative SVG or PNG)
4. **Thumbnail Grid** (Must add exactly 4):
   - Click "Add item" 4 times
   - Upload each image (600×600px recommended)
   - Add descriptive `alt` text
   - Set `displayOrder`: 1, 2, 3, 4
5. **Settings**:
   - `pageLocation`: Select display page
   - Check `isActive`
6. **Publish**: Save changes

### Image Specifications
- Hero Images: 1200×1600px (portrait orientation)
- Shape Image: SVG or PNG with transparency
- Thumbnails: 600×600px (square format)
- All images: WebP or high-quality JPEG

---

## Studio Testimonials Schema

**Schema Name**: `studioTestimonial`  
**Display Title**: Studio Testimonials  
**Purpose**: Manage client testimonials with company logos and quotes.

### Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `sectionTitle` | String | No | Section heading (default: "What Our Clients Say") |
| `subtitle` | String | No | Appears above testimonials (default: "Testimonials:") |
| `shapeImage` | Image | No | Decorative element on left side |
| `testimonials` | Array[Object] | Yes | Client testimonial items (≥ 1) |
| `isActive` | Boolean | No | Toggle visibility (default: true) |
| `pageLocation` | String (dropdown) | No | Display location (default: studio-home) |

### Testimonials Object Structure

Each testimonial:

| Sub-field | Type | Required | Description |
|-----------|------|----------|-------------|
| `clientName` | String | Yes | Client's full name |
| `designation` | String | Yes | Job title and company (e.g., "CEO \| Gemini Skincare") |
| `testimonialText` | Text | Yes | Quote (50-500 characters) |
| `companyLogo` | Image | Yes | Company logo (PNG with transparency) |
| `displayOrder` | Number | Yes | Position in carousel (≥ 1) |
| `featured` | Boolean | No | Highlight this testimonial |

### How to Add Studio Testimonials

1. **Navigate**: Sanity Studio → Studio Testimonials → Create/Edit
2. **Section Setup**:
   - `sectionTitle`: Customize or use default
   - `subtitle`: Label above testimonials
   - `shapeImage`: Upload decorative element
3. **Add Testimonials** (Click "Add item"):
   - `clientName`: First and Last name
   - `designation`: Format as "Title | Company"
   - `testimonialText`: Write quote (use quotation marks)
   - `companyLogo`: Upload logo (500×200px, PNG)
   - `displayOrder`: Set order (1, 2, 3...)
   - Check `featured` for VIP testimonials
4. **Settings**:
   - `pageLocation`: Choose display page
   - Check `isActive`
5. **Publish**: Save

### Best Practices
- Keep quotes between 50-200 words
- Use professional headshots if available
- Company logos: transparent PNG, 500×200px
- Always include client's permission
- Format designation: "Title | Company Name"

---

## Studio Counter Stats Schema

**Schema Name**: `studioCounter`  
**Display Title**: Studio Counter Stats  
**Purpose**: Animated counting statistics for showcasing company metrics.

### Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `title` | String | No | Optional section title |
| `counters` | Array[Object] | Yes | Counter items (1-10 stats) |
| `isActive` | Boolean | No | Toggle visibility (default: true) |
| `pageLocation` | String (dropdown) | No | Display location (default: studio-home) |

### Counters Object Structure

Each counter:

| Sub-field | Type | Required | Description |
|-----------|------|----------|-------------|
| `label` | String | Yes | Stat label (e.g., "Experts", "Projects") |
| `count` | Number | Yes | Numeric value to count to (≥ 0) |
| `prefix` | String | No | Appears before number (e.g., "$", "+") |
| `suffix` | String | No | Appears after number (e.g., "+", "K", "%") |
| `displayOrder` | Number | Yes | Position (≥ 1) |

### How to Add Counter Stats

1. **Navigate**: Sanity Studio → Studio Counter Stats → Create
2. **Optional Title**: Add section title if needed
3. **Add Counters** (Click "Add item"):
   - `label`: Short, clear description
   - `count`: Target number
   - `prefix`: Optional (e.g., "+", "$")
   - `suffix`: Optional (e.g., "+", "K", "%", "M")
   - `displayOrder`: Set position
4. **Repeat**: Add 1-10 counters
5. **Settings**:
   - `pageLocation`: Select page
   - Check `isActive`
6. **Publish**: Save changes

### Example Configuration

```
Counter 1: Experts | 54 | prefix: "+" | suffix: null | Order: 1
Counter 2: Projects | 21 | prefix: "+" | suffix: null | Order: 2
Counter 3: Years | 17 | prefix: null | suffix: "+" | Order: 3
Counter 4: Awards | 86 | prefix: null | suffix: "+" | Order: 4
```

---

## FAQ V2 Schema

**Schema Name**: `faqV2`  
**Display Title**: FAQ Section  
**Purpose**: Comprehensive FAQ section with sidebar, search, and categorized questions.

### Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `sidebarTitle` | String | Yes | Sidebar heading (default: "Q&A") |
| `sidebarDescription` | Text | Yes | Sidebar description text |
| `sidebarBanner` | Image | Yes | Decorative banner image for sidebar |
| `searchPlaceholder` | String | No | Search input placeholder (default: "Search questions") |
| `items` | Array[Object] | No | FAQ question/answer pairs |

### FAQ Items Object Structure

Each FAQ item:

| Sub-field | Type | Required | Description |
|-----------|------|----------|-------------|
| `question` | String | Yes | The question text |
| `answer` | Text | Yes | The answer (supports line breaks) |
| `order` | Number | Yes | Display order (≥ 1) |
| `category` | String (dropdown) | No | Question category |
| `isActive` | Boolean | No | Show/hide question (default: true) |

### Category Options
- General
- Creators
- Brands
- Content
- Technical
- Billing

### How to Add FAQ Section

1. **Navigate**: Sanity Studio → FAQ Section → Edit (usually only one document)
2. **Sidebar Setup**:
   - `sidebarTitle`: Main FAQ heading
   - `sidebarDescription`: Intro text (supports line breaks with \\n)
   - `sidebarBanner`: Upload image (600×400px)
   - `searchPlaceholder`: Customize search text
3. **Add FAQ Items** (Click "Add item"):
   - `question`: Clear, concise question
   - `answer`: Detailed response (2-5 sentences)
   - `order`: Set position (1, 2, 3...)
   - `category`: Select relevant category
   - Check `isActive` to display
4. **Repeat**: Add as many FAQs as needed
5. **Publish**: Save changes

### Best Practices for FAQs

**Questions**:
- Start with question words (What, How, Can, Do, Is)
- Keep under 100 characters
- Focus on common user concerns

**Answers**:
- Be clear and concise (2-5 sentences)
- Use simple language
- Include actionable information
- Link to relevant documentation if needed

**Organization**:
- Group similar questions by category
- Order from most common to less common
- Keep total FAQs between 8-20 items

### Example FAQ Structure

```
Q: Do you only work with exclusive creators?
A: No. We work with both in-house creators and non-exclusive collaborators...
Category: General | Order: 1 | Active: ✓

Q: Can brands build a channel with you?
A: Yes. We design, launch, and scale channels that brands fully own...
Category: Brands | Order: 2 | Active: ✓
```

---

## Common Field Types Reference

### Image Fields
- **Always include `alt` text** for accessibility
- **Hotspot**: Enable to control focus point on crops
- **Recommended sizes**:
  - Hero images: 1920×1080px
  - Thumbnails: 600×600px
  - Logos: 500×200px (transparent PNG)
  - General content: 1200×800px

### Slug Fields
- **Auto-generated** from source field (usually title)
- **Must be unique** within schema type
- **Used in URLs**: `/use-cases/[slug]`, `/creators/[slug]`
- **Can edit manually** but keep URL-friendly (lowercase, hyphens)

### Date Fields
- **Format varies** by schema (check description)
- **Use date picker** in Sanity Studio
- **Display formats**:
  - Full date: "January 15, 2025"
  - Month/Year: "January 2025"
  - Short: "Jan 15, 2025"

### Array Fields
- **Click "Add item"** to add new entries
- **Drag to reorder** items
- **Delete** individual items with trash icon
- **Validation**: Some arrays have min/max limits

### Boolean Fields
- **Toggle switches** in Sanity Studio
- **Default values**: Usually `true` for isActive/featured
- **Common uses**:
  - `isActive`: Show/hide content
  - `featured`: Highlight content
  - Custom flags for filtering

---

## Validation Rules Summary

### Required Fields
All schemas require these core fields:
- Title (or equivalent identifier)
- Slug (auto-generated but required)
- Display order (numeric sorting)

### Numeric Validations
- Display order: Must be ≥ 1 (or ≥ 0 for some schemas)
- Count fields: Must be ≥ 0
- Array limits: Check individual schemas

### Text Length Recommendations
- Titles: 50-80 characters
- Descriptions/Summaries: 150-300 characters
- Long text/Case details: 500-2000 characters
- Testimonials: 50-500 characters

### URL Validations
- Must start with `http://` or `https://`
- External affiliate links must be complete URLs
- Internal references use Sanity references, not URLs

---

## Publishing Workflow

### Draft vs. Published
- **Draft**: Changes saved but not live on website
- **Published**: Content visible on live site
- **Always publish** after making changes

### Publishing Steps
1. Fill all required fields (marked with *)
2. Click "Publish" button (green) in top right
3. Wait for confirmation message
4. Verify on website (may need hard refresh)

### Unpublishing Content
- **Set `isActive` to false** instead of deleting
- **Preserves data** for future use
- **Delete only** if content is permanently irrelevant

---

## Troubleshooting

### Content Not Appearing on Website
- [ ] Check `isActive` is true
- [ ] Verify content is published (not draft)
- [ ] Ensure `displayOrder` is set
- [ ] Check `featured` flag if looking for homepage content
- [ ] Clear browser cache and hard refresh

### Images Not Loading
- [ ] Verify image has alt text
- [ ] Check image is published
- [ ] Ensure image file size is reasonable (<5MB)
- [ ] Try re-uploading image

### Validation Errors
- [ ] Fill all required fields (marked with *)
- [ ] Check numeric fields are positive
- [ ] Ensure URLs are complete and valid
- [ ] Verify array items meet min/max requirements

---

**Last Updated**: October 2025  
**Schema Version**: 1.0  
**Sanity Studio Version**: 3.62.2
