import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export default defineType({
  name: 'jobTests',
  title: 'Job Tests',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'relations',
      title: 'Relations',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'Title of the job test',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version of the title',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'richBody',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'Main content of the job test',
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'reference',
      to: [{type: 'teamMember'}],
      group: 'relations',
      validation: (Rule) => Rule.required(),
      description: 'Team member who is the contact person for this job test',
    }),
    defineField({
      name: 'supportedDocuments',
      title: 'Supported Documents',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'kb'}]}],
      group: 'relations',
      description: 'Links to Knowledge Base documents that support this job test',
    }),
    defineField({
      name: 'relatedFAQs',
      title: 'Related FAQs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      group: 'relations',
      description: 'Links to relevant FAQ items',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'settings',
      description: 'Number for sorting (lower numbers appear first)',
      initialValue: 100,
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
      description: 'Whether this job test is currently active and should be displayed',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      contactPerson: 'contactPerson.name',
      order: 'order',
      isActive: 'isActive',
    },
    prepare({title, contactPerson, order, isActive}) {
      return {
        title,
        subtitle: [
          contactPerson ? `Contact: ${contactPerson}` : 'No contact',
          `Order: ${order}`,
          isActive ? '✅ Active' : '❌ Inactive'
        ].filter(Boolean).join(' • '),
        media: DocumentIcon,
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
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
    {
      title: 'Status (Active First)',
      name: 'activeFirst',
      by: [
        {field: 'isActive', direction: 'desc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
})
