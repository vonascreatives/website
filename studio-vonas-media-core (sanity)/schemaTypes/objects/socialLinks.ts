import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'socialLinks',
  title: 'Social Links',
  type: 'object',
  fields: [
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube',
      type: 'url',
    }),
    defineField({
      name: 'tiktok',
      title: 'TikTok',
      type: 'url',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook',
      type: 'url',
    }),
    defineField({
      name: 'twitter',
      title: 'X (Twitter)',
      type: 'url',
    }),
    defineField({
      name: 'other',
      title: 'Other Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Platform Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
})
