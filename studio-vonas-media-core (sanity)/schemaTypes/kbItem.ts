import {defineType, defineField} from 'sanity'
import {FolderIcon, DocumentIcon} from '@sanity/icons'

export default defineType({
  name: 'kbItem',
  title: 'Knowledge Base Item',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'relations',
      title: 'Supporting Content',
    },
    {
      name: 'structure',
      title: 'Structure',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'Short, clean title (no emojis)',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'structure',
      options: {
        source: async (doc, options) => {
          // Base slug from title
          const baseSlug = doc.title
            ? doc.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
                .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
            : '';
          
          // If no parent, return just the base slug
          if (!doc.parent?._ref) {
            return baseSlug;
          }
          
          try {
            // Get the parent document to build hierarchical path
            const client = options.getClient({apiVersion: '2024-09-03'});
            const parent = await client.fetch(
              '*[_type == "kbItem" && _id == $parentId][0]{_id, title, slug, parent}',
              {parentId: doc.parent._ref}
            );
            
            if (!parent) {
              return baseSlug;
            }
            
            // Build hierarchical path by traversing up the parent chain
            const buildPath = async (item) => {
              const parts = [];
              let current = item;
              
              while (current && parts.length < 5) { // Prevent infinite loops
                // Extract meaningful slug part from parent
                if (current.slug?.current) {
                  const slugPart = current.slug.current.split('/').pop() || current.slug.current;
                  parts.unshift(slugPart);
                } else if (current.title) {
                  const titleSlug = current.title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                  parts.unshift(titleSlug);
                }
                
                // Get next parent
                if (current.parent?._ref) {
                  current = await client.fetch(
                    '*[_type == "kbItem" && _id == $parentId][0]{_id, title, slug, parent}',
                    {parentId: current.parent._ref}
                  );
                } else {
                  break;
                }
              }
              
              return parts;
            };
            
            const pathParts = await buildPath(parent);
            pathParts.push(baseSlug);
            
            return pathParts.join('/');
            
          } catch (error) {
            console.warn('Error building hierarchical slug:', error);
            return baseSlug;
          }
        },
        maxLength: 200, // Increased for hierarchical paths
        slugify: (input) => {
          // Custom slugify to handle the hierarchical path
          return input
            .toLowerCase()
            .replace(/[^\w\s\/-]/g, '') // Keep forward slashes for hierarchy
            .replace(/[\s_-]+/g, '-')
            .replace(/\/-+/g, '/') // Clean up slash-hyphen combinations
            .replace(/-+\//g, '/') // Clean up hyphen-slash combinations
            .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
            .replace(/^\/+|\/+$/g, '') // Trim slashes from start/end
        }
      },
      validation: (Rule) => Rule.required(),
      description: 'Auto-generated hierarchical URL path (category/parent/title)',
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      group: 'structure',
      description: 'Section (nav) or Page (content)',
      options: {
        list: [
          {title: 'Section', value: 'section'},
          {title: 'Page', value: 'page'},
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent',
      type: 'reference',
      to: [{type: 'kbItem'}],
      group: 'structure',
      description: 'Optional parent to build the tree',
    }),
    defineField({
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      group: 'structure',
      description: 'Exclude from UI when true',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Brief description (1–3 sentences)',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'structure',
      initialValue: 100,
      description: 'Lower numbers appear first',
    }),
    // 4) Content
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
          ],
          lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [{title: 'URL', name: 'href', type: 'url'}],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', type: 'string', title: 'Alt Text'},
            {name: 'caption', type: 'string', title: 'Caption'},
          ],
        },
      ],
      group: 'content',
      description: 'Main content body',
    }),
    // 2) Steps and Checklist
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required()},
          {name: 'content', type: 'text', title: 'Content', rows: 3},
        ]
      }],
      group: 'content',
      hidden: ({document}) => document?.kind !== 'page',
      description: 'Steps with title and content',
    }),
    defineField({
      name: 'checklist',
      title: 'Checklist',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
      description: 'Checklist items (titles only)',
      hidden: ({document}) => document?.kind !== 'page',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'kbCategory'}],
      group: 'structure',
      description: 'Top-level category (Company, Team, Production, etc.)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'youtubeShow',
      title: 'YouTube Show',
      type: 'reference',
      to: [{type: 'youtubeShow'}],
      group: 'structure',
      description: 'Associated YouTube show (optional)',
    }),
    // Relations tab
    defineField({
      name: 'faqs',
      title: 'Related FAQs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      group: 'relations',
    }),

    // Settings
    defineField({
      name: 'docType',
      title: 'Document Type',
      type: 'string',
      group: 'settings',
      options: {list: ['about','checklist','guide','reference','template']},
      hidden: ({document}) => document?.kind !== 'page',
    }),
    defineField({
      name: 'visibility',
      title: 'Permissions',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'All', value: 'All'},
          {title: 'Core Team', value: 'Core Team'},
          {title: 'Intern', value: 'Intern'},
          {title: 'Freelancers', value: 'Freelancers'},
        ],
        layout: 'checkbox',
      },
      group: 'settings',
      initialValue: ['All'],
      description: 'Multi-select. Default: All',
    }),
    
    // Additional content fields
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'relations',
      description: 'Link to related video (YouTube, Vimeo, etc.)',
      hidden: ({document}) => document?.kind !== 'page',
    }),
    defineField({
      name: 'embedCode',
      title: 'Embed Code',
      type: 'text',
      group: 'relations',
      description: 'HTML embed code for videos, forms, etc.',
      hidden: ({document}) => document?.kind !== 'page',
      rows: 4,
    }),
    defineField({
      name: 'attachments',
      title: 'File Attachments',
      type: 'array',
      of: [{
        type: 'file',
        fields: [
          {name: 'title', type: 'string', title: 'File Title'},
          {name: 'description', type: 'text', title: 'Description', rows: 2},
        ]
      }],
      group: 'relations',
      description: 'Documents, PDFs, templates, etc.',
      hidden: ({document}) => document?.kind !== 'page',
    }),
    defineField({
      name: 'relatedItems',
      title: 'Related Content',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'kbItem'}]}],
      group: 'relations',
      description: 'Related KB items',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'teamMember'}, {type: 'author'}],
      group: 'settings',
      description: 'Document author/creator',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      group: 'settings',
    }),


    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      group: 'structure',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      youtubeShow: 'youtubeShow.title',
      kind: 'kind',
      docType: 'docType',
    },
    prepare({title, category, youtubeShow, kind, docType}) {
      const meta = [category, youtubeShow, docType].filter(Boolean).join(' • ');
      return {
        title,
        subtitle: meta,
        media: kind === 'section' ? FolderIcon : DocumentIcon,
      };
    },
  },
  orderings: [
    {
      title: 'Category Order',
      name: 'categoryOrder',
      by: [
        {field: 'category.order', direction: 'asc'},
        {field: 'order', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Last Updated',
      name: 'lastUpdated',
      by: [{field: 'lastUpdated', direction: 'desc'}],
    },
  ],
})