// Populate Comprehensive Content for Vonas Media Knowledge Base
// This script adds detailed content to the existing hierarchical structure

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk5MUsj2R008AHzNno2deJXdpndyDpRemUgr6KUs7HqxU21wEF88eJAWlBU657T86Wc29WpNftZuwj1KaThWN8vSPlmQRO0y3qRAwjTa56Eglbik5U4d4a95QKyUj1JtTDrou9JnGIw4iF535R6secIxTkrxG5Rh0puiPGRoB8u0c6P1TtF9',
  useCdn: false
});

// Rich text content templates
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

// YouTube Show Content Data
const showContent = {
  'off-the-record': {
    description: 'Off the Record is VONAS Media\'s flagship conversational series, featuring in-depth interviews with industry professionals, thought leaders, and creative minds. This show focuses on authentic, unscripted conversations that reveal the human stories behind professional success.',
    productionWorkflow: `Our Off the Record production process involves:

1. **Guest Research & Booking**
   - Identify potential guests through network connections and industry research
   - Initial outreach and scheduling coordination
   - Pre-interview briefing and technical setup verification

2. **Pre-Production Setup**
   - Location scouting for intimate interview settings
   - Equipment setup including multiple camera angles
   - Audio testing and backup recording systems
   - Lighting design for natural, conversational atmosphere

3. **Interview Conduct**
   - 60-90 minute recorded conversations
   - Flexible question flow based on guest responses
   - Multiple takes for key moments if needed
   - B-roll footage collection

4. **Post-Production**
   - Multi-camera edit with dynamic angle changes
   - Audio enhancement and noise reduction
   - Color correction and visual consistency
   - Title graphics and lower thirds creation
   - Final review and approval process`,
    episodes: [
      {
        title: 'Building Authentic Brands in the Digital Age',
        guest: 'Sarah Chen - Brand Strategist',
        topics: ['Brand authenticity', 'Digital marketing', 'Social media strategy']
      },
      {
        title: 'The Future of Remote Work Culture',
        guest: 'Marcus Rodriguez - HR Director',
        topics: ['Remote work', 'Team culture', 'Productivity tools']
      }
    ]
  },
  'passions': {
    description: 'Passions is our creative showcase series that highlights individuals pursuing their deepest interests and creative endeavors. Each episode explores the intersection of personal passion and professional success.',
    productionWorkflow: `Passions production emphasizes visual storytelling:

1. **Subject Discovery**
   - Community outreach for passionate individuals
   - Portfolio review and story assessment
   - Initial consultation and story planning

2. **Visual Planning**
   - Storyboard creation for narrative flow
   - Location scouting in subject's environment
   - Equipment planning for creative shots
   - Timeline coordination with subject's schedule

3. **Production**
   - Day-in-the-life filming approach
   - Interview segments with creative work demonstrations
   - Artistic process documentation
   - Environmental portrait photography

4. **Creative Post-Production**
   - Cinematic editing with artistic flair
   - Music selection and sound design
   - Color grading for mood enhancement
   - Motion graphics for passion project showcases`,
    episodes: [
      {
        title: 'Pottery as Meditation',
        subject: 'Elena Vasquez - Ceramic Artist',
        focus: 'How traditional pottery techniques provide mental clarity in modern life'
      },
      {
        title: 'Urban Beekeeping Revolution',
        subject: 'David Kim - Urban Beekeeper',
        focus: 'Sustainable city living through rooftop apiaries'
      }
    ]
  },
  'skyline': {
    description: 'Skyline captures the architectural and urban stories that shape our cities. This series explores buildings, spaces, and the communities they create through documentary-style storytelling.',
    productionWorkflow: `Skyline requires specialized architectural filming:

1. **Location Research**
   - Architectural significance assessment
   - Community impact evaluation
   - Access permission coordination
   - Historical research and context building

2. **Technical Planning**
   - Drone filming permits and safety protocols
   - Specialized architectural photography equipment
   - Time-lapse setup for construction or daily activity
   - Interview coordination with architects and residents

3. **Multi-Day Production**
   - Golden hour filming for optimal lighting
   - Community interaction documentation
   - Architectural detail photography
   - Resident and architect interviews

4. **Documentary Post-Production**
   - Narrative structure editing
   - Drone footage integration
   - Historical photo/video integration
   - Informational graphics and building statistics`,
    episodes: [
      {
        title: 'The Green Building Revolution',
        location: 'LEED Platinum Office Complex',
        focus: 'Sustainable architecture impact on urban environment'
      },
      {
        title: 'Community Gardens in Concrete',
        location: 'Rooftop Gardens Network',
        focus: 'Urban agriculture transforming city landscapes'
      }
    ]
  }
};

// Production Stage Workflow Content
const productionStageContent = {
  'pre-production': {
    title: 'Pre-Production Planning and Preparation',
    overview: 'Comprehensive planning phase covering concept development, resource allocation, scheduling, and technical preparation.',
    detailedSteps: [
      {
        phase: 'Concept Development',
        tasks: [
          'Story concept refinement and validation',
          'Target audience identification and analysis',
          'Competitive landscape research',
          'Creative direction establishment'
        ],
        deliverables: ['Creative Brief', 'Story Outline', 'Target Audience Profile'],
        timeline: '2-3 weeks'
      },
      {
        phase: 'Resource Planning',
        tasks: [
          'Budget creation and approval',
          'Team member assignment',
          'Equipment requirements assessment',
          'Location scouting and booking'
        ],
        deliverables: ['Production Budget', 'Team Roster', 'Equipment List', 'Location Agreements'],
        timeline: '1-2 weeks'
      },
      {
        phase: 'Schedule Coordination',
        tasks: [
          'Production calendar creation',
          'Talent and crew availability confirmation',
          'Permit applications and approvals',
          'Backup date identification'
        ],
        deliverables: ['Master Production Schedule', 'Permit Documentation', 'Contingency Plans'],
        timeline: '1 week'
      }
    ]
  },
  'shooting': {
    title: 'Production and Filming',
    overview: 'Active filming phase with on-location management, quality control, and real-time problem solving.',
    detailedSteps: [
      {
        phase: 'Setup and Testing',
        tasks: [
          'Equipment setup and calibration',
          'Audio and video testing',
          'Lighting adjustment and optimization',
          'Backup system verification'
        ],
        timeline: '2-3 hours daily',
        criticalPoints: ['Audio levels', 'White balance', 'Focus accuracy']
      },
      {
        phase: 'Active Filming',
        tasks: [
          'Scene direction and guidance',
          'Multiple take management',
          'Real-time quality monitoring',
          'Continuous backup recording'
        ],
        timeline: 'Variable by content type',
        criticalPoints: ['Performance consistency', 'Technical quality', 'Story continuity']
      },
      {
        phase: 'Wrap and Review',
        tasks: [
          'Equipment breakdown and storage',
          'Footage verification and backup',
          'Location cleanup and restoration',
          'Daily production notes compilation'
        ],
        timeline: '1-2 hours daily',
        criticalPoints: ['Footage integrity', 'Complete coverage', 'Equipment security']
      }
    ]
  },
  'editing': {
    title: 'Post-Production Editing',
    overview: 'Creative editing phase transforming raw footage into compelling narrative content.',
    detailedSteps: [
      {
        phase: 'Footage Organization',
        tasks: [
          'Raw footage ingestion and cataloging',
          'Backup verification and cloud storage',
          'Preliminary footage review and notes',
          'Edit timeline creation and structure'
        ],
        tools: ['DaVinci Resolve', 'Adobe Premiere Pro', 'Final Cut Pro'],
        timeline: '1-2 days'
      },
      {
        phase: 'Rough Cut Creation',
        tasks: [
          'Story structure assembly',
          'Key moment identification and placement',
          'Pacing establishment',
          'Initial audio sync and adjustment'
        ],
        deliverables: ['Rough Cut v1', 'Edit Notes', 'Timing Breakdown'],
        timeline: '3-5 days'
      },
      {
        phase: 'Fine Cut Refinement',
        tasks: [
          'Transition smoothing and enhancement',
          'Audio mixing and sound design',
          'Color correction and grading',
          'Graphics and title integration'
        ],
        deliverables: ['Fine Cut', 'Audio Mix', 'Color Grade'],
        timeline: '2-4 days'
      }
    ]
  }
};

// Tools and Systems Documentation
const toolsSystemsContent = {
  'descript-workflows': {
    title: 'Descript Video Editing Workflows',
    overview: 'Comprehensive guide to using Descript for efficient video editing with text-based editing, transcription, and AI-powered features.',
    sections: [
      {
        title: 'Getting Started with Descript',
        content: `Descript revolutionizes video editing by treating video like a text document. Here's how to maximize its potential:

**Initial Setup:**
- Create new project and import media files
- Allow automatic transcription processing (typically 2-3 minutes per hour of content)
- Review and correct transcription accuracy
- Set up project organization with folders and naming conventions

**Text-Based Editing:**
- Edit video by editing the transcript
- Delete filler words ("um", "uh", "like") directly from text
- Rearrange content by cutting and pasting transcript sections
- Use Find & Replace for consistent terminology changes`
      },
      {
        title: 'Advanced Descript Features',
        content: `**Overdub and Voice Cloning:**
- Train Overdub voice model with 10+ minutes of clean audio
- Generate new speech for corrections and additions
- Maintain speaker consistency across edits
- Use for fixing mispronunciations without re-recording

**Studio Sound Enhancement:**
- Apply Studio Sound AI to remove background noise
- Adjust intensity levels for different recording conditions
- Preview before/after comparisons
- Batch process multiple audio tracks

**Multi-track Editing:**
- Manage multiple audio and video tracks
- Sync external audio with video footage
- Layer background music and sound effects
- Export stems for further mixing in other applications`
      }
    ]
  },
  'video-editing-premiere': {
    title: 'Adobe Premiere Pro Advanced Workflows',
    overview: 'Professional video editing workflows using Adobe Premiere Pro for high-quality content production.',
    keyWorkflows: [
      {
        name: 'Multi-Camera Editing Setup',
        steps: [
          'Import all camera angles and audio sources',
          'Create multi-camera source sequence',
          'Sync using timecode, audio waveforms, or markers',
          'Edit on timeline with multi-camera switching',
          'Fine-tune individual angles and audio levels'
        ]
      },
      {
        name: 'Color Correction Workflow',
        steps: [
          'Apply primary color correction (exposure, highlights, shadows)',
          'Secondary color correction for specific elements',
          'Use scopes (waveform, vectorscope) for accurate colors',
          'Apply creative color grading for mood',
          'Match shots within scenes for consistency'
        ]
      },
      {
        name: 'Audio Post-Production',
        steps: [
          'Normalize audio levels across all clips',
          'Apply noise reduction using adaptive noise reduction',
          'EQ adjustment for voice clarity',
          'Compression for consistent dynamic range',
          'Add background music and sound effects layers'
        ]
      }
    ]
  }
};

// Team Management and Operations
const teamOperationsContent = {
  'project-management': {
    title: 'VONAS Media Project Management System',
    overview: 'Comprehensive project management approach using Monday.com, Slack integration, and custom workflow automation.',
    systems: [
      {
        name: 'Monday.com Workspace Organization',
        structure: `**Board Structure:**
- Master Production Calendar: All projects with phases and deadlines
- Individual Show Boards: Detailed task management per show
- Resource Management: Equipment, locations, team availability
- Client Communication: External stakeholder updates and approvals

**Automation Rules:**
- Auto-assign team members based on project type
- Status change notifications to relevant team members
- Deadline reminders 48 hours before due dates
- Budget tracking with spending alerts at 80% threshold`
      },
      {
        name: 'Slack Communication Protocols',
        channels: [
          {
            name: '#daily-standup',
            purpose: 'Daily team check-ins and priority updates',
            schedule: '9:00 AM PST weekdays'
          },
          {
            name: '#production-updates',
            purpose: 'Real-time filming and editing progress',
            integration: 'Monday.com status updates'
          },
          {
            name: '#creative-review',
            purpose: 'Content feedback and creative direction',
            workflow: 'Frame.io integration for video reviews'
          }
        ]
      }
    ]
  },
  'quality-standards': {
    title: 'Content Quality Standards and Review Process',
    overview: 'Established quality benchmarks and multi-stage review process ensuring consistent high-quality output.',
    standards: {
      technical: [
        'Video Resolution: Minimum 1080p, preferred 4K for archival',
        'Audio Quality: -12dB to -6dB levels, noise floor below -60dB',
        'Color Grading: Consistent color temperature within projects',
        'File Management: Standardized naming conventions and folder structure'
      ],
      creative: [
        'Story Structure: Clear beginning, middle, end with defined message',
        'Pacing: Appropriate to content type and audience attention span',
        'Visual Composition: Rule of thirds, leading lines, depth of field',
        'Audio Mix: Balanced levels between dialogue, music, and effects'
      ],
      brand: [
        'Logo Placement: Consistent positioning and sizing across content',
        'Color Palette: Adherence to VONAS Media brand colors',
        'Typography: Approved font families and sizing hierarchies',
        'Tone of Voice: Professional yet approachable communication style'
      ]
    }
  }
};

// FAQ Content
const comprehensiveFAQs = [
  {
    faqId: 'FAQ-001',
    question: 'What equipment do we use for multi-camera interview setups?',
    answer: 'Our standard multi-camera setup includes: 3x Sony FX6 cameras (wide, medium, close-up angles), Rode Wireless Pro microphone systems, Aputure 600d LED lights with softboxes, Sachtler tripods with fluid heads, and Atomos Ninja V+ external recorders for backup footage.',
    category: 'Equipment',
    tags: ['cameras', 'interviews', 'equipment-setup'],
    relatedContent: ['off-the-record-equipment', 'multi-camera-workflows']
  },
  {
    faqId: 'FAQ-002',
    question: 'How do we handle client revisions and feedback loops?',
    answer: 'We use Frame.io for video review and collaboration. Clients receive review links with timestamped commenting capability. We implement a maximum of 3 revision rounds: initial feedback, refinement round, and final approval. Each round has a 48-hour turnaround expectation.',
    category: 'Client Relations',
    tags: ['revisions', 'feedback', 'client-management'],
    relatedContent: ['client-communication-protocols', 'review-workflow']
  },
  {
    faqId: 'FAQ-003',
    question: 'What are our standard turnaround times for different content types?',
    answer: 'Standard turnaround times: Interview content (5-7 business days), Documentary-style pieces (10-14 business days), Social media cuts (2-3 business days), Live event coverage (7-10 business days). Rush delivery available with 50% premium fee.',
    category: 'Project Management',
    tags: ['timelines', 'delivery', 'project-planning'],
    relatedContent: ['production-scheduling', 'project-management-system']
  },
  {
    faqId: 'FAQ-004',
    question: 'How do we backup and store project files?',
    answer: 'Three-tier backup system: Local NAS storage (immediate access), Cloud backup via Google Drive (secondary), and LTO tape archive (long-term). Raw footage retained for 2 years, final deliverables permanently archived. All projects have unique folder structures with standardized naming conventions.',
    category: 'File Management',
    tags: ['backup', 'storage', 'file-management'],
    relatedContent: ['data-management-protocols', 'archive-system']
  },
  {
    faqId: 'FAQ-005',
    question: 'What are our color grading standards and workflows?',
    answer: 'We shoot in S-Log3 for maximum flexibility. Primary correction establishes proper exposure and white balance. Secondary correction for skin tones and environmental elements. Creative grading matches show-specific style guides. Final delivery in Rec.709 for broadcast, P3 for streaming platforms.',
    category: 'Post Production',
    tags: ['color-grading', 'technical-standards', 'workflows'],
    relatedContent: ['color-correction-workflow', 'technical-specifications']
  }
];

// Main population function
async function populateComprehensiveContent() {
  console.log('🚀 Starting comprehensive content population...');

  try {
    // First, let's get existing items to understand structure
    const existingItems = await client.fetch(`
      *[_type == "kbItem"] {
        _id,
        title,
        "slug": slug.current,
        itemType,
        youtubeShow,
        productionStage
      }
    `);

    console.log(`📊 Found ${existingItems.length} existing items`);

    // Find YouTube show folders and add detailed content
    for (const show of Object.keys(showContent)) {
      const showFolder = existingItems.find(item => 
        item.youtubeShow === show && item.itemType === 'youtube-show'
      );

      if (showFolder) {
        console.log(`📺 Updating ${show} content...`);
        
        const showData = showContent[show];
        
        // Update show folder with rich description
        await client.patch(showFolder._id)
          .set({
            content: createRichTextContent(showData.description),
            overviewSteps: [
              'Review production workflow and guidelines',
              'Understand show-specific creative direction',
              'Follow established quality standards',
              'Coordinate with team for optimal results'
            ]
          })
          .commit();

        // Add workflow document
        const workflowDoc = {
          _type: 'kbItem',
          title: `${show.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Production Workflow`,
          slug: { _type: 'slug', current: `${show}-production-workflow` },
          itemType: 'document',
          youtubeShow: show,
          parent: { _type: 'reference', _ref: showFolder._id },
          content: createRichTextContent(showData.productionWorkflow),
          tags: ['workflow', 'production', show],
          status: 'published',
          lastUpdated: new Date().toISOString()
        };

        const workflowResult = await client.create(workflowDoc);
        console.log(`✅ Created workflow doc for ${show}: ${workflowResult._id}`);
      }
    }

    // Add production stage detailed workflows
    for (const stage of Object.keys(productionStageContent)) {
      const stageFolder = existingItems.find(item => 
        item.productionStage === stage && item.itemType === 'production-stage'
      );

      if (stageFolder) {
        console.log(`🎬 Updating ${stage} workflow...`);
        
        const stageData = productionStageContent[stage];
        
        // Create detailed workflow content
        const workflowContent = `# ${stageData.title}

${stageData.overview}

## Detailed Workflow Steps

${stageData.detailedSteps.map(step => `
### ${step.phase}

**Timeline:** ${step.timeline}

**Tasks:**
${step.tasks.map(task => `- ${task}`).join('\n')}

${step.deliverables ? `**Deliverables:**
${step.deliverables.map(deliverable => `- ${deliverable}`).join('\n')}` : ''}

${step.criticalPoints ? `**Critical Success Factors:**
${step.criticalPoints.map(point => `- ${point}`).join('\n')}` : ''}

${step.tools ? `**Recommended Tools:**
${step.tools.map(tool => `- ${tool}`).join('\n')}` : ''}
`).join('\n')}`;

        await client.patch(stageFolder._id)
          .set({
            content: createRichTextContent(workflowContent),
            overviewSteps: stageData.detailedSteps.map(step => step.phase)
          })
          .commit();

        console.log(`✅ Updated ${stage} workflow content`);
      }
    }

    // Add tools and systems documentation
    for (const [toolKey, toolData] of Object.entries(toolsSystemsContent)) {
      const toolDoc = {
        _type: 'kbItem',
        title: toolData.title,
        slug: { _type: 'slug', current: toolKey },
        itemType: 'document',
        content: createRichTextContent(`# ${toolData.title}

${toolData.overview}

${toolData.sections ? toolData.sections.map(section => `
## ${section.title}

${section.content}
`).join('\n') : ''}

${toolData.keyWorkflows ? `
## Key Workflows

${toolData.keyWorkflows.map(workflow => `
### ${workflow.name}

${workflow.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
`).join('\n')}` : ''}

${toolData.systems ? toolData.systems.map(system => `
## ${system.name}

${system.structure || ''}

${system.channels ? system.channels.map(channel => `
### ${channel.name}
- **Purpose:** ${channel.purpose}
${channel.schedule ? `- **Schedule:** ${channel.schedule}` : ''}
${channel.integration ? `- **Integration:** ${channel.integration}` : ''}
${channel.workflow ? `- **Workflow:** ${channel.workflow}` : ''}
`).join('\n') : ''}
`).join('\n') : ''}`),
        tags: ['tools', 'workflows', 'systems'],
        status: 'published',
        lastUpdated: new Date().toISOString()
      };

      const toolResult = await client.create(toolDoc);
      console.log(`✅ Created tool documentation: ${toolData.title} (${toolResult._id})`);
    }

    // Add team operations content
    for (const [opKey, opData] of Object.entries(teamOperationsContent)) {
      const opDoc = {
        _type: 'kbItem',
        title: opData.title,
        slug: { _type: 'slug', current: opKey },
        itemType: 'document',
        content: createRichTextContent(`# ${opData.title}

${opData.overview}

${opData.systems ? opData.systems.map(system => `
## ${system.name}

${system.structure || ''}

${system.channels ? system.channels.map(channel => `
### ${channel.name}
- **Purpose:** ${channel.purpose}
${channel.schedule ? `- **Schedule:** ${channel.schedule}` : ''}
${channel.integration ? `- **Integration:** ${channel.integration}` : ''}
${channel.workflow ? `- **Workflow:** ${channel.workflow}` : ''}
`).join('\n') : ''}
`).join('\n') : ''}

${opData.standards ? `
## Quality Standards

### Technical Standards
${opData.standards.technical.map(standard => `- ${standard}`).join('\n')}

### Creative Standards  
${opData.standards.creative.map(standard => `- ${standard}`).join('\n')}

### Brand Standards
${opData.standards.brand.map(standard => `- ${standard}`).join('\n')}
` : ''}`),
        tags: ['team-management', 'operations', 'standards'],
        status: 'published',
        lastUpdated: new Date().toISOString()
      };

      const opResult = await client.create(opDoc);
      console.log(`✅ Created operations documentation: ${opData.title} (${opResult._id})`);
    }

    // Create comprehensive FAQ entries
    console.log('❓ Creating FAQ entries...');
    
    for (const faq of comprehensiveFAQs) {
      const faqDoc = {
        _type: 'faq',
        faqId: faq.faqId,
        question: faq.question,
        answer: createRichTextContent(faq.answer),
        category: faq.category,
        tags: faq.tags,
        order: parseInt(faq.faqId.split('-')[1]),
        lastUpdated: new Date().toISOString()
      };

      const faqResult = await client.create(faqDoc);
      console.log(`✅ Created FAQ: ${faq.faqId} (${faqResult._id})`);
    }

    console.log('🎉 Comprehensive content population completed successfully!');
    console.log(`
📊 Content Summary:
- Updated YouTube show folders with detailed descriptions and workflows
- Added production stage comprehensive workflows
- Created tools and systems documentation
- Added team operations and quality standards
- Populated ${comprehensiveFAQs.length} detailed FAQ entries

🚀 Your knowledge base is now fully populated with professional content!
    `);

  } catch (error) {
    console.error('❌ Error populating content:', error);
    throw error;
  }
}

// Run the script
populateComprehensiveContent();