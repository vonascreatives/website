import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepageImage',
  title: 'Page Image',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'placement',
      title: 'Placement & Usage',
    },
    {
      name: 'seo',
      title: 'SEO & Optimization',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Image Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'Descriptive name for this image (e.g., "Hero Background", "About Section Portrait")',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{type: 'imageWithAlt'}],
      group: 'content',
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.max(1).required(),
      description: 'The actual image file with alt text',
    }),
    defineField({
      name: 'category',
      title: 'Image Category',
      type: 'string',
      group: 'placement',
      options: {
        list: [
          { title: 'Hero Section', value: 'Hero Section' },
          { title: 'Brand Section', value: 'Brand Section' },
          { title: 'Service Section', value: 'Service Section' },
          { title: 'Project Section', value: 'Project Section' },
          { title: 'Award Section', value: 'Award Section' },
          { title: 'Team Section', value: 'Team Section' },
          { title: 'Footer Section', value: 'Footer Section' },
          { title: 'Background Images', value: 'Background Images' },
          { title: 'Gallery Section', value: 'Gallery Section' },
          { title: 'Testimonials Section', value: 'Testimonials Section' },
          { title: 'Other', value: 'Other' }
        ]
      },
      validation: (Rule) => Rule.required(),
      description: 'Where this image appears on the homepage',
    }),
    defineField({
      name: 'page',
      title: 'Page (1 Page 1 Folder)',
      type: 'string',
      group: 'placement',
      options: {
        list: [
          { title: 'Homepage', value: 'Homepage' },
          { title: 'About Us', value: 'About Us' },
          { title: 'Channels', value: 'Channels' },
          { title: 'Creators', value: 'Creators' },
          { title: 'Services', value: 'Services' },
          { title: 'Contact', value: 'Contact' },
          { title: 'Blog', value: 'Blog' },
          { title: 'Portfolio', value: 'Portfolio' },
          { title: 'News', value: 'News' },
          { title: 'Global Assets', value: 'Global Assets' }
        ]
      },
      initialValue: 'Homepage',
      validation: (Rule) => Rule.required(),
      description: '1 Page = 1 Folder organization. Each page gets its own image folder.',
    }),
    defineField({
      name: 'folder',
      title: 'Folder Path',
      type: 'string',
      group: 'placement',
      readOnly: true,
      initialValue: (document) => {
        const page = document?.page || 'Homepage'
        return `${page}/images`
      },
      description: 'Auto-generated folder path based on page selection',
    }),
    defineField({
      name: 'placement',
      title: 'Specific Placement',
      type: 'string',
      group: 'placement',
      description: 'More specific location (e.g., "Primary Hero", "Secondary CTA", "Team Member #1")',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      group: 'placement',
      description: 'Order within the same category (1, 2, 3, etc.)',
      initialValue: 1,
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      group: 'placement',
      description: 'Whether this image is currently being used on the homepage',
      initialValue: true,
    }),
    defineField({
      name: 'deviceVisibility',
      title: 'Device Visibility',
      type: 'array',
      of: [{type: 'string'}],
      group: 'placement',
      options: {
        list: [
          { title: 'Desktop', value: 'desktop' },
          { title: 'Tablet', value: 'tablet' },
          { title: 'Mobile', value: 'mobile' }
        ],
        layout: 'checkbox'
      },
      initialValue: ['desktop', 'tablet', 'mobile'],
      description: 'Which devices this image should be displayed on',
    }),
    defineField({
      name: 'dimensions',
      title: 'Recommended Dimensions',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'width',
          title: 'Width (px)',
          type: 'number'
        },
        {
          name: 'height',  
          title: 'Height (px)',
          type: 'number'
        },
        {
          name: 'aspectRatio',
          title: 'Aspect Ratio',
          type: 'string',
          description: 'e.g., 16:9, 4:3, 1:1'
        }
      ],
      description: 'Optimal dimensions for this image placement',
    }),
    defineField({
      name: 'originalPath',
      title: 'Original File Path',
      type: 'string',
      group: 'content',
      description: 'Original file path from the code repository (e.g., /assets/img/home-01/hero/hero-1-1.png)',
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'string',
      group: 'placement',
      options: {
        list: [
          { title: 'High (Core Visual Elements)', value: 'High' },
          { title: 'Medium (Content Enhancement)', value: 'Medium' },
          { title: 'Low (CMS Replacements)', value: 'Low' }
        ]
      },
      description: 'Upload priority based on importance',
    }),
    defineField({
      name: 'usage',
      title: 'Usage Type',
      type: 'string',
      group: 'placement',
      options: {
        list: [
          { title: 'Content Image (Editable)', value: 'content' },
          { title: 'Design Asset (Static)', value: 'static' },
          { title: 'Marketing Asset', value: 'marketing' },
          { title: 'User Generated', value: 'ugc' }
        ]
      },
      initialValue: 'content',
      description: 'Type of image for management purposes',
    }),
    defineField({
      name: 'notes',
      title: 'Usage Notes',
      type: 'text',
      rows: 3,
      group: 'placement',
      description: 'Additional notes about this image usage, context, or replacement guidelines',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image.0.image',
      category: 'category',
      placement: 'placement',
      isActive: 'isActive',
    },
    prepare({title, media, category, placement, isActive}) {
      const status = isActive ? '🟢' : '🔴';
      return {
        title: `${status} ${title}`,
        media,
        subtitle: [category, placement].filter(Boolean).join(' • '),
      }
    },
  },
  orderings: [
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'displayOrder', direction: 'asc'}
      ],
    },
    {
      title: 'Last Updated',
      name: 'lastUpdatedDesc',
      by: [{field: 'lastUpdated', direction: 'desc'}],
    },
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [
        {field: 'displayOrder', direction: 'asc'},
        {field: 'category', direction: 'asc'}
      ],
    },
  ],
})
