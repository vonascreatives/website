# Homepage Images Management System

## 🎯 Overview

This system allows you to easily replace homepage images without touching the code. All content images are now managed through Sanity CMS with proper categorization and metadata.

## ✅ What's Been Created

### 1. **Homepage Image Document Type** (`homepageImage`)
- New schema type specifically for homepage images
- Categorized by section (hero, about, team, portfolio, services, gallery, testimonials)
- Includes placement, dimensions, device visibility, and usage metadata
- Deployed to: `https://vonas-media.sanity.studio/`

### 2. **16 Homepage Images Uploaded**

#### 📁 **HERO SECTION** (2 images)
- `Homepage Hero Background` - Main background image (1920x1080, 16:9)
- `Hero Profile Picture` - Profile/portrait image (500x500, 1:1)

#### 📁 **ABOUT SECTION** (2 images)  
- `About Section Main Image` - Primary about image (600x400, 3:2)
- `About Section Secondary Image` - Supporting image (400x300, 4:3)

#### 📁 **TEAM SECTION** (3 images)
- `Team Member 1 Photo` - First team member (300x400, 3:4)
- `Team Member 2 Photo` - Second team member (300x400, 3:4)
- `Team Member 3 Photo` - Third team member (300x400, 3:4)

#### 📁 **PORTFOLIO SECTION** (3 images)
- `Portfolio Project 1` - Featured project showcase (600x400, 3:2)
- `Portfolio Project 2` - Featured project showcase (600x400, 3:2)
- `Portfolio Project 3` - Featured project showcase (600x400, 3:2)

#### 📁 **SERVICES SECTION** (3 images)
- `Service 1 Icon` - First service icon (100x100, 1:1)
- `Service 2 Icon` - Second service icon (100x100, 1:1)  
- `Service 3 Icon` - Third service icon (100x100, 1:1)

#### 📁 **GALLERY SECTION** (2 images)
- `Partner Brand 1` - Client/partner logo (200x100, 2:1)
- `Partner Brand 2` - Client/partner logo (200x100, 2:1)

#### 📁 **TESTIMONIALS SECTION** (1 image)
- `Award Badge 1` - Achievement badge (150x150, 1:1)

## 🔧 Management Tools

### **List Images**
```bash
SANITY_API_TOKEN=your_token node manage-homepage-images.js list
```

### **Generate Next.js Queries**
```bash
SANITY_API_TOKEN=your_token node manage-homepage-images.js queries
```

### **Activate/Deactivate Images**
```bash
SANITY_API_TOKEN=your_token node manage-homepage-images.js activate <imageId>
SANITY_API_TOKEN=your_token node manage-homepage-images.js deactivate <imageId>
```

## 🔗 Next.js Integration

Use these GROQ queries in your Next.js components:

```javascript
// Get hero section images
export const getHeroImages = async () => {
  return await client.fetch(`*[_type == "homepageImage" && category == "hero" && isActive == true] | order(displayOrder asc) {
    _id,
    title,
    placement,
    displayOrder,
    deviceVisibility,
    dimensions,
    "imageUrl": image[0].image.asset->url,
    "imageAlt": image[0].alt,
    "imageCaption": image[0].caption
  }`);
};

// Get all active homepage images
export const getAllActiveHomepageImages = async () => {
  return await client.fetch(`*[_type == "homepageImage" && isActive == true] | order(category asc, displayOrder asc) {
    _id,
    title,
    category,
    placement,
    displayOrder,
    deviceVisibility,
    dimensions,
    "imageUrl": image[0].image.asset->url,
    "imageAlt": image[0].alt,
    "imageCaption": image[0].caption
  }`);
};
```

## 📋 Content vs Static Assets

### ✅ **Content Images** (Now in Sanity)
- Hero backgrounds and profile images
- Team member photos
- Portfolio showcase images
- Service icons (when content-related)
- Partner/brand logos
- Award badges and testimonials

### 🔒 **Static Design Assets** (Stay in `/public`)
- Company logo and favicon
- Decorative UI graphics and icons
- Background patterns and shapes
- Navigation icons and arrows
- System fonts and animations

## 🎛️ Easy Image Replacement Process

1. **Login to Sanity Studio**: `https://vonas-media.sanity.studio/`
2. **Navigate to "Homepage Image"** in the document types
3. **Find the image** you want to replace by category/placement
4. **Upload new image** in the same aspect ratio
5. **Update alt text and caption** as needed
6. **Save** - changes are live immediately!

## 📱 Device-Specific Images

Each image has device visibility settings:
- **Desktop** - Full resolution images
- **Tablet** - Medium resolution optimized
- **Mobile** - Smaller, optimized images

You can control which devices show specific images through the Sanity interface.

## 🔄 Future Additions

To add more homepage images:

1. Use the upload script pattern in `upload-homepage-images.js`
2. Define new image configurations with proper categorization
3. Run the upload script to add to Sanity
4. Update your Next.js components to query the new images

## 🎯 Benefits

- ✅ **No code changes** required for image updates
- ✅ **SEO-friendly** with proper alt text and captions  
- ✅ **Responsive design** with device-specific visibility
- ✅ **Version control** with Sanity's revision history
- ✅ **Team-friendly** content management interface
- ✅ **CDN optimized** delivery through Sanity
