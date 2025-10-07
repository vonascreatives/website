import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'imageWithAlt',
  title: 'Image with Alt Text',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Short description for accessibility and SEO',
      validation: (Rule) => Rule.required().max(100),
    }),
  ],
  preview: {
    select: {
      media: 'image',
      title: 'alt',
    },
  },
})
