import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'richBody',
  title: 'Rich Content',
  type: 'array',
  of: [
    {
      title: 'Block',
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
                validation: (Rule) => Rule.required(),
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
              },
            ],
          },
        ],
      },
    },
    // Images with alt text
    {
      type: 'imageWithAlt',
    },
    // File attachments
    {
      type: 'object',
      name: 'fileAttachment',
      title: 'File Attachment',
      fields: [
        defineField({
          name: 'file',
          title: 'File',
          type: 'file',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'File Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
        }),
      ],
    },
    // Video embeds
    {
      type: 'object',
      name: 'videoEmbed',
      title: 'Video Embed',
      fields: [
        defineField({
          name: 'url',
          title: 'Video URL',
          type: 'url',
          description: 'YouTube, Vimeo, or other video URL',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    },
  ],
})
