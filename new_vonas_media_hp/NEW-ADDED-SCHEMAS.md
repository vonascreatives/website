affiliant-links


import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'affiliateLink',
  title: 'Affiliate Links',
  type: 'document',
  fields: [
    defineField({
      name: 'offerText',
      title: 'Offer Text',
      type: 'string',
      description: 'Offer text for this affiliate link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'offerText',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'appName',
      title: 'App Name',
      type: 'string',
      description: 'App name for this affiliate link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Project year (e.g., 2024)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'affiliateUrl',
      title: 'Affiliate URL',
      type: 'url',
      description: 'External affiliate link URL',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https'],
      }),
    }),
    defineField({
      name: 'hoverText',
      title: 'Hover Text',
      type: 'string',
      description: 'Text displayed on hover (e.g., "View Demo")',
      initialValue: 'View Demo',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this item appears (lower numbers first)',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to show/hide this affiliate link',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Mark as featured item',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'offerText',
      subtitle: 'appName',
      media: 'image',
      year: 'year',
      isActive: 'isActive',
    },
    prepare({ title, subtitle, media, year, isActive }) {
      return {
        title: `${title} (${year})`,
        subtitle: `${subtitle} ${isActive ? '✅' : '❌'}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Year (Newest First)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
});



award.ts

import { defineField, defineType } from 'sanity'

export const award = defineType({
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




fun fact

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


studio hero 

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


studio testimonials 

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



studio counter stats 


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


faq-v2.ts 

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faqV2',
  title: 'FAQ Section',
  type: 'document',
  fields: [
    defineField({
      name: 'sidebarTitle',
      title: 'Sidebar Title',
      type: 'string',
      description: 'Main title for the FAQ sidebar (h4 tag)',
      validation: (Rule) => Rule.required(),
      initialValue: 'Q&A',
    }),
    defineField({
      name: 'sidebarDescription',
      title: 'Sidebar Description',
      type: 'text',
      description: 'Description text below the sidebar title (p tag)',
      validation: (Rule) => Rule.required(),
      initialValue: 'Got questions about channels, creators, or collaborations?\nFind answers here.',
    }),
    defineField({
      name: 'sidebarBanner',
      title: 'Sidebar Banner Image',
      type: 'image',
      description: 'Banner image for the FAQ sidebar',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Search Placeholder Text',
      type: 'string',
      description: 'Placeholder text for the search input',
      initialValue: 'Search questions',
    }),
    // FAQ Items Array
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      description: 'List of FAQ questions and answers',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Order in which this FAQ should appear (lower numbers first)',
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: 'isActive',
              title: 'Is Active',
              type: 'boolean',
              description: 'Toggle to show/hide this FAQ',
              initialValue: true,
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              description: 'Optional category for filtering FAQs',
              options: {
                list: [
                  { title: 'General', value: 'general' },
                  { title: 'Freelancer', value: 'freelancer' },
                  { title: 'Brands', value: 'brands' },
                  { title: 'Creator', value: 'creator' },
                ],
              },
            },
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'category',
              order: 'order',
            },
            prepare({ title, subtitle, order }) {
              return {
                title: `${order}. ${title}`,
                subtitle: subtitle ? `Category: ${subtitle}` : 'No category',
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'sidebarTitle',
      subtitle: 'sidebarDescription',
      media: 'sidebarBanner',
    },
  },
});
