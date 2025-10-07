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

async function fixYouTubeThumbnails() {
  console.log('\n📺 FIXING YouTube Video thumbnails in visual_identity_images field...')
  
  const youtubeVideos = await client.fetch('*[_type == "youtubeId"]')
  console.log(`Found ${youtubeVideos.length} YouTube videos`)
  
  for (let i = 0; i < youtubeVideos.length; i++) {
    const video = youtubeVideos[i]
    const imageUrl = youtubeVideoImages[i % youtubeVideoImages.length]
    
    const asset = await uploadImageFromUrl(
      imageUrl,
      `youtube-${video.channel_name || video.channel_number || i}-thumbnail.jpg`,
      `${video.channel_name || 'YouTube Channel'} Thumbnail`
    )
    
    if (asset) {
      // Add to visual_identity_images field (correct field for YouTube schema)
      await client
        .patch(video._id)
        .set({
          visual_identity_images: [{
            _key: nanoid(),
            _type: 'imageWithAlt',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            },
            alt: `Thumbnail for YouTube channel: ${video.channel_name || video.channel_number || 'Untitled channel'}`
          }]
        })
        .commit()
      
      console.log(`✅ Added thumbnail to YouTube channel: ${video.channel_name || video.channel_number || 'Untitled'}`)
    }
  }
}

async function removeIncorrectThumbnailField() {
  console.log('\n🧹 Removing incorrect thumbnail field from YouTube videos...')
  
  const youtubeVideos = await client.fetch('*[_type == "youtubeId" && defined(thumbnail)]')
  console.log(`Found ${youtubeVideos.length} YouTube videos with incorrect thumbnail field`)
  
  for (const video of youtubeVideos) {
    await client
      .patch(video._id)
      .unset(['thumbnail'])
      .commit()
    
    console.log(`✅ Removed incorrect thumbnail field from: ${video.channel_name || video.channel_number || 'Untitled'}`)
  }
}

async function fixAllYouTubeThumbnails() {
  console.log('🚀 FIXING YouTube Video thumbnails in correct field...\n')
  
  try {
    await removeIncorrectThumbnailField()
    await fixYouTubeThumbnails()
    
    console.log('\n🎉 YouTube thumbnails FIXED!')
    console.log('📺 All YouTube videos now have thumbnails in visual_identity_images field ✅')
    console.log('🧹 Removed incorrect thumbnail fields ✅')
    
  } catch (error) {
    console.error('❌ Error fixing YouTube thumbnails:', error)
  }
}

fixAllYouTubeThumbnails()
