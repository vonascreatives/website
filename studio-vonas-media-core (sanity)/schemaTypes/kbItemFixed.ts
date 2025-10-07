import {defineType, defineField} from 'sanity'
import {FolderIcon, DocumentIcon, LinkIcon, PlayIcon} from '@sanity/icons'

export default defineType({
  name: 'kbItem',
  title: 'Knowledge Base',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'media',
      title: 'Media & Links',
    },
    {
      name: 'structure',
      title: 'Organization',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    // ============= CORE FIELDS =============
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(100),
      description: 'Clear title for the item',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'structure',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Brief summary of the content',
    }),

    // ============= STRUCTURE =============
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      group: 'structure',
      options: {
        list: [
          {title: 'Folder/Section', value: 'section'},
          {title: 'Page/Document', value: 'page'},
          {title: 'Show', value: 'show'},
        ],
        layout: 'radio'
      },
      initialValue: 'page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent Folder',
      type: 'reference',
      to: [{type: 'kbItem'}],
      group: 'structure',
      options: {
        filter: 'kind in ["section", "show"]',
      },
      description: 'Parent folder for hierarchy',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'structure',
      initialValue: 100,
      description: 'Lower numbers appear first',
    }),
    defineField({
      name: 'category',
      title: 'Main Category',
      type: 'reference',
      to: [{type: 'kbCategory'}],
      group: 'structure',
      description: 'Top-level category',
    }),

    // ============= MAIN CONTENT =============
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
            {title: 'H4', value: 'h4'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                title: 'Link',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (Rule) => Rule.uri({
                      allowRelative: true,
                      scheme: ['https', 'http', 'mailto', 'tel']
                    })
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean'
                  }
                ],
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
      description: 'Main content',
      hidden: ({document}) => document?.kind === 'section',
    }),

    // ============= STRUCTURED CONTENT =============
    defineField({
      name: 'steps',
      title: 'Steps/Process',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Step Title',
            validation: (Rule) => Rule.required()
          },
          {
            name: 'content',
            type: 'text',
            title: 'Instructions',
            rows: 3
          },
        ],
        preview: {
          select: {
            title: 'title',
            content: 'content'
          },
          prepare({title, content}) {
            return {
              title: title || 'Untitled step',
              subtitle: content?.substring(0, 100)
            }
          }
        }
      }],
      group: 'content',
      hidden: ({document}) => document?.kind === 'section',
      description: 'Step-by-step instructions',
    }),
    defineField({
      name: 'checklist',
      title: 'Checklist',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
      description: 'Simple checklist items',
      hidden: ({document}) => document?.kind === 'section',
    }),

    // ============= MEDIA & EMBEDS =============
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'media',
      description: 'YouTube, Vimeo, or other video URL',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
      hidden: ({document}) => document?.kind === 'section',
    }),
    defineField({
      name: 'embedCode',
      title: 'Embed Code',
      type: 'text',
      group: 'media',
      description: 'HTML embed code (e.g., Guidjar, Descript)',
      hidden: ({document}) => document?.kind === 'section',
    }),
    defineField({
      name: 'attachments',
      title: 'File Attachments',
      type: 'array',
      of: [
        {
          type: 'file',
          options: {
            storeOriginalFilename: true
          }
        }
      ],
      group: 'media',
      hidden: ({document}) => document?.kind === 'section',
    }),

    // ============= RELATIONSHIPS =============
    defineField({
      name: 'relatedItems',
      title: 'Related Content',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'kbItem'}],
        options: {
          filter: 'kind == "page"'
        }
      }],
      group: 'media',
      description: 'Link to related KB items',
    }),
    defineField({
      name: 'faqs',
      title: 'Related FAQs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      group: 'media',
    }),

    // ============= METADATA =============
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
        ],
      },
      hidden: ({document}) => document?.kind === 'section',
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
      name: 'visibility',
      title: 'Who can see this?',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Everyone', value: 'All'},
          {title: 'Team Only', value: 'Team'},
          {title: 'Interns', value: 'Intern'},
          {title: 'Freelancers', value: 'Freelancers'},
        ],
        layout: 'checkbox',
      },
      group: 'settings',
      initialValue: ['All'],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'teamMember'}, {type: 'author'}],
      group: 'settings',
    }),
    defineField({
      name: 'youtubeShow',
      title: 'YouTube Show',
      type: 'reference',
      to: [{type: 'youtubeShow'}],
      group: 'settings',
      description: 'Link to YouTube show',
      hidden: ({document}) => document?.kind !== 'show',
    }),

    // ============= SYSTEM =============
    defineField({
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Hide from navigation',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      group: 'settings',
      readOnly: true,
    }),

    // Legacy fields (hidden)
    defineField({
      name: 'section',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'supportLink',
      type: 'url',
      hidden: true,
    }),
    defineField({
      name: 'recommended',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'kbItem'}]}],
      hidden: true,
    }),
    defineField({
      name: 'writtenBy',
      type: 'reference',
      to: [{type: 'teamMember'}, {type: 'author'}],
      hidden: true,
    }),
    defineField({
      name: 'status',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resources',
      type: 'array',
      of: [{type: 'string'}],
      hidden: true,
    }),
    defineField({
      name: 'overviewSteps',
      type: 'array',
      of: [{type: 'object', fields: [{name: 'step', type: 'string'}, {name: 'details', type: 'text'}]}],
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      kind: 'kind',
      parent: 'parent.title',
      hidden: 'hidden',
      docType: 'docType',
    },
    prepare({title, kind, parent, hidden, docType}) {
      const icon = kind === 'section' ? FolderIcon : 
                   kind === 'show' ? PlayIcon : 
                   DocumentIcon
      
      const subtitle = [
        parent,
        docType,
        hidden ? '(Hidden)' : null
      ].filter(Boolean).join(' • ')
      
      return {
        title: title || 'Untitled',
        subtitle: subtitle || kind,
        media: icon,
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
  ],
})
