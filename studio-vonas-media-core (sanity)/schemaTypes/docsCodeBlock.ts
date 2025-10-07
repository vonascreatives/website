import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'docsCodeBlock',
  title: 'Code Block',
  type: 'object',
  icon: () => '💻',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title for the code block'
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'JSX', value: 'jsx'},
          {title: 'TSX', value: 'tsx'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'SCSS', value: 'scss'},
          {title: 'JSON', value: 'json'},
          {title: 'Markdown', value: 'markdown'},
          {title: 'YAML', value: 'yaml'},
          {title: 'Bash', value: 'bash'},
          {title: 'Shell', value: 'shell'},
          {title: 'Python', value: 'python'},
          {title: 'PHP', value: 'php'},
          {title: 'SQL', value: 'sql'},
          {title: 'GraphQL', value: 'graphql'},
          {title: 'Dockerfile', value: 'dockerfile'},
          {title: 'GROQ', value: 'groq'},
          {title: 'Plain Text', value: 'text'}
        ],
        layout: 'dropdown'
      },
      initialValue: 'javascript',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 10,
      validation: (Rule) => Rule.required(),
      description: 'The code content'
    }),
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
      description: 'Optional filename to display (e.g., "package.json", "index.tsx")'
    }),
    defineField({
      name: 'highlightLines',
      title: 'Highlight Lines',
      type: 'string',
      description: 'Lines to highlight (e.g., "1,3-5,8" to highlight lines 1, 3-5, and 8)'
    }),
    defineField({
      name: 'showLineNumbers',
      title: 'Show Line Numbers',
      type: 'boolean',
      initialValue: true,
      description: 'Whether to show line numbers'
    }),
    defineField({
      name: 'allowCopy',
      title: 'Allow Copy',
      type: 'boolean',
      initialValue: true,
      description: 'Whether to show a copy button'
    }),
    defineField({
      name: 'maxHeight',
      title: 'Max Height',
      type: 'number',
      description: 'Maximum height in pixels (optional, for scrollable code blocks)'
    })
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      filename: 'filename',
      code: 'code'
    },
    prepare({title, language, filename, code}) {
      const displayTitle = title || filename || `${language} code`;
      const preview = code ? code.substring(0, 50) + (code.length > 50 ? '...' : '') : '';
      return {
        title: displayTitle,
        subtitle: preview,
        media: '💻'
      }
    }
  }
})