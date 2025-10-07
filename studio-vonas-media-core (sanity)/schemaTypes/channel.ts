import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'channel',
  title: 'Channel',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'metrics',
      title: 'Metrics',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Channel Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo/Avatar',
      type: 'imageWithAlt',
      group: 'content',
    }),
    defineField({
      name: 'about',
      title: 'Short About Text',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Brief description of the channel',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Education', value: 'education'},
          {title: 'Technology', value: 'technology'},
          {title: 'Entertainment', value: 'entertainment'},
          {title: 'Gaming', value: 'gaming'},
          {title: 'Lifestyle', value: 'lifestyle'},
          {title: 'Business', value: 'business'},
          {title: 'Health & Fitness', value: 'health'},
          {title: 'Food & Cooking', value: 'food'},
          {title: 'Travel', value: 'travel'},
          {title: 'Music', value: 'music'},
          {title: 'Sports', value: 'sports'},
          {title: 'News', value: 'news'},
          {title: 'Comedy', value: 'comedy'},
          {title: 'Arts & Culture', value: 'arts'},
          {title: 'Science', value: 'science'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'language',
      title: 'Primary Language',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: 'Spanish', value: 'es'},
          {title: 'French', value: 'fr'},
          {title: 'German', value: 'de'},
          {title: 'Italian', value: 'it'},
          {title: 'Portuguese', value: 'pt'},
          {title: 'Dutch', value: 'nl'},
          {title: 'Russian', value: 'ru'},
          {title: 'Japanese', value: 'ja'},
          {title: 'Korean', value: 'ko'},
          {title: 'Chinese', value: 'zh'},
          {title: 'Hindi', value: 'hi'},
          {title: 'Arabic', value: 'ar'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'metrics',
      title: 'Platform Metrics',
      type: 'array',
      of: [{type: 'platformMetrics'}],
      group: 'metrics',
      description: 'Metrics for different social platforms',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'socialLinks',
      group: 'content',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      group: 'content',
      description: 'Keywords and tags for searchability',
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
      title: 'name',
      media: 'logo.image',
      category: 'category',
      country: 'country',
    },
    prepare({title, media, category, country}) {
      return {
        title,
        media,
        subtitle: [category, country].filter(Boolean).join(' • '),
      }
    },
  },
})
