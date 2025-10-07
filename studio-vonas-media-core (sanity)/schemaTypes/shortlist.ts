import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'shortlist',
  title: 'Shortlist',
  type: 'document',
  groups: [
    {
      name: 'list',
      title: 'Creator List',
      default: true,
    },
    {
      name: 'brief',
      title: 'Project Brief',
    },
    {
      name: 'status',
      title: 'Status',
    },
  ],
  fields: [
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      group: 'list',
      validation: (Rule) => Rule.required(),
      description: 'Unique session identifier for the shortlist',
    }),
    defineField({
      name: 'creators',
      title: 'Selected Creators',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'creator'}]}],
      group: 'list',
      description: 'Creators added to this shortlist',
    }),
    defineField({
      name: 'brief',
      title: 'Project Brief',
      type: 'object',
      group: 'brief',
      fields: [
        defineField({
          name: 'brandName',
          title: 'Brand Name',
          type: 'string',
          validation: (Rule) => Rule.max(100),
          description: 'Name of the brand or company',
        }),
        defineField({
          name: 'contactEmail',
          title: 'Contact Email',
          type: 'string',
          validation: (Rule) => Rule.email(),
          description: 'Primary contact email for this project',
        }),
        defineField({
          name: 'contactName',
          title: 'Contact Name',
          type: 'string',
          validation: (Rule) => Rule.max(100),
          description: 'Name of the primary contact person',
        }),
        defineField({
          name: 'message',
          title: 'Project Message',
          type: 'text',
          validation: (Rule) => Rule.max(2000),
          description: 'Detailed project description, goals, and requirements',
        }),
        defineField({
          name: 'budget',
          title: 'Budget Range',
          type: 'string',
          options: {
            list: [
              {title: 'Under $5,000', value: 'under-5k'},
              {title: '$5,000 - $10,000', value: '5k-10k'},
              {title: '$10,000 - $25,000', value: '10k-25k'},
              {title: '$25,000 - $50,000', value: '25k-50k'},
              {title: '$50,000+', value: 'over-50k'},
              {title: 'Prefer to discuss', value: 'discuss'},
            ],
          },
          description: 'Estimated budget range for the project',
        }),
        defineField({
          name: 'timeline',
          title: 'Project Timeline',
          type: 'string',
          options: {
            list: [
              {title: 'ASAP (Rush)', value: 'asap'},
              {title: 'Within 1 month', value: '1-month'},
              {title: '1-3 months', value: '1-3-months'},
              {title: '3-6 months', value: '3-6-months'},
              {title: '6+ months', value: 'over-6-months'},
              {title: 'Flexible', value: 'flexible'},
            ],
          },
          description: 'Preferred timeline for project completion',
        }),
        defineField({
          name: 'attachments',
          title: 'Attachments',
          type: 'array',
          of: [{type: 'file'}],
          options: {
            accept: '.png,.jpg,.jpeg,.pdf,.doc,.docx',
          },
          validation: (Rule) => Rule.max(10),
          description: 'Supporting files (images, briefs, references) - max 10 files, 10MB each',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: 'status',
      title: 'Shortlist Status',
      type: 'string',
      group: 'status',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Submitted', value: 'submitted'},
          {title: 'Under Review', value: 'under-review'},
          {title: 'Quoted', value: 'quoted'},
          {title: 'Accepted', value: 'accepted'},
          {title: 'Declined', value: 'declined'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes',
      type: 'text',
      group: 'status',
      description: 'Internal team notes about this shortlist/project',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      group: 'status',
      description: 'When the shortlist was submitted for review',
      readOnly: true,
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      group: 'status',
      description: 'When the shortlist was last modified',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      group: 'status',
      description: 'IP address of the client (for reference)',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      sessionId: 'sessionId',
      brandName: 'brief.brandName',
      contactEmail: 'brief.contactEmail',
      creatorCount: 'creators',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare({sessionId, brandName, contactEmail, creatorCount, status, submittedAt}) {
      const statusEmoji = {
        draft: '📝',
        submitted: '📤',
        'under-review': '👀',
        quoted: '💰',
        accepted: '✅',
        declined: '❌',
      }[status] || '❓'
      
      const title = brandName || contactEmail || sessionId?.slice(0, 8) || 'Unknown Shortlist'
      const creatorCountText = creatorCount ? `${creatorCount.length} creators` : '0 creators'
      const dateText = submittedAt ? new Date(submittedAt).toLocaleDateString() : 'Not submitted'
      
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${creatorCountText} • ${status} • ${dateText}`,
      }
    },
  },
  orderings: [
    {
      title: 'Recently Updated',
      name: 'updatedDesc',
      by: [{field: 'lastUpdated', direction: 'desc'}],
    },
    {
      title: 'Recently Submitted',
      name: 'submittedDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
  ],
})
