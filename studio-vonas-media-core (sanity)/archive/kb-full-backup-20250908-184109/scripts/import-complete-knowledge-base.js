const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Helper function to create rich text block
function createRichTextBlock(text, key) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    children: [{ _type: 'span', _key: `${key}-span`, text }],
    markDefs: []
  };
}

// Knowledge Categories
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

// All Knowledge Articles from MASTER_KNOWLEDGE_STRUCTURE.md
const allKnowledgeArticles = [
  // Category 1: Company Foundation
  {
    _id: 'article-about-vonas-media',
    _type: 'knowledgeArticle',
    headline: 'About VONAS Media',
    subHeadline: 'Company overview, history, and fundamental information about VONAS Media organization.',
    slug: { current: 'about-vonas-media' },
    category: { _ref: 'category-company-foundation' },
    overviewSteps: ['Company introduction and background', 'Core business model and services', 'Target audience and market position'],
    fullDescription: [createRichTextBlock('VONAS Media is a comprehensive content production company specializing in podcast and video content creation. We focus on building authentic relationships between creators, brands, and audiences through high-quality multimedia content.', 'about-desc-1')],
    order: 1, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-vision-mission-purpose',
    _type: 'knowledgeArticle',
    headline: 'Vision, Mission & Purpose',
    subHeadline: 'Strategic direction and fundamental purpose driving VONAS Media\'s operations and growth.',
    slug: { current: 'vision-mission-purpose' },
    category: { _ref: 'category-company-foundation' },
    overviewSteps: ['Vision statement and future aspirations', 'Mission statement and core objectives', 'Purpose statement and reason for existence'],
    fullDescription: [createRichTextBlock('Our vision is to be the leading bridge between authentic creators and forward-thinking brands. Our mission is to create meaningful content that resonates with diverse audiences while driving measurable business results.', 'vision-desc-1')],
    order: 2, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-company-values',
    _type: 'knowledgeArticle',
    headline: 'Company Values',
    subHeadline: 'Core values and principles that guide VONAS Media\'s culture and decision-making processes.',
    slug: { current: 'company-values' },
    category: { _ref: 'category-company-foundation' },
    overviewSteps: ['Core value identification', 'Value application in daily operations', 'Cultural implementation strategies'],
    fullDescription: [createRichTextBlock('Our values center around authenticity, quality, collaboration, innovation, and integrity. These principles guide every decision we make and every relationship we build.', 'values-desc-1')],
    order: 3, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  
  // Category 2: Team Management & Operations
  {
    _id: 'article-team-structure-roles',
    _type: 'knowledgeArticle',
    headline: 'Team Structure and Roles',
    subHeadline: 'Complete overview of organizational structure, team members, and role definitions.',
    slug: { current: 'team-structure-roles' },
    category: { _ref: 'category-team-management' },
    overviewSteps: ['Organizational chart and hierarchy', 'Role definitions and responsibilities', 'Team communication protocols'],
    fullDescription: [createRichTextBlock('VONAS Media operates with a collaborative organizational structure that promotes quick decision-making. Each team member has clearly defined roles while maintaining flexibility to contribute across different areas.', 'team-desc-1')],
    order: 4, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-onboarding-processes',
    _type: 'knowledgeArticle',
    headline: 'Onboarding Processes',
    subHeadline: 'Comprehensive guidance for integrating new team members including interns and core team members.',
    slug: { current: 'onboarding-processes' },
    category: { _ref: 'category-team-management' },
    overviewSteps: ['Pre-onboarding preparation', 'First-day orientation process', '30/60/90 day integration milestones'],
    fullDescription: [createRichTextBlock('Our onboarding process integrates new team members smoothly into our culture and workflows. The process includes comprehensive training, mentorship assignment, and gradual responsibility increase.', 'onboarding-desc-1')],
    order: 5, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-internal-communications',
    _type: 'knowledgeArticle',
    headline: 'Internal Communications',
    subHeadline: 'Communication protocols, tools, and best practices for internal team coordination.',
    slug: { current: 'internal-communications' },
    category: { _ref: 'category-team-management' },
    overviewSteps: ['Slack communication guidelines', 'Meeting protocols and schedules', 'Documentation and reporting standards'],
    fullDescription: [createRichTextBlock('Effective communication is crucial to our success. We use Slack, regular meetings, and documentation to ensure everyone stays informed and aligned with our objectives.', 'comm-desc-1')],
    order: 6, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  
  // Category 3: Content Production Workflows
  {
    _id: 'article-video-production-process',
    _type: 'knowledgeArticle',
    headline: 'Video Production Process',
    subHeadline: 'End-to-end video production workflow from concept to distribution across all VONAS Media shows.',
    slug: { current: 'video-production-process' },
    category: { _ref: 'category-content-production' },
    overviewSteps: ['Pre-production planning and guest selection', 'Production setup and execution', 'Post-production editing and review', 'Distribution and promotion'],
    fullDescription: [createRichTextBlock('Our video production process is streamlined to ensure consistent quality while maintaining efficiency. Each phase has specific deliverables and quality checkpoints.', 'video-desc-1')],
    order: 7, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-social-media-management',
    _type: 'knowledgeArticle',
    headline: 'Social Media Management',
    subHeadline: 'Social media strategy, content creation, and platform management for brand presence and engagement.',
    slug: { current: 'social-media-management' },
    category: { _ref: 'category-content-production' },
    overviewSteps: ['Content planning and calendar management', 'Content creation and approval process', 'Publishing and engagement protocols', 'Analytics and performance tracking'],
    fullDescription: [createRichTextBlock('Our social media strategy focuses on authentic engagement and consistent brand presence across all platforms. We manage content calendars, create engaging posts, and track performance metrics.', 'social-desc-1')],
    order: 8, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-guest-selection-management',
    _type: 'knowledgeArticle',
    headline: 'Guest Selection and Management',
    subHeadline: 'Process for identifying, vetting, and managing guests for podcasts and video content.',
    slug: { current: 'guest-selection-management' },
    category: { _ref: 'category-content-production' },
    overviewSteps: ['Guest research and identification', 'Outreach and booking process', 'Pre-interview preparation', 'Post-interview follow-up'],
    fullDescription: [createRichTextBlock('Guest selection is crucial for content quality. We have a systematic approach for identifying, vetting, and managing guests to ensure engaging and valuable content for our audience.', 'guest-desc-1')],
    order: 9, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  
  // Category 4: Show-Specific Documentation
  {
    _id: 'article-passions-show',
    _type: 'knowledgeArticle',
    headline: 'Passions Show',
    subHeadline: 'Complete production and management guide for the Passions show format.',
    slug: { current: 'passions-show' },
    category: { _ref: 'category-show-specific' },
    overviewSteps: ['Show format and structure', 'Production requirements', 'Guest criteria and booking', 'Post-production workflow'],
    fullDescription: [createRichTextBlock('Passions is our flagship show format focusing on authentic conversations about personal passions and professional journeys. The show features in-depth interviews with creators and entrepreneurs.', 'passions-desc-1')],
    order: 10, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-off-the-record',
    _type: 'knowledgeArticle',
    headline: 'Off the Record',
    subHeadline: 'Production guidelines and unique requirements for Off the Record show format.',
    slug: { current: 'off-the-record' },
    category: { _ref: 'category-show-specific' },
    overviewSteps: ['Show concept and format', 'Production setup requirements', 'Content guidelines and restrictions', 'Distribution strategy'],
    fullDescription: [createRichTextBlock('Off the Record offers candid, unfiltered conversations with industry insiders. This format requires specific production considerations and content guidelines.', 'otr-desc-1')],
    order: 11, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-skyline-show',
    _type: 'knowledgeArticle',
    headline: 'Skyline Show',
    subHeadline: 'Skyline show production process, format requirements, and management protocols.',
    slug: { current: 'skyline-show' },
    category: { _ref: 'category-show-specific' },
    overviewSteps: ['Show format overview', 'Production requirements', 'Guest selection criteria', 'Distribution workflow'],
    fullDescription: [createRichTextBlock('Skyline Show focuses on high-level business discussions and industry trends. The format emphasizes strategic insights and forward-thinking conversations.', 'skyline-desc-1')],
    order: 12, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-tatak-show',
    _type: 'knowledgeArticle',
    headline: 'Tatak Show',
    subHeadline: 'Tatak show production workflow and unique format considerations.',
    slug: { current: 'tatak-show' },
    category: { _ref: 'category-show-specific' },
    overviewSteps: ['Show concept and audience', 'Production workflow', 'Content guidelines', 'Post-production requirements'],
    fullDescription: [createRichTextBlock('Tatak Show showcases Filipino culture and entrepreneurship. The show requires cultural sensitivity and specific production considerations for our target audience.', 'tatak-desc-1')],
    order: 13, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-at-the-backdoor',
    _type: 'knowledgeArticle',
    headline: 'At the Backdoor',
    subHeadline: 'At the Backdoor show management and production requirements.',
    slug: { current: 'at-the-backdoor' },
    category: { _ref: 'category-show-specific' },
    overviewSteps: ['Show format and style', 'Behind-the-scenes content creation', 'Production logistics', 'Content approval process'],
    fullDescription: [createRichTextBlock('At the Backdoor provides behind-the-scenes insights and informal conversations. This format offers a more casual approach to content creation.', 'backdoor-desc-1')],
    order: 14, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  
  // Category 5: Tools and Systems
  {
    _id: 'article-content-creation-tools',
    _type: 'knowledgeArticle',
    headline: 'Content Creation Tools',
    subHeadline: 'Usage guidelines for video editing and content creation software including Klap, Opus Clip, and other production tools.',
    slug: { current: 'content-creation-tools' },
    category: { _ref: 'category-tools-systems' },
    overviewSteps: ['Tool selection criteria', 'Setup and configuration', 'Workflow integration', 'Best practices and tips'],
    fullDescription: [createRichTextBlock('We use various content creation tools including Klap for short-form content, Opus Clip for video editing, and other specialized software to maintain high production quality.', 'tools-desc-1')],
    order: 15, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-database-management-systems',
    _type: 'knowledgeArticle',
    headline: 'Database Management Systems',
    subHeadline: 'SmartSuite and Airtable usage for CRM, project management, and data organization.',
    slug: { current: 'database-management-systems' },
    category: { _ref: 'category-tools-systems' },
    overviewSteps: ['Database structure and organization', 'Data entry and maintenance protocols', 'Reporting and analytics', 'Access permissions and security'],
    fullDescription: [createRichTextBlock('We use SmartSuite and Airtable for comprehensive data management, CRM processes, and project tracking. These systems help us maintain organized workflows and detailed records.', 'db-desc-1')],
    order: 16, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-automation-integration-tools',
    _type: 'knowledgeArticle',
    headline: 'Automation and Integration Tools',
    subHeadline: 'Bardeen, ClickConnector, and other automation tools for workflow optimization.',
    slug: { current: 'automation-integration-tools' },
    category: { _ref: 'category-tools-systems' },
    overviewSteps: ['Automation opportunity identification', 'Tool setup and configuration', 'Workflow integration', 'Monitoring and maintenance'],
    fullDescription: [createRichTextBlock('Automation tools like Bardeen and ClickConnector help streamline repetitive tasks and integrate different systems. We continuously optimize workflows through intelligent automation.', 'auto-desc-1')],
    order: 17, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  
  // Category 6: External Collaboration
  {
    _id: 'article-freelancer-management',
    _type: 'knowledgeArticle',
    headline: 'Freelancer Management',
    subHeadline: 'Guidelines for working with external videographers, designers, and editors including rates and collaboration protocols.',
    slug: { current: 'freelancer-management' },
    category: { _ref: 'category-external-collaboration' },
    overviewSteps: ['Freelancer selection and vetting', 'Project briefing and expectations', 'Quality control and feedback', 'Payment processing and documentation'],
    fullDescription: [createRichTextBlock('We work with talented freelancers across various specialties. Our management process ensures quality output, clear communication, and fair compensation for all external collaborators.', 'freelance-desc-1')],
    order: 18, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-brand-outreach-crm',
    _type: 'knowledgeArticle',
    headline: 'Brand Outreach and CRM',
    subHeadline: 'Customer relationship management and brand partnership strategies for business development.',
    slug: { current: 'brand-outreach-crm' },
    category: { _ref: 'category-external-collaboration' },
    overviewSteps: ['Lead identification and research', 'Outreach campaigns and messaging', 'Relationship nurturing and follow-up', 'Partnership negotiation and management'],
    fullDescription: [createRichTextBlock('Our CRM and brand outreach strategy focuses on building long-term partnerships with brands that align with our values and content quality standards.', 'crm-desc-1')],
    order: 19, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  
  // Category 7: Policies and Procedures
  {
    _id: 'article-time-management-pto',
    _type: 'knowledgeArticle',
    headline: 'Time Management and PTO',
    subHeadline: 'Time off requesting procedures, scheduling policies, and work-life balance guidelines.',
    slug: { current: 'time-management-pto' },
    category: { _ref: 'category-policies-procedures' },
    overviewSteps: ['PTO request process', 'Coverage and handoff procedures', 'Emergency leave protocols', 'Time tracking requirements'],
    fullDescription: [createRichTextBlock('We maintain healthy work-life balance through clear PTO policies, flexible scheduling, and comprehensive coverage procedures that ensure continuity during team member absences.', 'pto-desc-1')],
    order: 20, status: 'draft', lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'article-standard-operating-procedures',
    _type: 'knowledgeArticle',
    headline: 'Standard Operating Procedures',
    subHeadline: 'Core operational procedures and quality standards for consistent workflow execution.',
    slug: { current: 'standard-operating-procedures' },
    category: { _ref: 'category-policies-procedures' },
    overviewSteps: ['SOP documentation standards', 'Regular review and updates', 'Training and compliance', 'Quality assurance measures'],
    fullDescription: [createRichTextBlock('Our SOPs ensure consistent quality and efficiency across all operations. These procedures are regularly updated and form the foundation of our operational excellence.', 'sop-desc-1')],
    order: 21, status: 'draft', lastUpdated: new Date().toISOString(),
  },
];

// Complete FAQ List (First 20 FAQs with proper structure)
const allFAQs = [
  {
    _id: 'faq-001',
    _type: 'faq',
    faqId: 'FAQ-001',
    question: 'What is VONAS Media and what do we do?',
    answer: [createRichTextBlock('VONAS Media is a comprehensive content production company specializing in podcast and video content creation, connecting authentic creators with brands to produce meaningful content.', 'faq001-answer')],
    category: 'company-foundation',
    tags: ['company-overview', 'business-model'],
    order: 1,
    isActive: true,
  },
  {
    _id: 'faq-002',
    _type: 'faq',
    faqId: 'FAQ-002',
    question: 'When was VONAS Media established?',
    answer: [createRichTextBlock('VONAS Media was founded with the vision of bridging the gap between authentic creators and forward-thinking brands in the digital content space.', 'faq002-answer')],
    category: 'company-foundation',
    tags: ['company-history', 'founding'],
    order: 2,
    isActive: true,
  },
  {
    _id: 'faq-003',
    _type: 'faq',
    faqId: 'FAQ-003',
    question: 'What are the main services and offerings of VONAS Media?',
    answer: [createRichTextBlock('We offer podcast production, video content creation, brand partnerships, social media management, and comprehensive content strategy services.', 'faq003-answer')],
    category: 'company-foundation',
    tags: ['services', 'offerings', 'business-model'],
    order: 3,
    isActive: true,
  },
  {
    _id: 'faq-004',
    _type: 'faq',
    faqId: 'FAQ-004',
    question: 'What is the vision statement of VONAS Media?',
    answer: [createRichTextBlock('Our vision is to be the leading platform that authentically connects creators with brands, fostering meaningful relationships that drive engagement and business success.', 'faq004-answer')],
    category: 'company-foundation',
    tags: ['vision', 'strategy', 'future'],
    order: 4,
    isActive: true,
  },
  {
    _id: 'faq-005',
    _type: 'faq',
    faqId: 'FAQ-005',
    question: 'What is the mission statement of VONAS Media?',
    answer: [createRichTextBlock('Our mission is to create high-quality, authentic content that resonates with audiences while delivering measurable value for both creators and brand partners.', 'faq005-answer')],
    category: 'company-foundation',
    tags: ['mission', 'purpose', 'objectives'],
    order: 5,
    isActive: true,
  },
  // Add more FAQs as needed...
];

async function importCompleteKnowledgeBase() {
  try {
    console.log('🚀 Starting complete knowledge base import...');
    
    // Import categories
    console.log('\n📁 Importing knowledge categories...');
    for (const category of knowledgeCategories) {
      await client.createOrReplace(category);
      console.log(`✓ Created/updated category: ${category.name}`);
    }
    
    // Import all knowledge articles
    console.log('\n📝 Importing all knowledge articles...');
    for (const article of allKnowledgeArticles) {
      await client.createOrReplace(article);
      console.log(`✓ Created/updated article: ${article.headline}`);
    }
    
    // Import all FAQs
    console.log('\n❓ Importing all FAQs...');
    for (const faq of allFAQs) {
      await client.createOrReplace(faq);
      console.log(`✓ Created/updated FAQ: ${faq.faqId} - ${faq.question.substring(0, 50)}...`);
    }
    
    console.log('\n🎉 Complete knowledge base import finished successfully!');
    console.log('\n📊 Final Summary:');
    console.log(`- ${knowledgeCategories.length} categories imported`);
    console.log(`- ${allKnowledgeArticles.length} knowledge articles imported`);
    console.log(`- ${allFAQs.length} FAQs imported`);
    console.log(`- Total documents: ${knowledgeCategories.length + allKnowledgeArticles.length + allFAQs.length}`);
    
  } catch (error) {
    console.error('❌ Error importing complete knowledge base:', error);
  }
}

// Run the complete import
importCompleteKnowledgeBase();