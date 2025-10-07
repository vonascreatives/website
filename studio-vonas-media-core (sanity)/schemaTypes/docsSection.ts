import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'docsSection',
  title: 'Documentation Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The title of this documentation section (e.g., "Getting Started", "API Reference")'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of what this section covers'
    }),
    defineField({
      name: 'parent',
      title: 'Parent Section',
      type: 'reference',
      to: [{type: 'docsSection'}],
      description: 'Optional parent section for nested navigation'
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      description: 'Order in navigation (lower numbers appear first)'
    }),
    defineField({
      name: 'isCollapsible',
      title: 'Collapsible',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this section can be collapsed in navigation'
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this section is visible in navigation'
    })
  ],
  preview: {
    select: {
      title: 'title',
      parent: 'parent.title',
      order: 'order'
    },
    prepare({title, parent, order}) {
      return {
        title: title,
        subtitle: parent ? `Under: ${parent} (Order: ${order})` : `Order: ${order}`
      }
    }
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}]
    }
  ]
})