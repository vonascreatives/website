import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'kbItem',
  title: 'Knowledge Base Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Title of the knowledge base item (no emojis)',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version of the title',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Company', value: 'company' },
          { title: 'Production', value: 'production' },
          { title: 'Shows', value: 'shows' },
          { title: 'Tools', value: 'tools' },
          { title: 'Partners', value: 'partners' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      description: 'Main category for top navigation',
    }),
    defineField({
      name: 'itemType',
      title: 'Item Type',
      type: 'string',
      options: {
        list: [
          { title: 'Page', value: 'page' },
          { title: 'Section', value: 'section' },
          { title: 'Item', value: 'item' },
        ],
        layout: 'radio',
      },
      initialValue: 'item',
      validation: (Rule) => Rule.required(),
      description: 'Type of content: Page (e.g., Off the Record), Section (e.g., Pre-Production), or Item (e.g., Equipment Setup)',
    }),
    defineField({
      name: 'parentPage',
      title: 'Parent Page',
      type: 'string',
      description: 'Page slug this belongs to (e.g., "off-the-record", "company"). Leave empty for top-level pages.',
      placeholder: 'off-the-record',
      hidden: ({ document }) => document?.itemType === 'page',
    }),
    defineField({
      name: 'section',
      title: 'Section',
      type: 'string',
      description: 'Section slug this item belongs to (e.g., "pre-production", "about"). Only for items.',
      placeholder: 'pre-production',
      hidden: ({ document }) => document?.itemType !== 'item',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
      description: 'Brief description of the content',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [{ title: 'URL', name: 'href', type: 'url' }],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption displayed below the image.',
            },
          ],
        },
        {
          type: 'object',
          name: 'workflowStep',
          title: 'Workflow Step',
          fields: [
            {
              name: 'stepNumber',
              title: 'Step Number',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            },
            {
              name: 'headline',
              title: 'Step Headline',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'Main headline for this step (e.g., "Camera Positioning")',
            },
            {
              name: 'description',
              title: 'Step Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
              description: 'Detailed description of what to do in this step',
            },
            {
              name: 'duration',
              title: 'Duration',
              type: 'string',
              placeholder: '~5 minutes',
              description: 'Estimated time for this step',
            },
            {
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  { title: 'Pending', value: 'pending' },
                  { title: 'In Progress', value: 'in-progress' },
                  { title: 'Completed', value: 'completed' },
                ],
              },
              initialValue: 'pending',
            },
          ],
          preview: {
            select: {
              stepNumber: 'stepNumber',
              headline: 'headline',
              description: 'description',
            },
            prepare({ stepNumber, headline, description }) {
              return {
                title: `${stepNumber}. ${headline}`,
                subtitle: description,
              }
            },
          },
        },
        {
          type: 'file',
          title: 'File Attachment',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'File Title',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
            },
          ],
        },
      ],
      description: 'Main content with rich text, images and files',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Article', value: 'Article' },
          { title: 'Video', value: 'Video' },
          { title: 'Workflow', value: 'Workflow' },
          { title: 'Reference', value: 'Reference' },
        ],
      },
      initialValue: 'Article',
      description: 'Type of content',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Tags for filtering and categorization',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      placeholder: '5 min read',
      description: 'Estimated read/watch time',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 100,
      description: 'Lower numbers appear first',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      initialValue: false,
      description: 'Hide from navigation',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'imageUrl',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Descript video URL or other video link',
    }),
    defineField({
      name: 'supportingDocs',
      title: 'Supporting Documents',
      type: 'url',
      description: 'Guidjar guide URL or other supporting documents',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      itemType: 'itemType',
      parentPage: 'parentPage',
      section: 'section',
      status: 'status',
      media: 'imageUrl',
      type: 'type',
    },
    prepare({ title, category, itemType, parentPage, section, status, media, type }) {
      const categoryMap = {
        company: 'Company',
        production: 'Production',
        shows: 'Shows',
        tools: 'Tools',
        partners: 'Partners',
      }
      
      // Build hierarchical display for organization
      const parts = [categoryMap[(category as keyof typeof categoryMap)] || category]
      if (parentPage) parts.push(parentPage)
      if (section) parts.push(section)
      
      const hierarchy = parts.join(' → ')
      const subtitle = [hierarchy, itemType, type, status].filter(Boolean).join(' • ')

      // Add indentation based on item type for visual hierarchy
      let displayTitle = title
      if (itemType === 'section') displayTitle = `  ${title}`
      if (itemType === 'item') displayTitle = `    ${title}`

      return {
        title: displayTitle,
        subtitle,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Hierarchical Order',
      name: 'hierarchicalOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'parentPage', direction: 'asc' },
        { field: 'itemType', direction: 'asc' }, // page < section < item
        { field: 'order', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: 'Category Order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: 'Item Type',
      name: 'itemTypeOrder',
      by: [
        { field: 'itemType', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Last Updated',
      name: 'lastUpdated',
      by: [{ field: 'lastUpdated', direction: 'desc' }],
    },
  ],
})
