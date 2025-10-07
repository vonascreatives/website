// Clean and Reorganize Knowledge Base Structure
// This script will delete the messy structure and create a clean, logical organization

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk5MUsj2R008AHzNno2deJXdpndyDpRemUgr6KUs7HqxU21wEF88eJAWlBU657T86Wc29WpNftZuwj1KaThWN8vSPlmQRO0y3qRAwjTa56Eglbik5U4d4a95QKyUj1JtTDrou9JnGIw4iF535R6secIxTkrxG5Rh0puiPGRoB8u0c6P1TtF9',
  useCdn: false
});

// Rich text content helper
const createRichTextContent = (text) => [
  {
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: text,
        marks: []
      }
    ]
  }
];

// Clean structure definition
const cleanStructure = {
  // Top Level Categories (Folders)
  folders: [
    {
      id: 'company-foundation',
      title: '🏢 Company Foundation',
      slug: 'company-foundation',
      description: 'Core organizational information, values, and company culture',
      order: 1
    },
    {
      id: 'team-operations',
      title: '👥 Team & Operations', 
      slug: 'team-operations',
      description: 'Team management, onboarding, and internal processes',
      order: 2
    },
    {
      id: 'production-workflows',
      title: '🎬 Production Workflows',
      slug: 'production-workflows', 
      description: 'Video production, editing, and content creation processes',
      order: 3
    },
    {
      id: 'youtube-shows',
      title: '📺 YouTube Shows',
      slug: 'youtube-shows',
      description: 'Show-specific guidelines and production information',
      order: 4
    },
    {
      id: 'tools-systems',
      title: '🛠️ Tools & Systems',
      slug: 'tools-systems',
      description: 'Software, databases, and automation tools',
      order: 5
    },
    {
      id: 'external-partnerships',
      title: '🤝 External Partnerships',
      slug: 'external-partnerships',
      description: 'Freelancer management and brand collaborations',
      order: 6
    },
    {
      id: 'policies-procedures',
      title: '📋 Policies & Procedures',
      slug: 'policies-procedures',
      description: 'HR policies, SOPs, and administrative guidelines',
      order: 7
    }
  ],
  
  // Documents organized by folder
  documents: {
    'company-foundation': [
      {
        title: 'About VONAS Media',
        slug: 'about-vonas-media',
        content: 'Complete company overview, history, and business model'
      },
      {
        title: 'Vision, Mission & Values',
        slug: 'vision-mission-values', 
        content: 'Strategic direction and core organizational values'
      }
    ],
    'team-operations': [
      {
        title: 'Team Structure & Roles',
        slug: 'team-structure-roles',
        content: 'Organizational chart and role definitions'
      },
      {
        title: 'Onboarding Process',
        slug: 'onboarding-process',
        content: 'Complete new hire integration process'
      },
      {
        title: 'Internal Communications',
        slug: 'internal-communications',
        content: 'Slack guidelines and meeting protocols'
      }
    ],
    'production-workflows': [
      {
        title: 'Video Production Process',
        slug: 'video-production-process',
        content: 'End-to-end video production workflow'
      },
      {
        title: 'Post-Production Guidelines',
        slug: 'post-production-guidelines', 
        content: 'Editing standards and quality control'
      },
      {
        title: 'Guest Management Process',
        slug: 'guest-management-process',
        content: 'Guest selection, coordination, and relationship management'
      },
      {
        title: 'Social Media Strategy',
        slug: 'social-media-strategy',
        content: 'Multi-platform content strategy and management'
      }
    ],
    'youtube-shows': [
      {
        title: 'Off the Record',
        slug: 'off-the-record-guide',
        youtubeShow: 'off-the-record',
        content: 'Complete production guide for OTR interviews'
      },
      {
        title: 'Passions',
        slug: 'passions-guide', 
        youtubeShow: 'passions',
        content: 'Creative showcase production guidelines'
      },
      {
        title: 'Skyline',
        slug: 'skyline-guide',
        youtubeShow: 'skyline',
        content: 'Architectural documentary production guide'
      },
      {
        title: 'Tatak',
        slug: 'tatak-guide',
        youtubeShow: 'tatak', 
        content: 'Handcraft showcase production guidelines'
      },
      {
        title: 'At the Backdoor',
        slug: 'at-the-backdoor-guide',
        youtubeShow: 'at-the-backdoor',
        content: 'Youth culture show production guide'
      }
    ],
    'tools-systems': [
      {
        title: 'Video Editing Software',
        slug: 'video-editing-software',
        content: 'Descript, Premiere Pro, and DaVinci Resolve workflows'
      },
      {
        title: 'Database Management',
        slug: 'database-management',
        content: 'Airtable and SmartSuite usage guidelines'
      },
      {
        title: 'Automation Tools',
        slug: 'automation-tools',
        content: 'Zapier, Bardeen, and workflow automation'
      }
    ],
    'external-partnerships': [
      {
        title: 'Freelancer Coordination',
        slug: 'freelancer-coordination',
        content: 'Managing external videographers, editors, and designers'
      },
      {
        title: 'Brand Partnerships',
        slug: 'brand-partnerships',
        content: 'Outreach, negotiation, and relationship management'
      }
    ],
    'policies-procedures': [
      {
        title: 'Time Off & PTO Policy',
        slug: 'time-off-pto-policy',
        content: 'Vacation requests and coverage procedures'
      },
      {
        title: 'Standard Operating Procedures',
        slug: 'standard-operating-procedures',
        content: 'Quality standards and process documentation'
      }
    ]
  }
};

async function cleanAndReorganizeKB() {
  console.log('🧹 Starting knowledge base cleanup and reorganization...');
  
  try {
    // Step 1: Get all existing items
    const allItems = await client.fetch(`*[_type == "kbItem"] { _id, title, "slug": slug.current }`);
    console.log(`📊 Found ${allItems.length} existing items to clean up`);
    
    // Step 2: Delete ALL existing items (fresh start)
    console.log('🗑️ Deleting all existing messy content...');
    
    const deletePromises = allItems.map(item => 
      client.delete(item._id)
        .then(() => console.log(`❌ Deleted: ${item.title}`))
        .catch(err => console.error(`Failed to delete ${item.title}:`, err))
    );
    
    await Promise.all(deletePromises);
    console.log('✅ All messy content deleted!');
    
    // Step 3: Create clean folder structure
    console.log('📁 Creating clean folder structure...');
    const folderRefs = {};
    
    for (const folder of cleanStructure.folders) {
      const folderDoc = {
        _type: 'kbItem',
        title: folder.title,
        slug: { _type: 'slug', current: folder.slug },
        itemType: 'folder',
        content: createRichTextContent(folder.description),
        order: folder.order,
        tags: ['folder', folder.id],
        status: 'published',
        lastUpdated: new Date().toISOString()
      };
      
      const createdFolder = await client.create(folderDoc);
      folderRefs[folder.id] = createdFolder._id;
      console.log(`📂 Created folder: ${folder.title}`);
    }
    
    // Step 4: Create organized documents
    console.log('📄 Creating organized documents...');
    let docCount = 0;
    
    for (const [folderId, documents] of Object.entries(cleanStructure.documents)) {
      const parentRef = folderRefs[folderId];
      
      for (const doc of documents) {
        const docData = {
          _type: 'kbItem',
          title: doc.title,
          slug: { _type: 'slug', current: doc.slug },
          itemType: 'document',
          parent: { _type: 'reference', _ref: parentRef },
          content: createRichTextContent(doc.content),
          overviewSteps: [
            'Review the complete guide',
            'Understand key processes and requirements', 
            'Apply guidelines in daily work',
            'Maintain quality standards'
          ],
          tags: [folderId, 'guide'],
          status: 'published',
          lastUpdated: new Date().toISOString()
        };
        
        // Add YouTube show reference if applicable
        if (doc.youtubeShow) {
          docData.youtubeShow = doc.youtubeShow;
          docData.tags.push('youtube-show', doc.youtubeShow);
        }
        
        const createdDoc = await client.create(docData);
        docCount++;
        console.log(`📄 Created: ${doc.title} in ${folderId}`);
      }
    }
    
    // Step 5: Create production stage references
    console.log('🎬 Creating production stage organization...');
    const productionStages = ['pre-production', 'shooting', 'editing', 'post-production', 'distribution'];
    
    for (const stage of productionStages) {
      const stageDoc = {
        _type: 'kbItem',
        title: `${stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' ')} Guidelines`,
        slug: { _type: 'slug', current: `${stage}-guidelines` },
        itemType: 'document',
        parent: { _type: 'reference', _ref: folderRefs['production-workflows'] },
        productionStage: stage,
        content: createRichTextContent(`Comprehensive guidelines for the ${stage.replace('-', ' ')} phase of content production.`),
        tags: ['production-stage', stage],
        status: 'published',
        lastUpdated: new Date().toISOString()
      };
      
      await client.create(stageDoc);
      console.log(`🎬 Created: ${stage} guidelines`);
    }
    
    console.log('🎉 Knowledge base cleanup and reorganization completed!');
    console.log(`📊 Final structure:`);
    console.log(`- ${cleanStructure.folders.length} main folders`);
    console.log(`- ${docCount} organized documents`);  
    console.log(`- ${productionStages.length} production stage guidelines`);
    console.log(`- Clean, logical hierarchy with consistent naming`);
    
  } catch (error) {
    console.error('❌ Error during cleanup and reorganization:', error);
    throw error;
  }
}

// Execute the cleanup and reorganization
cleanAndReorganizeKB();