import {defineType, defineField} from 'sanity'
import {FolderIcon, DocumentIcon} from '@sanity/icons'

export default defineType({
  name: 'kb',
  title: 'Knowledge Base',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'relations',
      title: 'Supporting Content',
    },
    {
      name: 'structure',
      title: 'Structure',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'Short, clean title (no emojis)',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'structure',
      options: {
        source: 'title',
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version of the title',
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      group: 'structure',
      description: 'Section (folder) or Page (content)',
      options: {
        list: [
          {title: 'Section', value: 'section'},
          {title: 'Page', value: 'page'},
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'page',
    }),
    defineField({
      name: 'parent',
      title: 'Parent',
      type: 'reference',
      to: [{type: 'kb'}],
      group: 'structure',
      description: 'Parent folder for organization',
    }),
    defineField({
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      group: 'structure',
      description: 'Hide from navigation when true',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Brief description (1–3 sentences)',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'structure',
      initialValue: 100,
      description: 'Lower numbers appear first',
    }),
    
    // Content Fields
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
          ],
          lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [{title: 'URL', name: 'href', type: 'url'}],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', type: 'string', title: 'Alt Text'},
            {name: 'caption', type: 'string', title: 'Caption'},
          ],
        },
      ],
      group: 'content',
      description: 'Main content body',
      hidden: ({document}) => document?.kind !== 'page',
    }),
    
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required()},
          {name: 'content', type: 'text', title: 'Content', rows: 3},
        ]
      }],
      group: 'content',
      hidden: ({document}) => document?.kind !== 'page',
      description: 'Step-by-step instructions',
    }),
    
    defineField({
      name: 'checklist',
      title: 'Checklist',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
      description: 'Checklist items',
      hidden: ({document}) => document?.kind !== 'page',
    }),

    // Document Classification
    defineField({
      name: 'docType',
      title: 'Document Type',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Guide', value: 'guide'},
          {title: 'Checklist', value: 'checklist'},
          {title: 'Template', value: 'template'},
          {title: 'Reference', value: 'reference'},
          {title: 'Tutorial', value: 'tutorial'},
          {title: 'Policy', value: 'policy'},
          {title: 'FAQ', value: 'faq'},
          {title: 'SOP', value: 'sop'},
        ]
      },
      hidden: ({document}) => document?.kind !== 'page',
    }),
    
    defineField({
      name: 'audience',
      title: 'Target Audience',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'All Team', value: 'all'},
          {title: 'Core Team', value: 'core'},
          {title: 'Interns', value: 'interns'},
          {title: 'Freelancers', value: 'freelancers'},
          {title: 'Partners', value: 'partners'},
          {title: 'Guests', value: 'guests'},
        ],
        layout: 'checkbox',
      },
      group: 'settings',
      initialValue: ['all'],
      description: 'Who should see this content',
    }),

    // Supporting Content
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'relations',
      description: 'Link to related video',
      hidden: ({document}) => document?.kind !== 'page',
    }),
    
    defineField({
      name: 'embedCode',
      title: 'Embed Code',
      type: 'text',
      group: 'relations',
      description: 'HTML embed code for videos, forms, etc.',
      hidden: ({document}) => document?.kind !== 'page',
      rows: 4,
    }),
    
    defineField({
      name: 'attachments',
      title: 'File Attachments',
      type: 'array',
      of: [{
        type: 'file',
        fields: [
          {name: 'title', type: 'string', title: 'File Title'},
          {name: 'description', type: 'text', title: 'Description', rows: 2},
        ]
      }],
      group: 'relations',
      description: 'Documents, PDFs, templates, etc.',
      hidden: ({document}) => document?.kind !== 'page',
    }),
    
    defineField({
      name: 'relatedItems',
      title: 'Related Content',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'kb'}]}],
      group: 'relations',
      description: 'Related KB items',
    }),
    
    defineField({
      name: 'faqs',
      title: 'Related FAQs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      group: 'relations',
    }),
    
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      group: 'settings',
    }),
    
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'teamMember'}, {type: 'author'}],
      group: 'settings',
      description: 'Document author/creator',
    }),

    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      group: 'structure',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      kind: 'kind',
      docType: 'docType',
      parent: 'parent.title',
    },
    prepare({title, kind, docType, parent}) {
      const meta = [parent, docType].filter(Boolean).join(' • ');
      return {
        title,
        subtitle: meta,
        media: kind === 'section' ? FolderIcon : DocumentIcon,
      };
    },
  },
  orderings: [
    {
      title: 'Hierarchical Order',
      name: 'hierarchical',
      by: [
        {field: 'parent._ref', direction: 'asc'},
        {field: 'order', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Last Updated',
      name: 'lastUpdated',
      by: [{field: 'lastUpdated', direction: 'desc'}],
    },
  ],
})
