const {createClient} = require('@sanity/client')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-08-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// Sample images from Unsplash (free to use)
const mediaAssets = [
  {
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    title: 'Modern Digital Workspace',
    description: 'A clean, modern workspace setup perfect for digital content creation',
    category: 'images',
    tags: ['workspace', 'modern', 'digital', 'productivity'],
    type: 'image'
  },
  {
    url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
    title: 'Social Media Analytics',
    description: 'Digital analytics dashboard showing social media engagement metrics',
    category: 'images', 
    tags: ['analytics', 'data', 'social-media', 'metrics'],
    type: 'image'
  },
  {
    url: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=600&fit=crop',
    title: 'Content Creation Setup',
    description: 'Professional content creation setup with camera and lighting equipment',
    category: 'images',
    tags: ['content-creation', 'video', 'professional', 'equipment'],
    type: 'image'
  },
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    title: 'Digital Marketing Dashboard', 
    description: 'Analytics and marketing performance dashboard interface',
    category: 'images',
    tags: ['marketing', 'dashboard', 'analytics', 'performance'],
    type: 'image'
  },
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    title: 'Data Visualization Charts',
    description: 'Colorful data visualization charts and graphs on screen',
    category: 'images',
    tags: ['data-viz', 'charts', 'analytics', 'visualization'], 
    type: 'image'
  }
]

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const module = url.startsWith('https:') ? https : http
    
    module.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename)
        response.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          resolve(filename)
        })
        fileStream.on('error', reject)
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`))
      }
    }).on('error', reject)
  })
}

async function uploadImageToSanity(imagePath, asset) {
  try {
    // Upload the image file to Sanity
    const uploadResponse = await client.assets.upload('image', fs.createReadStream(imagePath), {
      filename: path.basename(imagePath)
    })

    console.log(`✅ Uploaded image: ${asset.title}`)

    // Create the media asset document with reference to the uploaded image
    const mediaAssetDoc = {
      _type: 'mediaAsset',
      title: asset.title,
      description: asset.description,
      category: asset.category,
      tags: asset.tags,
      uploadedAt: new Date().toISOString(),
      fileSize: parseFloat((fs.statSync(imagePath).size / (1024 * 1024)).toFixed(2)), // Size in MB
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: uploadResponse._id
        }
      }
    }

    const docResponse = await client.create(mediaAssetDoc)
    console.log(`📄 Created media document: ${asset.title}`)

    // Clean up downloaded file
    fs.unlinkSync(imagePath)

    return docResponse
  } catch (error) {
    console.error(`❌ Error uploading ${asset.title}:`, error.message)
    // Clean up downloaded file even if upload failed
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
    throw error
  }
}

async function uploadRealMedia() {
  console.log('🖼️  Starting real media upload...\n')
  
  // Create temp directory for downloads
  const tempDir = path.join(__dirname, 'temp-images')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
  }

  let successCount = 0
  
  for (let i = 0; i < mediaAssets.length; i++) {
    const asset = mediaAssets[i]
    const filename = `temp-image-${i + 1}.jpg`
    const filepath = path.join(tempDir, filename)
    
    try {
      console.log(`📥 Downloading: ${asset.title}...`)
      await downloadImage(asset.url, filepath)
      
      console.log(`☁️  Uploading to Sanity: ${asset.title}...`)
      await uploadImageToSanity(filepath, asset)
      
      successCount++
      console.log(`✅ Complete: ${asset.title}\n`)
      
    } catch (error) {
      console.error(`❌ Failed: ${asset.title} - ${error.message}\n`)
    }
    
    // Small delay to be respectful to APIs
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true })
  }

  console.log(`🎉 Upload complete! Successfully uploaded ${successCount}/${mediaAssets.length} media assets.`)
  console.log('\n🌐 Check your media at:')
  console.log('   • Local: http://localhost:3333/')
  console.log('   • Deployed: https://vonas-media.sanity.studio/')
  console.log('\n💡 Look for the "Media Asset" section in your studio!')
}

// Run if executed directly
if (require.main === module) {
  uploadRealMedia().catch(console.error)
}

module.exports = { uploadRealMedia }
