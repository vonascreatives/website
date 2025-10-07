const fs = require('fs');
const path = require('path');

// Base path to the Next.js homepage project
const BASE_PATH = '/Users/theova/Documents/code/Vonas Media Test Page/new_vonas_media_hp/public/assets/img';

// Function to recursively find all images
function findAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findAllImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.svg', '.webp', '.avif'].includes(ext)) {
        const relativePath = path.relative(BASE_PATH, filePath);
        fileList.push({
          fullPath: filePath,
          relativePath: '/' + relativePath.replace(/\\\\/g, '/'),
          filename: file,
          directory: path.dirname(relativePath),
          extension: ext,
          size: stat.size
        });
      }
    }
  });
  
  return fileList;
}

// Categorize images based on directory structure and naming patterns
function categorizeImage(imageInfo) {
  const dir = imageInfo.directory.toLowerCase();
  const filename = imageInfo.filename.toLowerCase();
  
  // Homepage-specific categorization
  if (dir.includes('home-01') || dir.includes('home-02') || dir.includes('home-03') || 
      dir.includes('home-04') || dir.includes('home-05') || dir.includes('home-06') || 
      dir.includes('home-07') || dir.includes('home-08') || dir.includes('home-09') || 
      dir.includes('home-10') || dir.includes('home-11') || dir.includes('home-12')) {
    
    // Hero section images
    if (dir.includes('hero') || filename.includes('hero')) {
      return { category: 'hero', usage: 'content', priority: 'high' };
    }
    
    // About section images
    if (dir.includes('about') || filename.includes('about') || filename.includes('ab-')) {
      return { category: 'about', usage: 'content', priority: 'high' };
    }
    
    // Team section images
    if (dir.includes('team') || filename.includes('team')) {
      return { category: 'team', usage: 'content', priority: 'high' };
    }
    
    // Portfolio/Project images
    if (dir.includes('project') || dir.includes('portfolio') || dir.includes('port') || 
        filename.includes('project') || filename.includes('port')) {
      return { category: 'portfolio', usage: 'content', priority: 'high' };
    }
    
    // Service images
    if (dir.includes('service') || filename.includes('service') || filename.includes('sv-')) {
      return { category: 'services', usage: 'content', priority: 'high' };
    }
    
    // Brand/Gallery images
    if (dir.includes('brand') || filename.includes('brand')) {
      return { category: 'gallery', usage: 'content', priority: 'medium' };
    }
    
    // Award/Testimonial images
    if (dir.includes('award') || filename.includes('award') || dir.includes('testimonial')) {
      return { category: 'testimonials', usage: 'content', priority: 'medium' };
    }
    
    // Gallery/Showcase images
    if (dir.includes('gallery') || dir.includes('showcase') || filename.includes('gal-')) {
      return { category: 'gallery', usage: 'content', priority: 'medium' };
    }
    
    // Instagram/Social images
    if (dir.includes('instagram') || filename.includes('insta')) {
      return { category: 'gallery', usage: 'content', priority: 'low' };
    }
    
    // Blog images (for homepage blog section)
    if (dir.includes('blog') && (dir.includes('home-') || filename.includes('blog'))) {
      return { category: 'blog', usage: 'content', priority: 'medium' };
    }
    
    // CTA/Banner images
    if (dir.includes('cta') || filename.includes('cta') || dir.includes('banner')) {
      return { category: 'banner', usage: 'content', priority: 'medium' };
    }
    
    // Background images
    if (filename.includes('bg') || filename.includes('background')) {
      return { category: 'background', usage: 'content', priority: 'medium' };
    }
    
    // Default homepage content
    return { category: 'other', usage: 'content', priority: 'low' };
  }
  
  // Logo and branding
  if (dir.includes('logo') || filename.includes('logo')) {
    return { category: 'branding', usage: 'static', priority: 'high' };
  }
  
  // SVG icons (mostly static)
  if (imageInfo.extension === '.svg' && dir.includes('svg')) {
    return { category: 'icons', usage: 'static', priority: 'low' };
  }
  
  // Other categorizations
  if (dir.includes('inner-') || dir.includes('menu') || dir.includes('inner')) {
    return { category: 'internal', usage: 'static', priority: 'low' };
  }
  
  return { category: 'uncategorized', usage: 'unknown', priority: 'low' };
}

async function analyzeAllImages() {
  try {
    console.log('🔍 Scanning all images in the project...');
    console.log(`📂 Base path: ${BASE_PATH}\n`);
    
    const allImages = findAllImages(BASE_PATH);
    console.log(`📊 Found ${allImages.length} total images\n`);
    
    // Categorize all images
    const categorizedImages = allImages.map(img => ({
      ...img,
      ...categorizeImage(img)
    }));
    
    // Group by category
    const categories = {};
    categorizedImages.forEach(img => {
      if (!categories[img.category]) categories[img.category] = [];
      categories[img.category].push(img);
    });
    
    console.log('📋 COMPREHENSIVE IMAGE ANALYSIS');
    console.log('=' .repeat(50));
    
    // Sort categories by content priority
    const sortedCategories = Object.entries(categories).sort(([,a], [,b]) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const avgPriorityA = a.reduce((sum, img) => sum + priorityOrder[img.priority], 0) / a.length;
      const avgPriorityB = b.reduce((sum, img) => sum + priorityOrder[img.priority], 0) / b.length;
      return avgPriorityB - avgPriorityA;
    });
    
    let totalContentImages = 0;
    let totalStaticImages = 0;
    
    sortedCategories.forEach(([category, images]) => {
      const contentImages = images.filter(img => img.usage === 'content');
      const staticImages = images.filter(img => img.usage === 'static');
      
      totalContentImages += contentImages.length;
      totalStaticImages += staticImages.length;
      
      console.log(`\n📁 ${category.toUpperCase()} (${images.length} images)`);
      console.log(`   📝 Content: ${contentImages.length} | 🔒 Static: ${staticImages.length}`);
      
      // Show priority breakdown
      const highPriority = images.filter(img => img.priority === 'high').length;
      const mediumPriority = images.filter(img => img.priority === 'medium').length;
      const lowPriority = images.filter(img => img.priority === 'low').length;
      
      console.log(`   🔥 High: ${highPriority} | 🟡 Medium: ${mediumPriority} | 🔵 Low: ${lowPriority}`);
      
      // Show some example files
      const examples = images.slice(0, 3).map(img => path.basename(img.relativePath));
      if (examples.length > 0) {
        console.log(`   📄 Examples: ${examples.join(', ')}${images.length > 3 ? '...' : ''}`);
      }
    });
    
    console.log('\n🎯 SUMMARY FOR HOMEPAGE CMS');
    console.log('=' .repeat(50));
    console.log(`📝 Content Images (should be in Sanity): ${totalContentImages}`);
    console.log(`🔒 Static Images (stay in /public): ${totalStaticImages}`);
    console.log(`📊 Total Images: ${allImages.length}`);
    
    // Filter high-priority content images for upload
    const highPriorityContent = categorizedImages.filter(img => 
      img.usage === 'content' && (img.priority === 'high' || img.priority === 'medium')
    );
    
    console.log(`\n🚀 RECOMMENDED FOR SANITY UPLOAD: ${highPriorityContent.length} images`);
    
    // Group recommended images by category
    const recommendedCategories = {};
    highPriorityContent.forEach(img => {
      if (!recommendedCategories[img.category]) recommendedCategories[img.category] = [];
      recommendedCategories[img.category].push(img);
    });
    
    console.log('\n📋 UPLOAD CANDIDATES BY CATEGORY:');
    Object.entries(recommendedCategories).forEach(([category, images]) => {
      console.log(`   📁 ${category}: ${images.length} images`);
    });
    
    // Save detailed analysis to file
    const analysisData = {
      totalImages: allImages.length,
      categories: categories,
      recommendedForUpload: highPriorityContent,
      summary: {
        contentImages: totalContentImages,
        staticImages: totalStaticImages,
        highPriority: categorizedImages.filter(img => img.priority === 'high').length,
        mediumPriority: categorizedImages.filter(img => img.priority === 'medium').length,
        lowPriority: categorizedImages.filter(img => img.priority === 'low').length
      }
    };
    
    fs.writeFileSync('image-analysis.json', JSON.stringify(analysisData, null, 2));
    console.log('\n💾 Detailed analysis saved to: image-analysis.json');
    
    return analysisData;
    
  } catch (error) {
    console.error('❌ Error analyzing images:', error);
  }
}

// Run the analysis
analyzeAllImages();
