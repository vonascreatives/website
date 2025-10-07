import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'docsCallout',
  title: 'Callout',
  type: 'object',
  icon: () => '💡',
  fields: [
    defineField({
      name: 'type',
      title: 'Callout Type',
      type: 'string',
      options: {
        list: [
          {title: '💡 Note', value: 'note'},
          {title: '⚠️ Warning', value: 'warning'},
          {title: '❌ Danger', value: 'danger'},
          {title: '✅ Success', value: 'success'},
          {title: '💡 Tip', value: 'tip'},
          {title: 'ℹ️ Info', value: 'info'},
          {title: '🔥 Important', value: 'important'}
        ],
        layout: 'radio'
      },
      initialValue: 'note',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional custom title for the callout'
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H4', value: 'h4'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'}
          ],
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
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean'
                  }
                ]
              }
            ]
          }
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'collapsible',
      title: 'Collapsible',
      type: 'boolean',
      initialValue: false,
      description: 'Make this callout collapsible'
    }),
    defineField({
      name: 'defaultExpanded',
      title: 'Default Expanded',
      type: 'boolean',
      initialValue: true,
      description: 'Whether collapsible callout is expanded by default',
      hidden: ({parent}) => !parent?.collapsible
    })
  ],
  preview: {
    select: {
      type: 'type',
      title: 'title',
      content: 'content'
    },
    prepare({type, title, content}) {
      const typeLabels = {
        note: '💡 Note',
        warning: '⚠️ Warning',
        danger: '❌ Danger',
        success: '✅ Success',
        tip: '💡 Tip',
        info: 'ℹ️ Info',
        important: '🔥 Important'
      };
      
      const displayTitle = title || typeLabels[type as keyof typeof typeLabels] || 'Callout';
      const preview = content && content[0] && content[0].children 
        ? content[0].children.map((child: any) => child.text).join('').substring(0, 50) + '...'
        : '';
      
      return {
        title: displayTitle,
        subtitle: preview,
        media: '💡'
      }
    }
  }
})