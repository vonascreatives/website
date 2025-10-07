import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'docsTable',
  title: 'Table',
  type: 'object',
  icon: () => '📊',
  fields: [
    defineField({
      name: 'title',
      title: 'Table Title',
      type: 'string',
      description: 'Optional title for the table'
    }),
    defineField({
      name: 'headers',
      title: 'Headers',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
      description: 'Column headers for the table'
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          title: 'Table Row',
          fields: [
            {
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'tableCell',
                  title: 'Cell',
                  fields: [
                    {
                      name: 'content',
                      title: 'Content',
                      type: 'array',
                      of: [
                        {
                          type: 'block',
                          styles: [{title: 'Normal', value: 'normal'}],
                          lists: [],
                          marks: {
                            decorators: [
                              {title: 'Strong', value: 'strong'},
                              {title: 'Emphasis', value: 'em'},
                              {title: 'Code', value: 'code'},
                            ],
                            annotations: [
                              {
                                title: 'URL',
                                name: 'link',
                                type: 'object',
                                fields: [
                                  {
                                    title: 'URL',
                                    name: 'href',
                                    type: 'url',
                                    validation: (Rule) => Rule.uri({
                                      allowRelative: true,
                                      scheme: ['http', 'https', 'mailto', 'tel']
                                    })
                                  }
                                ]
                              }
                            ]
                          }
                        }
                      ]
                    }
                  ],
                  preview: {
                    select: {
                      content: 'content'
                    },
                    prepare({content}) {
                      const text = content && content[0] && content[0].children
                        ? content[0].children.map((child: any) => child.text).join('')
                        : 'Empty cell';
                      return {
                        title: text.substring(0, 50) + (text.length > 50 ? '...' : '')
                      }
                    }
                  }
                }
              ]
            }
          ],
          preview: {
            select: {
              cells: 'cells'
            },
            prepare({cells}) {
              const cellCount = cells ? cells.length : 0;
              return {
                title: `Row with ${cellCount} cells`
              }
            }
          }
        }
      ],
      validation: (Rule) => Rule.required().min(1),
      description: 'Table rows with cells'
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption displayed below the table'
    }),
    defineField({
      name: 'striped',
      title: 'Striped Rows',
      type: 'boolean',
      initialValue: true,
      description: 'Alternate row background colors'
    }),
    defineField({
      name: 'bordered',
      title: 'Bordered',
      type: 'boolean',
      initialValue: true,
      description: 'Show borders around cells'
    }),
    defineField({
      name: 'compact',
      title: 'Compact',
      type: 'boolean',
      initialValue: false,
      description: 'Use smaller padding for a more compact table'
    }),
    defineField({
      name: 'responsive',
      title: 'Responsive',
      type: 'boolean',
      initialValue: true,
      description: 'Make table horizontally scrollable on small screens'
    })
  ],
  preview: {
    select: {
      title: 'title',
      headers: 'headers',
      rows: 'rows'
    },
    prepare({title, headers, rows}) {
      const headerCount = headers ? headers.length : 0;
      const rowCount = rows ? rows.length : 0;
      const displayTitle = title || 'Table';
      return {
        title: displayTitle,
        subtitle: `${headerCount} columns × ${rowCount} rows`,
        media: '📊'
      }
    }
  }
})