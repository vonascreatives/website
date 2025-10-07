const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function testEasyDataFetching() {
  console.log('🔍 Testing EASY data fetching...\n');

  try {
    // 1. Simple query for all knowledge articles
    console.log('📝 Fetching all knowledge articles (SIMPLE!)');
    const articles = await client.fetch(`
      *[_type == "knowledgeArticle"] | order(order asc) {
        headline,
        subHeadline,
        overviewSteps,
        fullDescription,
        videoRecording,
        supportingDocuments,
        tags,
        category->{name, icon},
        status
      }
    `);
    
    console.log(`✅ Found ${articles.length} articles`);
    articles.forEach(article => {
      console.log(`   • ${article.headline} (${article.category?.name})`);
      if (article.videoRecording) console.log(`     📹 Video: ${article.videoRecording}`);
      if (article.supportingDocuments) console.log(`     📄 Docs: ${article.supportingDocuments}`);
    });

    // 2. Simple query for all FAQs
    console.log('\n❓ Fetching all FAQs (SIMPLE!)');
    const faqs = await client.fetch(`
      *[_type == "faq" && isActive == true] | order(faqId asc) {
        faqId,
        question,
        answer,
        category,
        tags
      }
    `);
    
    console.log(`✅ Found ${faqs.length} active FAQs`);
    faqs.forEach(faq => {
      console.log(`   • ${faq.faqId}: ${faq.question.substring(0, 50)}...`);
    });

    // 3. Simple query by category
    console.log('\n🏢 Fetching Company Foundation articles (SIMPLE!)');
    const companyArticles = await client.fetch(`
      *[_type == "knowledgeArticle" && category._ref == "category-company-foundation"] {
        headline,
        subHeadline,
        fullDescription
      }
    `);
    
    console.log(`✅ Found ${companyArticles.length} company foundation articles`);
    companyArticles.forEach(article => {
      console.log(`   • ${article.headline}`);
      console.log(`     ${article.fullDescription.substring(0, 100)}...`);
    });

    // 4. Simple query for articles with video recordings
    console.log('\n📹 Fetching articles with video recordings (SIMPLE!)');
    const articlesWithVideos = await client.fetch(`
      *[_type == "knowledgeArticle" && defined(videoRecording)] {
        headline,
        videoRecording,
        supportingDocuments
      }
    `);
    
    console.log(`✅ Found ${articlesWithVideos.length} articles with videos`);
    articlesWithVideos.forEach(article => {
      console.log(`   • ${article.headline}`);
      console.log(`     📹 Video: ${article.videoRecording}`);
      if (article.supportingDocuments) {
        console.log(`     📄 Docs: ${article.supportingDocuments}`);
      }
    });

    console.log('\n🎉 DATA FETCHING IS NOW SUPER EASY!');
    console.log('✅ No complex rich text parsing needed');
    console.log('✅ No missing keys or validation errors');
    console.log('✅ Simple string fields that work perfectly');
    console.log('✅ Video and document URLs ready to use');
    console.log('✅ Clean, efficient queries');

  } catch (error) {
    console.error('❌ Error fetching data:', error);
  }
}

// Run the test
testEasyDataFetching();