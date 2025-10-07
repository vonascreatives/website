import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'typography',
  title: 'Typography',
  type: 'object',
  fields: [
    defineField({
      name: 'font_name',
      title: 'Font Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'font_usage',
      title: 'Font Usage',
      type: 'string',
      description: 'e.g., "Used for thumbnails / Used for overlay text"',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'font_name',
      subtitle: 'font_usage',
    },
  },
})
