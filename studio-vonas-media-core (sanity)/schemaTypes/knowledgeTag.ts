import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'knowledgeTag',
  title: 'Knowledge Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tag Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Display name for the tag',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 50,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version of the tag name',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Brief description of what this tag represents',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          {title: 'Light Blue', value: '#DBEAFE'},
          {title: 'Light Green', value: '#D1FAE5'},
          {title: 'Light Yellow', value: '#FEF3C7'},
          {title: 'Light Red', value: '#FEE2E2'},
          {title: 'Light Purple', value: '#EDE9FE'},
          {title: 'Light Pink', value: '#FCE7F3'},
          {title: 'Light Gray', value: '#F3F4F6'},
        ],
      },
      description: 'Background color for the tag',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this tag is currently active and can be used',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      isActive: 'isActive',
    },
    prepare({title, subtitle, isActive}) {
      return {
        title,
        subtitle: [
          subtitle,
          isActive ? 'Active' : 'Inactive'
        ].filter(Boolean).join(' • '),
      }
    },
  },
  orderings: [
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Status (Active First)',
      name: 'activeFirst',
      by: [
        {field: 'isActive', direction: 'desc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
})