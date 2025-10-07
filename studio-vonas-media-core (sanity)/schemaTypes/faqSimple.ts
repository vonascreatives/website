import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faq',
  title: 'Homepage FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: 'Plain text answer shown on the official website',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 100,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Show/hide this FAQ on the site',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      isActive: 'isActive',
      order: 'order',
    },
    prepare({title, isActive, order}) {
      return {
        title,
        subtitle: `${isActive ? '✅ Active' : '❌ Inactive'} • Order: ${order ?? '-'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
