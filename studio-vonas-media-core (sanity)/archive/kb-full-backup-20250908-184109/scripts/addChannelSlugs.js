import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_AUTH_TOKEN // Uses the token from environment
})

// Function to generate slug from channel name
function generateSlug(channelName) {
  return channelName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function addChannelSlugs() {
  try {
    console.log('=== ADDING MISSING CHANNEL SLUGS ===\n')
    
    // Get all channels without slugs
    const channelsWithoutSlugs = await client.fetch(`
      *[_type == "youtubeId" && (!defined(slug) || !defined(slug.current) || slug.current == "")] {
        _id,
        channel_name,
        slug
      }
    `)

    console.log(`Found ${channelsWithoutSlugs.length} channels without slugs:`)
    
    for (const channel of channelsWithoutSlugs) {
      const generatedSlug = generateSlug(channel.channel_name)
      
      console.log(`\n--- Processing: ${channel.channel_name} ---`)
      console.log(`Generated slug: ${generatedSlug}`)
      
      // Check if this slug already exists
      const existingSlug = await client.fetch(`
        *[_type == "youtubeId" && slug.current == $slug][0]._id
      `, { slug: generatedSlug })
      
      if (existingSlug && existingSlug !== channel._id) {
        // Add a number suffix if slug exists
        let counter = 2
        let uniqueSlug = `${generatedSlug}-${counter}`
        let slugExists = true
        
        while (slugExists) {
          const checkSlug = await client.fetch(`
            *[_type == "youtubeId" && slug.current == $slug][0]._id
          `, { slug: uniqueSlug })
          
          if (!checkSlug) {
            slugExists = false
          } else {
            counter++
            uniqueSlug = `${generatedSlug}-${counter}`
          }
        }
        
        console.log(`Slug '${generatedSlug}' exists, using: ${uniqueSlug}`)
        
        // Update with unique slug
        const result = await client
          .patch(channel._id)
          .set({ slug: { current: uniqueSlug, _type: 'slug' } })
          .commit()
          
        console.log(`✅ Updated ${channel.channel_name} with slug: ${uniqueSlug}`)
      } else {
        // Use the generated slug
        const result = await client
          .patch(channel._id)
          .set({ slug: { current: generatedSlug, _type: 'slug' } })
          .commit()
          
        console.log(`✅ Updated ${channel.channel_name} with slug: ${generatedSlug}`)
      }
    }

    console.log('\n=== VERIFICATION ===')
    
    // Verify all channels now have slugs
    const channelsAfterUpdate = await client.fetch(`
      *[_type == "youtubeId"] {
        _id,
        channel_name,
        slug
      } | order(channel_name asc)
    `)
    
    console.log('\nAll channels after update:')
    channelsAfterUpdate.forEach(channel => {
      const hasSlug = channel.slug?.current ? '✅' : '❌'
      console.log(`${hasSlug} ${channel.channel_name}: ${channel.slug?.current || 'NO SLUG'}`)
    })

    console.log('\n🎉 Channel slug update completed!')

  } catch (error) {
    console.error('Error updating channel slugs:', error)
  }
}

addChannelSlugs()
