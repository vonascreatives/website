# 📋 About Page (/about) - Complete Image Analysis

## 🎯 About Page Component Structure

The About page (`/about`) uses these components:

1. **AboutUsHero** - Hero section with background image
2. **AboutUsArea** - Main content with 4 images
3. **TeamOne** - Team section (uses Sanity CMS data - already managed)
4. **FunFactOne** - Statistics section (no images, just counters) 
5. **BrandFive** - Brand section with logos and background
6. **AwardOne** - Awards section (reused from homepage - already managed)

---

## 📸 **EXACT Images Used on About Page**

### 🏆 **Hero Section** (1 image)
**Component**: `AboutUsHero`  
**Location**: `/assets/img/inner-about/hero/`

1. **`hero-1.jpg`** - Main hero background image
   - Usage: Background image for hero section
   - Applied via: `style={{backgroundImage: "url(/assets/img/inner-about/hero/hero-1.jpg)"}}`

---

### 🖼️ **About Area Section** (4 images)
**Component**: `AboutUsArea`  
**Location**: `/assets/img/inner-about/about/`

2. **`shape-1.png`** - Decorative shape element
   - Usage: Shape decoration in content area
   - Import: `import shape from "@/assets/img/inner-about/about/shape-1.png";`

3. **`about-1.jpg`** - Left side about image 
   - Usage: Main left about image
   - Import: `import ab_1 from "@/assets/img/inner-about/about/about-1.jpg";`

4. **`about-3.jpg`** - Right side inner about image
   - Usage: Inner image on right side (layered)
   - Import: `import ab_2 from "@/assets/img/inner-about/about/about-3.jpg";`

5. **`about-2.jpg`** - Right side outer about image
   - Usage: Outer image on right side (layered)
   - Import: `import ab_3 from "@/assets/img/inner-about/about/about-2.jpg";`

---

### 🏢 **Brand Section** (6 brand logos + 1 background)
**Component**: `BrandFive`  
**Location**: `/assets/img/inner-about/brand/`

**Brand Logos:**
6. **`brand-1.png`** - Client brand logo
7. **`brand-2.png`** - Client brand logo  
8. **`brand-3.png`** - Client brand logo
9. **`brand-4.png`** - Client brand logo
10. **`brand-5.png`** - Client brand logo
11. **`brand-2.png`** - Client brand logo (duplicate of brand-2)

**Background:**
12. **`brand-bg-shape.png`** - Brand section background pattern
    - Usage: Background image for brand section
    - Applied via: `style={{backgroundImage: "url(/assets/img/inner-about/brand/brand-bg-shape.png)"}}`

---

## 📊 **Summary - About Page Images**

### **Total: 12 unique images**
- **Hero**: 1 image
- **About area**: 4 images  
- **Brand section**: 6 logos + 1 background = 7 images

### **File Paths:**
```
/assets/img/inner-about/hero/hero-1.jpg
/assets/img/inner-about/about/shape-1.png
/assets/img/inner-about/about/about-1.jpg
/assets/img/inner-about/about/about-2.jpg
/assets/img/inner-about/about/about-3.jpg
/assets/img/inner-about/brand/brand-1.png
/assets/img/inner-about/brand/brand-2.png
/assets/img/inner-about/brand/brand-3.png
/assets/img/inner-about/brand/brand-4.png
/assets/img/inner-about/brand/brand-5.png
/assets/img/inner-about/brand/brand-bg-shape.png
```

---

## 🗂️ **Sanity CMS Categorization**

For Sanity organization, these images should be categorized as:

- **Hero section**: `hero` category
- **About area images**: `about` category  
- **Brand logos**: `gallery` category (or create `brand` category)
- **Decorative elements**: `other` category

---

## ✅ **Ready for Upload**

This analysis provides the complete and accurate list of images actually used on the About page. All images are properly traced from the component code to ensure 100% accuracy.

**Next Step**: Create upload script for these 12 About page images.
