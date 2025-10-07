import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'brandCollaboration',
  title: 'Brand Collaboration',
  type: 'document',
  groups: [
    {
      name: 'brand',
      title: 'Brand Info',
      default: true,
    },
    {
      name: 'project',
      title: 'Project Details',
    },
    {
      name: 'creators',
      title: 'Linked Creators',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      group: 'brand',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'brand',
      options: {
        source: 'brandName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Brand Logo',
      type: 'array',
      of: [{type: 'imageWithAlt'}],
      group: 'brand',
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.max(1),
      description: 'Brand logo image',
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'contactInfo',
      group: 'brand',
    }),
    defineField({
      name: 'objectives',
      title: 'Objectives',
      type: 'array',
      of: [{type: 'string'}],
      group: 'project',
      description: 'List of project objectives',
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [{type: 'string'}],
      group: 'project',
      description: 'List of expected deliverables',
    }),
    defineField({
      name: 'budgetRange',
      title: 'Budget Range',
      type: 'string',
      group: 'project',
      description: 'Budget range or details',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
      group: 'project',
      description: 'Project timeline or deadline',
    }),
    defineField({
      name: 'linkedCreators',
      title: 'Linked Exclusive Creators',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'exclusiveCreator'}]}],
      group: 'creators',
    }),
    defineField({
      name: 'linkedChannels',
      title: 'Linked YouTube Channels',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'youtubeId'}]}],
      group: 'creators',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'richBody',
      group: 'project',
      description: 'Additional notes and details',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Lead', value: 'lead'},
          {title: 'Negotiation', value: 'negotiation'},
          {title: 'Active', value: 'active'},
          {title: 'Paused', value: 'paused'},
          {title: 'Closed', value: 'closed'},
        ],
      },
      group: 'project',
      initialValue: 'lead',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created Date',
      type: 'datetime',
      group: 'project',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'brandName',
      media: 'logo.0.image',
      status: 'status',
      budget: 'budgetRange',
      timeline: 'timeline',
    },
    prepare({title, media, status, budget, timeline}) {
      return {
        title,
        media,
        subtitle: [status, budget, timeline].filter(Boolean).join(' • '),
      }
    },
  },
  orderings: [
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
    {
      title: 'Created Date (Newest)',
      name: 'createdDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
  ],
})
