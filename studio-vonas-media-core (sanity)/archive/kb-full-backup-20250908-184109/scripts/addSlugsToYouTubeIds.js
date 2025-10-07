import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})

// Function to create slug from channel name
function createSlug(channelName) {
  return channelName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

async function addSlugsToChannels() {
  try {
    console.log('Fetching YouTube channels without slugs...')
    
    // Get all YouTube channels
    const channels = await client.fetch(`*[_type == "youtubeId"]{
      _id,
      channel_name,
      slug
    }`)
    
    console.log(`Found ${channels.length} channels`)
    
    // Process each channel
    for (const channel of channels) {
      if (!channel.slug || !channel.slug.current) {
        const newSlug = createSlug(channel.channel_name)
        console.log(`Adding slug "${newSlug}" to channel "${channel.channel_name}"`)
        
        await client
          .patch(channel._id)
          .set({
            slug: {
              _type: 'slug',
              current: newSlug
            }
          })
          .commit()
        
        console.log(`✅ Updated ${channel.channel_name}`)
      } else {
        console.log(`⏭️  ${channel.channel_name} already has slug: ${channel.slug.current}`)
      }
    }
    
    console.log('✅ All channels processed!')
    
  } catch (error) {
    console.error('Error updating slugs:', error)
  }
}

addSlugsToChannels()
