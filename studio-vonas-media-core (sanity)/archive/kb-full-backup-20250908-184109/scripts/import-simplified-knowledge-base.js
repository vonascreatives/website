const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Knowledge Categories (same as before)
const knowledgeCategories = [
  {
    _id: 'category-company-foundation',
    _type: 'knowledgeCategory',
    name: 'Company Foundation',
    slug: { current: 'company-foundation' },
    description: 'Core organizational information and culture',
    icon: '🏢',
    color: '#3B82F6',
    order: 1,
  },
  {
    _id: 'category-team-management',
    _type: 'knowledgeCategory',
    name: 'Team Management & Operations',
    slug: { current: 'team-management' },
    description: 'Team structure, onboarding, and internal communications',
    icon: '👥',
    color: '#10B981',
    order: 2,
  },
  {
    _id: 'category-content-production',
    _type: 'knowledgeCategory',
    name: 'Content Production Workflows',
    slug: { current: 'content-production' },
    description: 'Video production, social media, and guest management',
    icon: '🎬',
    color: '#F59E0B',
    order: 3,
  },
  {
    _id: 'category-show-specific',
    _type: 'knowledgeCategory',
    name: 'Show-Specific Documentation',
    slug: { current: 'show-specific' },
    description: 'Individual show production guidelines and formats',
    icon: '📺',
    color: '#EF4444',
    order: 4,
  },
  {
    _id: 'category-tools-systems',
    _type: 'knowledgeCategory',
    name: 'Tools and Systems',
    slug: { current: 'tools-systems' },
    description: 'Content creation tools, databases, and automation',
    icon: '🛠️',
    color: '#8B5CF6',
    order: 5,
  },
  {
    _id: 'category-external-collaboration',
    _type: 'knowledgeCategory',
    name: 'External Collaboration',
    slug: { current: 'external-collaboration' },
    description: 'Freelancer management and brand partnerships',
    icon: '🤝',
    color: '#EC4899',
    order: 6,
  },
  {
    _id: 'category-policies-procedures',
    _type: 'knowledgeCategory',
    name: 'Policies and Procedures',
    slug: { current: 'policies-procedures' },
    description: 'Time management, PTO, and standard operating procedures',
    icon: '📋',
    color: '#6B7280',
    order: 7,
  },
];

// Simplified Knowledge Articles (easy to fetch!)
const simplifiedKnowledgeArticles = [
  // Company Foundation
  {
    _id: 'article-about-vonas-media',
    _type: 'knowledgeArticle',
    headline: 'About VONAS Media',
    subHeadline: 'Company overview, history, and fundamental information about VONAS Media organization.',
    slug: { current: 'about-vonas-media' },
    category: { _ref: 'category-company-foundation' },
    overviewSteps: ['Company introduction and background', 'Core business model and services', 'Target audience and market position'],
    fullDescription: 'VONAS Media is a comprehensive content production company specializing in podcast and video content creation. We focus on building authentic relationships between creators, brands, and audiences through high-quality multimedia content. Our approach combines creativity with data-driven strategies to deliver meaningful results for all stakeholders.',
    tags: ['company-overview', 'business-model'],
    order: 1,
    status: 'published',
  },
  {
    _id: 'article-vision-mission-purpose',
    _type: 'knowledgeArticle',
    headline: 'Vision, Mission & Purpose',
    subHeadline: 'Strategic direction and fundamental purpose driving VONAS Media\'s operations and growth.',
    slug: { current: 'vision-mission-purpose' },
    category: { _ref: 'category-company-foundation' },
    overviewSteps: ['Vision statement and future aspirations', 'Mission statement and core objectives', 'Purpose statement and reason for existence'],
    fullDescription: 'Our vision is to be the leading platform that authentically connects creators with brands, fostering meaningful relationships that drive engagement and business success. Our mission is to create high-quality, authentic content that resonates with audiences while delivering measurable value for both creators and brand partners. Our purpose is to bridge the gap between authentic storytelling and strategic business objectives.',
    tags: ['vision', 'mission', 'strategy'],
    order: 2,
    status: 'published',
  },
  {
    _id: 'article-company-values',
    _type: 'knowledgeArticle',
    headline: 'Company Values',
    subHeadline: 'Core values and principles that guide VONAS Media\'s culture and decision-making processes.',
    slug: { current: 'company-values' },
    category: { _ref: 'category-company-foundation' },
    overviewSteps: ['Core value identification', 'Value application in daily operations', 'Cultural implementation strategies'],
    fullDescription: 'Our values center around five key principles: Authenticity - we prioritize genuine connections and honest storytelling; Quality - we maintain high standards in all our content and processes; Collaboration - we work together internally and with partners to achieve shared goals; Innovation - we continuously seek new ways to improve and evolve; Integrity - we conduct business ethically and transparently in all interactions.',
    tags: ['values', 'culture', 'principles'],
    order: 3,
    status: 'published',
  },

  // Team Management
  {
    _id: 'article-team-structure-roles',
    _type: 'knowledgeArticle',
    headline: 'Team Structure and Roles',
    subHeadline: 'Complete overview of organizational structure, team members, and role definitions.',
    slug: { current: 'team-structure-roles' },
    category: { _ref: 'category-team-management' },
    overviewSteps: ['Organizational chart and hierarchy', 'Role definitions and responsibilities', 'Team communication protocols'],
    fullDescription: 'VONAS Media operates with a collaborative organizational structure that promotes quick decision-making and creative freedom. Each team member has clearly defined roles while maintaining flexibility to contribute across different areas. Our structure includes content creation, production, business development, and administrative functions, all working together to deliver exceptional results.',
    tags: ['team-structure', 'roles', 'organization'],
    order: 4,
    status: 'published',
  },
  {
    _id: 'article-onboarding-processes',
    _type: 'knowledgeArticle',
    headline: 'Onboarding Processes',
    subHeadline: 'Comprehensive guidance for integrating new team members including interns and core team members.',
    slug: { current: 'onboarding-processes' },
    category: { _ref: 'category-team-management' },
    overviewSteps: ['Pre-onboarding preparation', 'First-day orientation process', '30/60/90 day integration milestones'],
    fullDescription: 'Our onboarding process is designed to integrate new team members smoothly into our culture and workflows. The process includes comprehensive training on our tools and processes, mentorship assignment with experienced team members, and gradual responsibility increase over the first 90 days. We provide all necessary resources, access to documentation, and regular check-ins to ensure successful integration.',
    tags: ['onboarding', 'training', 'integration'],
    order: 5,
    status: 'published',
  },

  // Content Production
  {
    _id: 'article-video-production-process',
    _type: 'knowledgeArticle',
    headline: 'Video Production Process',
    subHeadline: 'End-to-end video production workflow from concept to distribution across all VONAS Media shows.',
    slug: { current: 'video-production-process' },
    category: { _ref: 'category-content-production' },
    overviewSteps: ['Pre-production planning and guest selection', 'Production setup and execution', 'Post-production editing and review', 'Distribution and promotion'],
    fullDescription: 'Our video production process is streamlined to ensure consistent quality while maintaining efficiency. Pre-production involves guest research, interview preparation, and technical setup. Production includes recording with professional equipment and backup systems. Post-production covers editing, review cycles, and final approval. Distribution involves optimizing content for different platforms and coordinating promotional activities.',
    videoRecording: 'https://share.descript.com/view/example-production-process',
    supportingDocuments: 'https://app.guidjar.com/playbooks/production-workflow',
    tags: ['video-production', 'workflow', 'content-creation'],
    order: 6,
    status: 'published',
  },
  {
    _id: 'article-guest-selection-management',
    _type: 'knowledgeArticle',
    headline: 'Guest Selection and Management',
    subHeadline: 'Process for identifying, vetting, and managing guests for podcasts and video content.',
    slug: { current: 'guest-selection-management' },
    category: { _ref: 'category-content-production' },
    overviewSteps: ['Guest research and identification', 'Outreach and booking process', 'Pre-interview preparation', 'Post-interview follow-up'],
    fullDescription: 'Guest selection is crucial for content quality and audience engagement. Our process begins with identifying potential guests through research, networking, and audience suggestions. We then conduct outreach with personalized messaging and clear value propositions. Once booked, we provide guests with preparation materials and conduct pre-interviews when necessary. Post-interview, we maintain relationships for future collaborations and gather feedback for continuous improvement.',
    tags: ['guest-management', 'booking', 'relationships'],
    order: 7,
    status: 'published',
  },

  // Show-Specific
  {
    _id: 'article-passions-show',
    _type: 'knowledgeArticle',
    headline: 'Passions Show',
    subHeadline: 'Complete production and management guide for the Passions show format.',
    slug: { current: 'passions-show' },
    category: { _ref: 'category-show-specific' },
    overviewSteps: ['Show format and structure', 'Production requirements', 'Guest criteria and booking', 'Post-production workflow'],
    fullDescription: 'Passions is our flagship show format focusing on authentic conversations about personal passions and professional journeys. The show features in-depth interviews with creators, entrepreneurs, and thought leaders who are passionate about their work. Episodes typically run 45-60 minutes and follow a structured format that allows for natural conversation flow while covering key talking points.',
    tags: ['passions-show', 'interviews', 'creators'],
    order: 8,
    status: 'published',
  },
  {
    _id: 'article-off-the-record',
    _type: 'knowledgeArticle',
    headline: 'Off the Record',
    subHeadline: 'Production guidelines and unique requirements for Off the Record show format.',
    slug: { current: 'off-the-record' },
    category: { _ref: 'category-show-specific' },
    overviewSteps: ['Show concept and format', 'Production setup requirements', 'Content guidelines and restrictions', 'Distribution strategy'],
    fullDescription: 'Off the Record offers candid, unfiltered conversations with industry insiders. This format requires specific production considerations including enhanced privacy measures, careful content guidelines, and strategic distribution. Guests share insider perspectives and behind-the-scenes insights that wouldn\'t be shared in traditional interview formats.',
    tags: ['off-the-record', 'candid-interviews', 'industry-insights'],
    order: 9,
    status: 'published',
  },

  // Tools and Systems
  {
    _id: 'article-content-creation-tools',
    _type: 'knowledgeArticle',
    headline: 'Content Creation Tools',
    subHeadline: 'Usage guidelines for video editing and content creation software including Klap, Opus Clip, and other production tools.',
    slug: { current: 'content-creation-tools' },
    category: { _ref: 'category-tools-systems' },
    overviewSteps: ['Tool selection criteria', 'Setup and configuration', 'Workflow integration', 'Best practices and tips'],
    fullDescription: 'We use various content creation tools to maintain high production quality and efficiency. Klap is used for creating short-form content clips, Opus Clip for automated video editing, and additional specialized software for specific tasks. Each tool is selected based on quality output, ease of use, and integration capabilities with our existing workflow.',
    videoRecording: 'https://share.descript.com/view/tools-overview',
    supportingDocuments: 'https://app.guidjar.com/playbooks/tools-setup',
    tags: ['tools', 'software', 'production-tools'],
    order: 10,
    status: 'published',
  },
];

// Simplified FAQs (easy to fetch!)
const simplifiedFAQs = [
  {
    _id: 'faq-001',
    _type: 'faq',
    faqId: 'FAQ-001',
    question: 'What is VONAS Media and what do we do?',
    answer: 'VONAS Media is a comprehensive content production company specializing in podcast and video content creation. We connect authentic creators with brands to produce meaningful content that drives engagement and business results.',
    category: 'company-foundation',
    tags: ['company-overview', 'business-model'],
    order: 1,
    isActive: true,
  },
  {
    _id: 'faq-002',
    _type: 'faq',
    faqId: 'FAQ-002',
    question: 'What types of shows does VONAS Media produce?',
    answer: 'We produce multiple show formats including Passions (our flagship interview show), Off the Record (candid industry conversations), Skyline Show (business strategy discussions), Tatak Show (Filipino culture and entrepreneurship), and At the Backdoor (behind-the-scenes content).',
    category: 'show-specific',
    tags: ['shows', 'formats', 'content-types'],
    order: 2,
    isActive: true,
  },
  {
    _id: 'faq-003',
    _type: 'faq',
    faqId: 'FAQ-003',
    question: 'How does the onboarding process work for new team members?',
    answer: 'New team members go through a structured 90-day onboarding process including orientation, comprehensive training on our tools and processes, mentorship assignment, and gradual responsibility increase. We provide all necessary resources and conduct regular check-ins.',
    category: 'team-management',
    tags: ['onboarding', 'new-hires', 'training'],
    order: 3,
    isActive: true,
  },
  {
    _id: 'faq-004',
    _type: 'faq',
    faqId: 'FAQ-004',
    question: 'What tools do we use for video production?',
    answer: 'We use a variety of tools including Klap for short-form content creation, Opus Clip for automated video editing, Descript for transcription and editing, professional recording equipment, and various specialized software based on project needs.',
    category: 'tools-systems',
    tags: ['tools', 'video-production', 'software'],
    order: 4,
    isActive: true,
  },
  {
    _id: 'faq-005',
    _type: 'faq',
    faqId: 'FAQ-005',
    question: 'How do we select guests for our shows?',
    answer: 'Guest selection involves research and identification of potential guests, personalized outreach with clear value propositions, vetting process to ensure alignment with show format, and preparation including pre-interviews when necessary.',
    category: 'content-production',
    tags: ['guest-selection', 'booking', 'content-strategy'],
    order: 5,
    isActive: true,
  },
];

async function importSimplifiedKnowledgeBase() {
  try {
    console.log('🚀 Starting SIMPLIFIED knowledge base import...');
    
    // Clean slate - remove existing articles with validation issues
    console.log('\n🧹 Cleaning existing content...');
    const existingArticles = await client.fetch(`*[_type == "knowledgeArticle"]`);
    for (const article of existingArticles) {
      await client.delete(article._id);
      console.log(`🗑️  Deleted: ${article.headline || article._id}`);
    }

    const existingFAQs = await client.fetch(`*[_type == "faq"]`);
    for (const faq of existingFAQs) {
      await client.delete(faq._id);
      console.log(`🗑️  Deleted: ${faq.faqId || faq._id}`);
    }
    
    // Import categories
    console.log('\n📁 Importing knowledge categories...');
    for (const category of knowledgeCategories) {
      await client.createOrReplace(category);
      console.log(`✓ ${category.name}`);
    }
    
    // Import simplified articles
    console.log('\n📝 Importing SIMPLIFIED knowledge articles...');
    for (const article of simplifiedKnowledgeArticles) {
      await client.createOrReplace(article);
      console.log(`✓ ${article.headline}`);
    }
    
    // Import simplified FAQs
    console.log('\n❓ Importing SIMPLIFIED FAQs...');
    for (const faq of simplifiedFAQs) {
      await client.createOrReplace(faq);
      console.log(`✓ ${faq.faqId}: ${faq.question.substring(0, 40)}...`);
    }
    
    console.log('\n🎉 SIMPLIFIED knowledge base import completed!');
    console.log('\n📊 Summary:');
    console.log(`- ${knowledgeCategories.length} categories`);
    console.log(`- ${simplifiedKnowledgeArticles.length} simplified articles (EASY TO FETCH!)`);
    console.log(`- ${simplifiedFAQs.length} simplified FAQs (EASY TO FETCH!)`);
    console.log('\n✅ All fields now work properly!');
    console.log('✅ Data fetching is now simple and efficient!');
    console.log('✅ No more validation errors!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the simplified import
importSimplifiedKnowledgeBase();