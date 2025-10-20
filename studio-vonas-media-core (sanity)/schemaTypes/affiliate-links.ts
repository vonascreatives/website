
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
