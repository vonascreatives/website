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

// Free stock photo URLs from Unsplash (via their API)
const stockPhotos = {
  teamMembers: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
  ],
  creatorHeros: [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop'
  ],
  creatorGallery: [
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop'
  ],
  blogPosts: [
    'https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop'
  ],
  brandCollabs: [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop'
  ]
}

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
      fs.unlink(filename, () => {}) // Delete the file on error
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
    
    // Clean up temp file
    fs.unlinkSync(tempPath)
    
    console.log(`✅ Uploaded: ${title}`)
    return asset
  } catch (error) {
    console.error(`❌ Failed to upload ${title}:`, error.message)
    return null
  }
}

async function updateTeamMembers() {
  console.log('\n👥 Updating Team Members with professional headshots...')
  
  const teamMembers = await client.fetch('*[_type == "teamMember"]')
  console.log(`Found ${teamMembers.length} team members`)
  
  for (let i = 0; i < teamMembers.length; i++) {
    const member = teamMembers[i]
    const photoUrl = stockPhotos.teamMembers[i % stockPhotos.teamMembers.length]
    
    const asset = await uploadImageFromUrl(
      photoUrl,
      `${member.name.toLowerCase().replace(/\s+/g, '-')}-profile.jpg`,
      `${member.name} Professional Headshot`
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
            alt: `Professional headshot of ${member.name}, ${member.role || 'team member'}`
          }]
        })
        .commit()
      
      console.log(`✅ Updated ${member.name} with professional headshot`)
    }
  }
}

async function updateExclusiveCreators() {
  console.log('\n🎨 Updating Exclusive Creators with real content creator photos...')
  
  const creators = await client.fetch('*[_type == "exclusiveCreator"]')
  console.log(`Found ${creators.length} exclusive creators`)
  
  for (let i = 0; i < creators.length; i++) {
    const creator = creators[i]
    
    // Upload hero image
    const heroUrl = stockPhotos.creatorHeros[i % stockPhotos.creatorHeros.length]
    const heroAsset = await uploadImageFromUrl(
      heroUrl,
      `${creator.name.toLowerCase().replace(/\s+/g, '-')}-hero.jpg`,
      `${creator.name} Hero Banner`
    )
    
    // Upload gallery images
    const galleryAssets = []
    for (let j = 0; j < 3; j++) {
      const galleryUrl = stockPhotos.creatorGallery[(i * 3 + j) % stockPhotos.creatorGallery.length]
      const galleryAsset = await uploadImageFromUrl(
        galleryUrl,
        `${creator.name.toLowerCase().replace(/\s+/g, '-')}-gallery-${j + 1}.jpg`,
        `${creator.name} Content Sample ${j + 1}`
      )
      
      if (galleryAsset) {
        galleryAssets.push({
          _key: nanoid(),
          _type: 'imageWithAlt',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: galleryAsset._id
            }
          },
          alt: `${creator.name} content creation sample ${j + 1}`
        })
      }
    }
    
    // Update creator document
    const updateData = {}
    
    if (heroAsset) {
      updateData.heroImage = [{
        _key: nanoid(),
        _type: 'imageWithAlt',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: heroAsset._id
          }
        },
        alt: `${creator.name} professional hero banner showcasing their content creation work`
      }]
    }
    
    if (galleryAssets.length > 0) {
      updateData.gallery = galleryAssets
    }
    
    if (Object.keys(updateData).length > 0) {
      await client
        .patch(creator._id)
        .set(updateData)
        .commit()
      
      console.log(`✅ Updated ${creator.name} with hero + ${galleryAssets.length} gallery images`)
    }
  }
}

async function updatePosts() {
  console.log('\n📝 Updating Blog Posts with relevant stock photos...')
  
  const posts = await client.fetch('*[_type == "post"]')
  console.log(`Found ${posts.length} posts`)
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const imageUrl = stockPhotos.blogPosts[i % stockPhotos.blogPosts.length]
    
    const asset = await uploadImageFromUrl(
      imageUrl,
      `${(post.title || 'post').toLowerCase().replace(/\s+/g, '-')}-featured.jpg`,
      `${post.title || 'Blog Post'} Featured Image`
    )
    
    if (asset) {
      await client
        .patch(post._id)
        .set({
          mainImage: {
            _type: 'imageWithAlt',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            },
            alt: `Featured image for blog post: ${post.title || 'Untitled post'}`
          }
        })
        .commit()
      
      console.log(`✅ Updated "${post.title || 'Untitled Post'}" with stock photo`)
    }
  }
}

async function updateBrandCollaborations() {
  console.log('\n🤝 Updating Brand Collaborations with business stock photos...')
  
  const collaborations = await client.fetch('*[_type == "brandCollaboration"]')
  console.log(`Found ${collaborations.length} brand collaborations`)
  
  for (let i = 0; i < collaborations.length; i++) {
    const collab = collaborations[i]
    const imageUrl = stockPhotos.brandCollabs[i % stockPhotos.brandCollabs.length]
    
    const asset = await uploadImageFromUrl(
      imageUrl,
      `${(collab.title || 'collaboration').toLowerCase().replace(/\s+/g, '-')}-featured.jpg`,
      `${collab.title || 'Brand Collaboration'} Featured Image`
    )
    
    if (asset) {
      await client
        .patch(collab._id)
        .set({
          featuredImage: [{
            _key: nanoid(),
            _type: 'imageWithAlt',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            },
            alt: `Featured image for brand collaboration: ${collab.title || 'Untitled collaboration'}`
          }]
        })
        .commit()
      
      console.log(`✅ Updated "${collab.title || 'Untitled Collaboration'}" with business stock photo`)
    }
  }
}

async function updateAllWithRealStockImages() {
  console.log('🚀 Updating ALL collections with REAL professional stock photos...\n')
  
  try {
    await updateTeamMembers()
    await updateExclusiveCreators() 
    await updatePosts()
    await updateBrandCollaborations()
    
    console.log('\n🎉 SUCCESS! All collections updated with professional stock photos!')
    console.log('📸 Team members now have professional headshots')
    console.log('🎨 Creators have real content creation photos')
    console.log('📝 Blog posts have relevant stock images')
    console.log('🤝 Brand collaborations have business photos')
    
  } catch (error) {
    console.error('❌ Error updating with real stock images:', error)
  }
}

// Run the update with REAL stock photos
updateAllWithRealStockImages()
