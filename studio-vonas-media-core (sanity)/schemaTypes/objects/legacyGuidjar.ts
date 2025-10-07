import {defineType, defineField} from 'sanity'

// Hidden legacy object to support previously stored Guidjar resources
// This prevents "Unknown field found" messages for existing documents
export default defineType({
  name: 'guidjar',
  title: 'Guidjar (Legacy)',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', hidden: true}),
    defineField({name: 'url', title: 'URL', type: 'url', hidden: true}),
    defineField({name: 'id', title: 'ID', type: 'string', hidden: true}),
  ],
  options: {collapsible: true, collapsed: true},
  hidden: true,
})

