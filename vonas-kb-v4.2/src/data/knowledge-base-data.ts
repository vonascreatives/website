export interface KnowledgeBaseItem {
  id: string;
  title: string;
  description: string;
  type: 'Article' | 'Video' | 'Workflow' | 'Reference';
  lastUpdated: string;
  tags: string[];
  readTime: string;
  imageUrl?: string;
  // Sanity-driven optional fields
  summary?: string;
  hasContent?: boolean;
  body?: any;
  workflowSteps?: Array<{
    stepNumber: number;
    headline: string;
    description: string;
  }>;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'pending';
  details?: string;
}

export interface KnowledgeBaseSection {
  id: string;
  title: string;
  items: KnowledgeBaseItem[];
  isExpanded: boolean;
}

export interface Show {
  id: string;
  name: string;
  sections: KnowledgeBaseSection[];
}

export const shows: Show[] = [
  {
    id: 'off-the-record',
    name: 'Off the Record',
    sections: [
      {
        id: 'pre-production',
        title: 'Pre-Production',
        isExpanded: true,
        items: [
          {
            id: 'concept-development',
            title: 'Concept Development',
            description: 'Initial ideation and concept planning for episodes',
            type: 'Article',
            lastUpdated: 'January 10, 2024',
            tags: ['planning', 'creative'],
            readTime: '6 min read'
          },
          {
            id: 'script-writing',
            title: 'Script Writing',
            description: 'Guidelines for writing engaging interview scripts',
            type: 'Workflow',
            lastUpdated: 'January 8, 2024',
            tags: ['writing', 'content'],
            readTime: '8 min read'
          },
          {
            id: 'guest-coordination',
            title: 'Guest Coordination',
            description: 'Process for booking and coordinating with guests',
            type: 'Workflow',
            lastUpdated: 'December 20, 2023',
            tags: ['coordination', 'guests'],
            readTime: '5 min read'
          },
          {
            id: 'research-prep',
            title: 'Research & Prep',
            description: 'Research methodologies and preparation techniques',
            type: 'Article',
            lastUpdated: 'January 5, 2024',
            tags: ['research', 'preparation'],
            readTime: '7 min read'
          }
        ]
      },
      {
        id: 'shooting',
        title: 'Shooting',
        isExpanded: true,
        items: [
          {
            id: 'equipment-setup',
            title: 'Equipment Setup',
            description: 'Complete guide for setting up professional video recording equipment',
            type: 'Workflow',
            lastUpdated: 'January 15, 2024',
            tags: ['equipment', 'workflow', 'video-production'],
            readTime: '10 min read'
          },
          {
            id: 'lighting-guide',
            title: 'Lighting Guide',
            description: 'Professional lighting techniques for video interviews',
            type: 'Workflow',
            lastUpdated: 'January 12, 2024',
            tags: ['lighting', 'technical'],
            readTime: '8 min read'
          },
          {
            id: 'audio-recording',
            title: 'Audio Recording',
            description: 'Best practices for crystal clear audio capture',
            type: 'Article',
            lastUpdated: 'January 18, 2024',
            tags: ['audio', 'technical'],
            readTime: '6 min read'
          },
          {
            id: 'multiple-camera-angles',
            title: 'Multiple Camera Angles',
            description: 'Setting up and managing multiple camera perspectives',
            type: 'Video',
            lastUpdated: 'December 28, 2023',
            tags: ['cameras', 'technical'],
            readTime: '12 min watch'
          }
        ]
      },
      {
        id: 'post-production',
        title: 'Post-Production',
        isExpanded: true,
        items: [
          {
            id: 'video-editing',
            title: 'Video Editing',
            description: 'Complete video editing workflow and best practices',
            type: 'Workflow',
            lastUpdated: 'January 20, 2024',
            tags: ['editing', 'post-production'],
            readTime: '15 min read'
          },
          {
            id: 'color-correction',
            title: 'Color Correction',
            description: 'Professional color grading and correction techniques',
            type: 'Article',
            lastUpdated: 'January 14, 2024',
            tags: ['color', 'editing'],
            readTime: '9 min read'
          },
          {
            id: 'audio-mixing',
            title: 'Audio Mixing',
            description: 'Audio post-processing and mixing guidelines',
            type: 'Workflow',
            lastUpdated: 'January 16, 2024',
            tags: ['audio', 'mixing'],
            readTime: '11 min read'
          },
          {
            id: 'thumbnail-creation',
            title: 'Thumbnail Creation',
            description: 'Designing compelling thumbnails that drive clicks',
            type: 'Article',
            lastUpdated: 'January 22, 2024',
            tags: ['design', 'thumbnails'],
            readTime: '7 min read'
          },
          {
            id: 'seo-optimization',
            title: 'SEO Optimization',
            description: 'Optimizing video content for search and discovery',
            type: 'Reference',
            lastUpdated: 'January 25, 2024',
            tags: ['seo', 'optimization'],
            readTime: '8 min read'
          }
        ]
      },
      {
        id: 'distribution',
        title: 'Distribution',
        isExpanded: true,
        items: [
          {
            id: 'youtube-upload',
            title: 'YouTube Upload',
            description: 'Complete process for uploading and configuring videos',
            type: 'Workflow',
            lastUpdated: 'January 30, 2024',
            tags: ['youtube', 'upload'],
            readTime: '6 min read'
          },
          {
            id: 'social-media',
            title: 'Social Media',
            description: 'Cross-platform social media promotion strategies',
            type: 'Article',
            lastUpdated: 'January 28, 2024',
            tags: ['social-media', 'promotion'],
            readTime: '9 min read'
          },
          {
            id: 'analytics-setup',
            title: 'Analytics Setup',
            description: 'Setting up tracking and analytics for performance monitoring',
            type: 'Reference',
            lastUpdated: 'February 1, 2024',
            tags: ['analytics', 'tracking'],
            readTime: '5 min read'
          }
        ]
      }
    ]
  },
  {
    id: 'passions',
    name: 'Passions',
    sections: [
      {
        id: 'content-planning',
        title: 'Content Planning',
        isExpanded: true,
        items: [
          {
            id: 'passion-discovery',
            title: 'Passion Discovery Process',
            description: 'Methods for identifying compelling passion stories',
            type: 'Workflow',
            lastUpdated: 'January 25, 2024',
            tags: ['discovery', 'content'],
            readTime: '8 min read'
          }
        ]
      }
    ]
  },
  {
    id: 'tech-talks',
    name: 'Tech Talks',
    sections: [
      {
        id: 'technical-setup',
        title: 'Technical Setup',
        isExpanded: true,
        items: [
          {
            id: 'screen-recording',
            title: 'Screen Recording Setup',
            description: 'Optimal configuration for recording technical demonstrations',
            type: 'Workflow',
            lastUpdated: 'February 2, 2024',
            tags: ['screen-recording', 'technical'],
            readTime: '7 min read'
          }
        ]
      }
    ]
  },
  {
    id: 'weekly-wrap',
    name: 'Weekly Wrap',
    sections: [
      {
        id: 'weekly-planning',
        title: 'Weekly Planning',
        isExpanded: true,
        items: [
          {
            id: 'content-curation',
            title: 'Content Curation',
            description: 'Weekly content selection and curation process',
            type: 'Workflow',
            lastUpdated: 'January 31, 2024',
            tags: ['curation', 'weekly'],
            readTime: '6 min read'
          }
        ]
      }
    ]
  }
];

export const workflowSteps: WorkflowStep[] = [
  {
    id: 'camera-positioning',
    title: 'Camera Positioning',
    description: 'Set up the main camera at eye level, 6 feet from the interview subject. Ensure the background is clean and professional.',
    duration: '~5 minutes',
    status: 'completed'
  },
  {
    id: 'audio-equipment-setup',
    title: 'Audio Equipment Setup',
    description: 'Connect wireless microphones and test audio levels. Set up backup audio recording on separate device.',
    duration: '~8 minutes',
    status: 'completed'
  },
  {
    id: 'lighting-configuration',
    title: 'Lighting Configuration',
    description: 'Position key light, fill light, and background light. Test for proper exposure and color temperature consistency.',
    duration: '~10 minutes',
    status: 'in-progress'
  },
  {
    id: 'camera-settings',
    title: 'Camera Settings Configuration',
    description: 'Configure manual focus, frame rate, and recording quality settings.',
    duration: '~3 minutes',
    status: 'pending'
  },
  {
    id: 'final-testing',
    title: 'Final Testing & Rehearsal',
    description: 'Conduct final equipment test and brief rehearsal with all participants.',
    duration: '~7 minutes',
    status: 'pending'
  },
  {
    id: 'backup-verification',
    title: 'Backup Systems Verification',
    description: 'Verify all backup recording systems are functioning and properly configured.',
    duration: '~4 minutes',
    status: 'pending'
  }
];

export const mainSections = [
  'Company',
  'Team',
  'Production',
  'YouTube Shows',
  'Tools',
  'Partners',
  'Policies'
];
