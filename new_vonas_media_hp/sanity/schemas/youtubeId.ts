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
    })
  ],
  preview: {
    select: {
      title: 'channel_name',
      subtitle: 'category'
    }
  }
})
