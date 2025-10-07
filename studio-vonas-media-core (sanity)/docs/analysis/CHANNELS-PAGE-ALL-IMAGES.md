# 📺 CHANNELS PAGE - ALL STATIC DECORATIVE IMAGES

## Page: `/channels` → `HomeSevenMain` → Studio Panels

---

## 🖼️ **ALL STATIC DECORATIVE IMAGES TO UPLOAD**

### **SECTION 1: Hero Panel (StudioPanelOne) - 6 Static + CMS**

**🔀 HYBRID SECTION: Static Decoration + CMS Content**

#### **STATIC DECORATIVE IMAGES:**

1. **`img-1.jpg`**
   - **Full Path**: `/assets/img/home-08/hero/img-1.jpg`
   - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-1.jpg`
   - **Usage**: Hero decorative background image
   - **Component**: StudioPanelOne
   - **Import**: `import hero_1 from "@/assets/img/home-08/hero/img-1.jpg";`

2. **`img-2.jpg`**
   - **Full Path**: `/assets/img/home-08/hero/img-2.jpg`
   - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-2.jpg`
   - **Usage**: Hero decorative background image
   - **Component**: StudioPanelOne
   - **Import**: `import hero_2 from "@/assets/img/home-08/hero/img-2.jpg";`

3. **`shape-1.png`**
   - **Full Path**: `/assets/img/home-08/hero/shape-1.png`
   - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/shape-1.png`
   - **Usage**: Shape decoration element
   - **Component**: StudioPanelOne
   - **Import**: `import shape from "@/assets/img/home-08/hero/shape-1.png";`

4. **`img-3.jpg`**
   - **Full Path**: `/assets/img/home-08/hero/img-3.jpg`
   - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-3.jpg`
   - **Usage**: Right side thumbnail decoration
   - **Component**: StudioPanelOne
   - **Import**: `import hero_thumb_1 from "@/assets/img/home-08/hero/img-3.jpg";`

5. **`img-4.jpg`**
   - **Full Path**: `/assets/img/home-08/hero/img-4.jpg`
   - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-4.jpg`
   - **Usage**: Right side thumbnail decoration
   - **Component**: StudioPanelOne
   - **Import**: `import hero_thumb_2 from "@/assets/img/home-08/hero/img-4.jpg";`

6. **`img-5.jpg`**
   - **Full Path**: `/assets/img/home-08/hero/img-5.jpg`
   - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-5.jpg`
   - **Usage**: Right side thumbnail decoration
   - **Component**: StudioPanelOne
   - **Import**: `import hero_thumb_3 from "@/assets/img/home-08/hero/img-5.jpg";`

7. **`img-6.jpg`**
   - **Full Path**: `/assets/img/home-08/hero/img-6.jpg`
   - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/img-6.jpg`
   - **Usage**: Right side thumbnail decoration
   - **Component**: StudioPanelOne
   - **Import**: `import hero_thumb_4 from "@/assets/img/home-08/hero/img-6.jpg";`

#### **🗄️ CMS DYNAMIC CONTENT:**
- **Collection**: `channel` (from Sanity)
- **Schema**: `/schemaTypes/channel.ts`
- **Query Function**: `getChannelsData()` from `/lib/sanity.ts`
- **GROQ Query**: `*[_type == "channel"]{ _id, name, slug, "image": logo.image.asset->url, "imageAlt": logo.alt, about, category, country, language, metrics, socialLinks, tags }`
- **Fields Used**:
  - `channel.name` → Main hero title (replaces "Digital Design Experience" fallback)
  - `channel.about` → Hero description text
  - `channel.logo.image.asset->url` → Channel logo URL (not used in hero section)
- **Static Fallbacks** (when no CMS data):
  - Title: "Digital Design Experience"
  - Description: None
- **Data Flow**: `channels[0]` (first channel) passed to StudioPanelOne
- **Channel Distribution**: First 5 channels distributed to 5 panels

---

### **SECTION 2: Services Panel (StudioPanelTwo) - 3 Images**

8. **`sv-icon-1.png`**
   - **Full Path**: `/assets/img/home-08/service/sv-icon-1.png`
   - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/service/sv-icon-1.png`
   - **Usage**: Service icon decoration
   - **Component**: StudioPanelTwo
   - **Import**: `import s_icon_1 from "@/assets/img/home-08/service/sv-icon-1.png";`

9. **`sv-icon-2.png`**
   - **Full Path**: `/assets/img/home-08/service/sv-icon-2.png`
   - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/service/sv-icon-2.png`
   - **Usage**: Service icon decoration
   - **Component**: StudioPanelTwo
   - **Import**: `import s_icon_2 from "@/assets/img/home-08/service/sv-icon-2.png";`

10. **`sv-icon-3.png`**
    - **Full Path**: `/assets/img/home-08/service/sv-icon-3.png`
    - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/service/sv-icon-3.png`
    - **Usage**: Service icon decoration
    - **Component**: StudioPanelTwo
    - **Import**: `import s_icon_3 from "@/assets/img/home-08/service/sv-icon-3.png";`

---

### **SECTION 3: Portfolio/Channels Panel (StudioPanelThree) - 1 Static + CMS**

**🔀 HYBRID SECTION: Static Decoration + CMS Content**

#### **STATIC DECORATIVE IMAGE:**
11. **`shape-1.png`** ⚠️ **REUSED from Section 1**
    - **Full Path**: `/assets/img/home-08/hero/shape-1.png`
    - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/hero/shape-1.png`
    - **Usage**: Portfolio section decoration (reused)
    - **Component**: StudioPanelThree
    - **Import**: `import shape from '@/assets/img/home-08/hero/shape-1.png';`

#### **🗄️ CMS DYNAMIC CONTENT:**
- **Collection**: `channel` (from Sanity)
- **Query**: `getChannelsData()` from `/lib/sanity`
- **Fields Used**:
  - `channel.name` → Portfolio item title
  - `channel.image` → Portfolio item image (replaces static port-*.jpg)
  - `channel.slug.current` → Link to `/channels/[slug]`
  - `channel._id` → Unique identifier
- **Static Fallbacks** (when no CMS data):
  - `port-1.jpg` → `/assets/img/home-12/portfolio/port-1.jpg`
  - `port-2.jpg` → `/assets/img/home-12/portfolio/port-2.jpg`  
  - `port-3.jpg` → `/assets/img/home-12/portfolio/port-3.jpg`
  - `port-4.jpg` → `/assets/img/home-12/portfolio/port-4.jpg`
  - `port-5.jpg` → `/assets/img/home-12/portfolio/port-5.jpg`
  - `port-6.jpg` → `/assets/img/home-12/portfolio/port-6.jpg`
- **Functionality**: 
  - Displays up to 6 channel items
  - Hover effects on channel images
  - Click → Navigate to `/channels/[slug]`
  - Shows channel title and number
- **Links to Single Pages**: `/channels/[slug]` (fully CMS managed)

---

### **SECTION 4: Testimonials Panel (StudioPanelFour) - 2 Images**

12. **`test-1.png`**
    - **Full Path**: `/assets/img/home-08/testimonial/test-1.png`
    - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/testimonial/test-1.png`
    - **Usage**: Testimonial decoration shape
    - **Component**: StudioPanelFour
    - **Import**: `import shape from "@/assets/img/home-08/testimonial/test-1.png";`

13. **`test-logo-1.png`**
    - **Full Path**: `/assets/img/home-08/testimonial/test-logo-1.png`
    - **Absolute Path**: `/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img/home-08/testimonial/test-logo-1.png`
    - **Usage**: Testimonial company logo
    - **Component**: StudioPanelFour
    - **Import**: `import logo from "@/assets/img/home-08/testimonial/test-logo-1.png";`

---

### **SECTION 5: CTA Panel (StudioPanelFive)**
**NO IMAGES** - Text only section

---

## 📊 **CHANNELS PAGE SUMMARY**

### **TOTAL STATIC DECORATIVE IMAGES: 12 unique images**
(13 total usages, 1 reused)

### **ALL FILE PATHS FOR UPLOAD:**
```
/assets/img/home-08/hero/img-1.jpg
/assets/img/home-08/hero/img-2.jpg
/assets/img/home-08/hero/shape-1.png (used twice)
/assets/img/home-08/hero/img-3.jpg
/assets/img/home-08/hero/img-4.jpg
/assets/img/home-08/hero/img-5.jpg
/assets/img/home-08/hero/img-6.jpg
/assets/img/home-08/service/sv-icon-1.png
/assets/img/home-08/service/sv-icon-2.png
/assets/img/home-08/service/sv-icon-3.png
/assets/img/home-08/testimonial/test-1.png
/assets/img/home-08/testimonial/test-logo-1.png
```

### **EXCLUDED (CMS Content - Already Managed):**
- Portfolio showcase images (port-1.jpg through port-6.jpg) - These are CMS placeholders
- Channel data (titles, descriptions, links) - From Sanity CMS

---

**This document lists EVERY SINGLE static decorative image that needs CMS management for the Channels page.**
