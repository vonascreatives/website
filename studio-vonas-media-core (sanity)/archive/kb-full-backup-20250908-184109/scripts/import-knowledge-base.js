const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Knowledge Categories based on the master structure
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
  },
];

// Knowledge Tags
const knowledgeTags = [
  { _id: 'tag-onboarding', _type: 'knowledgeTag', name: 'Onboarding', slug: { current: 'onboarding' }, description: 'New team member integration', color: '#DBEAFE', isActive: true },
  { _id: 'tag-video-production', _type: 'knowledgeTag', name: 'Video Production', slug: { current: 'video-production' }, description: 'Video creation and editing', color: '#D1FAE5', isActive: true },
  { _id: 'tag-social-media', _type: 'knowledgeTag', name: 'Social Media', slug: { current: 'social-media' }, description: 'Social media management and strategy', color: '#FEF3C7', isActive: true },
  { _id: 'tag-guest-management', _type: 'knowledgeTag', name: 'Guest Management', slug: { current: 'guest-management' }, description: 'Guest booking and coordination', color: '#FEE2E2', isActive: true },
  { _id: 'tag-automation', _type: 'knowledgeTag', name: 'Automation', slug: { current: 'automation' }, description: 'Workflow automation and tools', color: '#EDE9FE', isActive: true },
  { _id: 'tag-freelancers', _type: 'knowledgeTag', name: 'Freelancers', slug: { current: 'freelancers' }, description: 'External contractor management', color: '#FCE7F3', isActive: true },
  { _id: 'tag-policies', _type: 'knowledgeTag', name: 'Policies', slug: { current: 'policies' }, description: 'Company policies and procedures', color: '#F3F4F6', isActive: true },
  { _id: 'tag-communication', _type: 'knowledgeTag', name: 'Communication', slug: { current: 'communication' }, description: 'Internal communication protocols', color: '#DBEAFE', isActive: true },
  { _id: 'tag-tools', _type: 'knowledgeTag', name: 'Tools', slug: { current: 'tools' }, description: 'Software tools and platforms', color: '#D1FAE5', isActive: true },
];

// Knowledge Articles based on the master structure
const knowledgeArticles = [
  // Company Foundation Category
  {
    _id: 'article-about-vonas-media',
    _type: 'knowledgeArticle',
    headline: 'About VONAS Media',
    subHeadline: 'Company overview, history, and fundamental information about VONAS Media organization.',
    slug: { current: 'about-vonas-media' },
    category: { _ref: 'category-company-foundation' },
    overviewSteps: [
      'Company introduction and background',
      'Core business model and services',
      'Target audience and market position'
    ],
    fullDescription: [
      {
        _type: 'block',
        _key: 'intro-block-1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'intro-span-1', text: 'VONAS Media is a comprehensive content production company specializing in podcast and video content creation. Our organization focuses on building authentic relationships between creators, brands, and audiences through high-quality multimedia content.' }],
        markDefs: []
      }
    ],
    tags: [{ _ref: 'tag-onboarding' }],
    order: 1,
    status: 'draft',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-vision-mission-purpose',
    _type: 'knowledgeArticle',
    headline: 'Vision, Mission & Purpose',
    subHeadline: 'Strategic direction and fundamental purpose driving VONAS Media\'s operations and growth.',
    slug: { current: 'vision-mission-purpose' },
    category: { _ref: 'category-company-foundation' },
    overviewSteps: [
      'Vision statement and future aspirations',
      'Mission statement and core objectives',
      'Purpose statement and reason for existence'
    ],
    fullDescription: [
      {
        _type: 'block',
        _key: 'mission-block-1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'mission-span-1', text: 'Our mission is to bridge the gap between authentic creators and forward-thinking brands, creating meaningful content that resonates with diverse audiences while driving measurable business results.' }],
        markDefs: []
      }
    ],
    tags: [{ _ref: 'tag-onboarding' }],
    order: 2,
    status: 'draft',
    isActive: true,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-company-values',
    _type: 'knowledgeArticle',
    headline: 'Company Values',
    subHeadline: 'Core values and principles that guide VONAS Media\'s culture and decision-making processes.',
    slug: { current: 'company-values' },
    category: { _ref: 'category-company-foundation' },
    overviewSteps: [
      'Core value identification',
      'Value application in daily operations',
      'Cultural implementation strategies'
    ],
    fullDescription: [
      {
        _type: 'block',
        _key: 'values-block-1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'values-span-1', text: 'Our values center around authenticity, quality, collaboration, innovation, and integrity. These principles guide every decision we make and every relationship we build.' }],
        markDefs: []
      }
    ],
    tags: [{ _ref: 'tag-onboarding' }],
    order: 3,
    status: 'draft',
    isActive: true,
    lastUpdated: new Date().toISOString(),
  },
  // Team Management Category
  {
    _id: 'article-team-structure-roles',
    _type: 'knowledgeArticle',
    headline: 'Team Structure and Roles',
    subHeadline: 'Complete overview of organizational structure, team members, and role definitions.',
    slug: { current: 'team-structure-roles' },
    category: { _ref: 'category-team-management' },
    overviewSteps: [
      'Organizational chart and hierarchy',
      'Role definitions and responsibilities',
      'Team communication protocols'
    ],
    fullDescription: [
      {
        _type: 'block',
        _key: 'structure-block-1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'structure-span-1', text: 'VONAS Media operates with a flat organizational structure that promotes collaboration and quick decision-making. Each team member has clearly defined roles while maintaining flexibility to contribute across different areas.' }],
        markDefs: []
      }
    ],
    tags: [{ _ref: 'tag-onboarding' }, { _ref: 'tag-communication' }],
    order: 4,
    status: 'draft',
    isActive: true,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-onboarding-processes',
    _type: 'knowledgeArticle',
    headline: 'Onboarding Processes',
    subHeadline: 'Comprehensive guidance for integrating new team members including interns and core team members.',
    slug: { current: 'onboarding-processes' },
    category: { _ref: 'category-team-management' },
    overviewSteps: [
      'Pre-onboarding preparation',
      'First-day orientation process',
      '30/60/90 day integration milestones'
    ],
    fullDescription: [
      {
        _type: 'block',
        _key: 'onboarding-block-1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'onboarding-span-1', text: 'Our onboarding process is designed to integrate new team members smoothly into our culture and workflows. The process includes comprehensive training, mentorship assignment, and gradual responsibility increase.' }],
        markDefs: []
      }
    ],
    tags: [{ _ref: 'tag-onboarding' }, { _ref: 'tag-policies' }],
    order: 5,
    status: 'draft',
    isActive: true,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-internal-communications',
    _type: 'knowledgeArticle',
    headline: 'Internal Communications',
    subHeadline: 'Communication protocols, tools, and best practices for internal team coordination.',
    slug: { current: 'internal-communications' },
    category: { _ref: 'category-team-management' },
    overviewSteps: [
      'Slack communication guidelines',
      'Meeting protocols and schedules',
      'Documentation and reporting standards'
    ],
    fullDescription: [
      {
        _type: 'block',
        _key: 'communications-block-1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'communications-span-1', text: 'Effective communication is crucial to our success. We use a combination of Slack, regular meetings, and documentation to ensure everyone stays informed and aligned with our objectives.' }],
        markDefs: []
      }
    ],
    tags: [{ _ref: 'tag-communication' }, { _ref: 'tag-tools' }],
    order: 6,
    status: 'draft',
    isActive: true,
    lastUpdated: new Date().toISOString(),
  },
  // Content Production Category
  {
    _id: 'article-video-production-process',
    _type: 'knowledgeArticle',
    headline: 'Video Production Process',
    subHeadline: 'End-to-end video production workflow from concept to distribution across all VONAS Media shows.',
    slug: { current: 'video-production-process' },
    category: { _ref: 'category-content-production' },
    overviewSteps: [
      'Pre-production planning and guest selection',
      'Production setup and execution',
      'Post-production editing and review',
      'Distribution and promotion'
    ],
    fullDescription: [
      {
        _type: 'block',
        _key: 'production-block-1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'production-span-1', text: 'Our video production process is streamlined to ensure consistent quality while maintaining efficiency. Each phase has specific deliverables and quality checkpoints.' }],
        markDefs: []
      }
    ],
    tags: [{ _ref: 'tag-video-production' }],
    order: 7,
    status: 'draft',
    isActive: true,
    lastUpdated: new Date().toISOString(),
  },
];

// Sample FAQs based on the structure
const faqs = [
  {
    _id: 'faq-001',
    _type: 'faq',
    faqId: 'FAQ-001',
    question: 'What is VONAS Media\'s primary business focus?',
    answer: [
      {
        _type: 'block',
        _key: 'answer-block-1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'answer-span-1', text: 'VONAS Media specializes in podcast and video content production, connecting authentic creators with brands to produce meaningful content that drives engagement and business results.' }],
        markDefs: []
      }
    ],
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
    answer: [
      {
        _type: 'block',
        _key: 'answer-block-2',
        style: 'normal',
        children: [{ _type: 'span', _key: 'answer-span-2', text: 'We produce multiple show formats including Passions, Off the Record, Skyline Show, Tatak Show, and At the Backdoor, each with unique formats and target audiences.' }],
        markDefs: []
      }
    ],
    category: 'show-specific',
    tags: ['shows', 'formats'],
    order: 2,
    isActive: true,
  },
  {
    _id: 'faq-003',
    _type: 'faq',
    faqId: 'FAQ-003',
    question: 'How does the onboarding process work for new team members?',
    answer: [
      {
        _type: 'block',
        _key: 'answer-block-3',
        style: 'normal',
        children: [{ _type: 'span', _key: 'answer-span-3', text: 'New team members go through a structured onboarding process including orientation, training, mentorship assignment, and progressive responsibility increase over their first 90 days.' }],
        markDefs: []
      }
    ],
    category: 'team-management',
    tags: ['onboarding', 'new-hires'],
    order: 3,
    isActive: true,
  },
];

async function importKnowledgeBase() {
  try {
    console.log('Starting knowledge base import...');
    
    // Import categories first
    console.log('Importing knowledge categories...');
    for (const category of knowledgeCategories) {
      await client.createOrReplace(category);
      console.log(`✓ Created/updated category: ${category.name}`);
    }
    
    // Import tags
    console.log('Importing knowledge tags...');
    for (const tag of knowledgeTags) {
      await client.createOrReplace(tag);
      console.log(`✓ Created/updated tag: ${tag.name}`);
    }
    
    // Import knowledge articles
    console.log('Importing knowledge articles...');
    for (const article of knowledgeArticles) {
      await client.createOrReplace(article);
      console.log(`✓ Created/updated article: ${article.headline}`);
    }
    
    // Import FAQs
    console.log('Importing FAQs...');
    for (const faq of faqs) {
      await client.createOrReplace(faq);
      console.log(`✓ Created/updated FAQ: ${faq.faqId}`);
    }
    
    console.log('\n🎉 Knowledge base import completed successfully!');
    console.log('\nSummary:');
    console.log(`- ${knowledgeCategories.length} categories imported`);
    console.log(`- ${knowledgeTags.length} tags imported`);
    console.log(`- ${knowledgeArticles.length} knowledge articles imported`);
    console.log(`- ${faqs.length} FAQs imported`);
    
  } catch (error) {
    console.error('Error importing knowledge base:', error);
  }
}

// Run the import
importKnowledgeBase();