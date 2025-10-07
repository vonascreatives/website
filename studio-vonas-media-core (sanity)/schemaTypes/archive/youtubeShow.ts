import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'youtubeShow',
  title: 'YouTube Show',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Show Title',
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
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Alt text'},
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {title: 'title', media: 'thumbnail', order: 'order'},
    prepare({title, media, order}) {
      return {title, media, subtitle: `Order: ${order ?? '-'}`}
    },
  },
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}, {field: 'title', direction: 'asc'}]},
    {title: 'Title', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
})
