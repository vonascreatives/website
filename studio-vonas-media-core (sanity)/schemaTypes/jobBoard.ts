import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'jobBoard',
  title: 'Job Board',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      name: 'team',
      title: 'Team',
      type: 'string',
      options: {
        list: [
          {title: 'Editorial', value: 'editorial'},
          {title: 'Production', value: 'production'},
          {title: 'Design', value: 'design'},
          {title: 'Marketing', value: 'marketing'},
          {title: 'Operations', value: 'operations'},
          {title: 'Technology', value: 'technology'},
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Remote or city name',
    }),
    defineField({
      name: 'jobType',
      title: 'Job Type',
      type: 'string',
      options: {
        list: [
          {title: 'Full-time', value: 'fulltime'},
          {title: 'Part-time', value: 'parttime'},
          {title: 'Contract', value: 'contract'},
          {title: 'Internship', value: 'internship'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'richBody',
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Bullet list of requirements',
    }),
    defineField({
      name: 'compensation',
      title: 'Compensation',
      type: 'string',
      description: 'Salary range or compensation details',
    }),
    defineField({
      name: 'applyUrl',
      title: 'Apply URL',
      type: 'url',
      description: 'Link to application form or email',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date/Time',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'headerImage',
      title: 'Header Image',
      type: 'imageWithAlt',
      description: 'Header image for this job posting',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      team: 'team',
      location: 'location',
      jobType: 'jobType',
      active: 'active',
    },
    prepare({title, team, location, jobType, active}) {
      return {
        title: `${title}${!active ? ' (Inactive)' : ''}`,
        subtitle: [team, jobType, location].filter(Boolean).join(' • '),
      }
    },
  },
})
