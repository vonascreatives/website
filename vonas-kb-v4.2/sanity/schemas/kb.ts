import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'kb',
  title: 'Knowledge Base',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 200 } }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: { list: [
        { title: 'Show', value: 'show' },
        { title: 'Section', value: 'section' },
        { title: 'Page', value: 'page' },
      ] },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent',
      type: 'reference',
      to: [{ type: 'kb' }],
      description: 'Parent node (show for sections, section for pages/items)'
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 100 }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'lastUpdated', title: 'Last Updated', type: 'datetime' }),
    defineField({ name: 'hidden', title: 'Hidden', type: 'boolean', initialValue: false }),

    // Media/links
    defineField({ name: 'imageUrl', title: 'Featured Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'videoUrl', title: 'Video URL', type: 'url' }),
    defineField({ name: 'embedCode', title: 'Embed Code (HTML)', type: 'text' }),
    defineField({ name: 'supportingDocs', title: 'Supporting Docs URL', type: 'url' }),

    // Structured content
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
            { title: 'Numbered', value: 'number' },
          ],
        },
        { type: 'image', options: { hotspot: true } },
        { type: 'file' },
      ],
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'content', title: 'Content', type: 'text' },
          { name: 'duration', title: 'Duration', type: 'string' },
          { name: 'status', title: 'Status', type: 'string', options: { list: ['pending','in-progress','completed'] } },
        ]
      }]
    }),
    defineField({ name: 'checklist', title: 'Checklist', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'attachments',
      title: 'Attachments',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'asset', title: 'File', type: 'file' },
        ]
      }]
    }),
  ],
})

