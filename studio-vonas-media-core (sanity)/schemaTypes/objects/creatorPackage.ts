import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'creatorPackage',
  title: 'Creator Package',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Package Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of what this package includes',
    }),
    defineField({
      name: 'turnaroundTime',
      title: 'Turnaround Time (days)',
      type: 'number',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'rateFrom',
      title: 'Rate From (Internal)',
      type: 'number',
      description: 'Internal pricing information',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      turnaround: 'turnaroundTime',
      rate: 'rateFrom',
    },
    prepare({title, turnaround, rate}) {
      return {
        title: title,
        subtitle: [
          turnaround && `${turnaround} days`,
          rate && `From $${rate}`,
        ].filter(Boolean).join(' • '),
      }
    },
  },
})
