# 🎯 URGENT: Add YouTube Channel Reference to Team Members

## YOU MUST DO THIS IN SANITY STUDIO

### 1. Go to Your Sanity Studio
**URL:** https://5cywtc7a.sanity.studio/

### 2. Navigate to Schema Editor
- Look for **"Structure"** or **"Schema"** in the left sidebar
- OR go to **Settings** → **Schema**
- OR look for a **"Schema Editor"** option

### 3. Find Team Member Document Type
- Look for **"teamMember"** in your document types list
- Click on it to edit the schema

### 4. Add This EXACT Field
Add this field to your teamMember schema (copy and paste exactly):

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
  description: 'Select YouTube channels this team member works on'
}
```

### 5. Save/Deploy Schema
- Click **"Save"** or **"Deploy"** or **"Publish Schema"**
- Wait for confirmation that schema is updated

### 6. Test the Reference
1. Go to **Content** → **Team Member**
2. Edit **Sarah Johnson**
3. You should now see **"YouTube Channels"** field
4. Click **"Add"** and select a YouTube channel from the list
5. Save the document

### 7. Verify on Website
- Go to `/team-details/sarah-johnson` on your website
- You should see **"Channel:"** section instead of **"Portfolio:"**
- Clicking the channel name should take you to `/work/[channel-slug]`

## WHY THIS MATTERS

- **Personal YouTube Link:** Stays in Social Links (for their personal channel)
- **Work Channels:** Shows in "Channel:" section (for company YouTube channels they work on)
- **Navigation:** Clicking work channels goes to your YouTube channel detail pages

## Current Setup
✅ **Code is ready** - No more code changes needed
❌ **Schema missing** - You need to add the reference field in Sanity Studio

## After You Add the Field
The website will automatically:
- Show "Channel:" section for team members with connected YouTube channels
- Link to your internal YouTube channel pages (`/work/[slug]`)
- Keep personal social links separate
- Hide "Channel:" section if no work channels are connected

**This is the ONLY step missing to make it work!**
