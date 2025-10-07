import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'knowledgeArticle',
  title: 'Knowledge Article',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Main headline for the knowledge article',
    }),
    defineField({
      name: 'subHeadline',
      title: 'Sub-headline',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
      description: 'Short description (1-3 sentences)',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'headline',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'overviewSteps',
      title: 'Overview Steps',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Key steps or points (simple list)',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'text',
      rows: 8,
      validation: (Rule) => Rule.required(),
      description: 'Complete article content (plain text for easy fetching)',
    }),
    defineField({
      name: 'videoRecording',
      title: 'Video Recording (Descript)',
      type: 'url',
      description: 'URL to video recording (Descript link)',
    }),
    defineField({
      name: 'supportingDocuments',
      title: 'Supporting Documents (Guidjar)',
      type: 'url',
      description: 'URL to supporting documents (Guidjar embed)',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'knowledgeCategory'}],
      validation: (Rule) => Rule.required(),
      description: 'Main category',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Simple tags for filtering',
    }),
    defineField({
      name: 'relatedFaqs',
      title: 'Related FAQs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      description: 'Connected FAQs',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Number for sorting (lower = first)',
      initialValue: 100,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'subHeadline',
      category: 'category.name',
      status: 'status',
    },
    prepare({title, subtitle, category, status}) {
      return {
        title,
        subtitle: `${category} • ${status}`,
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
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category.name', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
})