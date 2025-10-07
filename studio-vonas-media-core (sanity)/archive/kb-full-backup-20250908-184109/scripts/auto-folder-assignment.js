const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Auto-folder assignment rules
const autoAssignmentRules = [
  // YouTube Show Rules
  {
    name: 'Off the Record Content',
    keywords: ['off the record', 'otr', 'candid interview', 'behind the scenes'],
    targetFolder: 'off-the-record-show',
    addTags: ['off-the-record', 'candid'],
    showField: 'off-the-record',
  },
  {
    name: 'Passions Content',
    keywords: ['passions', 'passion', 'personal journey', 'creator story'],
    targetFolder: 'passions-show',
    addTags: ['passions', 'creator-journey'],
    showField: 'passions',
  },
  {
    name: 'Skyline Content',
    keywords: ['skyline', 'business strategy', 'industry trends', 'high-level'],
    targetFolder: 'skyline-show',
    addTags: ['skyline', 'business-strategy'],
    showField: 'skyline',
  },
  {
    name: 'Tatak Content',
    keywords: ['tatak', 'filipino', 'philippine', 'cultural'],
    targetFolder: 'tatak-show',
    addTags: ['tatak', 'filipino-culture'],
    showField: 'tatak',
  },
  {
    name: 'At the Backdoor Content',
    keywords: ['at the backdoor', 'backdoor', 'informal', 'casual conversation'],
    targetFolder: 'at-the-backdoor-show',
    addTags: ['at-the-backdoor', 'informal'],
    showField: 'at-the-backdoor',
  },

  // Production Stage Rules
  {
    name: 'Shooting Content',
    keywords: ['shooting', 'filming', 'camera', 'recording', 'production day', 'on set'],
    productionStage: 'shooting',
    addTags: ['shooting', 'production'],
  },
  {
    name: 'Editing Content',
    keywords: ['editing', 'post-production', 'timeline', 'cuts', 'final cut', 'premiere'],
    productionStage: 'editing',
    addTags: ['editing', 'post-production'],
  },
  {
    name: 'Pre-Production Content',
    keywords: ['pre-production', 'planning', 'guest research', 'preparation', 'briefing'],
    productionStage: 'pre-production',
    addTags: ['pre-production', 'planning'],
  },

  // Department Rules
  {
    name: 'Freelancer Content',
    keywords: ['freelancer', 'contractor', 'external', 'rates', 'payment', 'collaboration'],
    targetFolder: 'freelancer-management',
    addTags: ['freelancers', 'external-collaboration'],
  },
  {
    name: 'Intern Content',
    keywords: ['intern', 'internship', 'onboarding', 'training', 'mentorship'],
    targetFolder: 'internship-program',
    addTags: ['interns', 'training'],
  },
  {
    name: 'Software Tools Content',
    keywords: ['software', 'tools', 'klap', 'opus clip', 'descript', 'automation', 'bardeen'],
    targetFolder: 'software-tools',
    addTags: ['tools', 'software'],
  },
];

// Function to analyze content and suggest folder assignment
function analyzeContentForFolderAssignment(title, content = '', tags = []) {
  const textToAnalyze = `${title} ${content} ${tags.join(' ')}`.toLowerCase();
  const suggestions = [];

  for (const rule of autoAssignmentRules) {
    const matchingKeywords = rule.keywords.filter(keyword => 
      textToAnalyze.includes(keyword.toLowerCase())
    );

    if (matchingKeywords.length > 0) {
      suggestions.push({
        ruleName: rule.name,
        matchingKeywords,
        targetFolder: rule.targetFolder,
        productionStage: rule.productionStage,
        showField: rule.showField,
        suggestedTags: rule.addTags,
        confidence: matchingKeywords.length / rule.keywords.length,
      });
    }
  }

  // Sort by confidence (highest first)
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

// Function to auto-assign folder based on content
async function autoAssignFolder(itemId, dryRun = false) {
  try {
    // Fetch the item
    const item = await client.fetch(`*[_type == "kbItem" && _id == $itemId][0]`, { itemId });
    if (!item) {
      console.log(`❌ Item not found: ${itemId}`);
      return;
    }

    // Extract content for analysis
    const contentText = item.content 
      ? item.content.map(block => 
          block.children?.map(child => child.text).join(' ') || ''
        ).join(' ')
      : '';

    // Analyze content
    const suggestions = analyzeContentForFolderAssignment(
      item.title,
      contentText,
      item.tags || []
    );

    if (suggestions.length === 0) {
      console.log(`ℹ️  No auto-assignment suggestions for: ${item.title}`);
      return;
    }

    const topSuggestion = suggestions[0];
    console.log(`\n🤖 Auto-assignment analysis for: ${item.title}`);
    console.log(`📊 Top suggestion: ${topSuggestion.ruleName} (${Math.round(topSuggestion.confidence * 100)}% confidence)`);
    console.log(`🎯 Matching keywords: ${topSuggestion.matchingKeywords.join(', ')}`);
    
    if (topSuggestion.targetFolder) {
      console.log(`📁 Suggested folder: ${topSuggestion.targetFolder}`);
    }
    if (topSuggestion.productionStage) {
      console.log(`🎬 Suggested production stage: ${topSuggestion.productionStage}`);
    }
    if (topSuggestion.showField) {
      console.log(`📺 Suggested YouTube show: ${topSuggestion.showField}`);
    }
    if (topSuggestion.suggestedTags) {
      console.log(`🏷️  Suggested tags: ${topSuggestion.suggestedTags.join(', ')}`);
    }

    if (!dryRun && topSuggestion.confidence > 0.5) {
      // Apply the suggestion
      const updates = {};
      
      if (topSuggestion.targetFolder) {
        updates.parent = { _ref: topSuggestion.targetFolder };
      }
      if (topSuggestion.productionStage) {
        updates.productionStage = topSuggestion.productionStage;
      }
      if (topSuggestion.showField) {
        updates.youtubeShow = topSuggestion.showField;
      }
      if (topSuggestion.suggestedTags) {
        const existingTags = item.tags || [];
        const newTags = [...existingTags];
        topSuggestion.suggestedTags.forEach(tag => {
          if (!newTags.includes(tag)) {
            newTags.push(tag);
          }
        });
        updates.tags = newTags;
      }

      await client.patch(itemId).set(updates).commit();
      console.log(`✅ Auto-assignment applied!`);
    } else if (dryRun) {
      console.log(`🔍 Dry run - no changes made`);
    } else {
      console.log(`⚠️  Confidence too low (${Math.round(topSuggestion.confidence * 100)}%) - no changes made`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${itemId}:`, error);
  }
}

// Function to bulk analyze all items
async function bulkAnalyzeItems(dryRun = true) {
  try {
    console.log('🔍 Analyzing all knowledge base items for auto-assignment...\n');
    
    const items = await client.fetch(`*[_type == "kbItem" && itemType == "document"] | order(title asc)`);
    
    console.log(`Found ${items.length} documents to analyze\n`);
    
    for (const item of items) {
      await autoAssignFolder(item._id, dryRun);
      console.log('---');
    }

    console.log(`\n🎉 Analysis complete!`);
    if (dryRun) {
      console.log('🔍 This was a dry run - no changes were made');
      console.log('💡 Run with dryRun=false to apply suggestions');
    }

  } catch (error) {
    console.error('❌ Error in bulk analysis:', error);
  }
}

// Test function for new content
function testAutoAssignment() {
  console.log('🧪 Testing auto-assignment rules...\n');
  
  const testCases = [
    {
      title: 'Off the Record Interview Setup',
      content: 'Guidelines for setting up candid interviews with industry insiders',
      tags: ['interview'],
    },
    {
      title: 'Passions Pre-Production Checklist',
      content: 'Complete checklist for preparing passionate creator interviews',
      tags: ['planning'],
    },
    {
      title: 'Video Shooting Equipment Guide',
      content: 'Camera setup and filming techniques for professional recording',
      tags: ['equipment'],
    },
    {
      title: 'Post-Production Editing Workflow',
      content: 'Step-by-step editing process using Final Cut Pro and timeline management',
      tags: ['workflow'],
    },
    {
      title: 'Freelancer Payment Rates',
      content: 'Updated payment rates for external contractors and freelance videographers',
      tags: ['rates'],
    },
    {
      title: 'Intern Training Manual',
      content: 'Comprehensive training guide for new internship program participants',
      tags: ['training'],
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.title}`);
    const suggestions = analyzeContentForFolderAssignment(
      testCase.title,
      testCase.content,
      testCase.tags
    );
    
    if (suggestions.length > 0) {
      const top = suggestions[0];
      console.log(`  📊 Best match: ${top.ruleName} (${Math.round(top.confidence * 100)}%)`);
      console.log(`  🎯 Keywords: ${top.matchingKeywords.join(', ')}`);
      if (top.targetFolder) console.log(`  📁 Folder: ${top.targetFolder}`);
      if (top.showField) console.log(`  📺 Show: ${top.showField}`);
    } else {
      console.log('  ❌ No matches found');
    }
    console.log('');
  });
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'test') {
  testAutoAssignment();
} else if (command === 'analyze') {
  const dryRun = !args.includes('--apply');
  bulkAnalyzeItems(dryRun);
} else if (command === 'assign') {
  const itemId = args[1];
  const dryRun = !args.includes('--apply');
  if (itemId) {
    autoAssignFolder(itemId, dryRun);
  } else {
    console.log('❌ Please provide an item ID');
  }
} else {
  console.log('🤖 Auto-Folder Assignment Tool');
  console.log('\nUsage:');
  console.log('  node auto-folder-assignment.js test              # Test assignment rules');
  console.log('  node auto-folder-assignment.js analyze           # Analyze all items (dry run)');
  console.log('  node auto-folder-assignment.js analyze --apply   # Apply suggestions');
  console.log('  node auto-folder-assignment.js assign <id>       # Analyze specific item');
  console.log('  node auto-folder-assignment.js assign <id> --apply # Apply to specific item');
}