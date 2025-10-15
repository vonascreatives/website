import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'studioCounter',
  title: 'Studio Counter Stats',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional title for the counter section',
    }),
    defineField({
      name: 'counters',
      title: 'Counter Items',
      type: 'array',
      description: 'Add your statistics/counter items here',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'E.g., "Experts", "Projects", "Years in business"',
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
              name: 'prefix',
              title: 'Prefix',
              type: 'string',
              description: 'Text before the number (e.g., "+", "$")',
              initialValue: '+'
            }),
            defineField({
              name: 'suffix',
              title: 'Suffix',
              type: 'string',
              description: 'Text after the number (e.g., "+", "K", "M", "%")',
            }),
            defineField({
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              description: 'Order in which this counter appears',
              validation: Rule => Rule.required().min(1)
            })
          ],
          preview: {
            select: {
              label: 'label',
              count: 'count',
              prefix: 'prefix',
              suffix: 'suffix',
              order: 'displayOrder'
            },
            prepare({ label, count, prefix, suffix, order }) {
              const prefixStr = prefix || '';
              const suffixStr = suffix || '';
              return {
                title: `${order}. ${label}`,
                subtitle: `${prefixStr}${count}${suffixStr}`
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1).max(10)
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to show/hide this counter section',
      initialValue: true
    }),
    defineField({
      name: 'pageLocation',
      title: 'Page Location',
      type: 'string',
      description: 'Where this counter section appears',
      options: {
        list: [
          { title: 'Studio Home', value: 'studio-home' },
          { title: 'Home Page', value: 'home' },
          { title: 'Multiple Pages', value: 'global' }
        ]
      },
      initialValue: 'studio-home'
    })
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      pageLocation: 'pageLocation',
      counterCount: 'counters'
    },
    prepare({ title, isActive, pageLocation, counterCount }) {
      const count = counterCount?.length || 0;
      return {
        title: title || 'Studio Counter Stats',
        subtitle: `${count} counters • ${pageLocation || 'studio-home'} • ${isActive ? '✅ Active' : '❌ Inactive'}`
      }
    }
  }
})
