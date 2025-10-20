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
