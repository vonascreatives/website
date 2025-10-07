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

// Refined categorization focusing on actual homepage usage
function categorizeForHomepageUsage(imageInfo) {
  const dir = imageInfo.directory.toLowerCase();
  const filename = imageInfo.filename.toLowerCase();
  
  // Skip team member images - they have their own CMS collection
  if (dir.includes('team') || filename.includes('team')) {
    return { category: 'skip', reason: 'Has dedicated Team Members CMS collection', usage: 'cms_collection' };
  }
  
  // Skip creator-specific images - they have their own CMS collection  
  if (filename.includes('creator') || dir.includes('creator')) {
    return { category: 'skip', reason: 'Has dedicated Creators CMS collection', usage: 'cms_collection' };
  }
  
  // Skip blog images - they have their own CMS collection
  if (dir.includes('blog') || filename.includes('blog')) {
    return { category: 'skip', reason: 'Has dedicated Blog Posts CMS collection', usage: 'cms_collection' };
  }
  
  // Skip inner pages and non-homepage content
  if (dir.includes('inner-') || dir.includes('menu') || dir.includes('shop') || 
      dir.includes('contact') || dir.includes('service') || dir.includes('project') ||
      dir.includes('portfolio') || dir.includes('faq')) {
    return { category: 'skip', reason: 'Not homepage content', usage: 'other_pages' };
  }
  
  // Homepage-specific categorization (only home-01 to home-12 directories)
  if (dir.includes('home-01') || dir.includes('home-02') || dir.includes('home-03') || 
      dir.includes('home-04') || dir.includes('home-05') || dir.includes('home-06') || 
      dir.includes('home-07') || dir.includes('home-08') || dir.includes('home-09') || 
      dir.includes('home-10') || dir.includes('home-11') || dir.includes('home-12')) {
    
    // Hero section background images (not profile pics)
    if (dir.includes('hero') && (filename.includes('bg') || filename.includes('background') || 
        filename.includes('shape') || !filename.includes('profile'))) {
      return { category: 'hero_backgrounds', usage: 'homepage_content', priority: 'high' };
    }
    
    // About section standalone images (decorative, not team photos)
    if (dir.includes('about') && !filename.includes('team') && !filename.includes('profile')) {
      return { category: 'about_decorative', usage: 'homepage_content', priority: 'high' };
    }
    
    // Service icons and graphics (not detailed service pages)
    if (dir.includes('service') && (filename.includes('icon') || filename.includes('sv-') || 
        imageInfo.extension === '.svg' || imageInfo.extension === '.png')) {
      return { category: 'service_icons', usage: 'homepage_content', priority: 'high' };
    }
    
    // Brand logos and partner showcase (for homepage trust section)
    if (dir.includes('brand') || filename.includes('brand')) {
      return { category: 'brand_showcase', usage: 'homepage_content', priority: 'medium' };
    }
    
    // Awards and achievement badges (for homepage credibility)
    if (dir.includes('award') || filename.includes('award')) {
      return { category: 'awards_badges', usage: 'homepage_content', priority: 'medium' };
    }
    
    // Gallery and showcase images (for homepage portfolio preview)
    if (dir.includes('gallery') && !dir.includes('instagram')) {
      return { category: 'gallery_preview', usage: 'homepage_content', priority: 'medium' };
    }
    
    // Instagram feed images (for social proof section)
    if (dir.includes('instagram') || filename.includes('insta')) {
      return { category: 'social_feed', usage: 'homepage_content', priority: 'low' };
    }
    
    // CTA and banner images (for homepage call-to-actions)
    if (dir.includes('cta') || filename.includes('cta')) {
      return { category: 'cta_banners', usage: 'homepage_content', priority: 'medium' };
    }
    
    // Testimonial section graphics (not the actual testimonials)
    if (dir.includes('testimonial')) {
      return { category: 'testimonial_graphics', usage: 'homepage_content', priority: 'medium' };
    }
    
    // Mission/values section images
    if (dir.includes('mission') || filename.includes('mission')) {
      return { category: 'mission_values', usage: 'homepage_content', priority: 'medium' };
    }
    
    // Homepage-specific decorative elements
    if (filename.includes('shape') || filename.includes('bg') || filename.includes('overly')) {
      return { category: 'decorative_elements', usage: 'homepage_content', priority: 'low' };
    }
    
    // Other homepage content that's not categorized above
    return { category: 'homepage_other', usage: 'homepage_content', priority: 'low' };
  }
  
  // Logo and main branding (company logo, not brand showcase)
  if (dir.includes('logo') && filename.includes('logo')) {
    return { category: 'company_branding', usage: 'static_asset', priority: 'high' };
  }
  
  // Skip everything else
  return { category: 'skip', reason: 'Not relevant for homepage CMS', usage: 'static_or_unused' };
}

async function analyzeHomepageUsage() {
  try {
    console.log('🎯 Analyzing images for ACTUAL homepage CMS usage...');
    console.log(`📂 Base path: ${BASE_PATH}\n`);
    
    const allImages = findAllImages(BASE_PATH);
    console.log(`📊 Found ${allImages.length} total images\n`);
    
    // Categorize all images with refined logic
    const categorizedImages = allImages.map(img => ({
      ...img,
      ...categorizeForHomepageUsage(img)
    }));
    
    // Filter out skipped images
    const relevantImages = categorizedImages.filter(img => img.category !== 'skip');
    const skippedImages = categorizedImages.filter(img => img.category === 'skip');
    
    console.log('🎯 REFINED HOMEPAGE CMS ANALYSIS');
    console.log('=' .repeat(50));
    console.log(`✅ Relevant for Homepage CMS: ${relevantImages.length}`);
    console.log(`⏭️  Skipped (have CMS collections or not homepage): ${skippedImages.length}`);
    
    // Group relevant images by category
    const categories = {};
    relevantImages.forEach(img => {
      if (!categories[img.category]) categories[img.category] = [];
      categories[img.category].push(img);
    });
    
    console.log('\n📋 HOMEPAGE CMS CANDIDATES:');
    console.log('=' .repeat(50));
    
    let totalHighPriority = 0;
    let totalMediumPriority = 0;
    let totalLowPriority = 0;
    
    Object.entries(categories)
      .sort(([,a], [,b]) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const avgPriorityA = a.reduce((sum, img) => sum + priorityOrder[img.priority], 0) / a.length;
        const avgPriorityB = b.reduce((sum, img) => sum + priorityOrder[img.priority], 0) / b.length;
        return avgPriorityB - avgPriorityA;
      })
      .forEach(([category, images]) => {
        const highPriority = images.filter(img => img.priority === 'high').length;
        const mediumPriority = images.filter(img => img.priority === 'medium').length;
        const lowPriority = images.filter(img => img.priority === 'low').length;
        
        totalHighPriority += highPriority;
        totalMediumPriority += mediumPriority;
        totalLowPriority += lowPriority;
        
        console.log(`\n📁 ${category.toUpperCase().replace(/_/g, ' ')} (${images.length} images)`);
        console.log(`   🔥 High: ${highPriority} | 🟡 Medium: ${mediumPriority} | 🔵 Low: ${lowPriority}`);
        
        // Show examples
        const examples = images.slice(0, 3).map(img => path.basename(img.relativePath));
        if (examples.length > 0) {
          console.log(`   📄 Examples: ${examples.join(', ')}${images.length > 3 ? '...' : ''}`);
        }
      });
    
    // Show skip reasons
    console.log('\n⏭️ SKIPPED CATEGORIES:');
    console.log('=' .repeat(30));
    const skipReasons = {};
    skippedImages.forEach(img => {
      if (!skipReasons[img.reason]) skipReasons[img.reason] = 0;
      skipReasons[img.reason]++;
    });
    
    Object.entries(skipReasons).forEach(([reason, count]) => {
      console.log(`🚫 ${reason}: ${count} images`);
    });
    
    console.log('\n🎯 RECOMMENDED FOR UPLOAD:');
    console.log('=' .repeat(30));
    console.log(`🔥 High Priority: ${totalHighPriority} images`);
    console.log(`🟡 Medium Priority: ${totalMediumPriority} images`);
    console.log(`🔵 Low Priority: ${totalLowPriority} images`);
    console.log(`📊 Total Recommended: ${relevantImages.length} images`);
    
    // Filter high and medium priority for upload
    const uploadCandidates = relevantImages.filter(img => 
      img.priority === 'high' || img.priority === 'medium'
    );
    
    console.log(`\n🚀 IMMEDIATE UPLOAD CANDIDATES: ${uploadCandidates.length} images`);
    
    // Save refined analysis
    const refinedAnalysis = {
      totalImages: allImages.length,
      relevantImages: relevantImages.length,
      skippedImages: skippedImages.length,
      categories: categories,
      skipReasons: skipReasons,
      uploadCandidates: uploadCandidates,
      summary: {
        highPriority: totalHighPriority,
        mediumPriority: totalMediumPriority,
        lowPriority: totalLowPriority,
        totalRecommended: relevantImages.length
      }
    };
    
    fs.writeFileSync('refined-homepage-analysis.json', JSON.stringify(refinedAnalysis, null, 2));
    console.log('\n💾 Refined analysis saved to: refined-homepage-analysis.json');
    
    return refinedAnalysis;
    
  } catch (error) {
    console.error('❌ Error analyzing homepage usage:', error);
  }
}

// Run the refined analysis
analyzeHomepageUsage();
