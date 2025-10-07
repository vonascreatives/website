import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'shareLinks',
  title: 'Share Links',
  type: 'object',
  fields: [
    defineField({
      name: 'youtube_url',
      title: 'YouTube URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instagram_url',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'tiktok_url',
      title: 'TikTok URL',
      type: 'url',
    }),
    defineField({
      name: 'twitter_url',
      title: 'Twitter URL',
      type: 'url',
    }),
    defineField({
      name: 'facebook_url',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'website_url',
      title: 'Website URL',
      type: 'url',
    }),
  ],
})
