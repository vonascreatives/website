import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'useCase',
  title: 'Use Case',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Use Case Title',
      type: 'string',
      description: 'Main title of the use case',
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
      description: 'URL-friendly version of the title',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Tagline or subtitle of the case study (e.g., "Effortless chic lifestyle")'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Large background image for the use case hero section',
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
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
      description: 'Link to the live project website'
    }),
    defineField({
      name: 'summary',
      title: 'Project Summary',
      type: 'text',
      description: 'Brief description of the project',
      rows: 3,
      validation: Rule => Rule.required()
    }),
    
    // Project Info Fields
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Name of the client or company',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'string',
      description: 'Services provided (e.g., Web Development, Design)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      description: 'Industry of the project (e.g., Photography, E-commerce)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Project Date',
      type: 'date',
      options: {
        dateFormat: 'MMMM YYYY',
      },
      description: 'When the project was completed',
      validation: Rule => Rule.required()
    }),

    // Content Sections
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      description: 'Different sections of the use case',
      of: [
        {
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              description: 'Title of this section (e.g., "Simple & Significant")',
              validation: Rule => Rule.required()
            },
            {
              name: 'goal',
              title: 'Goal',
              type: 'string',
              description: 'Section goal or category (e.g., "An introduction")'
            },
            {
              name: 'caseDetails',
              title: 'Case Details',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [{ title: 'Normal', value: 'normal' }],
                  lists: [],
                }
              ],
              description: 'Detailed content for this section'
            }
          ],
          preview: {
            select: {
              title: 'sectionTitle',
              subtitle: 'goal'
            }
          }
        }
      ]
    }),    // Gallery Images
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for accessibility'
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image'
            }
          ]
        }
      ],
      description: 'Images for the moving gallery section'
    }),
    
    // Full Width Image
    defineField({
      name: 'fullWidthImage',
      title: 'Full Width Image',
      type: 'image',
      description: 'Large full-width showcase image',
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
      ]
    }),
    
    // Grid Images
    defineField({
      name: 'gridImageLeft',
      title: 'Grid Image (Left)',
      type: 'image',
      description: 'Left image in the grid layout',
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
      ]
    }),
    defineField({
      name: 'gridImageRight',
      title: 'Grid Image (Right)',
      type: 'image',
      description: 'Right image in the grid layout',
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
      ]
    }),
    
    // Additional Fields
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this use case should appear (lower numbers appear first)',
      validation: Rule => Rule.required().min(1),
      initialValue: 1
    }),
    defineField({
      name: 'featured',
      title: 'Featured Use Case',
      type: 'boolean',
      description: 'Mark as featured to highlight on homepage',
      initialValue: false
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Show/hide this use case on the website',
      initialValue: true
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      description: 'Categories or tags for filtering use cases'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'heroImage'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title,
        subtitle: subtitle ? `Client: ${subtitle}` : 'No client set'
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
        { field: 'date', direction: 'desc' }
      ]
    },
    {
      title: 'Date (Oldest First)',
      name: 'dateAsc',
      by: [
        { field: 'date', direction: 'asc' }
      ]
    }
  ]
})

