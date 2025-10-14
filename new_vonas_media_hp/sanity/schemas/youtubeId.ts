import { defineField, defineType } from 'sanity'

export const youtubeId = defineType({
  name: 'youtubeId',
  title: 'YouTube Channel',
  type: 'document',
  fields: [
    defineField({
      name: 'channel_name',
      title: 'Channel Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'channel_name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string'
    }),
    defineField({
      name: 'cta_button_url',
      title: 'Channel URL',
      type: 'url'
    }),
    defineField({
      name: 'channel_number',
      title: 'Channel Number',
      type: 'string'
    }),
    defineField({
      name: 'channel',
      title: 'Creator Name',
      type: 'string'
    }),
    // missing description field
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              }
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string'
            }
          ]
        }
      ],
      description: 'Main hero image for the channel (displayed in project gallery on homepage)'
    }),
    defineField({
      name: 'logoImage',
      title: 'Logo Image',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              }
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string'
            }
          ]
        }
      ],
      description: 'Channel logo (fallback if hero image not provided)'
    })
  ],
  preview: {
    select: {
      title: 'channel_name',
      subtitle: 'category'
    }
  }
})
