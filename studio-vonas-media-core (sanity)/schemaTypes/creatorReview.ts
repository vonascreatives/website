import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'creatorReview',
  title: 'Creator Review',
  type: 'document',
  groups: [
    {
      name: 'review',
      title: 'Review',
      default: true,
    },
    {
      name: 'moderation',
      title: 'Moderation',
    },
  ],
  fields: [
    defineField({
      name: 'creator',
      title: 'Creator',
      type: 'reference',
      to: [{type: 'creator'}],
      group: 'review',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      group: 'review',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      description: 'Rating from 1 to 5 stars',
    }),
    defineField({
      name: 'title',
      title: 'Review Title',
      type: 'string',
      group: 'review',
      validation: (Rule) => Rule.max(100),
      description: 'Optional title for the review',
    }),
    defineField({
      name: 'body',
      title: 'Review Body',
      type: 'text',
      group: 'review',
      validation: (Rule) => Rule.required().max(1000),
      description: 'Main review content (max 1000 characters)',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      group: 'review',
      options: {
        list: [
          {title: 'Professional', value: 'professional'},
          {title: 'Creative', value: 'creative'},
          {title: 'Reliable', value: 'reliable'},
          {title: 'Responsive', value: 'responsive'},
          {title: 'High Quality', value: 'high-quality'},
          {title: 'On Time', value: 'on-time'},
          {title: 'Great Communication', value: 'great-communication'},
          {title: 'Exceeded Expectations', value: 'exceeded-expectations'},
          {title: 'Innovative', value: 'innovative'},
          {title: 'Easy to Work With', value: 'easy-to-work-with'},
        ],
        layout: 'tags',
      },
      description: 'Main tags for filtering and categorizing reviews',
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      group: 'review',
      validation: (Rule) => Rule.required().max(50),
      description: 'Name of the person writing the review',
    }),
    defineField({
      name: 'authorEmail',
      title: 'Author Email',
      type: 'string',
      group: 'review',
      validation: (Rule) => Rule.required().email(),
      description: 'Email of the reviewer (not displayed publicly)',
    }),
    defineField({
      name: 'authorCompany',
      title: 'Author Company',
      type: 'string',
      group: 'review',
      validation: (Rule) => Rule.max(100),
      description: 'Optional company name of the reviewer',
    }),
    defineField({
      name: 'status',
      title: 'Review Status',
      type: 'string',
      group: 'moderation',
      options: {
        list: [
          {title: 'Pending Review', value: 'pending'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
          {title: 'Spam', value: 'spam'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'moderationNotes',
      title: 'Moderation Notes',
      type: 'text',
      group: 'moderation',
      description: 'Internal notes about the moderation decision',
    }),
    defineField({
      name: 'moderatedBy',
      title: 'Moderated By',
      type: 'string',
      group: 'moderation',
      description: 'Who approved/rejected this review',
      readOnly: true,
    }),
    defineField({
      name: 'moderatedAt',
      title: 'Moderated At',
      type: 'datetime',
      group: 'moderation',
      description: 'When this review was moderated',
      readOnly: true,
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      group: 'moderation',
      description: 'IP address of the reviewer (for spam detection)',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
      group: 'moderation',
      description: 'Browser info (for spam detection)',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'honeypot',
      title: 'Honeypot',
      type: 'string',
      group: 'moderation',
      description: 'Anti-spam honeypot field',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      creatorName: 'creator.name',
      authorName: 'authorName',
      rating: 'rating',
      status: 'status',
      createdAt: '_createdAt',
    },
    prepare({title, creatorName, authorName, rating, status, createdAt}) {
      const stars = '⭐'.repeat(rating || 0)
      const statusEmoji = {
        pending: '⏳',
        approved: '✅',
        rejected: '❌',
        spam: '🚫',
      }[status] || '❓'
      
      const displayTitle = title || `${stars} Review`
      const subtitle = `${statusEmoji} ${creatorName || 'Unknown Creator'} • by ${authorName || 'Anonymous'} • ${new Date(createdAt).toLocaleDateString()}`
      
      return {
        title: displayTitle,
        subtitle,
      }
    },
  },
  orderings: [
    {
      title: 'Pending First',
      name: 'pendingFirst',
      by: [
        {field: 'status', direction: 'asc'}, // pending comes first alphabetically
        {field: '_createdAt', direction: 'desc'}
      ],
    },
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
    {
      title: 'Highest Rating',
      name: 'highestRating',
      by: [{field: 'rating', direction: 'desc'}],
    },
  ],
})
