import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactInfo',
  title: 'Contact Information',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Contact Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
  ],
})
