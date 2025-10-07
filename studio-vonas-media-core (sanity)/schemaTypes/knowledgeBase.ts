import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'knowledgeArticle',
  title: 'Knowledge Article',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'structure',
      title: 'Structure',
    },
    {
      name: 'media',
      title: 'Media Resources',
    },
    {
      name: 'references',
      title: 'References & FAQs',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'Main headline for the knowledge article',
    }),
    defineField({
      name: 'subHeadline',
      title: 'Sub-headline',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'Descriptive sub-headline explaining the article focus',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'headline',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'overviewSteps',
      title: 'Overview Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'step',
              title: 'Step',
              type: 'text',
              validation: (Rule) => Rule.required(),
            }
          ],
        }
      ],
      group: 'structure',
      description: 'Key steps or points covered in this article',
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'richBody',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'Complete detailed content for the knowledge article',
    }),
    defineField({
      name: 'videoRecording',
      title: 'Video Recording',
      type: 'file',
      group: 'media',
      description: 'Video recording (mostly for Descript recordings)',
      options: {
        accept: '.mp4,.mov,.avi,.mkv,.webm',
      },
    }),
    defineField({
      name: 'supportingDocuments',
      title: 'Supporting Documents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'file',
              title: 'File',
              type: 'file',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'File Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
          ],
        }
      ],
      group: 'media',
      description: 'Supporting documents (mostly for Guidjar embeddings)',
      options: {
        layout: 'list',
      },
    }),
    defineField({
      name: 'mediaResources',
      title: 'Additional Media Resources',
      type: 'array',
      of: [
        {type: 'imageWithAlt'},
        {type: 'file'},
      ],
      group: 'media',
      description: 'Additional images, documents, or other media',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'knowledgeCategory'}],
      group: 'structure',
      validation: (Rule) => Rule.required(),
      description: 'Main category this article belongs to',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'knowledgeTag'}]}],
      group: 'structure',
      description: 'Tags for additional categorization and filtering',
    }),
    defineField({
      name: 'relatedFaqs',
      title: 'Related FAQs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      group: 'references',
      description: 'FAQs that are relevant to this knowledge article',
    }),
    defineField({
      name: 'relatedChannels',
      title: 'Related Channels',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'channel'}]}],
      group: 'references',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'structure',
      description: 'Number for sorting (lower numbers appear first)',
      initialValue: 100,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'In Review', value: 'review'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Source Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
          ],
        }
      ],
      group: 'references',
      description: 'External source URLs',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date/Time',
      type: 'datetime',
      group: 'content',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'subHeadline',
      media: 'mediaResources.0.image',
      category: 'category.name',
      status: 'status',
      order: 'order',
    },
    prepare({title, subtitle, media, category, status, order}) {
      return {
        title,
        subtitle: [category, status, `Order: ${order}`].filter(Boolean).join(' • '),
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category.name', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
    {
      title: 'Last Updated',
      name: 'lastUpdatedDesc',
      by: [{field: 'lastUpdated', direction: 'desc'}],
    },
  ],
})
