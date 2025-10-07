#!/usr/bin/env node

/**
 * Migration script to convert exclusiveCreator documents to creator documents
 * Following the requirements in the brief
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
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

function normalizeMetrics(metrics) {
  if (!metrics || metrics.length === 0) return [];
  
  return metrics.map(metric => ({
    platform: getMainPlatformFromMetrics([metric]),
    handle: metric.handle || '',
    profileUrl: metric.profileUrl || '',
    followers: metric.followers || 0
  }));
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

async function migrateCreators() {
  try {
    console.log('🚀 Starting creator migration...');
    
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
    
    const migrations = [];
    
    for (const exclusive of exclusiveCreators) {
      console.log(`🔄 Processing ${exclusive.name}...`);
      
      const mainCategory = mapNicheToMainCategory(exclusive.niche);
      const normalizedMetrics = normalizeMetrics(exclusive.metrics);
      const mainPlatform = getMainPlatformFromMetrics(exclusive.metrics);
      
      // Convert heroImage array to single imageWithAlt
      let heroImage = null;
      if (exclusive.heroImage && exclusive.heroImage.length > 0) {
        heroImage = exclusive.heroImage[0]; // Take first image
      }
      
      const creatorDoc = {
        _type: 'creator',
        name: exclusive.name,
        slug: exclusive.slug,
        featured: exclusive.featured || false,
        mainCategory,
        niches: exclusive.niches || (exclusive.niche ? [exclusive.niche] : []),
        mainPlatform,
        metrics: normalizedMetrics,
        totalFollowers: exclusive.totalFollowers || (normalizedMetrics.length > 0 ? normalizedMetrics.reduce((sum, m) => sum + (m.followers || 0), 0) : 0),
        availability: convertAvailability(exclusive.availability),
        languages: exclusive.languages || [],
        headline: exclusive.headline || '',
        heroImage,
        gallery: exclusive.gallery || [],
        bio: exclusive.bio,
        selectedWork: [], // Will need to be filled manually
        socialLinks: exclusive.socialLinks || {
          youtube: null,
          instagram: null,
          tiktok: null,
          twitter: null
        },
        ratingAverage: null,
        ratingCount: null,
        seo: exclusive.seo || null
      };
      
      migrations.push({
        create: {
          _id: exclusive._id.replace('exclusive-creator', 'creator').replace('drafts.exclusive-creator', 'drafts.creator'),
          ...creatorDoc
        }
      });
    }
    
    console.log(`📝 Creating ${migrations.length} creator documents...`);
    
    // Execute migration in batches
    const batchSize = 10;
    for (let i = 0; i < migrations.length; i += batchSize) {
      const batch = migrations.slice(i, i + batchSize);
      const transaction = client.transaction();
      
      batch.forEach(migration => {
        transaction.create(migration.create);
      });
      
      await transaction.commit();
      console.log(`✅ Migrated batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(migrations.length / batchSize)}`);
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log(`
    📋 Migration Summary:
    - ${migrations.length} creators migrated
    - All documents converted from exclusiveCreator to creator type
    - Main categories mapped based on niche data
    - Metrics normalized to new format
    - Availability statuses converted
    
    ⚠️  Next Steps:
    1. Verify the migrated data in Sanity Studio
    2. Manually add selectedWork data for creators
    3. Consider archiving or deleting old exclusiveCreator documents
    4. Update any remaining references in your codebase
    `);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateCreators().then(() => {
    process.exit(0);
  });
}

module.exports = { migrateCreators };
