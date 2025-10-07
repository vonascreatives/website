# 🚀 EXECUTE THESE IN SANITY VISION TOOL

## Step 1: Go to Sanity Vision
**URL:** https://5cywtc7a.sanity.studio/vision

## Step 2: Add YouTube Channels Field to Sarah Johnson

Copy and paste this **MUTATION** into the Vision tool:

```javascript
[
  {
    "patch": {
      "id": "team-member-1",
      "set": {
        "youtubeChannels": [
          {
            "_type": "reference",
            "_ref": "youtube-05"
          }
        ]
      }
    }
  }
]
```

**Click "Execute" or "Run Query"**

This will:
- ✅ Add `youtubeChannels` field to Sarah Johnson
- ✅ Connect her to "Culture Remix" channel (which has proper slug)
- ✅ Make it show up in the website immediately

## Step 3: Verify the Connection

Run this **QUERY** to verify it worked:

```javascript
*[_type == "teamMember" && _id == "team-member-1"]{
  name,
  "youtubeChannels": youtubeChannels[]->{
    _id,
    channel_name,
    slug
  }
}
```

You should see:
```json
[
  {
    "name": "Sarah Johnson",
    "youtubeChannels": [
      {
        "_id": "youtube-05",
        "channel_name": "Culture Remix",
        "slug": {
          "_type": "slug",
          "current": "culture-remix"
        }
      }
    ]
  }
]
```

## Step 4: Test on Website

1. Go to `/team-details/sarah-johnson` on your website
2. You should see **"Channel: Culture Remix"** instead of Portfolio
3. Clicking "Culture Remix" should go to `/work/culture-remix`

## Alternative Channels

If you want to connect to a different channel, replace `"youtube-05"` with:
- `"youtube-01"` for TechSphere Daily
- `"youtube-02"` for Urban Nomad Life  
- `"youtube-03"` for Pixel Pioneers
- `"youtube-04"` for Future Skills Academy
- `"youtube-channel-1"` for TechVision Pro
- `"youtube-channel-2"` for GameMaster Elite
- `"youtube-channel-3"` for Lifestyle Luxe

**EXECUTE THE MUTATION ABOVE IN SANITY VISION AND IT WILL WORK IMMEDIATELY!**
