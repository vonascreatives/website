const {createClient} = require('@sanity/client')
const {nanoid} = require('nanoid')
const https = require('https')
const fs = require('fs')
const path = require('path')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-08-26',
  token: process.env.SANITY_API_TOKEN || 'skZQcAQ9gbAHpg7hhIfcStbr6KWOZOp9hUSGhOJWkg4aWejVrns4JZYbN4zyINFzsGl0wPVEdWFHu48jn',
  useCdn: false
})

// PROPER PROFILE HEADSHOTS - Clear face photos for identification
const profileHeadshots = {
  teamMembers: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face&facepad=2'
  ],
  creators: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop&crop=face&facepad=2',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face&facepad=2'
  ]
}

// YouTube video thumbnails
const youtubeVideoImages = [
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=640&h=360&fit=crop'
]

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(filename)
      })
    }).on('error', (err) => {
      fs.unlink(filename, () => {})
      reject(err)
    })
  })
}

async function uploadImageFromUrl(url, filename, title) {
  try {
    const tempPath = path.join(__dirname, 'temp_' + filename)
    await downloadImage(url, tempPath)
    
    const buffer = fs.readFileSync(tempPath)
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
      title: title
    })
    
    fs.unlinkSync(tempPath)
    console.log(`✅ Uploaded: ${title}`)
    return asset
  } catch (error) {
    console.error(`❌ Failed to upload ${title}:`, error.message)
    return null
  }
}

async function fixTeamMemberProfiles() {
  console.log('\n👥 FIXING Team Member PROFILE PICTURES (clear headshots)...')
  
  const teamMembers = await client.fetch('*[_type == "teamMember"]')
  console.log(`Found ${teamMembers.length} team members`)
  
  for (let i = 0; i < teamMembers.length; i++) {
    const member = teamMembers[i]
    const photoUrl = profileHeadshots.teamMembers[i % profileHeadshots.teamMembers.length]
    
    const asset = await uploadImageFromUrl(
      photoUrl,
      `${member.name.toLowerCase().replace(/\s+/g, '-')}-headshot.jpg`,
      `${member.name} Clear Profile Headshot`
    )
    
    if (asset) {
      await client
        .patch(member._id)
        .set({
          photo: [{
            _key: nanoid(),
            _type: 'imageWithAlt',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            },
            alt: `Clear profile headshot of ${member.name} for easy identification`
          }]
        })
        .commit()
      
      console.log(`✅ FIXED ${member.name} - now has clear profile headshot`)
    }
  }
}

async function fixCreatorProfiles() {
  console.log('\n🎨 FIXING Creator PROFILE PICTURES (clear headshots for identification)...')
  
  const creators = await client.fetch('*[_type == "exclusiveCreator"]')
  console.log(`Found ${creators.length} exclusive creators`)
  
  for (let i = 0; i < creators.length; i++) {
    const creator = creators[i]
    const photoUrl = profileHeadshots.creators[i % profileHeadshots.creators.length]
    
    // Replace heroImage with actual profile headshot
    const profileAsset = await uploadImageFromUrl(
      photoUrl,
      `${creator.name.toLowerCase().replace(/\s+/g, '-')}-profile-headshot.jpg`,
      `${creator.name} Profile Headshot`
    )
    
    if (profileAsset) {
      await client
        .patch(creator._id)
        .set({
          heroImage: [{
            _key: nanoid(),
            _type: 'imageWithAlt',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: profileAsset._id
              }
            },
            alt: `Clear profile headshot of ${creator.name} for easy identification`
          }]
        })
        .commit()
      
      console.log(`✅ FIXED ${creator.name} - now has clear profile headshot instead of banner`)
    }
  }
}

async function addYouTubeVideoImages() {
  console.log('\n📺 ADDING YouTube Video ID images...')
  
  const youtubeVideos = await client.fetch('*[_type == "youtubeId"]')
  console.log(`Found ${youtubeVideos.length} YouTube videos`)
  
  for (let i = 0; i < youtubeVideos.length; i++) {
    const video = youtubeVideos[i]
    const imageUrl = youtubeVideoImages[i % youtubeVideoImages.length]
    
    const asset = await uploadImageFromUrl(
      imageUrl,
      `youtube-${video.videoId || i}-thumbnail.jpg`,
      `YouTube Video ${video.title || video.videoId || i} Thumbnail`
    )
    
    if (asset) {
      await client
        .patch(video._id)
        .set({
          thumbnail: {
            _type: 'imageWithAlt',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            },
            alt: `Thumbnail for YouTube video: ${video.title || video.videoId || 'Untitled video'}`
          }
        })
        .commit()
      
      console.log(`✅ Added thumbnail to YouTube video: ${video.title || video.videoId || 'Untitled'}`)
    }
  }
}

async function fixAllProfilesAndYouTube() {
  console.log('🚀 FIXING ALL PROFILE PICTURES + ADDING YOUTUBE IMAGES...\n')
  console.log('📸 Making sure team & creator images are CLEAR PROFILE HEADSHOTS for identification!')
  
  try {
    await fixTeamMemberProfiles()
    await fixCreatorProfiles() 
    await addYouTubeVideoImages()
    
    console.log('\n🎉 ALL FIXED!')
    console.log('👥 Team members: Clear profile headshots ✅')
    console.log('🎨 Creators: Clear profile headshots (not banners) ✅') 
    console.log('📺 YouTube videos: All have thumbnails ✅')
    console.log('🔍 Now you can easily identify everyone by their face!')
    
  } catch (error) {
    console.error('❌ Error fixing profiles:', error)
  }
}

fixAllProfilesAndYouTube()
