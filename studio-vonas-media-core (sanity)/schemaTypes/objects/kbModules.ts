import {defineType, defineField} from 'sanity'

// ============= HERO MODULE =============
export const heroModule = defineType({
  name: 'heroModule',
  title: 'Hero',
  type: 'object',
  preview: {
    select: {title: 'heading', subtitle: 'subheading'},
    prepare({title, subtitle}) {
      return {
        title: `Hero: ${title || 'Untitled'}`,
        subtitle,
      }
    },
  },
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'ctaButtons',
      title: 'CTA Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', type: 'string', title: 'Label'},
            {name: 'url', type: 'string', title: 'URL'},
            {name: 'style', type: 'string', title: 'Style', 
             options: {list: ['primary', 'secondary', 'ghost']}},
          ],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
})

// ============= RICH TEXT MODULE =============
export const richTextModule = defineType({
  name: 'richTextModule',
  title: 'Rich Text',
  type: 'object',
  preview: {
    select: {content: 'content'},
    prepare({content}) {
      const text = content?.[0]?.children?.[0]?.text || ''
      return {
        title: 'Rich Text',
        subtitle: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
      }
    },
  },
  fields: [
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
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {name: 'href', type: 'url', title: 'URL'},
                  {name: 'blank', type: 'boolean', title: 'Open in new tab'},
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Internal Link',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    to: [{type: 'kb'}],
                  },
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
        {
          type: 'object',
          name: 'callout',
          title: 'Callout',
          fields: [
            {
              name: 'type',
              type: 'string',
              options: {
                list: ['info', 'warning', 'success', 'error'],
              },
            },
            {name: 'title', type: 'string'},
            {name: 'text', type: 'text'},
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
})

// ============= QUOTE MODULE =============
export const quoteModule = defineType({
  name: 'quoteModule',
  title: 'Quote',
  type: 'object',
  preview: {
    select: {text: 'text', author: 'author'},
    prepare({text, author}) {
      return {
        title: `Quote: "${text?.substring(0, 50)}..."`,
        subtitle: author || 'Anonymous',
      }
    },
  },
  fields: [
    defineField({
      name: 'text',
      title: 'Quote Text',
      type: 'text',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Author Role',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Author Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})

// ============= LINK GRID MODULE =============
export const linkGridModule = defineType({
  name: 'linkGridModule',
  title: 'Link Grid',
  type: 'object',
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      return {
        title: 'Link Grid',
        subtitle: `${items?.length || 0} links`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [2, 3, 4],
      },
      initialValue: 3,
    }),
    defineField({
      name: 'items',
      title: 'Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              type: 'string',
              options: {
                list: ['internal', 'external'],
              },
              initialValue: 'internal',
            },
            {
              name: 'internalRef',
              type: 'reference',
              to: [{type: 'kb'}],
              hidden: ({parent}) => parent?.type !== 'internal',
            },
            {
              name: 'externalUrl',
              type: 'url',
              hidden: ({parent}) => parent?.type !== 'external',
            },
            {
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'icon',
              type: 'string',
              description: 'Icon name or emoji',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(12),
    }),
  ],
})

// ============= GALLERY MODULE =============
export const galleryModule = defineType({
  name: 'galleryModule',
  title: 'Gallery',
  type: 'object',
  preview: {
    select: {images: 'images', layout: 'layout'},
    prepare({images, layout}) {
      return {
        title: 'Gallery',
        subtitle: `${images?.length || 0} images - ${layout || 'grid'}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: ['grid', 'carousel', 'masonry'],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required()},
            {name: 'caption', type: 'string', title: 'Caption'},
            {name: 'link', type: 'url', title: 'Link URL'},
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(20),
    }),
  ],
})

// ============= STEPS MODULE =============
export const stepsModule = defineType({
  name: 'stepsModule',
  title: 'Steps',
  type: 'object',
  preview: {
    select: {steps: 'steps'},
    prepare({steps}) {
      return {
        title: 'Steps',
        subtitle: `${steps?.length || 0} steps`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'numbered',
      title: 'Show Numbers',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'content',
              type: 'array',
              of: [{type: 'block'}],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'image',
              type: 'image',
              options: {hotspot: true},
            },
            {
              name: 'tip',
              type: 'text',
              rows: 2,
              description: 'Optional tip or note',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(2).max(20),
    }),
  ],
})

// ============= CHECKLIST MODULE =============
export const checklistModule = defineType({
  name: 'checklistModule',
  title: 'Checklist',
  type: 'object',
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      return {
        title: 'Checklist',
        subtitle: `${items?.length || 0} items`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Checklist Title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'required',
              type: 'boolean',
              title: 'Required Item',
              initialValue: false,
            },
            {
              name: 'category',
              type: 'string',
              description: 'Optional grouping',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(50),
    }),
  ],
})

// ============= FAQ LIST MODULE =============
export const faqListModule = defineType({
  name: 'faqListModule',
  title: 'FAQ List',
  type: 'object',
  preview: {
    select: {mode: 'mode', items: 'manualItems', refs: 'faqReferences'},
    prepare({mode, items, refs}) {
      const count = mode === 'manual' ? items?.length : refs?.length
      return {
        title: 'FAQ List',
        subtitle: `${count || 0} FAQs - ${mode || 'manual'}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'mode',
      title: 'Mode',
      type: 'string',
      options: {
        list: [
          {title: 'Manual Entry', value: 'manual'},
          {title: 'Reference FAQs', value: 'reference'},
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'manualItems',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'answer',
              type: 'array',
              of: [{type: 'block'}],
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      hidden: ({parent}) => parent?.mode !== 'manual',
    }),
    defineField({
      name: 'faqReferences',
      title: 'FAQ References',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      hidden: ({parent}) => parent?.mode !== 'reference',
    }),
  ],
})

// ============= EMBED MODULE =============
export const embedModule = defineType({
  name: 'embedModule',
  title: 'Embed',
  type: 'object',
  preview: {
    select: {url: 'url', type: 'embedType'},
    prepare({url, type}) {
      return {
        title: `Embed: ${type || 'Unknown'}`,
        subtitle: url,
      }
    },
  },
  fields: [
    defineField({
      name: 'url',
      title: 'Embed URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
      description: 'YouTube, Vimeo, CodePen, etc.',
    }),
    defineField({
      name: 'embedType',
      title: 'Embed Type',
      type: 'string',
      options: {
        list: [
          {title: 'YouTube', value: 'youtube'},
          {title: 'Vimeo', value: 'vimeo'},
          {title: 'Descript', value: 'descript'},
          {title: 'Guidjar', value: 'guidjar'},
          {title: 'Loom', value: 'loom'},
          {title: 'CodePen', value: 'codepen'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: ['16:9', '4:3', '1:1', '9:16'],
      },
      initialValue: '16:9',
    }),
  ],
})

// ============= RELATED CONTENT MODULE =============
export const relatedContentModule = defineType({
  name: 'relatedContentModule',
  title: 'Related Content',
  type: 'object',
  preview: {
    select: {mode: 'mode', limit: 'limit'},
    prepare({mode, limit}) {
      return {
        title: 'Related Content',
        subtitle: `${mode || 'auto'} - ${limit || 3} items`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Related Content',
    }),
    defineField({
      name: 'mode',
      title: 'Selection Mode',
      type: 'string',
      options: {
        list: [
          {title: 'Automatic', value: 'auto'},
          {title: 'Manual', value: 'manual'},
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'autoConfig',
      title: 'Auto Configuration',
      type: 'object',
      fields: [
        {
          name: 'matchTags',
          type: 'boolean',
          title: 'Match Tags',
          initialValue: true,
        },
        {
          name: 'matchAudience',
          type: 'boolean',
          title: 'Match Audience',
          initialValue: true,
        },
        {
          name: 'matchDocType',
          type: 'boolean',
          title: 'Match Doc Type',
          initialValue: false,
        },
        {
          name: 'preferFreshness',
          type: 'boolean',
          title: 'Prefer Recent',
          initialValue: true,
        },
      ],
      hidden: ({parent}) => parent?.mode !== 'auto',
    }),
    defineField({
      name: 'manualItems',
      title: 'Manual Selection',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'kb'}]}],
      hidden: ({parent}) => parent?.mode !== 'manual',
    }),
    defineField({
      name: 'limit',
      title: 'Max Items',
      type: 'number',
      validation: (Rule) => Rule.integer().min(1).max(12),
      initialValue: 3,
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: ['cards', 'list', 'compact'],
      },
      initialValue: 'cards',
    }),
  ],
})

// ============= VIDEO WITH ANNOTATIONS MODULE =============
export const videoAnnotationsModule = defineType({
  name: 'videoAnnotationsModule',
  title: 'Video with Annotations',
  type: 'object',
  preview: {
    select: {url: 'videoUrl', annotations: 'annotations'},
    prepare({url, annotations}) {
      return {
        title: 'Video with Annotations',
        subtitle: `${annotations?.length || 0} annotations`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
      description: 'Vimeo or YouTube URL',
    }),
    defineField({
      name: 'annotations',
      title: 'Annotations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'timestampSeconds',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'text',
              type: 'text',
              rows: 2,
            },
            {
              name: 'type',
              type: 'string',
              options: {
                list: ['chapter', 'note', 'warning', 'tip'],
              },
              initialValue: 'chapter',
            },
          ],
          preview: {
            select: {
              title: 'title',
              time: 'timestampSeconds',
              type: 'type',
            },
            prepare({title, time, type}) {
              const mins = Math.floor(time / 60)
              const secs = time % 60
              return {
                title,
                subtitle: `${mins}:${secs.toString().padStart(2, '0')} - ${type}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'showTranscript',
      title: 'Show Transcript',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript',
      type: 'text',
      hidden: ({parent}) => !parent?.showTranscript,
    }),
  ],
})

// Export all modules
export default [
  heroModule,
  richTextModule,
  quoteModule,
  linkGridModule,
  galleryModule,
  stepsModule,
  checklistModule,
  faqListModule,
  embedModule,
  relatedContentModule,
  videoAnnotationsModule,
]
