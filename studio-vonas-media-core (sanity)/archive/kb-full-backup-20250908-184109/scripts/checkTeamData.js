import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
})

async function checkTeamData() {
  try {
    console.log('=== TEAM MEMBERS DATA ===')
    
    const teamMembers = await client.fetch(`
      *[_type == "teamMember"] | order(order asc) {
        _id,
        name,
        slug,
        role,
        "photo": photo[0].image.asset->url,
        "photoAlt": photo[0].alt,
        "bioText": bio[0].children[0].text,
        socialLinks,
        email,
        order,
        "youtubeChannels": youtubeChannels[]->{ 
          _id,
          channel_name,
          slug,
          cta_button_url,
          category,
          channel_number
        }
      }
    `)

    console.log(`Found ${teamMembers.length} team members:`)
    teamMembers.forEach((member, index) => {
      console.log(`\n--- Team Member ${index + 1} ---`)
      console.log(`Name: ${member.name}`)
      console.log(`Slug: ${member.slug?.current || 'NO SLUG'}`)
      console.log(`Role: ${member.role}`)
      console.log(`Photo: ${member.photo ? 'YES' : 'NO'}`)
      console.log(`Bio: ${member.bioText ? 'YES' : 'NO'}`)
      console.log(`YouTube Channels: ${member.youtubeChannels?.length || 0}`)
      
      if (member.youtubeChannels?.length > 0) {
        console.log('  Connected Channels:')
        member.youtubeChannels.forEach(channel => {
          console.log(`    - ${channel.channel_name}`)
          console.log(`      Slug: ${channel.slug?.current || 'NO SLUG'}`)
          console.log(`      URL: ${channel.cta_button_url || 'NO URL'}`)
        })
      }
    })

    console.log('\n=== YOUTUBE CHANNELS DATA ===')
    
    const channels = await client.fetch(`
      *[_type == "youtubeId"] | order(channel_number asc) {
        _id,
        channel_name,
        slug,
        cta_button_url,
        category,
        channel_number,
        "teamMembers": teamMembers[]->{ 
          _id,
          name,
          slug
        }
      }
    `)

    console.log(`\nFound ${channels.length} YouTube channels:`)
    channels.forEach((channel, index) => {
      console.log(`\n--- Channel ${index + 1} ---`)
      console.log(`Name: ${channel.channel_name}`)
      console.log(`Slug: ${channel.slug?.current || 'NO SLUG'}`)
      console.log(`Number: ${channel.channel_number}`)
      console.log(`URL: ${channel.cta_button_url}`)
      console.log(`Team Members: ${channel.teamMembers?.length || 0}`)
      
      if (channel.teamMembers?.length > 0) {
        console.log('  Connected Team Members:')
        channel.teamMembers.forEach(member => {
          console.log(`    - ${member.name} (${member.slug?.current || 'no slug'})`)
        })
      }
    })

  } catch (error) {
    console.error('Error querying data:', error)
  }
}

checkTeamData()
