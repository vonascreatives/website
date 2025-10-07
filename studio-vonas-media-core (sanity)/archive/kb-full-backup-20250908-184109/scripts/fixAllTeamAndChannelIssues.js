import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_AUTH_TOKEN
})

// Generate clean slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function fixAllIssues() {
  try {
    console.log('🚀 FIXING ALL TEAM MEMBER AND CHANNEL ISSUES\n')

    // 1. CLEAN UP DUPLICATE TEAM MEMBERS
    console.log('1. REMOVING DUPLICATE TEAM MEMBERS...')
    const allTeamMembers = await client.fetch(`
      *[_type == "teamMember"] | order(_createdAt desc) {
        _id,
        name,
        slug,
        role,
        "photo": photo[0].image.asset->url,
        _createdAt
      }
    `)

    console.log(`Found ${allTeamMembers.length} team members total`)

    // Group by name to find duplicates
    const membersByName = {}
    allTeamMembers.forEach(member => {
      if (!membersByName[member.name]) {
        membersByName[member.name] = []
      }
      membersByName[member.name].push(member)
    })

    // Remove duplicates, keeping the one with photo or most recent
    for (const [name, members] of Object.entries(membersByName)) {
      if (members.length > 1) {
        console.log(`\n📋 Found ${members.length} duplicates for ${name}:`)
        
        // Sort by: has photo first, then by creation date (newest first)
        members.sort((a, b) => {
          if (a.photo && !b.photo) return -1
          if (!a.photo && b.photo) return 1
          return new Date(b._createdAt) - new Date(a._createdAt)
        })

        const keepMember = members[0]
        const deleteMemberIds = members.slice(1).map(m => m._id)

        console.log(`   ✅ Keeping: ${keepMember._id} (${keepMember.photo ? 'has photo' : 'no photo'})`)
        console.log(`   ❌ Deleting: ${deleteMemberIds.join(', ')}`)

        // Delete duplicates
        for (const id of deleteMemberIds) {
          try {
            await client.delete(id)
            console.log(`   🗑️  Deleted ${id}`)
          } catch (error) {
            console.error(`   ⚠️  Failed to delete ${id}:`, error.message)
          }
        }
      }
    }

    // 2. FIX TEAM MEMBER SLUGS
    console.log('\n2. FIXING TEAM MEMBER SLUGS...')
    const remainingTeamMembers = await client.fetch(`
      *[_type == "teamMember"] {
        _id,
        name,
        slug
      }
    `)

    for (const member of remainingTeamMembers) {
      const correctSlug = generateSlug(member.name)
      const currentSlug = member.slug?.current

      if (currentSlug !== correctSlug) {
        console.log(`\n👤 ${member.name}:`)
        console.log(`   Current slug: ${currentSlug || 'NONE'}`)
        console.log(`   Correct slug: ${correctSlug}`)

        try {
          await client
            .patch(member._id)
            .set({ slug: { current: correctSlug, _type: 'slug' } })
            .commit()
          console.log(`   ✅ Updated slug to: ${correctSlug}`)
        } catch (error) {
          console.error(`   ⚠️  Failed to update slug:`, error.message)
        }
      }
    }

    // 3. ADD PROFILE IMAGES FOR MISSING ONES
    console.log('\n3. ADDING DEFAULT PROFILE IMAGES...')
    const membersWithoutPhotos = await client.fetch(`
      *[_type == "teamMember" && !defined(photo)] {
        _id,
        name,
        role
      }
    `)

    console.log(`Found ${membersWithoutPhotos.length} team members without photos`)

    // Default team photos mapping
    const defaultPhotos = {
      'Sarah Johnson': 'https://images.unsplash.com/photo-1494790108755-2616b75a5d78?w=500&h=600&fit=crop&crop=face',
      'Mike Chen': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face',
      'David Kim': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop&crop=face',
      'Theo Rodriguez': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=600&fit=crop&crop=face'
    }

    for (const member of membersWithoutPhotos) {
      const photoUrl = defaultPhotos[member.name]
      if (photoUrl) {
        console.log(`\n📷 Adding photo for ${member.name}...`)
        try {
          // Upload image as Sanity asset
          const imageAsset = await client.assets.upload('image', photoUrl, {
            filename: `${generateSlug(member.name)}-profile.jpg`
          })

          // Add to team member with imageWithAlt structure
          await client
            .patch(member._id)
            .set({
              photo: [{
                _type: 'imageWithAlt',
                image: {
                  _type: 'image',
                  asset: {
                    _ref: imageAsset._id,
                    _type: 'reference'
                  }
                },
                alt: `${member.name} - ${member.role}`
              }]
            })
            .commit()
          
          console.log(`   ✅ Added profile photo for ${member.name}`)
        } catch (error) {
          console.error(`   ⚠️  Failed to add photo for ${member.name}:`, error.message)
        }
      }
    }

    // 4. ADD YOUTUBE CHANNEL SLUGS
    console.log('\n4. ADDING YOUTUBE CHANNEL SLUGS...')
    const channelsWithoutSlugs = await client.fetch(`
      *[_type == "youtubeId" && (!defined(slug) || !defined(slug.current) || slug.current == "")] {
        _id,
        channel_name,
        slug
      }
    `)

    console.log(`Found ${channelsWithoutSlugs.length} channels without slugs`)

    for (const channel of channelsWithoutSlugs) {
      const generatedSlug = generateSlug(channel.channel_name)
      console.log(`\n📺 ${channel.channel_name}: ${generatedSlug}`)

      try {
        await client
          .patch(channel._id)
          .set({ slug: { current: generatedSlug, _type: 'slug' } })
          .commit()
        console.log(`   ✅ Added slug: ${generatedSlug}`)
      } catch (error) {
        console.error(`   ⚠️  Failed to add slug:`, error.message)
      }
    }

    // 5. VERIFICATION
    console.log('\n5. FINAL VERIFICATION...')
    
    const finalTeamMembers = await client.fetch(`
      *[_type == "teamMember"] | order(order asc) {
        _id,
        name,
        slug,
        "hasPhoto": defined(photo)
      }
    `)

    console.log('\n👥 FINAL TEAM MEMBERS:')
    finalTeamMembers.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.name}`)
      console.log(`     Slug: ${member.slug?.current || 'NO SLUG'}`)
      console.log(`     Photo: ${member.hasPhoto ? '✅' : '❌'}`)
      console.log(`     URL: /team-details/${member.slug?.current || 'NO-SLUG'}`)
      console.log('')
    })

    const finalChannels = await client.fetch(`
      *[_type == "youtubeId"] | order(channel_number asc) {
        _id,
        channel_name,
        slug
      }
    `)

    console.log('📺 FINAL YOUTUBE CHANNELS:')
    finalChannels.forEach((channel, index) => {
      console.log(`  ${index + 1}. ${channel.channel_name}`)
      console.log(`     Slug: ${channel.slug?.current || 'NO SLUG'}`)
      console.log(`     URL: /channels/${channel.slug?.current || 'NO-SLUG'}`)
      console.log('')
    })

    console.log('🎉 ALL FIXES COMPLETED!')

  } catch (error) {
    console.error('❌ Error during fixes:', error)
  }
}

fixAllIssues()
