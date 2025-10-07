#!/usr/bin/env node

/**
 * Test script to verify Sanity connection and check existing data
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
});

async function testConnection() {
  console.log('🔍 Testing Sanity connection...');
  
  try {
    // Test basic connection with a simple query
    const testQuery = `{
      "hasExclusiveCreator": count(*[_type == "exclusiveCreator"]) > 0,
      "hasCreator": count(*[_type == "creator"]) > 0,
      "hasBrandCollab": count(*[_type == "brandCollaboration"]) > 0,
      "hasCreatorReview": count(*[_type == "creatorReview"]) > 0,
      "hasShortlist": count(*[_type == "shortlist"]) > 0
    }`;
    
    const result = await client.fetch(testQuery);
    
    console.log('✅ Sanity connection successful!');
    console.log('📊 Data audit:', result);
    
    // Sample some exclusiveCreator data
    if (result.hasExclusiveCreator) {
      console.log('\n📋 Sample exclusiveCreator data:');
      const sampleCreators = await client.fetch(
        `*[_type == "exclusiveCreator"][0...3]{_id, name, niche, niches, availability}`
      );
      console.table(sampleCreators);
    }
    
    // Sample some creator data (if it exists)
    if (result.hasCreator) {
      console.log('\n📋 Sample creator data:');
      const sampleNewCreators = await client.fetch(
        `*[_type == "creator"][0...3]{_id, name, mainCategory, mainPlatform, availability}`
      );
      console.table(sampleNewCreators);
    }
    
    if (!result.hasExclusiveCreator) {
      console.log('⚠️  No exclusiveCreator data found - migration may have already been run or data needs to be created.');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Verify NEXT_PUBLIC_SANITY_PROJECT_ID is correct (currently: ' + (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a') + ')');
    console.log('2. Verify NEXT_PUBLIC_SANITY_DATASET is correct (currently: ' + (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production') + ')');
    console.log('3. Check if the Sanity project is accessible');
    console.log('4. Ensure you have read access to the dataset');
  }
}

// Run the test
testConnection().then(() => {
  console.log('\n✨ Test completed!');
}).catch(console.error);
