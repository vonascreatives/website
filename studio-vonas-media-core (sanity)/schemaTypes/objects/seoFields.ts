import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines and social media',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engines and social media',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Social/OG Image',
      type: 'imageWithAlt',
      description: 'Image for social media sharing',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
  ],
})
