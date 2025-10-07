import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'categorization',
      title: 'Categorization',
    },
    {
      name: 'relationships',
      title: 'Relationships',
    },
  ],
  fields: [
    defineField({
      name: 'faqId',
      title: 'FAQ ID',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().regex(/^FAQ-\d{3}$/, {
        name: 'FAQ ID Format',
        invert: false
      }).error('FAQ ID must be in format FAQ-XXX (e.g., FAQ-001)'),
      description: 'Unique FAQ identifier in format FAQ-XXX (e.g., FAQ-001)',
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'richBody',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Primary Category',
      type: 'string',
      group: 'categorization',
      options: {
        list: [
          {title: 'Company Foundation', value: 'company-foundation'},
          {title: 'Team Management', value: 'team-management'},
          {title: 'Content Production', value: 'content-production'},
          {title: 'Show-Specific', value: 'show-specific'},
          {title: 'Tools & Systems', value: 'tools-systems'},
          {title: 'External Collaboration', value: 'external-collaboration'},
          {title: 'Policies & Procedures', value: 'policies-procedures'},
          {title: 'General', value: 'general'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'tag',
              title: 'Tag',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }
          ],
        }
      ],
      group: 'categorization',
      options: {
        layout: 'list',
      },
      description: 'Tags for additional filtering and organization',
    }),
    defineField({
      name: 'relatedFaqs',
      title: 'Related FAQs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      group: 'relationships',
      description: 'Other FAQs that are related to this one',
    }),
    defineField({
      name: 'relatedKnowledgeArticles',
      title: 'Related Knowledge Articles',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'knowledgeArticle'}]}],
      group: 'relationships',
      description: 'Knowledge articles that reference this FAQ',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'categorization',
      description: 'Number for sorting (lower numbers appear first)',
      initialValue: 100,
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      group: 'content',
      initialValue: true,
      description: 'Whether this FAQ is currently active and should be displayed',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      faqId: 'faqId',
      category: 'category',
      order: 'order',
      isActive: 'isActive',
    },
    prepare({title, faqId, category, order, isActive}) {
      return {
        title: `${faqId}: ${title}`,
        subtitle: [
          category,
          `Order: ${order}`,
          isActive ? '✅ Active' : '❌ Inactive'
        ].filter(Boolean).join(' • '),
      }
    },
  },
  orderings: [
    {
      title: 'FAQ ID',
      name: 'faqIdAsc',
      by: [{field: 'faqId', direction: 'asc'}],
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
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
