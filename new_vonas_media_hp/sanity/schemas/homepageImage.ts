import { defineField, defineType } from 'sanity'

export const homepageImage = defineType({
  name: 'homepageImage',
  title: 'Homepage Image',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'folder',
      title: 'Folder',
      type: 'string'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string'
    }),
    defineField({
      name: 'placement',
      title: 'Placement',
      type: 'string'
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number'
    })
  ]
})
