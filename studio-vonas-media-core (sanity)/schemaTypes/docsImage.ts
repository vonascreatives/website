import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'docsImage',
  title: 'Documentation Image',
  type: 'object',
  icon: () => '🖼️',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption displayed below the image'
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small (400px)', value: 'small'},
          {title: 'Medium (600px)', value: 'medium'},
          {title: 'Large (800px)', value: 'large'},
          {title: 'Full Width', value: 'full'}
        ],
        layout: 'radio'
      },
      initialValue: 'medium'
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'}
        ],
        layout: 'radio'
      },
      initialValue: 'center'
    }),
    defineField({
      name: 'border',
      title: 'Show Border',
      type: 'boolean',
      initialValue: false,
      description: 'Add a border around the image'
    }),
    defineField({
      name: 'shadow',
      title: 'Drop Shadow',
      type: 'boolean',
      initialValue: false,
      description: 'Add a drop shadow to the image'
    }),
    defineField({
      name: 'rounded',
      title: 'Rounded Corners',
      type: 'boolean',
      initialValue: false,
      description: 'Add rounded corners to the image'
    }),
    defineField({
      name: 'lightbox',
      title: 'Enable Lightbox',
      type: 'boolean',
      initialValue: true,
      description: 'Allow users to click to view full-size image'
    })
  ],
  preview: {
    select: {
      media: 'image',
      alt: 'image.alt',
      caption: 'caption',
      size: 'size'
    },
    prepare({media, alt, caption, size}) {
      return {
        title: alt || 'Documentation Image',
        subtitle: caption || `${size} image`,
        media
      }
    }
  }
})