import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'colors',
  title: 'Colors',
  type: 'object',
  fields: [
    defineField({
      name: 'color_name',
      title: 'Color Name',
      type: 'string',
      description: 'Optional name for the color (e.g., "Primary Blue", "Accent Red")',
    }),
    defineField({
      name: 'color_hex',
      title: 'Color Hex Code',
      type: 'string',
      validation: (Rule) => 
        Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
          name: 'hex',
          invert: false,
        }).error('Must be a valid hex color code (e.g., #FF5733)'),
    }),
  ],
  preview: {
    select: {
      name: 'color_name',
      hex: 'color_hex',
    },
    prepare({name, hex}) {
      return {
        title: name || hex,
        subtitle: hex,
      }
    },
  },
})
