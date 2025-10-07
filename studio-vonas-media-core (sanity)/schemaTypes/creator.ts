import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'creator',
  title: 'Creator',
  type: 'document',
  groups: [
    {
      name: 'profile',
      title: 'Profile',
      default: true,
    },
    {
      name: 'metrics',
      title: 'Metrics & Platforms',
    },
    {
      name: 'work',
      title: 'Selected Work',
    },
    {
      name: 'ratings',
      title: 'Ratings & Reviews',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Creator Name',
      type: 'string',
      group: 'profile',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'profile',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Creator',
      type: 'boolean',
      group: 'profile',
      description: 'Show this creator prominently on the site',
      initialValue: false,
    }),
    defineField({
      name: 'mainCategory',
      title: 'Main Category',
      type: 'string',
      group: 'profile',
      options: {
        list: [
          {title: 'Fashion & Style', value: 'Fashion & Style'},
          {title: 'Beauty & Makeup', value: 'Beauty & Makeup'},
          {title: 'Fitness & Health', value: 'Fitness & Health'},
          {title: 'Food & Cooking', value: 'Food & Cooking'},
          {title: 'Travel & Adventure', value: 'Travel & Adventure'},
          {title: 'Technology', value: 'Technology'},
          {title: 'Gaming', value: 'Gaming'},
          {title: 'Lifestyle', value: 'Lifestyle'},
          {title: 'Comedy & Entertainment', value: 'Comedy & Entertainment'},
          {title: 'Art & Design', value: 'Art & Design'},
          {title: 'Music', value: 'Music'},
          {title: 'Business & Finance', value: 'Business & Finance'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'niches',
      title: 'Sub-Niches',
      type: 'array',
      of: [{type: 'string'}],
      group: 'profile',
      description: 'Specific sub-categories within the main category',
    }),
    defineField({
      name: 'mainPlatform',
      title: 'Main Platform',
      type: 'string',
      group: 'metrics',
      options: {
        list: [
          {title: 'YouTube', value: 'YouTube'},
          {title: 'Instagram', value: 'Instagram'},
          {title: 'TikTok', value: 'TikTok'},
          {title: 'Twitter', value: 'Twitter'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metrics',
      title: 'Platform Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'platformMetric',
          title: 'Platform Metric',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'YouTube', value: 'YouTube'},
                  {title: 'Instagram', value: 'Instagram'},
                  {title: 'TikTok', value: 'TikTok'},
                  {title: 'Twitter', value: 'Twitter'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'handle',
              title: 'Handle/Username',
              type: 'string',
            }),
            defineField({
              name: 'profileUrl',
              title: 'Profile URL',
              type: 'url',
            }),
            defineField({
              name: 'followers',
              title: 'Followers',
              type: 'number',
              validation: (Rule) => Rule.min(0).required(),
            }),
          ],
          preview: {
            select: {
              platform: 'platform',
              handle: 'handle',
              followers: 'followers',
            },
            prepare({platform, handle, followers}) {
              return {
                title: `${platform}${handle ? ` (@${handle})` : ''}`,
                subtitle: `${followers?.toLocaleString() || 0} followers`,
              }
            },
          },
        },
      ],
      group: 'metrics',
      validation: (Rule) => Rule.min(1).error('At least one platform metric is required'),
    }),
    defineField({
      name: 'totalFollowers',
      title: 'Total Followers',
      type: 'number',
      group: 'metrics',
      description: 'Sum of all platform followers (auto-calculated if empty)',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      group: 'profile',
      options: {
        list: [
          {title: 'Available', value: 'Available'},
          {title: 'Busy', value: 'Busy'},
          {title: 'Unknown', value: 'Unknown'},
        ],
        layout: 'radio',
      },
      initialValue: 'Unknown',
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [{type: 'string'}],
      group: 'profile',
      description: 'Languages the creator speaks/creates content in',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'profile',
      description: 'Short hook line that describes the creator',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'imageWithAlt',
      group: 'profile',
      description: 'Main profile image for the creator',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'imageWithAlt'}],
      group: 'profile',
      options: {
        layout: 'grid',
      },
      description: 'Additional images showcasing the creator',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'richBody',
      group: 'profile',
      description: 'Detailed biography and background',
    }),
    defineField({
      name: 'selectedWork',
      title: 'Selected Work',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'workItem',
          title: 'Work Item',
          fields: [
            defineField({
              name: 'brand',
              title: 'Brand',
              type: 'reference',
              to: [{type: 'brandCollaboration'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Project Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Project Link',
              type: 'url',
              description: 'Link to the finished work (video, post, etc.)',
            }),
            defineField({
              name: 'thumb',
              title: 'Thumbnail',
              type: 'imageWithAlt',
              description: 'Preview image of the work',
            }),
            defineField({
              name: 'date',
              title: 'Project Date',
              type: 'date',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'thumb.image',
              brandName: 'brand.brandName',
              date: 'date',
            },
            prepare({title, media, brandName, date}) {
              return {
                title: title,
                subtitle: `${brandName || 'Unknown Brand'} • ${date || 'No date'}`,
                media,
              }
            },
          },
        },
      ],
      group: 'work',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      group: 'profile',
      fields: [
        defineField({
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok URL',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'ratingAverage',
      title: 'Average Rating',
      type: 'number',
      group: 'ratings',
      validation: (Rule) => Rule.min(0).max(5),
      description: 'Auto-calculated from approved reviews (0-5 stars)',
      readOnly: true,
    }),
    defineField({
      name: 'ratingCount',
      title: 'Number of Ratings',
      type: 'number',
      group: 'ratings',
      validation: (Rule) => Rule.min(0),
      description: 'Auto-calculated from approved reviews',
      readOnly: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'image',
          title: 'SEO Image',
          type: 'imageWithAlt',
          description: 'Image for social media sharing (defaults to hero image)',
        }),
        defineField({
          name: 'title',
          title: 'SEO Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
          description: 'Title for search engines (max 60 characters)',
        }),
        defineField({
          name: 'description',
          title: 'SEO Description',
          type: 'text',
          validation: (Rule) => Rule.max(160),
          description: 'Description for search engines (max 160 characters)',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'heroImage.image',
      mainCategory: 'mainCategory',
      mainPlatform: 'mainPlatform',
      totalFollowers: 'totalFollowers',
      availability: 'availability',
      featured: 'featured',
    },
    prepare({title, media, mainCategory, mainPlatform, totalFollowers, availability, featured}) {
      const followersText = totalFollowers ? `${totalFollowers.toLocaleString()} followers` : ''
      const platformText = mainPlatform ? `${mainPlatform}` : ''
      const featuredText = featured ? '⭐ Featured' : ''
      
      return {
        title: `${title}${featured ? ' ⭐' : ''}`,
        media,
        subtitle: [mainCategory, platformText, followersText, availability, featuredText]
          .filter(Boolean)
          .join(' • '),
      }
    },
  },
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredDesc',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'name', direction: 'asc'}
      ],
    },
    {
      title: 'Most Followers',
      name: 'followersDesc',
      by: [{field: 'totalFollowers', direction: 'desc'}],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Recently Added',
      name: 'createdDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
})
