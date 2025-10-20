
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'studioTestimonial',
  title: 'Studio Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main title for the testimonial section (e.g., "What Our Clients Say")',
      initialValue: 'What Our Clients Say'
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Subtitle that appears above testimonials (e.g., "Testimonials:")',
      initialValue: 'Testimonials:'
    }),
    defineField({
      name: 'shapeImage',
      title: 'Shape/Decoration Image',
      type: 'image',
      description: 'Decorative shape image on the left side',
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
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      description: 'Add client testimonials here',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'clientName',
              title: 'Client Name',
              type: 'string',
              description: 'Name of the person giving the testimonial',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'designation',
              title: 'Designation',
              type: 'string',
              description: 'Job title and company (e.g., "CEO | Gemini Skincare")',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'testimonialText',
              title: 'Testimonial Text',
              type: 'text',
              description: 'The testimonial content',
              rows: 4,
              validation: Rule => Rule.required().min(50).max(500)
            }),
            defineField({
              name: 'companyLogo',
              title: 'Company Logo',
              type: 'image',
              description: 'Logo of the client\'s company',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  validation: Rule => Rule.required()
                }
              ],
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              description: 'Order in which this testimonial appears',
              validation: Rule => Rule.required().min(1)
            }),
            defineField({
              name: 'featured',
              title: 'Featured',
              type: 'boolean',
              description: 'Mark as featured testimonial',
              initialValue: false
            })
          ],
          preview: {
            select: {
              name: 'clientName',
              designation: 'designation',
              order: 'displayOrder',
              logo: 'companyLogo'
            },
            prepare({ name, designation, order, logo }) {
              return {
                title: `${order}. ${name}`,
                subtitle: designation,
                media: logo
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to show/hide this testimonial section',
      initialValue: true
    }),
    defineField({
      name: 'pageLocation',
      title: 'Page Location',
      type: 'string',
      description: 'Where this testimonial section appears',
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
      title: 'sectionTitle',
      isActive: 'isActive',
      pageLocation: 'pageLocation',
      testimonialCount: 'testimonials'
    },
    prepare({ title, isActive, pageLocation, testimonialCount }) {
      const count = testimonialCount?.length || 0;
      return {
        title: title || 'Studio Testimonials',
        subtitle: `${count} testimonials • ${pageLocation || 'studio-home'} • ${isActive ? '✅ Active' : '❌ Inactive'}`
      }
    }
  }
})
