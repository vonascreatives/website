const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Helper function to create rich text content
function createRichTextContent(text) {
  return [
    {
      _type: 'block',
      _key: Math.random().toString(36).substr(2, 9),
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: text,
          marks: []
        }
      ],
      markDefs: []
    }
  ];
}

// Complete hierarchical structure for VONAS Media
const hierarchicalStructure = [
  // 1. About VONAS Media (Top Level)
  {
    _id: 'vonas-about',
    _type: 'kbItem',
    title: 'About VONAS Media',
    slug: { current: 'about-vonas-media' },
    itemType: 'folder',
    icon: '🏢',
    order: 1,
    content: createRichTextContent('Learn about VONAS Media, our mission, vision, and company culture.'),
  },
  {
    _id: 'vonas-about-overview',
    _type: 'kbItem',
    title: 'Company Overview',
    slug: { current: 'company-overview' },
    parent: { _ref: 'vonas-about' },
    itemType: 'document',
    icon: '📋',
    order: 1,
    content: createRichTextContent('VONAS Media is a comprehensive content production company specializing in podcast and video content creation. We focus on building authentic relationships between creators, brands, and audiences through high-quality multimedia content.'),
    overviewSteps: ['Company introduction and background', 'Core business model and services', 'Target audience and market position'],
    status: 'published',
  },
  {
    _id: 'vonas-about-vision',
    _type: 'kbItem',
    title: 'Vision & Mission',
    slug: { current: 'vision-mission' },
    parent: { _ref: 'vonas-about' },
    itemType: 'document',
    icon: '🎯',
    order: 2,
    content: createRichTextContent('Our vision is to be the leading platform that authentically connects creators with brands. Our mission is to create high-quality, authentic content that resonates with audiences while delivering measurable value for both creators and brand partners.'),
    status: 'published',
  },
  {
    _id: 'vonas-about-values',
    _type: 'kbItem',
    title: 'Company Values',
    slug: { current: 'company-values' },
    parent: { _ref: 'vonas-about' },
    itemType: 'document',
    icon: '💎',
    order: 3,
    content: createRichTextContent('Our values center around five key principles: Authenticity, Quality, Collaboration, Innovation, and Integrity. These principles guide every decision we make and every relationship we build.'),
    status: 'published',
  },

  // 2. Internship Program
  {
    _id: 'internship-program',
    _type: 'kbItem',
    title: 'Internship Program',
    slug: { current: 'internship-program' },
    itemType: 'folder',
    icon: '🎓',
    order: 2,
    content: createRichTextContent('Comprehensive internship program information, guidelines, and resources.'),
  },
  {
    _id: 'intern-onboarding',
    _type: 'kbItem',
    title: 'Intern Onboarding',
    slug: { current: 'intern-onboarding' },
    parent: { _ref: 'internship-program' },
    itemType: 'document',
    icon: '📝',
    order: 1,
    content: createRichTextContent('Complete onboarding process for new interns including orientation, training schedule, mentorship assignment, and 90-day integration milestones.'),
    overviewSteps: ['Pre-onboarding preparation', 'First-day orientation', '30/60/90 day milestones'],
    tags: ['onboarding', 'training', 'interns'],
    status: 'published',
  },
  {
    _id: 'intern-handbook',
    _type: 'kbItem',
    title: 'Intern Handbook',
    slug: { current: 'intern-handbook' },
    parent: { _ref: 'internship-program' },
    itemType: 'document',
    icon: '📖',
    order: 2,
    content: createRichTextContent('Essential handbook for interns covering policies, procedures, expectations, and resources available during the internship program.'),
    status: 'published',
  },

  // 3. Freelancer Management
  {
    _id: 'freelancer-management',
    _type: 'kbItem',
    title: 'Freelancer Management',
    slug: { current: 'freelancer-management' },
    itemType: 'folder',
    icon: '🤝',
    order: 3,
    content: createRichTextContent('Guidelines and processes for working with external freelancers including videographers, editors, and designers.'),
  },
  {
    _id: 'freelancer-guidelines',
    _type: 'kbItem',
    title: 'Work Collaboration Guidelines',
    slug: { current: 'freelancer-guidelines' },
    parent: { _ref: 'freelancer-management' },
    itemType: 'document',
    icon: '📋',
    order: 1,
    content: createRichTextContent('Guidelines for collaborating with external freelancers including project briefing, quality standards, communication protocols, and payment procedures.'),
    overviewSteps: ['Freelancer selection and vetting', 'Project briefing and expectations', 'Quality control and feedback', 'Payment processing'],
    tags: ['freelancers', 'collaboration', 'quality-control'],
    status: 'published',
  },
  {
    _id: 'freelancer-rates',
    _type: 'kbItem',
    title: 'Rates & Payment Terms',
    slug: { current: 'freelancer-rates' },
    parent: { _ref: 'freelancer-management' },
    itemType: 'document',
    icon: '💰',
    order: 2,
    content: createRichTextContent('Standard rates and payment terms for different types of freelance work including videography, editing, graphic design, and other specialized services.'),
    status: 'published',
  },

  // 4. YouTube Channels (Main Folder)
  {
    _id: 'youtube-channels',
    _type: 'kbItem',
    title: 'YouTube Channels',
    slug: { current: 'youtube-channels' },
    itemType: 'folder',
    icon: '📺',
    order: 4,
    content: createRichTextContent('All YouTube shows and channel-specific documentation, production guides, and resources.'),
  },

  // 4.1 Off the Record Show
  {
    _id: 'off-the-record-show',
    _type: 'kbItem',
    title: 'Off the Record',
    slug: { current: 'off-the-record' },
    parent: { _ref: 'youtube-channels' },
    itemType: 'youtube-show',
    icon: '🎙️',
    order: 1,
    youtubeShow: 'off-the-record',
    content: createRichTextContent('Off the Record offers candid, unfiltered conversations with industry insiders, providing behind-the-scenes insights and authentic perspectives.'),
    status: 'published',
  },
  {
    _id: 'otr-about',
    _type: 'kbItem',
    title: 'About Off the Record',
    slug: { current: 'otr-about' },
    parent: { _ref: 'off-the-record-show' },
    itemType: 'document',
    icon: '📄',
    order: 1,
    youtubeShow: 'off-the-record',
    content: createRichTextContent('Off the Record is our candid interview format where guests share unfiltered insights about their industry experiences, challenges, and behind-the-scenes stories.'),
    overviewSteps: ['Show concept and format', 'Guest selection criteria', 'Content guidelines', 'Production requirements'],
    status: 'published',
  },
  {
    _id: 'otr-shooting',
    _type: 'kbItem',
    title: 'Shooting Guidelines',
    slug: { current: 'otr-shooting' },
    parent: { _ref: 'off-the-record-show' },
    itemType: 'production-stage',
    icon: '🎬',
    order: 2,
    youtubeShow: 'off-the-record',
    productionStage: 'shooting',
    content: createRichTextContent('Shooting guidelines specific to Off the Record including equipment setup, lighting requirements, audio considerations, and interview techniques for candid conversations.'),
    videoRecording: 'https://share.descript.com/view/otr-shooting-guide',
    supportingDocuments: 'https://app.guidjar.com/playbooks/otr-shooting',
    tags: ['shooting', 'production', 'equipment'],
    status: 'published',
  },
  {
    _id: 'otr-editing',
    _type: 'kbItem',
    title: 'Editing Workflow',
    slug: { current: 'otr-editing' },
    parent: { _ref: 'off-the-record-show' },
    itemType: 'production-stage',
    icon: '✂️',
    order: 3,
    youtubeShow: 'off-the-record',
    productionStage: 'editing',
    content: createRichTextContent('Editing workflow and guidelines for Off the Record episodes including pacing, content sensitivity review, and maintaining the authentic feel of candid conversations.'),
    tags: ['editing', 'post-production', 'workflow'],
    status: 'published',
  },

  // 4.2 Passions Show
  {
    _id: 'passions-show',
    _type: 'kbItem',
    title: 'Passions',
    slug: { current: 'passions' },
    parent: { _ref: 'youtube-channels' },
    itemType: 'youtube-show',
    icon: '🔥',
    order: 2,
    youtubeShow: 'passions',
    content: createRichTextContent('Passions is our flagship show focusing on authentic conversations about personal passions, professional journeys, and the drive behind successful creators and entrepreneurs.'),
    status: 'published',
  },
  {
    _id: 'passions-about',
    _type: 'kbItem',
    title: 'About Passions',
    slug: { current: 'passions-about' },
    parent: { _ref: 'passions-show' },
    itemType: 'document',
    icon: '📄',
    order: 1,
    youtubeShow: 'passions',
    content: createRichTextContent('Passions showcases the personal stories and professional journeys of creators, entrepreneurs, and thought leaders who are passionate about their work and making a difference.'),
    overviewSteps: ['Show format and structure', 'Guest criteria', 'Interview style', 'Content themes'],
    status: 'published',
  },
  {
    _id: 'passions-pre-production',
    _type: 'kbItem',
    title: 'Pre-Production',
    slug: { current: 'passions-pre-production' },
    parent: { _ref: 'passions-show' },
    itemType: 'production-stage',
    icon: '📋',
    order: 2,
    youtubeShow: 'passions',
    productionStage: 'pre-production',
    content: createRichTextContent('Pre-production checklist and guidelines for Passions episodes including guest research, interview preparation, question development, and logistical coordination.'),
    tags: ['pre-production', 'planning', 'guest-research'],
    status: 'published',
  },

  // 4.3 Skyline Show
  {
    _id: 'skyline-show',
    _type: 'kbItem',
    title: 'Skyline',
    slug: { current: 'skyline' },
    parent: { _ref: 'youtube-channels' },
    itemType: 'youtube-show',
    icon: '🏙️',
    order: 3,
    youtubeShow: 'skyline',
    content: createRichTextContent('Skyline focuses on high-level business discussions, industry trends, and strategic insights for business leaders and entrepreneurs.'),
    status: 'published',
  },

  // 4.4 Tatak Show
  {
    _id: 'tatak-show',
    _type: 'kbItem',
    title: 'Tatak',
    slug: { current: 'tatak' },
    parent: { _ref: 'youtube-channels' },
    itemType: 'youtube-show',
    icon: '🇵🇭',
    order: 4,
    youtubeShow: 'tatak',
    content: createRichTextContent('Tatak showcases Filipino culture, entrepreneurship, and success stories, celebrating the Filipino community and business landscape.'),
    status: 'published',
  },

  // 4.5 At the Backdoor
  {
    _id: 'at-the-backdoor-show',
    _type: 'kbItem',
    title: 'At the Backdoor',
    slug: { current: 'at-the-backdoor' },
    parent: { _ref: 'youtube-channels' },
    itemType: 'youtube-show',
    icon: '🚪',
    order: 5,
    youtubeShow: 'at-the-backdoor',
    content: createRichTextContent('At the Backdoor provides behind-the-scenes insights, informal conversations, and a more casual approach to content creation and industry discussions.'),
    status: 'published',
  },

  // 5. Software & Tools
  {
    _id: 'software-tools',
    _type: 'kbItem',
    title: 'Software & Tools',
    slug: { current: 'software-tools' },
    itemType: 'folder',
    icon: '🛠️',
    order: 5,
    content: createRichTextContent('Documentation for all software tools, platforms, and systems used in content production and business operations.'),
  },
  {
    _id: 'content-creation-tools',
    _type: 'kbItem',
    title: 'Content Creation Tools',
    slug: { current: 'content-creation-tools' },
    parent: { _ref: 'software-tools' },
    itemType: 'document',
    icon: '🎨',
    order: 1,
    content: createRichTextContent('Comprehensive guide to content creation tools including Klap for short-form content, Opus Clip for video editing, Descript for transcription, and other specialized software.'),
    overviewSteps: ['Tool selection criteria', 'Setup and configuration', 'Workflow integration', 'Best practices'],
    videoRecording: 'https://share.descript.com/view/tools-overview',
    supportingDocuments: 'https://app.guidjar.com/playbooks/tools-setup',
    tags: ['tools', 'software', 'content-creation'],
    status: 'published',
  },
  {
    _id: 'automation-tools',
    _type: 'kbItem',
    title: 'Automation & Integration',
    slug: { current: 'automation-integration' },
    parent: { _ref: 'software-tools' },
    itemType: 'document',
    icon: '🤖',
    order: 2,
    content: createRichTextContent('Automation tools like Bardeen, ClickConnector, and integration platforms that streamline workflows, reduce repetitive tasks, and connect different systems.'),
    overviewSteps: ['Automation identification', 'Tool setup', 'Workflow integration', 'Monitoring and maintenance'],
    tags: ['automation', 'integration', 'workflow'],
    status: 'published',
  },
];

// Auto-folder assignment rules
const autoFolderRules = [
  {
    keywords: ['shooting', 'camera', 'filming', 'recording'],
    targetFolder: 'shooting',
    addTag: 'shooting',
  },
  {
    keywords: ['editing', 'post-production', 'cut', 'timeline'],
    targetFolder: 'editing',
    addTag: 'editing',
  },
  {
    keywords: ['off-the-record', 'otr'],
    targetFolder: 'off-the-record-show',
    addTag: 'off-the-record',
  },
  {
    keywords: ['passions', 'passion'],
    targetFolder: 'passions-show',
    addTag: 'passions',
  },
  {
    keywords: ['freelancer', 'contractor', 'external'],
    targetFolder: 'freelancer-management',
    addTag: 'freelancers',
  },
];

async function setupHierarchicalKnowledgeBase() {
  try {
    console.log('🚀 Setting up hierarchical knowledge base for VONAS Media...');
    
    // Clean existing content
    console.log('\n🧹 Cleaning existing knowledge base...');
    const existingItems = await client.fetch(`*[_type == "kbItem"]`);
    for (const item of existingItems) {
      await client.delete(item._id);
      console.log(`🗑️  Deleted: ${item.title || item._id}`);
    }
    
    // Import hierarchical structure
    console.log('\n📁 Creating hierarchical structure...');
    for (const item of hierarchicalStructure) {
      await client.createOrReplace({
        ...item,
        lastUpdated: new Date().toISOString(),
      });
      
      const typeEmoji = item.itemType === 'folder' ? '📁' : item.itemType === 'youtube-show' ? '📺' : '📄';
      const parentInfo = item.parent ? ' (child item)' : ' (top-level)';
      console.log(`✓ ${typeEmoji} ${item.title}${parentInfo}`);
    }
    
    console.log('\n🎉 Hierarchical knowledge base setup completed!');
    console.log('\n📊 Structure Summary:');
    console.log('├── 🏢 About VONAS Media');
    console.log('│   ├── 📋 Company Overview');
    console.log('│   ├── 🎯 Vision & Mission');
    console.log('│   └── 💎 Company Values');
    console.log('├── 🎓 Internship Program');
    console.log('│   ├── 📝 Intern Onboarding');
    console.log('│   └── 📖 Intern Handbook');
    console.log('├── 🤝 Freelancer Management');
    console.log('│   ├── 📋 Work Collaboration Guidelines');
    console.log('│   └── 💰 Rates & Payment Terms');
    console.log('├── 📺 YouTube Channels');
    console.log('│   ├── 🎙️ Off the Record');
    console.log('│   │   ├── 📄 About Off the Record');
    console.log('│   │   ├── 🎬 Shooting Guidelines');
    console.log('│   │   └── ✂️ Editing Workflow');
    console.log('│   ├── 🔥 Passions');
    console.log('│   │   ├── 📄 About Passions');
    console.log('│   │   └── 📋 Pre-Production');
    console.log('│   ├── 🏙️ Skyline');
    console.log('│   ├── 🇵🇭 Tatak');
    console.log('│   └── 🚪 At the Backdoor');
    console.log('└── 🛠️ Software & Tools');
    console.log('    ├── 🎨 Content Creation Tools');
    console.log('    └── 🤖 Automation & Integration');
    
    console.log('\n✅ Features implemented:');
    console.log('✅ Unlimited nesting capability');
    console.log('✅ YouTube show-specific organization');
    console.log('✅ Production stage categorization');
    console.log('✅ Auto-tagging system ready');
    console.log('✅ Rich text content support');
    console.log('✅ Media files integration (Descript + Guidjar)');
    console.log('✅ Flexible hierarchy that\'s easy to reorganize');

  } catch (error) {
    console.error('❌ Error setting up hierarchical knowledge base:', error);
  }
}

// Run the setup
setupHierarchicalKnowledgeBase();