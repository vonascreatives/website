import {defineField, defineType} from 'sanity'

import {FolderIcon} from '@sanity/icons'

export default defineType({
  name: 'kbCategory',
  title: 'KB Category',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 1,
      description: 'Lower numbers appear first',
    }),
  ],
  preview: {
    select: {title: 'title', order: 'order'},
    prepare({title, order}) {
      return {title, subtitle: `Order: ${order ?? '-'}`}
    },
  },
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}, {field: 'title', direction: 'asc'}]},
    {title: 'Title', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
})
