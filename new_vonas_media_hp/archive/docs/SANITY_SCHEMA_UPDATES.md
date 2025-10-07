# Sanity Schema Updates Required

## Team Member Schema Update

You need to add a reference field to the **teamMember** schema in your Sanity Studio to connect team members with YouTube channels.

### 1. Go to your Sanity Studio
Visit: https://5cywtc7a.sanity.studio/ (based on your project ID)

### 2. Navigate to Schema
Go to the Schema tab in your Sanity Studio

### 3. Edit Team Member Schema
Find the **teamMember** document type and add this field:

```javascript
{
  name: 'youtubeChannels',
  title: 'YouTube Channels',
  type: 'array',
  of: [
    {
      type: 'reference',
      to: [{ type: 'youtubeId' }]
    }
  ],
  description: 'Select YouTube channels this team member is associated with'
}
```

### 4. Alternative: If you prefer single channel relationship
If each team member should only be connected to one channel, use this instead:

```javascript
{
  name: 'youtubeChannel',
  title: 'YouTube Channel',
  type: 'reference',
  to: [{ type: 'youtubeId' }],
  description: 'Select the YouTube channel this team member works on'
}
```

### 5. Update the Query
If you use the single reference approach, update the query in the code from:
```javascript
"youtubeChannels": *[_type == "youtubeId" && references(^._id)]{
```

to:
```javascript
"youtubeChannel": youtubeChannel->{
  _id,
  channel_name,
  slug,
  cta_button_url,
  category
}
```

## After Schema Update

1. **Deploy the schema changes** in Sanity Studio
2. **Edit team member documents** to connect them with YouTube channels
3. The website will automatically show the "Channel:" section instead of "Portfolio:" for team members who have connected YouTube channels

## Testing
Once you've made these changes:
1. Go to a team member document (like Sarah Johnson)
2. Add a reference to a YouTube channel using the new field
3. Save the document
4. The team member detail page will now show the connected channel instead of static portfolio links

## Current Project Info
- Project ID: 5cywtc7a  
- Dataset: production
- Studio URL: https://5cywtc7a.sanity.studio/
