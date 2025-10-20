import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'award',
  title: 'Award & Recognition',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Award Title',
      type: 'string',
      description: 'The name of the award or recognition',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Count/Subtitle',
      type: 'string',
      description: 'Number of times received (e.g., "x2", "x3") or subtitle text',
      placeholder: 'x2',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'awardDate',
      title: 'Award Date',
      type: 'date',
      description: 'Date when the award was received',
      options: {
        dateFormat: 'MMM DD, YYYY',
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Award Logo/Image',
      type: 'image',
      description: 'Logo or image representing the award (PNG format recommended for transparency)',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility'
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'organization',
      title: 'Awarding Organization',
      type: 'string',
      description: 'Organization that gave the award (e.g., FWA, Awwwards)',
    }),
    defineField({
      name: 'category',
      title: 'Award Category',
      type: 'string',
      description: 'Category or type of award',
      options: {
        list: [
          { title: 'Design', value: 'design' },
          { title: 'Development', value: 'development' },
          { title: 'Innovation', value: 'innovation' },
          { title: 'Digital Excellence', value: 'digital-excellence' },
          { title: 'Site of the Day', value: 'sotd' },
          { title: 'Other', value: 'other' }
        ]
      }
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
      description: 'Link to the awarded project or award page'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description about the award or achievement',
      rows: 3
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which the award should appear (lower numbers appear first)',
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'featured',
      title: 'Featured Award',
      type: 'boolean',
      description: 'Mark as featured to highlight this award',
      initialValue: false
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Show/hide this award on the website',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
      date: 'awardDate'
    },
    prepare(selection) {
      const { title, subtitle, date } = selection
      return {
        title: `${subtitle} ${title}`,
        subtitle: date ? `Awarded: ${date}` : 'No date set'
      }
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [
        { field: 'displayOrder', direction: 'asc' }
      ]
    },
    {
      title: 'Date (Newest First)',
      name: 'dateDesc',
      by: [
        { field: 'awardDate', direction: 'desc' }
      ]
    },
    {
      title: 'Date (Oldest First)',
      name: 'dateAsc',
      by: [
        { field: 'awardDate', direction: 'asc' }
      ]
    }
  ]
})