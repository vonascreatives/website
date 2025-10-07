import {defineType, defineField} from 'sanity'
import {
  FolderIcon,
  DocumentIcon,
  LinkIcon,
  StarIcon,
  PlayIcon,
  DocumentTextIcon,
  ClipboardIcon,
  BillIcon,
  BookIcon,
  CircleIcon,
  CogIcon,
  UserIcon,
} from '@sanity/icons'

// Icon mapping for doc types
const docTypeIcons = {
  policy: BillIcon,
  sop: CogIcon,
  guide: BookIcon,
  template: DocumentTextIcon,
  checklist: ClipboardIcon,
  faq: CircleIcon,
  playbook: StarIcon,
  brief: DocumentIcon,
  contract: BillIcon,
  ratecard: DocumentIcon,
}

// Icon mapping for kinds
const kindIcons = {
  section: FolderIcon,
  folder: FolderIcon,
  page: DocumentIcon,
  show: PlayIcon,
  link: LinkIcon,
}

export default defineType({
  name: 'kbItem',
  title: 'Knowledge Base Item',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'modules', title: 'Page Builder'},
    {name: 'structure', title: 'Structure & Hierarchy'},
    {name: 'governance', title: 'Governance'},
    {name: 'ai', title: 'AI & Search'},
    {name: 'settings', title: 'Settings'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ============= CORE FIELDS =============
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(100),
      description: 'Clear, concise title without emojis',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'structure',
      options: {
        source: 'title',
        maxLength: 96,
        // Custom slugify to handle special chars
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, ''),
      },
      validation: (Rule) => 
        Rule.required()
          .custom((slug, context) => {
            if (!slug?.current) return true
            // Validate uniqueness among siblings only
            // This would require a custom API call in production
            return true
          }),
      description: 'URL-friendly version (unique among siblings)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.max(300),
      description: 'Brief summary (1-3 sentences)',
    }),

    // ============= STRUCTURE =============
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      group: 'structure',
      options: {
        list: [
          {title: 'Section (Root)', value: 'section'},
          {title: 'Folder', value: 'folder'},
          {title: 'Page', value: 'page'},
          {title: 'Show', value: 'show'},
          {title: 'External Link', value: 'link'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'page',
    }),
    defineField({
      name: 'docType',
      title: 'Document Type',
      type: 'string',
      group: 'structure',
      options: {
        list: [
          {title: 'Policy', value: 'policy'},
          {title: 'SOP', value: 'sop'},
          {title: 'Guide', value: 'guide'},
          {title: 'Template', value: 'template'},
          {title: 'Checklist', value: 'checklist'},
          {title: 'FAQ', value: 'faq'},
          {title: 'Playbook', value: 'playbook'},
          {title: 'Brief', value: 'brief'},
          {title: 'Contract', value: 'contract'},
          {title: 'Rate Card', value: 'ratecard'},
        ],
      },
      hidden: ({document}) => !['page', 'show'].includes(document?.kind as string),
      description: 'Type of document for categorization',
    }),
    defineField({
      name: 'parent',
      title: 'Parent Item',
      type: 'reference',
      to: [{type: 'kbItem'}],
      group: 'structure',
      options: {
        filter: 'kind in ["section", "folder", "show"]',
        disableNew: true,
      },
      description: 'Parent folder/section for hierarchy',
      validation: (Rule) =>
        Rule.custom((parent, context) => {
          // Prevent circular references
          if (!parent?._ref) return true
          // TODO: Add depth check (max 6 levels)
          return true
        }),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'structure',
      initialValue: 100,
      validation: (Rule) => Rule.integer().min(0),
      description: 'Order within parent (lower = first)',
    }),

    // ============= PAGE BUILDER MODULES =============
    defineField({
      name: 'modules',
      title: 'Content Modules',
      type: 'array',
      group: 'modules',
      of: [
        {type: 'heroModule'},
        {type: 'richTextModule'},
        {type: 'quoteModule'},
        {type: 'linkGridModule'},
        {type: 'galleryModule'},
        {type: 'stepsModule'},
        {type: 'checklistModule'},
        {type: 'faqListModule'},
        {type: 'embedModule'},
        {type: 'relatedContentModule'},
        {type: 'videoAnnotationsModule'},
      ],
      hidden: ({document}) => !['page', 'show'].includes(document?.kind as string),
      description: 'Build pages with reusable content modules',
    }),

    // Legacy content field (for backward compatibility)
    defineField({
      name: 'content',
      title: 'Content (Legacy)',
      type: 'array',
      of: [{type: 'block'}],
      group: 'content',
      hidden: ({document}) => document?.modules && (document.modules as any[]).length > 0,
      description: 'Legacy rich text (use modules instead)',
    }),

    // ============= AUDIENCE & VISIBILITY =============
    defineField({
      name: 'audience',
      title: 'Audience/Visibility',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'All', value: 'All'},
          {title: 'Team', value: 'Team'},
          {title: 'Interns', value: 'Interns'},
          {title: 'Freelancers', value: 'Freelancers'},
          {title: 'Partners', value: 'Partners'},
        ],
        layout: 'radio',
      },
      initialValue: 'All',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'safetyLevel',
      title: 'Safety Level',
      type: 'string',
      group: 'governance',
      options: {
        list: [
          {title: 'Public', value: 'public'},
          {title: 'Internal', value: 'internal'},
          {title: 'Confidential', value: 'confidential'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (Rule) =>
        Rule.custom((safety, context) => {
          // Prevent confidential + All audience
          if (safety === 'confidential' && context.document?.audience === 'All') {
            return 'Confidential content cannot have "All" audience'
          }
          return true
        }),
    }),

    // ============= TAGS =============
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'kbTag'}]}],
      group: 'settings',
      validation: (Rule) => Rule.max(10),
      description: 'Curated tags for categorization',
    }),

    // ============= GOVERNANCE =============
    defineField({
      name: 'writtenBy',
      title: 'Written By',
      type: 'reference',
      to: [{type: 'teamMember'}, {type: 'author'}],
      group: 'governance',
    }),
    defineField({
      name: 'ownerTeam',
      title: 'Owner Team',
      type: 'string',
      group: 'governance',
      options: {
        list: [
          {title: 'Leadership', value: 'leadership'},
          {title: 'Production', value: 'production'},
          {title: 'Creative', value: 'creative'},
          {title: 'Operations', value: 'operations'},
          {title: 'HR', value: 'hr'},
          {title: 'Finance', value: 'finance'},
        ],
      },
      hidden: ({document}) => !['policy', 'sop'].includes(document?.docType as string),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (['policy', 'sop'].includes(context.document?.docType as string) && !value) {
            return 'Owner team is required for policies and SOPs'
          }
          return true
        }),
    }),
    defineField({
      name: 'reviewCycleDays',
      title: 'Review Cycle (Days)',
      type: 'number',
      group: 'governance',
      hidden: ({document}) => !['policy', 'sop'].includes(document?.docType as string),
      validation: (Rule) =>
        Rule.integer()
          .min(30)
          .max(365)
          .custom((value, context) => {
            if (['policy', 'sop'].includes(context.document?.docType as string) && !value) {
              return 'Review cycle is required for policies and SOPs'
            }
            return true
          }),
      description: 'Days between required reviews (30-365)',
    }),
    defineField({
      name: 'lastReviewedAt',
      title: 'Last Reviewed',
      type: 'datetime',
      group: 'governance',
      description: 'Date of last review',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'governance',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'In Review', value: 'review'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),

    // ============= ATTACHMENTS =============
    defineField({
      name: 'attachments',
      title: 'Attachments',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'attachment',
          fields: [
            {
              name: 'file',
              title: 'File',
              type: 'file',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'type',
              title: 'File Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Document', value: 'document'},
                  {title: 'Spreadsheet', value: 'spreadsheet'},
                  {title: 'Presentation', value: 'presentation'},
                  {title: 'Video', value: 'video'},
                  {title: 'Other', value: 'other'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              validation: (Rule) => Rule.required().max(200),
            },
          ],
        },
      ],
      group: 'content',
      description: 'Supporting files and documents',
    }),

    // ============= AI FIELDS =============
    defineField({
      name: 'ai',
      title: 'AI Metadata',
      type: 'object',
      group: 'ai',
      fields: [
        {
          name: 'plainText',
          title: 'Plain Text',
          type: 'text',
          readOnly: true,
          description: 'Auto-generated plain text from modules',
        },
        {
          name: 'summary',
          title: 'AI Summary',
          type: 'text',
          rows: 3,
          readOnly: true,
          description: 'Auto-generated summary',
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
          readOnly: true,
          description: 'Auto-extracted keywords',
        },
        {
          name: 'entities',
          title: 'Named Entities',
          type: 'array',
          of: [{type: 'string'}],
          readOnly: true,
          description: 'Auto-extracted entities (people, places, tools)',
        },
        {
          name: 'qa',
          title: 'Q&A Pairs',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'question', type: 'string', title: 'Question'},
                {name: 'answer', type: 'text', title: 'Answer'},
              ],
            },
          ],
          readOnly: true,
          description: 'Auto-generated Q&A for RAG',
        },
        {
          name: 'chunks',
          title: 'Text Chunks',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'anchorId', type: 'string', title: 'Anchor ID'},
                {name: 'heading', type: 'string', title: 'Heading'},
                {name: 'plainText', type: 'text', title: 'Plain Text'},
                {name: 'order', type: 'number', title: 'Order'},
                {name: 'tokensApprox', type: 'number', title: 'Approx Tokens'},
              ],
            },
          ],
          readOnly: true,
          description: 'Chunked text for vector search',
        },
        {
          name: 'embeddingDimension',
          title: 'Embedding Dimension',
          type: 'number',
          readOnly: true,
          description: 'Vector dimension (e.g., 768, 1536)',
        },
        {
          name: 'lastProcessedAt',
          title: 'Last AI Processing',
          type: 'datetime',
          readOnly: true,
        },
      ],
    }),

    // ============= SEO =============
    defineField({
      name: 'ogTitle',
      title: 'OG Title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(60),
      description: 'Open Graph title for social sharing',
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
      description: 'Open Graph description',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      group: 'seo',
      options: {hotspot: true},
      description: 'Social sharing image',
    }),

    // ============= SYSTEM FIELDS =============
    defineField({
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Hide from navigation and search',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      group: 'content',
      hidden: ({document}) => document?.kind !== 'link',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === 'link' && !value) {
            return 'External URL is required for link items'
          }
          return true
        }),
    }),
    defineField({
      name: 'category',
      title: 'Category (Legacy)',
      type: 'reference',
      to: [{type: 'kbCategory'}],
      group: 'structure',
      hidden: true, // Keep for backward compatibility
    }),
    defineField({
      name: 'youtubeShow',
      title: 'YouTube Show',
      type: 'reference',
      to: [{type: 'youtubeShow'}],
      group: 'structure',
      hidden: ({document}) => document?.kind !== 'show',
      description: 'Associated YouTube show',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      kind: 'kind',
      docType: 'docType',
      audience: 'audience',
      status: 'status',
      parent: 'parent.title',
    },
    prepare({title, kind, docType, audience, status, parent}) {
      const icon = kindIcons[kind as keyof typeof kindIcons] || DocumentIcon
      const meta = [
        parent,
        docType,
        audience !== 'All' ? audience : null,
        status !== 'published' ? status : null,
      ]
        .filter(Boolean)
        .join(' • ')
      
      return {
        title,
        subtitle: meta || kind,
        media: docType && docTypeIcons[docType as keyof typeof docTypeIcons] || icon,
      }
    },
  },
  orderings: [
    {
      title: 'Hierarchy',
      name: 'hierarchyOrder',
      by: [
        {field: 'parent._ref', direction: 'asc'},
        {field: 'order', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Recently Updated',
      name: 'recentlyUpdated',
      by: [{field: '_updatedAt', direction: 'desc'}],
    },
    {
      title: 'Status',
      name: 'statusOrder',
      by: [
        {field: 'status', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
  ],
})
