#!/usr/bin/env node

/**
 * Preview migration script - shows what would be migrated without actually writing
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
});

const MAIN_CATEGORIES = [
  'Fashion & Style',
  'Beauty & Makeup', 
  'Fitness & Health',
  'Food & Cooking',
  'Travel & Adventure',
  'Technology',
  'Gaming',
  'Lifestyle',
  'Comedy & Entertainment',
  'Art & Design',
  'Music',
  'Business & Finance'
];

function mapNicheToMainCategory(niche) {
  if (!niche) return 'Lifestyle';
  
  const nicheNormalized = niche.toLowerCase();
  
  if (nicheNormalized.includes('tech')) return 'Technology';
  if (nicheNormalized.includes('gaming')) return 'Gaming';
  if (nicheNormalized.includes('food') || nicheNormalized.includes('cooking')) return 'Food & Cooking';
  if (nicheNormalized.includes('fashion') || nicheNormalized.includes('style')) return 'Fashion & Style';
  if (nicheNormalized.includes('beauty') || nicheNormalized.includes('makeup')) return 'Beauty & Makeup';
  if (nicheNormalized.includes('fitness') || nicheNormalized.includes('health')) return 'Fitness & Health';
  if (nicheNormalized.includes('travel') || nicheNormalized.includes('adventure')) return 'Travel & Adventure';
  if (nicheNormalized.includes('comedy') || nicheNormalized.includes('entertainment')) return 'Comedy & Entertainment';
  if (nicheNormalized.includes('art') || nicheNormalized.includes('design')) return 'Art & Design';
  if (nicheNormalized.includes('music')) return 'Music';
  if (nicheNormalized.includes('business') || nicheNormalized.includes('finance')) return 'Business & Finance';
  
  return 'Lifestyle';
}

function getMainPlatformFromMetrics(metrics) {
  if (!metrics || metrics.length === 0) return 'Instagram'; // Default
  
  // Find platform with highest followers
  let maxFollowers = 0;
  let mainPlatform = 'Instagram';
  
  metrics.forEach(metric => {
    const followers = metric.followers || 0;
    if (followers > maxFollowers) {
      maxFollowers = followers;
      mainPlatform = metric.platform;
    }
  });
  
  // Normalize platform name
  const platformMap = {
    'youtube': 'YouTube',
    'instagram': 'Instagram', 
    'tiktok': 'TikTok',
    'twitter': 'Twitter'
  };
  
  return platformMap[mainPlatform.toLowerCase()] || 'Instagram';
}

function convertAvailability(availability) {
  if (!availability) return 'Available';
  
  const availabilityMap = {
    'open': 'Available',
    'limited': 'Busy', 
    'closed': 'Busy',
    'inquiry': 'Available'
  };
  
  return availabilityMap[availability.toLowerCase()] || 'Available';
}

async function previewMigration() {
  try {
    console.log('🔍 Previewing creator migration...');
    
    // Fetch all exclusiveCreator documents
    const exclusiveCreators = await client.fetch(`
      *[_type == "exclusiveCreator"]{
        _id,
        name,
        slug,
        headline,
        heroImage,
        gallery,
        bio,
        niche,
        niches,
        location,
        languages,
        metrics,
        totalFollowers,
        availability,
        featured,
        socialLinks,
        seo
      }
    `);
    
    console.log(`📊 Found ${exclusiveCreators.length} exclusiveCreator documents to migrate`);
    
    if (exclusiveCreators.length === 0) {
      console.log('⚠️  No exclusiveCreator documents found. Migration may have already been run.');
      return;
    }
    
    console.log('\n📋 Migration Preview:');
    console.log('┌────────────────────────┬─────────────────────┬─────────────┬───────────────┐');
    console.log('│ Name                   │ Old Niche           │ New Category │ Main Platform │');
    console.log('├────────────────────────┼─────────────────────┼─────────────┼───────────────┤');
    
    const migrations = [];
    
    for (const exclusive of exclusiveCreators) {
      const mainCategory = mapNicheToMainCategory(exclusive.niche);
      const mainPlatform = getMainPlatformFromMetrics(exclusive.metrics);
      const availability = convertAvailability(exclusive.availability);
      
      console.log(`│ ${(exclusive.name || '').padEnd(22, ' ')} │ ${(exclusive.niche || '').padEnd(19, ' ')} │ ${mainCategory.padEnd(11, ' ')} │ ${mainPlatform.padEnd(13, ' ')} │`);
      
      migrations.push({
        oldId: exclusive._id,
        newId: exclusive._id.replace('exclusive-creator', 'creator').replace('drafts.exclusive-creator', 'drafts.creator'),
        name: exclusive.name,
        mainCategory,
        mainPlatform,
        availability,
        hasMetrics: !!(exclusive.metrics && exclusive.metrics.length > 0),
        hasSocialLinks: !!(exclusive.socialLinks && Object.keys(exclusive.socialLinks).length > 0)
      });
    }
    
    console.log('└────────────────────────┴─────────────────────┴─────────────┴───────────────┘');
    
    console.log('\n📈 Migration Statistics:');
    console.log(`- Total documents to migrate: ${migrations.length}`);
    console.log(`- Documents with metrics: ${migrations.filter(m => m.hasMetrics).length}`);
    console.log(`- Documents with social links: ${migrations.filter(m => m.hasSocialLinks).length}`);
    
    const categoryBreakdown = {};
    migrations.forEach(m => {
      categoryBreakdown[m.mainCategory] = (categoryBreakdown[m.mainCategory] || 0) + 1;
    });
    
    console.log('\n📊 Category breakdown:');
    Object.entries(categoryBreakdown).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} creators`);
    });
    
    console.log('\n✅ Preview completed successfully!');
    console.log('\n🚀 To run the actual migration:');
    console.log('1. Set SANITY_WRITE_TOKEN in your .env.local file');
    console.log('2. Run: node migrate-creators.js');
    
  } catch (error) {
    console.error('❌ Preview failed:', error);
  }
}

// Run preview
previewMigration().then(() => {
  process.exit(0);
});
