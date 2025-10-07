# Homepage (/) - Static Assets & CMS Content Documentation

**Page Route**: `/` (redirects to `/home-1`)  
**Main Component**: `HomeMain` (`/src/pages/homes/home-1.tsx`)  
**Implementation**: Hybrid pattern with static decorative images and CMS-driven dynamic content

## Static Decorative Images Inventory

### 1. Hero Banner Section (`HeroBannerOne`)

**File**: `/src/components/hero-banner/hero-banner-one.tsx`

#### Static Images Required for Upload:
1. **Hero Background Shape**
   - **File Path**: `/assets/img/home-01/hero/hero-bg-shape-1-1.svg`
   - **Import**: Direct public path reference  
   - **Usage**: Background decorative shape behind hero title
   - **Element**: `.tp-hero-shape-1`
   - **Dimensions**: 790×700px (SVG scalable)

2. **Hero Small Decorative Shape**
   - **File Path**: `/assets/img/home-01/hero/hero-shape-1-1.png`
   - **Import**: Direct public path reference
   - **Usage**: Small decorative accent next to "Content" text
   - **Element**: `.tp-hero-shape-2`
   - **Dimensions**: 40×40px

3. **Hero Main Image**
   - **File Path**: `/assets/img/home-01/hero/hero-1-1.png`
   - **Import**: Direct public path reference
   - **Usage**: Main hero image embedded within title "Lab"
   - **Element**: `.tp-hero-title-img`
   - **Dimensions**: 270×160px
   - **CSS Classes**: `tp-zoom-img` (for animation)

### 2. Brand Section (`BrandOne` → `BrandSlider`)

**File**: `/src/components/brand/brand-slider.tsx`

#### Static Images Required for Upload (Brand Logos):
4. **Brand Logo 1**
   - **File Path**: `/src/assets/img/home-01/brand/brand-1.png`
   - **Import**: `import b_1 from "@/assets/img/home-01/brand/brand-1.png"`
   - **Usage**: "Brands We've Built With" - Brand collaboration logo in marquee slider
   - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to brandCollaboration collection (Brand Collab)**

5. **Brand Logo 2**
   - **File Path**: `/src/assets/img/home-01/brand/brand-2.png`
   - **Import**: `import b_2 from "@/assets/img/home-01/brand/brand-2.png"`
   - **Usage**: "Brands We've Built With" - Brand collaboration logo in marquee slider (used twice in array)
   - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to brandCollaboration collection (Brand Collab)**

6. **Brand Logo 3**
   - **File Path**: `/src/assets/img/home-01/brand/brand-3.png`
   - **Import**: `import b_3 from "@/assets/img/home-01/brand/brand-3.png"`
   - **Usage**: "Brands We've Built With" - Brand collaboration logo in marquee slider
   - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to brandCollaboration collection (Brand Collab)**

7. **Brand Logo 4**
   - **File Path**: `/src/assets/img/home-01/brand/brand-4.png`
   - **Import**: `import b_4 from "@/assets/img/home-01/brand/brand-4.png"`
   - **Usage**: "Brands We've Built With" - Brand collaboration logo in marquee slider
   - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to brandCollaboration collection (Brand Collab)**

8. **Brand Logo 5**
   - **File Path**: `/src/assets/img/home-01/brand/brand-5.png`
   - **Import**: `import b_5 from "@/assets/img/home-01/brand/brand-5.png"`
   - **Usage**: "Brands We've Built With" - Brand collaboration logo in marquee slider
   - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to brandCollaboration collection (Brand Collab)**

9. **Brand Logo 6**
   - **File Path**: `/src/assets/img/home-01/brand/brand-6.png`
   - **Import**: `import b_6 from "@/assets/img/home-01/brand/brand-6.png"`
   - **Usage**: "Brands We've Built With" - Brand collaboration logo in marquee slider
   - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to brandCollaboration collection (Brand Collab)**

10. **Brand Logo 7**
    - **File Path**: `/src/assets/img/home-01/brand/brand-7.png`
    - **Import**: `import b_7 from "@/assets/img/home-01/brand/brand-7.png"`
    - **Usage**: "Brands We've Built With" - Brand collaboration logo in marquee slider
    - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to brandCollaboration collection (Brand Collab)**

### 3. Service Section (`ServiceOne`)

**File**: `/src/components/service/service-one.tsx`

#### Static Service Icons Required for Upload:
11. **Channel Building Icon**
    - **File Path**: `/src/assets/img/home-01/service/service-icon-1.png`
    - **Import**: `import s_1 from "@/assets/img/home-01/service/service-icon-1.png"`
    - **Usage**: Icon for "CHANNEL BUILDING" service
    - **Content**: "We launch digital shows and platforms that stand out..."

12. **Creator Support Icon**
    - **File Path**: `/src/assets/img/home-01/service/service-icon-2.png`
    - **Import**: `import s_2 from "@/assets/img/home-01/service/service-icon-2.png"`
    - **Usage**: Icon for "CREATOR SUPPORT" service
    - **Content**: "In-house talent and freelance collaborators..."

13. **Format Design Icon**
    - **File Path**: `/src/assets/img/home-01/service/service-icon-3.png`
    - **Import**: `import s_3 from "@/assets/img/home-01/service/service-icon-3.png"`
    - **Usage**: Icon for "FORMAT DESIGN" service
    - **Content**: "We engineer repeatable show structures that scale..."

14. **Brand Stories Icon**
    - **File Path**: `/src/assets/img/home-01/service/service-icon-4.png`
    - **Import**: `import s_4 from "@/assets/img/home-01/service/service-icon-4.png"`
    - **Usage**: Icon for "BRAND STORIES" service
    - **Content**: "Partner with brands who want storytelling, not advertising..."

### 4. Project/Channel Section (`ProjectOne`)

**File**: `/src/components/project/project-one.tsx`

#### Static Placeholder Images (Fallback):
15. **Project Image 1**
    - **File Path**: `/src/assets/img/home-01/project/project-1-1.jpg`
    - **Import**: `import p_1 from "@/assets/img/home-01/project/project-1-1.jpg"`
    - **Usage**: Project Section - Fallback image for channel showcase (layout position 1)
    - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to youtubeId collection (YouTubeIds - max 10 items, shows only images)**
    - **CSS Layout**: `tp-project-mr height-1`

16. **Project Image 2**
    - **File Path**: `/src/assets/img/home-01/project/project-1-2.jpg`
    - **Import**: `import p_2 from "@/assets/img/home-01/project/project-1-2.jpg"`
    - **Usage**: Project Section - Fallback image for channel showcase (layout position 2)
    - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to youtubeId collection (YouTubeIds - max 10 items, shows only images)**
    - **CSS Layout**: `text-end height-2 d-inline-flex justify-content-end`

17. **Project Image 3**
    - **File Path**: `/src/assets/img/home-01/project/project-1-3.jpg`
    - **Import**: `import p_3 from "@/assets/img/home-01/project/project-1-3.jpg"`
    - **Usage**: Project Section - Fallback image for channel showcase (layout position 3)
    - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to youtubeId collection (YouTubeIds - max 10 items, shows only images)**
    - **CSS Layout**: `tp-project-mr height-3`

18. **Project Image 4**
    - **File Path**: `/src/assets/img/home-01/project/project-1-4.jpg`
    - **Import**: `import p_4 from "@/assets/img/home-01/project/project-1-4.jpg"`
    - **Usage**: Project Section - Fallback image for channel showcase (layout position 4)
    - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to youtubeId collection (YouTubeIds - max 10 items, shows only images)**
    - **CSS Layout**: `height-4`

19. **Project Image 5**
    - **File Path**: `/src/assets/img/home-01/project/project-1-5.jpg`
    - **Import**: `import p_5 from "@/assets/img/home-01/project/project-1-5.jpg"`
    - **Usage**: Project Section - Fallback image for channel showcase (layout position 5)
    - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to youtubeId collection (YouTubeIds - max 10 items, shows only images)**
    - **CSS Layout**: `tp-project-ml height-5`

20. **Project Image 6**
    - **File Path**: `/src/assets/img/home-01/project/project-1-6.jpg`
    - **Import**: `import p_6 from "@/assets/img/home-01/project/project-1-6.jpg"`
    - **Usage**: Project Section - Fallback image for channel showcase (layout position 6)
    - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to youtubeId collection (YouTubeIds - max 10 items, shows only images)**
    - **CSS Layout**: `height-6`

### 5. Project Text Line Section (`ProjectTextLine`)

**File**: `/src/components/project/project-text-line.tsx`

#### Static Decorative Shape:
21. **Project Text Shape**
    - **File Path**: `/src/assets/img/home-01/project/project-shape-1-1.png`
    - **Import**: `import shape from "@/assets/img/home-01/project/project-shape-1-1.png"`
    - **Usage**: Decorative shape within animated "Channel" text in scrolling marquee
    - **Animation**: Horizontal scroll with GSAP
    - **Appears**: 4 times in the scrolling text line

### 6. Background Images

#### Project Full Background:
22. **Project Full Background Image**
    - **File Path**: `/assets/img/inner-service/hero/hero-1-2.jpg`
    - **Usage**: Full-width background image in project section
    - **Implementation**: CSS `background-image` property
    - **Element**: `.tp-project-full-img`
    - **CSS**: Pinned scrolling effect with GSAP

### 7. Award Section (`AwardOne`)

**File**: `/src/components/award/award-one.tsx`

#### Award/Recognition Images:
23. **Award Image 1**
    - **File Path**: `/src/assets/img/home-01/award/award-1.png`
    - **Import**: `import a_1 from "@/assets/img/home-01/award/award-1.png"`
    - **Usage**: FWA Site of the Day award image
    - **Content**: "x2 FWA, Site of the Day - Jun 24, 2024"

24. **Award Image 2**
    - **File Path**: `/src/assets/img/home-01/award/award-2.png`
    - **Import**: `import a_2 from "@/assets/img/home-01/award/award-2.png"`
    - **Usage**: Awwwards Interior Excellence award image
    - **Content**: "x3 Awwwards Interior Excellence - Nov 24, 2022"

25. **Award Image 3**
    - **File Path**: `/src/assets/img/home-01/award/award-3.png`
    - **Import**: `import a_3 from "@/assets/img/home-01/award/award-3.png"`
    - **Usage**: Loki boundary pushing year award image
    - **Content**: "x1 Loki boundary pushing year in Review 2022 - May 24, 2012"

26. **Award Image 4**
    - **File Path**: `/src/assets/img/home-01/award/award-4.png`
    - **Import**: `import a_4 from "@/assets/img/home-01/award/award-4.png"`
    - **Usage**: Liko Tools Website live award image
    - **Content**: "x1 The New Liko Tools Website is Live. - Sep 10, 2021"

27. **Award Image 5**
    - **File Path**: `/src/assets/img/home-01/award/award-5.png`
    - **Import**: `import a_5 from "@/assets/img/home-01/award/award-5.png"`
    - **Usage**: Digital Agencies Worldwide award image
    - **Content**: "x2 Digital Agencies Worldwide - Jun 12, 2021"

28. **Award Image 6**
    - **File Path**: `/src/assets/img/home-01/award/award-6.png`
    - **Import**: `import a_6 from "@/assets/img/home-01/award/award-6.png"`
    - **Usage**: FWA Site of the Day award image (duplicate)
    - **Content**: "x1 FWA, Site of the Day - Aug 18, 2022"

### 8. Team/Creator Section (`TeamOne` → `TeamItem`)

**File**: `/src/components/team/team-item.tsx`

#### Fallback Creator Images:
29. **Default Team Image**
    - **File Path**: `/assets/img/home-01/team/team-1-1.jpg`
    - **Usage**: Team Section - Default/fallback image when creator doesn't have photo
    - **Note**: **🔄 CMS REPLACEMENT REQUIRED - Connect to exclusiveCreator collection (Exclusive Creators - max 20 items, gallery view)**

### 9. Footer Section (`FooterOne`)

**File**: `/src/layouts/footers/footer-one.tsx`

#### Footer Logo:
30. **Footer Logo**
    - **File Path**: `/src/assets/img/logo/logo-white.png`
    - **Import**: `import logo from '@/assets/img/logo/logo-white.png'`
    - **Usage**: White version of logo in footer copyright section

### 10. Footer Shapes (from main `home-1.tsx`)

#### Footer Decorative Elements:
31. **Footer Circle Shape 1**
    - **File Path**: `/src/assets/img/home-01/footer/footer-circle-shape-1.png`
    - **Import**: `import shape_1 from '@/assets/img/home-01/footer/footer-circle-shape-1.png'`
    - **Usage**: First layer of footer contact CTA shape
    - **CSS Class**: `img-1`

32. **Footer Circle Shape 2**
    - **File Path**: `/src/assets/img/home-01/footer/footer-circle-shape-2.png`
    - **Import**: `import shape_2 from '@/assets/img/home-01/footer/footer-circle-shape-2.png'`
    - **Usage**: Second layer of footer contact CTA shape
    - **CSS Class**: `img-2`

### 11. Video Section (`VideOne`)

#### External Video:
- **Video Source**: `https://html.hixstudio.net/videos/liko/liko.mp4`
- **Type**: External MP4 (not static asset)
- **Settings**: Loop, muted, autoplay, playsInline
- **Note**: Consider replacing with Sanity-hosted video or local asset

---

## CMS Collection Connections

### 1. Brand Collaboration Connection (**REQUIRED IMPLEMENTATION**)

**Collection**: `brandCollaboration` (Brand Collab)  
**Schema Path**: `/schemaTypes/brandCollaboration.ts`  
**Component**: `BrandOne` → `BrandSlider`  
**Section**: "Brands We've Built With" marquee slider  
**Current**: Static brand logo array (8 items, duplicated to 16)

#### Required GROQ Query:
```groq
*[_type == "brandCollaboration" && status == "active"]{
  _id,
  brandName,
  "logo": logo[0].image.asset->url,
  "logoAlt": logo[0].alt,
  slug
} | order(_createdAt desc)
```

#### Key Fields Used:
- `brandName`: Brand name for alt text and accessibility
- `logo[0].image.asset->url`: Brand logo URL from Sanity CDN
- `logo[0].alt`: Alt text for logo image
- `slug.current`: For potential brand detail links
- `status`: Only show "active" collaborations

#### Implementation Notes:
- Replace static `brand_images` array with CMS data
- Maintain Marquee slider functionality
- Fallback to static images if CMS empty
- Consider brand logo size consistency (200px width container)

### 2. YouTubeIds Collection Connection (**REQUIRED IMPLEMENTATION**)

**Collection**: `youtubeId` (YouTubeIds)  
**Schema Path**: `/schemaTypes/youtubeId.ts`  
**Component**: `ProjectOne`  
**Section**: Project Section with Channel showcase grid  
**Current**: Static project images (6 items)  
**⚠️ LIMIT**: Maximum 10 channels displayed (shows only images as specified)

#### Required GROQ Query:
```groq
*[_type == "youtubeId"]{
  _id,
  channel_number,
  category,
  channel_name,
  "image": visual_identity_images[0].image.asset->url,
  "imageAlt": visual_identity_images[0].alt,
  cta_button_url,
  channel,
  date_started
} | order(channel_number asc)[0...10]
```

#### Key Fields Used:
- `channel_name`: Used as title/name for channel
- `visual_identity_images[0]`: Main channel visual for homepage display
- `cta_button_url`: YouTube channel link for click-through
- `channel_number`: For ordering/sorting
- `category`: Additional context
- `channel`: Creator name

#### Layout Mapping:
- Items 0-2: Left column (`tp-project-left-wrap`)
- Items 3-5: Right column (`tp-project-right-wrap`)
- Items 6-9: Additional items (if needed for scrolling/rotation)

#### Implementation Notes:
- **CRITICAL**: Cap at maximum 10 items to prevent layout overflow
- Maintain CSS layout classes for proper grid positioning
- Dynamic slug generation: `/channels/${channelSlug}`
- Fallback to static images if CMS empty

### 3. Exclusive Creators Collection Connection (**REQUIRED IMPLEMENTATION**)

**Collection**: `exclusiveCreator` (Exclusive Creators)  
**Schema Path**: `/schemaTypes/exclusiveCreator.ts`  
**Component**: `TeamOne` → `TeamItem`  
**Section**: Team/Creators slider section (gallery view at end of page)  
**Current**: Static team data fallback  
**⚠️ LIMIT**: Maximum 20 creators displayed (gallery view as specified)

#### Required GROQ Query:
```groq
*[_type == "exclusiveCreator" && featured == true]{
  _id,
  name,
  slug,
  headline,
  "image": heroImage[0].image.asset->url,
  "imageAlt": heroImage[0].alt,
  "bioText": bio[0].children[0].text,
  bio,
  niches,
  location,
  totalFollowers,
  availability
} | order(_createdAt desc)[0...20]
```

#### Key Fields Used:
- `name`: Creator name
- `heroImage[0]`: Main creator photo for slider
- `headline`: Subtitle/role description
- `bio`: Full bio for modal popup
- `niches`: Content specialties
- `totalFollowers`: Follower count
- `availability`: Status (open, limited, closed)

#### Implementation Notes:
- **CRITICAL**: Cap at maximum 20 items for performance
- Filter by `featured == true` for homepage display
- Swiper slider with 6 items visible on desktop
- Modal popup functionality maintained
- Transform CMS data to match existing team modal structure

### 4. Video Content Connection (Optional)

**Current**: External video URL  
**Recommendation**: Replace with Sanity file upload or video collection
**Field Type**: `file` or custom video document

---

## Text Content (Static/Hardcoded)

### Hero Section Content:
- **Subtitle**: "Hey Creators! We're"
- **Main Title**: "Content Channel Lab" 
- **Description**: "Bold digital channel builders partnering with creators and brands that make content with impact. We build formats that scale—stories that stick like culture itself."

### Brand Section Content:
- **Title**: "Brands We've Built With"

### Service Section Content:
- **Subtitle**: "We Build Bold"
- **Title**: "Content Formats"
- **Button**: "View Our Work"

#### Service Items (Static):
1. **Channel Building**: "We launch digital shows and platforms that stand out. Each channel gets its own universe with tone, audience, rhythm."
2. **Creator Support**: "In-house talent and freelance collaborators get the same strategy, editorial edge, and production craft from our team."
3. **Format Design**: "We engineer repeatable show structures that scale. Not one-off campaigns but formats people binge, share, and remember."
4. **Brand Stories**: "Partner with brands who want storytelling, not advertising. We create content with cultural relevance that actually matters."

### Project Section Content:
- **Animated Text**: "Channel Builds" (repeated in marquee)
- **CTA Button**: "See All Channels" (links to `/channels`)

### Award Section Content:
- **Title**: "Awards & Recognitions"

### Footer Content:
- **Big Title**: "Let's Build!"
- **Contact Label**: "Say hello at:"
- **Email**: "hello@vonas-media.com"
- **Location**: "Content Channel Lab, Manila, Philippines"
- **Social Links**: YouTube, Instagram, TikTok, Twitter
- **Copyright**: "Copyright © 2024 Vonas Media. All rights reserved."

---

## Technical Implementation Notes

### Animation Libraries:
- **GSAP**: Used for scroll animations, video animations, and text effects
- **ScrollTrigger**: Scroll-based animations
- **ScrollSmoother**: Smooth scrolling experience
- **SplitText**: Text animation effects

### CSS Framework:
- **Custom CSS**: Bootstrap-like grid system with custom classes
- **Magic Cursor**: Custom cursor animation (`tp-magic-cursor`)

### Performance Considerations:
- Lazy loading for images (Next.js Image component)
- GSAP animations with cleanup on unmount
- Swiper.js for performant sliders
- CDN delivery for Sanity images

### Responsive Breakpoints:
- Desktop: 1400px+ (6 team items visible)
- Tablet: 992-1200px (4 team items visible)
- Mobile: 576-768px (2-3 team items visible)
- Small Mobile: <576px (1 team item visible)

---

## Upload Priority & Action Items

### High Priority (Core Visual Elements):
1. **Hero images** (items 1-3): Essential for main visual impact
2. **Service icons** (items 11-14): Core service representation
3. **Footer elements** (items 30-32): Brand consistency

### Medium Priority (Content Enhancement):
4. **Award images** (items 23-28): Social proof and credibility
5. **Project background** (item 22): Visual depth
6. **Project text shapes** (item 21): Animation elements

### Low Priority (Fallback Elements):
7. **Brand logos** (items 4-10): Will be replaced with CMS
8. **Project images** (items 15-20): Will be replaced with CMS
9. **Team image** (item 29): Will be replaced with CMS

### CMS Integration Requirements:
1. **Connect Brand Collaboration collection** to replace static brand logos
2. **Connect YouTubeIds collection** for project showcase (max 10)  
3. **Connect Exclusive Creators collection** for team slider (max 20)
4. **Implement GROQ queries** with proper fallback handling
5. **Maintain layout consistency** with dynamic content
6. **Test responsive behavior** with varying content lengths

---

## File Structure Summary

**Total Static Images**: 32 files  
**Static Components**: 11 sections  
**CMS Collections**: 3 connections required  
**External Assets**: 1 video file  

This documentation provides complete visibility into every static asset and CMS connection needed for the homepage implementation.
