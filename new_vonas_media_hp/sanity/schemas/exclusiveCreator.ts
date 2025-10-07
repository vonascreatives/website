import { defineField, defineType } from 'sanity'

export const exclusiveCreator = defineType({
  name: 'exclusiveCreator',
  title: 'Exclusive Creator',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      }
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string'
    }),
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
      name: 'niche',
      title: 'Niche',
      type: 'string'
    }),
    defineField({
      name: 'totalFollowers',
      title: 'Total Followers',
      type: 'number'
    })
  ]
})
