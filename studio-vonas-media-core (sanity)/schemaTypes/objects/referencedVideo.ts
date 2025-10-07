import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'referencedVideo',
  title: 'Referenced Video',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, TikTok, or other video platform link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedChannel',
      title: 'Related YouTube Channel',
      type: 'reference',
      to: [{type: 'youtubeId'}],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      channelName: 'relatedChannel.channel_name',
      url: 'url',
    },
    prepare({title, channelName, url}) {
      return {
        title: title,
        subtitle: channelName ? `${channelName} - ${url}` : url,
      }
    },
  },
})
