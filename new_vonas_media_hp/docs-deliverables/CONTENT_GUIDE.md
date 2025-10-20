# Content Editor's Guide

## Overview
This guide is designed for content editors and administrators who will be adding and updating content in the Vonas Media Sanity CMS. No coding knowledge required—everything is done through the Sanity Studio visual interface.

---

## Table of Contents
1. [Accessing Sanity Studio](#accessing-sanity-studio)
2. [Content Management Basics](#content-management-basics)
3. [Adding Use Cases](#adding-use-cases)
4. [Managing Affiliate Links](#managing-affiliate-links)
5. [Adding Awards](#adding-awards)
6. [Updating Fun Facts](#updating-fun-facts)
7. [Managing Hero Sections](#managing-hero-sections)
8. [Adding Testimonials](#adding-testimonials)
9. [Updating Counter Stats](#updating-counter-stats)
10. [Managing FAQ Content](#managing-faq-content)
11. [Image Guidelines](#image-guidelines)
12. [Best Practices](#best-practices)

---

## Accessing Sanity Studio

### Login Instructions

1. **Navigate** to your Sanity Studio URL:
   - Production: `https://vonas-media.sanity.studio` (or your configured domain)
   - Local: `http://localhost:3333` (if running locally)

2. **Login Options**:
   - **Google**: Click "Continue with Google" and select your account
   - **Email**: Enter your email and click the magic link sent to your inbox
   - **GitHub**: Click "Continue with GitHub" (if enabled)

3. **First-Time Setup**:
   - Accept the invitation email from Sanity
   - Follow the setup wizard
   - Verify your email address

### User Permissions

- **Editor**: Can create, edit, and publish content
- **Viewer**: Can only view content
- **Administrator**: Full access including settings

---

## Content Management Basics

### Understanding the Interface

**Left Sidebar**: Navigation to different content types  
**Center Panel**: Content list or editor  
**Right Panel**: Publishing tools and metadata

### Publishing Workflow

1. **Draft**: Content saved but not visible on website
2. **Edit**: Make your changes
3. **Publish**: Click green "Publish" button to make live
4. **Update**: Changes to published content need republishing

### Key Actions

| Action | How to Do It |
|--------|--------------|
| Create New | Click "+ Create" button → Select content type |
| Edit Existing | Click on content item in list |
| Duplicate | Click "•••" menu → Duplicate |
| Delete | Click "•••" menu → Delete (use sparingly) |
| Hide Content | Set "Is Active" to OFF instead of deleting |

---

## Adding Use Cases

**Purpose**: Showcase portfolio projects and client work

### Step-by-Step Guide

#### 1. Create New Use Case

1. Click **"Use Cases"** in left sidebar
2. Click **"+ Create"** button (top right)
3. New document opens in editor

#### 2. Basic Information

**Title** (Required)
- Enter project name: e.g., "Fashion E-commerce Platform"
- This will appear as the main heading
- Keep between 5-10 words

**Slug** (Auto-generated)
- Click "Generate" next to slug field
- Based on title: "fashion-e-commerce-platform"
- Can edit manually if needed (keep lowercase, use hyphens)

**Subtitle** (Optional)
- Add a catchy tagline: e.g., "Effortless chic lifestyle"
- Keep under 60 characters

#### 3. Hero Image (Required)

1. Click **"Upload"** in Hero Background Image field
2. Select image from your computer
3. **Recommended size**: 1920×1080px (landscape)
4. **Format**: JPG or WebP
5. After upload, click **"Edit Hotspot"** to adjust focal point
6. Add **Alt Text**: Describe the image for accessibility
   - Good: "Modern fashion e-commerce homepage with minimalist design"
   - Bad: "Image 1" or "Homepage"

#### 4. Project Details (All Required)

**Website URL** (Optional)
- Full URL: `https://example.com`
- Leave blank if project is not live

**Summary** (Required)
- Write 3-5 sentences describing the project
- Explain what you did and why
- Keep between 150-300 characters

**Client** (Required)
- Client or company name: "Chic Boutique Inc."

**Services** (Required)
- List what you provided: "Web Development, UI/UX Design, Branding"
- Separate with commas

**Industry** (Required)
- Business sector: "Fashion & Retail" or "Technology" or "Healthcare"

**Date** (Required)
- Select project completion date
- Only month and year will display: "January 2025"

#### 5. Content Sections

This is where you tell the project story. Add 3-5 sections minimum.

**Adding a Section**:

1. Scroll to **"Content Sections"** field
2. Click **"Add item"** button
3. Fill in section fields:

**Section Title** (Required)
- Heading for this section
- Examples: "The Challenge", "Our Solution", "The Results"
- Keep 2-5 words

**Goal** (Optional)
- Category label for the section
- Examples: "Introduction", "Problem Statement", "Approach"
- Appears above section title in smaller text

**Case Details** (Required)
- Full description for this section
- Write 2-5 paragraphs
- Explain this aspect of the project thoroughly
- Can include line breaks for readability

**Example Section Structure**:
```
Section 1:
  Title: "The Challenge"
  Goal: "Introduction"
  Details: "The client needed a modern e-commerce platform that would compete with industry leaders while maintaining their unique brand identity. Their existing website was outdated, difficult to navigate, and not mobile-friendly..."

Section 2:
  Title: "Our Solution"
  Goal: "Approach"
  Details: "We designed a mobile-first responsive platform built on modern web technologies. The new design features intuitive navigation, streamlined checkout, and stunning product photography..."

Section 3:
  Title: "The Results"
  Goal: "Outcomes"
  Details: "Post-launch metrics showed a 45% increase in mobile conversions and a 60% reduction in cart abandonment rates..."
```

4. Click **"Add item"** to create more sections
5. Drag sections to reorder them

#### 6. Gallery Images (Optional)

Add 3-8 images to showcase the project:

1. Scroll to **"Gallery Images"** field
2. Click **"Add item"**
3. Upload image (**Recommended**: 1200×800px)
4. Add **Alt Text**: Describe what's in the image
5. Add **Caption** (Optional): Brief description shown below image
6. Repeat for each gallery image

#### 7. Additional Images (Optional)

**Full Width Image**:
- Large showcase image spanning page width
- **Size**: 1920×1080px or larger
- Perfect for key visuals

**Grid Image Left**:
- Appears in 2-column layout (left side)
- **Size**: 800×600px

**Grid Image Right**:
- Appears in 2-column layout (right side)
- **Size**: 800×600px

#### 8. Display Settings

**Display Order** (Required)
- Number controlling sort order
- Lower numbers appear first
- Example: Order 1 shows before Order 2
- Recommendation: Use 1, 2, 3, 4, etc.

**Featured Use Case** (Toggle)
- Turn ON to display on homepage
- Only 1-2 use cases should be featured

**Active** (Toggle)
- Turn ON to show on website (default)
- Turn OFF to hide without deleting

**Tags** (Optional)
- Add keywords for filtering
- Click field → Type tag → Press Enter
- Examples: "branding", "web", "mobile", "ecommerce"

#### 9. Publish

1. Review all content
2. Ensure all required fields filled (marked with *)
3. Click green **"Publish"** button (top right)
4. Wait for confirmation message
5. Visit website to verify (may need to refresh)

---

## Managing Affiliate Links

**Purpose**: Display partner offers and affiliate programs

### Adding an Affiliate Link

1. Click **"Affiliate Links"** in sidebar
2. Click **"+ Create"**

#### Fill Required Fields:

**Offer Text** (Required)
- Main promotional text
- Examples: "Get 50% off Canva Pro", "Free trial for 30 days"
- Keep under 80 characters

**App Name** (Required)
- Brand or product name
- Examples: "Canva Pro", "Notion", "Adobe Creative Cloud"

**Year** (Required)
- Current year of offer: "2025"

**Featured Image** (Required)
- Upload brand logo or product image
- **Recommended size**: 1200×800px
- Add descriptive alt text

**Affiliate URL** (Required)
- Complete URL with tracking code
- Example: `https://partner.com/offer?ref=vonasmedia&code=SAVE50`
- Always use `https://`

**Hover Text** (Optional)
- Text shown on mouse hover
- Default: "View Demo"
- Other options: "Learn More", "Get Offer", "Start Free Trial"

**Display Order** (Required)
- Set position: 0, 1, 2, 3, etc.
- 0 = appears first

**Is Active** (Toggle)
- ON = visible on website
- OFF = hidden

**Featured** (Toggle)
- ON = priority display
- OFF = standard display

### Tips for Affiliate Links

✓ Use high-quality brand images  
✓ Test affiliate URLs before publishing  
✓ Keep offer text short and compelling  
✓ Update year annually  
✓ Deactivate expired offers (don't delete)

---

## Adding Awards

**Purpose**: Showcase recognitions and achievements

### Creating an Award Entry

1. Click **"Awards & Recognition"** in sidebar
2. Click **"+ Create"**

#### Required Information:

**Award Title**
- Official name: "FWA Site of the Day", "Best Digital Agency 2025"

**Subtitle**
- Count or category: "x2" (if won twice), "x3", "Winner", "Finalist"

**Award Date**
- Date received (displays as: Jan 15, 2025)

**Award Logo/Image**
- Upload official award badge or logo
- **Recommended**: PNG with transparent background
- **Size**: 500×200px

#### Optional Information:

**Awarding Organization**
- Who gave the award: "FWA", "Awwwards", "CSS Design Awards"

**Award Category**
- Select from dropdown:
  - Design
  - Development
  - Innovation
  - Digital Excellence
  - Site of the Day
  - Other

**Project URL**
- Link to award announcement or project page

**Description**
- 2-3 sentences about the achievement
- Example: "Recognized for innovative use of animation and exceptional user experience in our portfolio redesign project."

**Display Order**
- Set position (1, 2, 3...)
- Lower numbers appear first

**Featured Award**
- Toggle ON for homepage display

**Active**
- Toggle ON to show on website

### Award Best Practices

- Use official award logos
- Multiple wins: Use "x2", "x3" in subtitle
- Keep descriptions brief (under 150 characters)
- Link to award announcement when possible
- Feature 2-3 most prestigious awards

---

## Updating Fun Facts

**Purpose**: Display company statistics (projects, team size, years)

### Editing Fun Facts

1. Click **"Fun Facts"** in sidebar
2. Usually only **1 document** exists—click to edit
3. Don't create multiple; edit the existing one

#### Section Settings:

**Title** (Required)
- Main heading: "Agency Snapshots", "By the Numbers"

**Subtitle** (Optional)
- Label above title: "Fun Facts", "Our Achievements"

**Page Location**
- Select where to display:
  - About Page (most common)
  - Home Page
  - Multiple Pages (global)

#### Adding/Editing Facts:

Each fact has 4 fields:

**Title** (Required)
- Label in UPPERCASE
- Examples: "PROJECTS DELIVERED", "TEAM MEMBERS", "YEARS OF EXCELLENCE"

**Count** (Required)
- Numeric value only: 200, 5, 94, 1500
- No commas or symbols (those are added automatically)

**Suffix** (Optional)
- Added after number
- Options: "+", "%", "K", "M" or leave blank
- Examples:
  - Count: 200, Suffix: "+" → Displays as "200+"
  - Count: 94, Suffix: "%" → Displays as "94%"
  - Count: 2, Suffix: "K" → Displays as "2K"

**Display Order** (Required)
- Position: 1, 2, 3, 4, etc.

#### Example Setup:

```
Fact 1:
  Title: PROJECTS DELIVERED
  Count: 200
  Suffix: +
  Order: 1

Fact 2:
  Title: YEARS OF EXCELLENCE
  Count: 5
  Suffix: +
  Order: 2

Fact 3:
  Title: TEAM MEMBERS STRONG
  Count: 9
  Suffix: +
  Order: 3

Fact 4:
  Title: AGENCY GROWTH RATE
  Count: 194
  Suffix: %
  Order: 4
```

### Tips for Fun Facts

- Keep 3-6 facts total (more looks cluttered)
- Use impressive but honest numbers
- UPPERCASE titles for consistency
- Update annually with current stats
- Use "+" suffix for ongoing counts
- Use "%" for rates and percentages

---

## Managing Hero Sections

**Purpose**: Control homepage hero area with images and titles

### Editing Studio Hero

1. Click **"Studio Hero Section"** in sidebar
2. Click existing document to edit (don't create multiple)

#### Hero Title (Required)
- Main text: "Content Channel Lab", "Vonas Media"
- Keep 2-5 words
- Will display in large typography

#### Hero Images:

**Hero Image Left** (Optional)
- Large decorative image (left side)
- **Size**: 1200×1600px (portrait)
- **Format**: JPG or WebP

**Hero Image Right** (Optional)
- Large decorative image (right side)
- **Size**: 1200×1600px (portrait)

**Shape Image** (Optional)
- Decorative graphic element
- **Format**: SVG or PNG with transparency
- Appears below title

#### Thumbnail Grid (Required - Exactly 4):

Must add exactly 4 thumbnail images:

1. Click **"Add item"** under Thumbnail Images
2. Upload image (**Size**: 600×600px square)
3. Add **Alt Text** (required)
4. Set **Display Order**: 1, 2, 3, or 4
5. Repeat 4 times total

**Thumbnail Layout**:
```
Order 1 | Order 2
Order 3 | Order 4
```

#### Settings:

**Page Location**
- Studio Home (default)
- Home Page
- Multiple Pages

**Is Active**
- ON = visible
- OFF = hidden

---

## Adding Testimonials

**Purpose**: Display client reviews and feedback

### Managing Testimonials

1. Click **"Studio Testimonials"** in sidebar
2. Edit existing document (should be only one)

#### Section Settings:

**Section Title**
- Heading: "What Our Clients Say" (default)

**Subtitle**
- Label: "Testimonials:" (default)

**Shape Image** (Optional)
- Decorative element on left
- PNG with transparency recommended

#### Adding Testimonial Items:

Click **"Add item"** under Testimonials array:

**Client Name** (Required)
- Full name: "Chris Hughes", "Maria Rodriguez"

**Designation** (Required)
- Format: "Title | Company Name"
- Examples:
  - "CEO | Gemini Skincare"
  - "Marketing Director | TechStart Inc."
  - "Founder | Creative Studio"

**Testimonial Text** (Required)
- The actual review/quote
- Length: 50-500 characters
- Include quotation marks: "The team exceeded our expectations..."
- Be authentic and specific

**Company Logo** (Required)
- Upload client's company logo
- **Size**: 500×200px (landscape)
- **Format**: PNG with transparent background preferred
- Add alt text: "Company Name logo"

**Display Order** (Required)
- Position: 1, 2, 3, etc.

**Featured** (Toggle)
- ON = priority/highlight display

### Testimonial Best Practices

✓ Get written permission from clients  
✓ Use real names and companies  
✓ Keep quotes between 100-200 words  
✓ Use high-quality company logos  
✓ Include specific results when possible  
✓ Format designation consistently  
✗ Don't use generic or fake testimonials  
✗ Avoid overly long quotes

---

## Updating Counter Stats

**Purpose**: Animated counting numbers for company metrics

### Editing Counter Stats

1. Click **"Studio Counter Stats"** in sidebar
2. Edit existing document

#### Optional Title
- Section heading (leave blank if not needed)

#### Adding Counter Items:

Click **"Add item"** to add a stat:

**Label** (Required)
- Short description: "Experts", "Projects", "Awards", "Years"
- Keep 1-2 words

**Count** (Required)
- Target number: 54, 21, 17, 86, 4
- Numbers will animate from 0 to this value

**Prefix** (Optional)
- Before number: "+", "$", "#"
- Example: "$" + 1M = "$1M"

**Suffix** (Optional)
- After number: "+", "K", "M", "%"
- Example: 54 + "+" = "54+"

**Display Order** (Required)
- Position: 1, 2, 3, etc.

#### Examples:

```
Counter 1:
  Label: Experts
  Count: 54
  Prefix: +
  Suffix: (none)
  Result: "+54 Experts"

Counter 2:
  Label: Projects
  Count: 21
  Prefix: (none)
  Suffix: +
  Result: "21+ Projects"

Counter 3:
  Label: Revenue Growth
  Count: 94
  Prefix: (none)
  Suffix: %
  Result: "94% Revenue Growth"
```

### Tips for Counter Stats

- Keep 4-6 counters total
- Use round, impressive numbers
- Consistent suffix style across counters
- Update quarterly or annually
- Test animation on website after publishing

---

## Managing FAQ Content

**Purpose**: Answer common questions from visitors

### Editing FAQ Section

1. Click **"FAQ Section"** in sidebar
2. Edit existing document (should be only one)

#### Sidebar Configuration:

**Sidebar Title** (Required)
- Main heading: "Q&A", "Frequently Asked Questions"

**Sidebar Description** (Required)
- Intro text: "Got questions about channels, creators, or collaborations? Find answers here."
- Can use line breaks for formatting

**Sidebar Banner** (Required)
- Upload decorative image
- **Size**: 600×400px
- Add alt text

**Search Placeholder** (Optional)
- Search box text: "Search questions" (default)

#### Adding FAQ Items:

Click **"Add item"** under Items:

**Question** (Required)
- Clear, specific question
- Start with: What, How, Can, Do, Is, Why
- Examples:
  - "Do you only work with exclusive creators?"
  - "Can brands build a channel with you?"
  - "What types of content do you focus on?"

**Answer** (Required)
- Clear, concise response
- 2-5 sentences
- Be specific and actionable
- Example: "No. We work with both in-house creators and non-exclusive collaborators. All get access to the same strategy, editorial edge, and production craft from our team."

**Order** (Required)
- Position: 1, 2, 3, etc.
- Place most common questions first

**Category** (Optional)
- Select from:
  - General
  - Creators
  - Brands
  - Content
  - Technical
  - Billing

**Is Active** (Toggle)
- ON = visible on website
- OFF = hidden (use to draft questions)

### FAQ Writing Best Practices

**Questions**:
✓ Use conversational language  
✓ Keep under 100 characters  
✓ Address one topic per question  
✓ Use keywords users might search  

**Answers**:
✓ Be direct and helpful  
✓ Provide actionable information  
✓ Keep 2-5 sentences  
✓ Use simple language  
✗ Avoid jargon and marketing speak  
✗ Don't be overly technical  

**Organization**:
- Group similar questions by category
- Place most important questions first (order 1-3)
- Keep total FAQs between 8-20 items
- Review and update quarterly

---

## Image Guidelines

### Image Specifications

| Image Type | Recommended Size | Format | Notes |
|------------|------------------|--------|-------|
| Hero Images | 1920×1080px | JPG, WebP | Landscape orientation |
| Gallery Images | 1200×800px | JPG, WebP | High quality |
| Thumbnails | 600×600px | JPG, WebP, PNG | Square format |
| Logos | 500×200px | PNG | Transparent background |
| Icons | 256×256px | SVG, PNG | Vector preferred |
| Award Badges | 500×200px | PNG | Transparent background |

### File Naming Conventions

Good file names:
- `ecommerce-platform-hero-image.jpg`
- `client-logo-gemini-skincare.png`
- `award-badge-fwa-sotd.png`

Avoid:
- `IMG_1234.jpg`
- `Screen Shot 2025-01-15.png`
- `Untitled-1.jpg`

### Image Optimization Tips

**Before Upload**:
1. Resize to recommended dimensions
2. Compress images (use TinyPNG or similar)
3. Keep file size under 2MB per image
4. Use appropriate format (JPG for photos, PNG for graphics)

**In Sanity Studio**:
1. Always add alt text (describe the image)
2. Use hotspot for images with important focal points
3. Add captions for context when needed
4. Test images on website after publishing

### Alt Text Best Practices

✓ **Good Alt Text**:
- "Modern fashion e-commerce homepage with minimalist white background"
- "Team collaborating in bright office space"
- "Award badge for FWA Site of the Day"

✗ **Bad Alt Text**:
- "Image 1"
- "Homepage"
- "Photo"
- Leaving alt text blank

**Alt Text Guidelines**:
- Describe what's in the image
- Keep under 125 characters
- Don't start with "Image of..." or "Picture of..."
- Include important text visible in image
- For logos: "[Company Name] logo"

---

## Best Practices

### Content Quality

**Writing**:
- Use clear, concise language
- Check spelling and grammar
- Write for your audience
- Be specific and informative
- Use active voice

**Structure**:
- Break up long text with headings
- Use short paragraphs (3-5 sentences)
- Include bullet points for lists
- Add line breaks for readability

**Consistency**:
- Follow existing content style
- Use consistent terminology
- Maintain brand voice
- Match formatting patterns

### Publishing Workflow

**Before Publishing**:
- [ ] All required fields filled
- [ ] Images uploaded with alt text
- [ ] Spelling and grammar checked
- [ ] Preview content if available
- [ ] Display order set correctly
- [ ] Active/Featured toggles configured

**After Publishing**:
- [ ] Visit website to verify
- [ ] Test on mobile device
- [ ] Check all images load
- [ ] Verify links work
- [ ] Test on different browsers

### Content Maintenance

**Regular Tasks**:
- Update statistics quarterly
- Review and refresh old content
- Remove outdated information
- Check for broken links
- Update dates and years annually

**Content Audit** (Every 6 months):
- Review all published content
- Archive or update old projects
- Refresh testimonials
- Update fun facts/counter stats
- Review FAQ relevance

### Getting Help

**Common Issues**:
- **Can't publish**: Check all required fields (marked with *)
- **Image not showing**: Verify image is published and alt text added
- **Content not on website**: Hard refresh browser (Ctrl+Shift+R)
- **Lost changes**: Sanity auto-saves drafts every few seconds

**Support Resources**:
- Sanity Documentation: https://www.sanity.io/docs
- Contact your developer
- Check this guide's README.md for setup issues

---

## Quick Reference Checklists

### New Use Case Checklist

- [ ] Title entered (5-10 words)
- [ ] Slug generated
- [ ] Hero image uploaded (1920×1080px) with alt text
- [ ] Project summary written (150-300 chars)
- [ ] Client, services, industry, date filled
- [ ] 3-5 content sections added
- [ ] 3-8 gallery images uploaded with alt text
- [ ] Display order set
- [ ] Featured toggle configured
- [ ] Active toggle ON
- [ ] Published
- [ ] Verified on website

### New Affiliate Link Checklist

- [ ] Offer text entered (under 80 chars)
- [ ] App name entered
- [ ] Year set to current year
- [ ] Image uploaded (1200×800px) with alt text
- [ ] Affiliate URL entered (complete with https://)
- [ ] Affiliate URL tested
- [ ] Hover text customized
- [ ] Display order set
- [ ] Is Active toggle ON
- [ ] Published
- [ ] Verified on website

### Image Upload Checklist

- [ ] Image properly sized for use case
- [ ] File size under 2MB
- [ ] Appropriate format (JPG/PNG/SVG)
- [ ] Descriptive filename
- [ ] Alt text added (under 125 chars)
- [ ] Hotspot adjusted if needed
- [ ] Caption added if relevant
- [ ] Image appears correctly on website

---

**Last Updated**: October 2025  
**Guide Version**: 1.0  
**For**: Content Editors & Administrators
