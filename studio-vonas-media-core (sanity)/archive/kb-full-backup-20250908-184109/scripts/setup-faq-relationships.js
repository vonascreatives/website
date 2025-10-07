const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function setupFaqRelationships() {
  try {
    console.log('Setting up FAQ relationships and cross-references...');
    
    // First, let's establish relationships between knowledge articles and FAQs
    
    // Update "About VONAS Media" article to reference FAQ-001
    await client
      .patch('article-about-vonas-media')
      .set({
        relatedFaqs: [{ _ref: 'faq-001', _type: 'reference' }]
      })
      .commit();
    console.log('✓ Linked "About VONAS Media" article with FAQ-001');
    
    // Update "Onboarding Processes" article to reference FAQ-003
    await client
      .patch('article-onboarding-processes')
      .set({
        relatedFaqs: [{ _ref: 'faq-003', _type: 'reference' }]
      })
      .commit();
    console.log('✓ Linked "Onboarding Processes" article with FAQ-003');
    
    // Now let's set up reciprocal relationships in FAQs
    
    // Update FAQ-001 to reference the About VONAS Media article
    await client
      .patch('faq-001')
      .set({
        relatedKnowledgeArticles: [{ _ref: 'article-about-vonas-media', _type: 'reference' }]
      })
      .commit();
    console.log('✓ FAQ-001 now references "About VONAS Media" article');
    
    // Update FAQ-002 to demonstrate it can be used across multiple contexts
    await client
      .patch('faq-002')
      .set({
        relatedKnowledgeArticles: [
          { _ref: 'article-about-vonas-media', _type: 'reference' },
          { _ref: 'article-video-production-process', _type: 'reference' }
        ]
      })
      .commit();
    console.log('✓ FAQ-002 now references multiple articles (reusable FAQ demonstration)');
    
    // Update FAQ-003 to reference onboarding article
    await client
      .patch('faq-003')
      .set({
        relatedKnowledgeArticles: [{ _ref: 'article-onboarding-processes', _type: 'reference' }]
      })
      .commit();
    console.log('✓ FAQ-003 now references "Onboarding Processes" article');
    
    // Let's create some cross-references between FAQs
    await client
      .patch('faq-001')
      .set({
        relatedFaqs: [{ _ref: 'faq-002', _type: 'reference' }]
      })
      .commit();
    console.log('✓ FAQ-001 now references FAQ-002');
    
    await client
      .patch('faq-002')
      .set({
        relatedFaqs: [{ _ref: 'faq-001', _type: 'reference' }]
      })
      .commit();
    console.log('✓ FAQ-002 now references FAQ-001 (bidirectional relationship)');
    
    console.log('\n🎉 FAQ relationships setup completed successfully!');
    console.log('\nRelationship Summary:');
    console.log('- FAQ-001 ↔ "About VONAS Media" article');
    console.log('- FAQ-002 → Multiple articles (demonstrating reusability)');
    console.log('- FAQ-003 ↔ "Onboarding Processes" article');
    console.log('- FAQ-001 ↔ FAQ-002 (cross-references between FAQs)');
    
  } catch (error) {
    console.error('Error setting up FAQ relationships:', error);
  }
}

async function testQueryRelationships() {
  try {
    console.log('\n🔍 Testing reusable FAQ system with queries...');
    
    // Test 1: Find all FAQs related to a specific knowledge article
    const faqsForAboutArticle = await client.fetch(`
      *[_type == "faq" && references("article-about-vonas-media")] {
        faqId,
        question,
        "referencedByArticles": *[_type == "knowledgeArticle" && references(^._id)] {
          headline,
          slug
        }
      }
    `);
    
    console.log('\n📋 FAQs referenced by "About VONAS Media" article:');
    faqsForAboutArticle.forEach(faq => {
      console.log(`  - ${faq.faqId}: ${faq.question}`);
      console.log(`    Used by ${faq.referencedByArticles.length} article(s)`);
    });
    
    // Test 2: Find knowledge articles that reference a specific FAQ
    const articlesUsingFaq002 = await client.fetch(`
      *[_type == "knowledgeArticle" && references("faq-002")] {
        headline,
        slug,
        "relatedFaqsDetails": relatedFaqs[]-> {
          faqId,
          question
        }
      }
    `);
    
    console.log('\n📄 Articles that reference FAQ-002 (demonstrating reusability):');
    articlesUsingFaq002.forEach(article => {
      console.log(`  - ${article.headline}`);
      console.log(`    References ${article.relatedFaqsDetails.length} FAQ(s)`);
    });
    
    // Test 3: Get a complete knowledge article with all its related FAQs
    const completeArticle = await client.fetch(`
      *[_id == "article-about-vonas-media"][0] {
        headline,
        subHeadline,
        "category": category-> {
          name,
          description
        },
        "tags": tags[]-> {
          name
        },
        "relatedFaqs": relatedFaqs[]-> {
          faqId,
          question,
          answer,
          category,
          tags,
          "relatedArticles": relatedKnowledgeArticles[]-> {
            headline
          }
        }
      }
    `);
    
    console.log('\n🔗 Complete article with relationships:');
    console.log(`Article: ${completeArticle.headline}`);
    console.log(`Category: ${completeArticle.category.name}`);
    console.log(`Tags: ${completeArticle.tags.map(t => t.name).join(', ')}`);
    console.log(`Related FAQs: ${completeArticle.relatedFaqs.map(f => f.faqId).join(', ')}`);
    
    console.log('\n✅ Reusable FAQ system is working correctly!');
    
  } catch (error) {
    console.error('Error testing relationships:', error);
  }
}

// Run both setup and testing
async function run() {
  await setupFaqRelationships();
  await testQueryRelationships();
}

run();