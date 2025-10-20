import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'funFact',
  title: 'Fun Facts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main title for the fun facts section (e.g., "Agency Snapshots")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'The subtitle that appears above the title (e.g., "Fun Facts")',
      initialValue: 'Fun Facts'
    }),
    defineField({
      name: 'facts',
      title: 'Fun Facts',
      type: 'array',
      description: 'Add your fun facts/statistics here',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'E.g., "PROJECTS DELIVERED", "YEARS OF EXCELLENCE"',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'count',
              title: 'Count/Number',
              type: 'number',
              description: 'The number to count up to',
              validation: Rule => Rule.required().min(0)
            }),
            defineField({
              name: 'suffix',
              title: 'Suffix',
              type: 'string',
              description: 'Text to appear after the number (e.g., "+", "%", "K", "M")',
              initialValue: '+'
            }),
            defineField({
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              description: 'Order in which this fact appears (lower numbers appear first)',
              validation: Rule => Rule.required().min(1)
            })
          ],
          preview: {
            select: {
              title: 'title',
              count: 'count',
              suffix: 'suffix',
              order: 'displayOrder'
            },
            prepare({ title, count, suffix, order }) {
              return {
                title: `${order}. ${title}`,
                subtitle: `${count}${suffix}`
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1).max(6)
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to show/hide this fun facts section',
      initialValue: true
    }),
    defineField({
      name: 'pageLocation',
      title: 'Page Location',
      type: 'string',
      description: 'Where this fun facts section appears',
      options: {
        list: [
          { title: 'About Page', value: 'about' },
          { title: 'Home Page', value: 'home' },
          { title: 'Multiple Pages', value: 'global' }
        ]
      },
      initialValue: 'about'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      isActive: 'isActive',
      pageLocation: 'pageLocation'
    },
    prepare({ title, subtitle, isActive, pageLocation }) {
      return {
        title: title || 'Fun Facts Section',
        subtitle: `${subtitle || 'Fun Facts'} • ${pageLocation || 'about'} • ${isActive ? '✅ Active' : '❌ Inactive'}`
      }
    }
  }
})