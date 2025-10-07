import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 4,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'array',
      of: [{type: 'imageWithAlt'}],
      group: 'content',
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.max(1),
      description: 'Featured hero image for the blog post',
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'richBody',
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Business', value: 'business'},
          {title: 'Education', value: 'education'},
          {title: 'Entertainment', value: 'entertainment'},
          {title: 'Sports', value: 'sports'},
          {title: 'Subculture', value: 'subculture'},
          {title: 'Technology', value: 'technology'},
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: [{type: 'teamMember'}],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      group: 'content',
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
      media: 'heroImage.0.image',
      authorName: 'author.name',
      publishedAt: 'publishedAt',
    },
    prepare({title, media, authorName, publishedAt}) {
      const formattedDate = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft'
      return {
        title,
        media,
        subtitle: [authorName, formattedDate].filter(Boolean).join(' • '),
      }
    },
  },
})
