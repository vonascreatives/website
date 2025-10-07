import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'array',
      of: [{type: 'imageWithAlt'}],
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.max(1),
      description: 'Profile photo of the team member',
    }),
    defineField({
      name: 'role',
      title: 'Role/Title',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'richBody',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'socialLinks',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Number for manual sorting (lower numbers appear first)',
      initialValue: 100,
    }),
    defineField({
      name: 'youtubeChannels',
      title: 'YouTube Channels',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'youtubeId'}],
      }],
      description: 'YouTube channels this team member works on',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'photo.0.image',
      role: 'role',
      order: 'order',
    },
    prepare({title, media, role, order}) {
      return {
        title,
        media,
        subtitle: role ? `${role} • Order: ${order}` : `Order: ${order}`,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
