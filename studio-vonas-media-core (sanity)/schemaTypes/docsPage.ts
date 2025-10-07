import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'docsPage',
  title: 'Documentation Page',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'navigation',
      title: 'Navigation',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'navigation',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Brief description shown in navigation and search results',
      validation: (Rule) => Rule.max(160)
    }),
    defineField({
      name: 'section',
      title: 'Section',
      type: 'reference',
      group: 'navigation',
      to: [{type: 'docsSection'}],
      validation: (Rule) => Rule.required(),
      description: 'The section this page belongs to'
    }),
    defineField({
      name: 'order',
      title: 'Order in Section',
      type: 'number',
      group: 'navigation',
      initialValue: 0,
      description: 'Order within the section (lower numbers appear first)'
    }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
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
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (Rule) => Rule.uri({
                      allowRelative: true,
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'docsCodeBlock'
        },
        {
          type: 'docsCallout'
        },
        {
          type: 'docsImage'
        },
        {
          type: 'docsTable'
        }
      ]
    }),
    defineField({
      name: 'tableOfContents',
      title: 'Table of Contents',
      type: 'boolean',
      group: 'navigation',
      initialValue: true,
      description: 'Show table of contents for this page'
    }),
    defineField({
      name: 'breadcrumbs',
      title: 'Show Breadcrumbs',
      type: 'boolean',
      group: 'navigation',
      initialValue: true,
      description: 'Show breadcrumb navigation for this page'
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: [{type: 'author'}],
      description: 'Author of this documentation page'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      description: 'Tags for categorization and search'
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      group: 'navigation',
      initialValue: false,
      description: 'Whether this page is visible in navigation and search'
    }),
    // SEO fields
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Override the page title for SEO (max 60 characters)',
      validation: (Rule) => Rule.max(60)
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Meta description for search engines (max 160 characters)',
      validation: (Rule) => Rule.max(160)
    }),
  ],
  preview: {
    select: {
      title: 'title',
      section: 'section.title',
      order: 'order',
      published: 'isPublished'
    },
    prepare({title, section, order, published}) {
      return {
        title: title,
        subtitle: `${section} (Order: ${order}) ${published ? 'Published' : 'Draft'}`,
      }
    }
  },
  orderings: [
    {
      title: 'Section and Order',
      name: 'sectionOrder',
      by: [
        {field: 'section.title', direction: 'asc'},
        {field: 'order', direction: 'asc'}
      ]
    },
    {
      title: 'Last Updated',
      name: 'lastUpdated',
      by: [{field: 'lastUpdated', direction: 'desc'}]
    }
  ]
})