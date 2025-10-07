import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export default defineType({
  name: 'kbTag',
  title: 'KB Tag',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Tag Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(30),
      description: 'Short, descriptive tag name',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 30,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Tag Category',
      type: 'string',
      options: {
        list: [
          {title: 'Topic', value: 'topic'},
          {title: 'Tool', value: 'tool'},
          {title: 'Process', value: 'process'},
          {title: 'Department', value: 'department'},
          {title: 'Project', value: 'project'},
          {title: 'Skill', value: 'skill'},
        ],
      },
      validation: (Rule) => Rule.required(),
      description: 'Type of tag for grouping',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          {title: 'Blue', value: 'blue'},
          {title: 'Green', value: 'green'},
          {title: 'Yellow', value: 'yellow'},
          {title: 'Red', value: 'red'},
          {title: 'Purple', value: 'purple'},
          {title: 'Gray', value: 'gray'},
        ],
      },
      initialValue: 'gray',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Inactive tags won\'t appear in selection lists',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category',
      isActive: 'isActive',
    },
    prepare({title, category, isActive}) {
      return {
        title,
        subtitle: `${category} ${!isActive ? '(Inactive)' : ''}`,
        media: TagIcon,
      }
    },
  },
  orderings: [
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
})
