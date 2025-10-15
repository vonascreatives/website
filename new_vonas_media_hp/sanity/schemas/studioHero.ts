import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'studioHero',
  title: 'Studio Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Hero Title',
      type: 'string',
      description: 'Main hero title (e.g., "Vonas Content", "Content Channel Lab")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'heroImageLeft',
      title: 'Hero Image Left',
      type: 'image',
      description: 'Large decorative image on the left side',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility'
        }
      ]
    }),
    defineField({
      name: 'heroImageRight',
      title: 'Hero Image Right',
      type: 'image',
      description: 'Large decorative image on the right side',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility'
        }
      ]
    }),
    defineField({
      name: 'shapeImage',
      title: 'Shape/Decoration Image',
      type: 'image',
      description: 'Decorative shape image below the title',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text'
        }
      ]
    }),
    defineField({
      name: 'thumbnailImages',
      title: 'Thumbnail Images',
      type: 'array',
      description: 'Add 4 thumbnail images for the right side grid',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: Rule => Rule.required()
            },
            {
              name: 'displayOrder',
              type: 'number',
              title: 'Display Order',
              description: 'Order in the grid (1-4)',
              validation: Rule => Rule.required().min(1).max(4)
            }
          ]
        }
      ],
      validation: Rule => Rule.required().min(4).max(4)
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to show/hide this hero section',
      initialValue: true
    }),
    defineField({
      name: 'pageLocation',
      title: 'Page Location',
      type: 'string',
      description: 'Where this hero section appears',
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
      media: 'heroImageLeft'
    },
    prepare({ title, isActive, pageLocation, media }) {
      return {
        title: title || 'Studio Hero Section',
        subtitle: `${pageLocation || 'studio-home'} • ${isActive ? '✅ Active' : '❌ Inactive'}`,
        media
      }
    }
  }
})
