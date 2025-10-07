import {defineField, defineType} from 'sanity'
import {FolderIcon} from '@sanity/icons'

export default defineType({
  name: 'knowledgeCategory',
  title: 'Knowledge Category',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Display name for the category',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version of the category name',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of what this category covers',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name or emoji to represent this category',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          {title: 'Blue', value: '#3B82F6'},
          {title: 'Green', value: '#10B981'},
          {title: 'Yellow', value: '#F59E0B'},
          {title: 'Red', value: '#EF4444'},
          {title: 'Purple', value: '#8B5CF6'},
          {title: 'Pink', value: '#EC4899'},
          {title: 'Gray', value: '#6B7280'},
        ],
      },
      description: 'Color theme for this category',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which categories should be displayed',
      initialValue: 100,
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this category is currently active',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      order: 'order',
      isActive: 'isActive',
    },
    prepare({title, subtitle, order, isActive}) {
      return {
        title,
        subtitle: [
          subtitle,
          `Order: ${order}`,
          isActive ? 'Active' : 'Inactive'
        ].filter(Boolean).join(' • '),
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})