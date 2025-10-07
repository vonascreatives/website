import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mediaAsset',
  title: 'Media Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.mp3,.wav,.mp4,.avi,.mov'
      }
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Images', value: 'images'},
          {title: 'Documents', value: 'documents'},
          {title: 'Videos', value: 'videos'},
          {title: 'Audio', value: 'audio'},
          {title: 'Graphics', value: 'graphics'},
          {title: 'Templates', value: 'templates'},
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size (MB)',
      type: 'number',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'category',
    },
  },
})
