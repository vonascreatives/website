#!/usr/bin/env node

const { createClient } = require('@sanity/client');

// Read configuration
const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false
});

async function checkMigrationReadiness() {
  console.log('🔍 Checking Migration Readiness...');
  console.log('=====================================\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`  PROJECT_ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'} ✅`);
  console.log(`  DATASET: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'} ✅`);
  console.log(`  API_VERSION: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'} ✅`);
  
  const writeToken = process.env.SANITY_WRITE_TOKEN;
  if (!writeToken || writeToken === 'your-write-token-here') {
    console.log(`  WRITE_TOKEN: ❌ Missing or placeholder`);
    console.log('\n🚨 Write token required! Run ./setup-token.sh for instructions.\n');
  } else {
    console.log(`  WRITE_TOKEN: ✅ Configured`);
  }

  try {
    // Check connection to Sanity
    console.log('\n🌐 Sanity Connection:');
    const exclusiveCreators = await readClient.fetch(
      `*[_type == "exclusiveCreator"] | order(_createdAt desc) [0...5] {
        _id,
        name,
        niche,
        location,
        _createdAt
      }`
    );

    if (exclusiveCreators.length > 0) {
      console.log(`  Found ${exclusiveCreators.length} exclusiveCreator documents ✅`);
      console.log('  Sample data:');
      exclusiveCreators.forEach((creator, index) => {
        console.log(`    ${index + 1}. ${creator.name} (${creator.niche}) - ${creator.location}`);
      });
    } else {
      console.log('  No exclusiveCreator documents found ⚠️');
    }

    // Check if creator schema exists
    console.log('\n📊 Schema Check:');
    const existingCreators = await readClient.fetch(
      `*[_type == "creator"] | order(_createdAt desc) [0...3] {
        _id,
        name,
        mainCategory
      }`
    );

    if (existingCreators.length > 0) {
      console.log(`  Found ${existingCreators.length} existing creator documents`);
      console.log('  ⚠️  Migration may overwrite existing data');
    } else {
      console.log('  No existing creator documents ✅');
    }

  } catch (error) {
    console.log(`  Connection failed: ${error.message} ❌`);
    return false;
  }

  console.log('\n📝 Migration Scripts:');
  const fs = require('fs');
  const scriptsExist = {
    preview: fs.existsSync('./test-migration-preview.js'),
    migration: fs.existsSync('./migrate-creators.js')
  };

  console.log(`  Preview script: ${scriptsExist.preview ? '✅' : '❌'}`);
  console.log(`  Migration script: ${scriptsExist.migration ? '✅' : '❌'}`);

  // Final readiness check
  console.log('\n🎯 Migration Readiness Summary:');
  const ready = writeToken && 
                writeToken !== 'your-write-token-here' && 
                scriptsExist.preview && 
                scriptsExist.migration;

  if (ready) {
    console.log('  Status: ✅ Ready to migrate!');
    console.log('\n🚀 Next steps:');
    console.log('  1. Preview: node test-migration-preview.js');
    console.log('  2. Migrate: node migrate-creators.js');
  } else {
    console.log('  Status: ⏳ Setup required');
    console.log('\n📋 Required actions:');
    if (!writeToken || writeToken === 'your-write-token-here') {
      console.log('  - Generate and configure Sanity write token');
    }
    if (!scriptsExist.preview || !scriptsExist.migration) {
      console.log('  - Ensure migration scripts are in place');
    }
  }

  return ready;
}

checkMigrationReadiness().catch(console.error);
