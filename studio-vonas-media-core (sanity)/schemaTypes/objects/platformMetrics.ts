import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'platformMetrics',
  title: 'Platform Metrics',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform Name',
      type: 'string',
      options: {
        list: [
          {title: 'YouTube', value: 'youtube'},
          {title: 'TikTok', value: 'tiktok'},
          {title: 'Instagram', value: 'instagram'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'X (Twitter)', value: 'twitter'},
          {title: 'Twitch', value: 'twitch'},
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'Pinterest', value: 'pinterest'},
          {title: 'Snapchat', value: 'snapchat'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'handle',
      title: 'Handle / Channel ID',
      type: 'string',
      description: 'Username or channel identifier',
    }),
    defineField({
      name: 'profileUrl',
      title: 'Profile URL',
      type: 'url',
    }),
    defineField({
      name: 'followers',
      title: 'Followers / Subscribers',
      type: 'number',
      description: 'Current follower count',
    }),
    defineField({
      name: 'averageViews',
      title: 'Average Views',
      type: 'number',
      description: 'Typical views per post/video',
    }),
    defineField({
      name: 'engagementRate',
      title: 'Engagement Rate (%)',
      type: 'number',
      description: 'Engagement rate as percentage',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
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
        title: `${platform}${handle ? ` - ${handle}` : ''}`,
        subtitle: followers ? `${followers.toLocaleString()} followers` : '',
      }
    },
  },
})
