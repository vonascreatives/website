const {createClient} = require('@sanity/client')
const {nanoid} = require('nanoid')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-08-26',
  token: process.env.SANITY_API_TOKEN || 'skZQcAQ9gbAHpg7hhIfcStbr6KWOZOp9hUSGhOJWkg4aWejVrns4JZYbN4zyINFzsGl0wPVEdWFHu48jn',
  useCdn: false
})

// Helper function to create stock images
function createStockImageBuffer(type, name, color, width = 400, height = 400) {
  let svg
  
  if (type === 'profile') {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
    svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/2 - 10}" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${width/8}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${initials}</text>
    </svg>`
  } else if (type === 'creator-hero') {
    svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">${name}</text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Content Creator</text>
    </svg>`
  } else if (type === 'creator-gallery') {
    svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <circle cx="50" cy="50" r="30" fill="white" opacity="0.3"/>
      <circle cx="${width-50}" cy="50" r="30" fill="white" opacity="0.3"/>
      <circle cx="50" cy="${height-50}" r="30" fill="white" opacity="0.3"/>
      <circle cx="${width-50}" cy="${height-50}" r="30" fill="white" opacity="0.3"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="bold">Gallery</text>
    </svg>`
  } else {
    svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">${name}</text>
    </svg>`
  }
  
  return Buffer.from(svg)
}

// Color palette for different types
const colors = {
  profile: ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#EC4899'],
  creator: ['#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981'],
  general: ['#6B7280', '#374151', '#1F2937', '#111827']
}

async function uploadImage(buffer, filename, title) {
  try {
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
      title: title
    })
    console.log(`✅ Uploaded: ${title}`)
    return asset
  } catch (error) {
    console.error(`❌ Failed to upload ${title}:`, error.message)
    return null
  }
}

async function updateTeamMembers() {
  console.log('\n🧑‍💼 Updating Team Member images...')
  
  const teamMembers = await client.fetch('*[_type == "teamMember"]')
  console.log(`Found ${teamMembers.length} team members`)
  
  for (let i = 0; i < teamMembers.length; i++) {
    const member = teamMembers[i]
    const color = colors.profile[i % colors.profile.length]
    
    // Create profile image
    const profileBuffer = createStockImageBuffer('profile', member.name, color, 300, 300)
    const profileAsset = await uploadImage(
      profileBuffer, 
      `${member.name.toLowerCase().replace(/\s+/g, '-')}-profile.svg`,
      `${member.name} Profile Photo`
    )
    
    if (profileAsset) {
      // Update the team member document
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
                _ref: profileAsset._id
              }
            },
            alt: `Profile photo of ${member.name}`
          }]
        })
        .commit()
      
      console.log(`✅ Updated ${member.name} profile photo`)
    }
  }
}

async function updateExclusiveCreators() {
  console.log('\n🎨 Updating Exclusive Creator images...')
  
  const creators = await client.fetch('*[_type == "exclusiveCreator"]')
  console.log(`Found ${creators.length} exclusive creators`)
  
  for (let i = 0; i < creators.length; i++) {
    const creator = creators[i]
    const color = colors.creator[i % colors.creator.length]
    
    // Create hero image
    const heroBuffer = createStockImageBuffer('creator-hero', creator.name, color, 800, 400)
    const heroAsset = await uploadImage(
      heroBuffer,
      `${creator.name.toLowerCase().replace(/\s+/g, '-')}-hero.svg`,
      `${creator.name} Hero Banner`
    )
    
    // Create gallery images
    const galleryAssets = []
    for (let j = 0; j < 3; j++) {
      const galleryColor = colors.creator[(i + j) % colors.creator.length]
      const galleryBuffer = createStockImageBuffer('creator-gallery', `${creator.name} Content ${j + 1}`, galleryColor, 400, 300)
      const galleryAsset = await uploadImage(
        galleryBuffer,
        `${creator.name.toLowerCase().replace(/\s+/g, '-')}-gallery-${j + 1}.svg`,
        `${creator.name} Gallery Image ${j + 1}`
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
          alt: `${creator.name} content showcase ${j + 1}`
        })
      }
    }
    
    // Update the creator document
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
        alt: `${creator.name} hero banner`
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
      
      console.log(`✅ Updated ${creator.name} images (hero + ${galleryAssets.length} gallery)`)
    }
  }
}

async function updatePosts() {
  console.log('\n📝 Updating Post images...')
  
  const posts = await client.fetch('*[_type == "post"]')
  console.log(`Found ${posts.length} posts`)
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const color = colors.general[i % colors.general.length]
    
    // Create main image
    const imageBuffer = createStockImageBuffer('general', post.title || 'Blog Post', color, 600, 400)
    const imageAsset = await uploadImage(
      imageBuffer,
      `${(post.title || 'post').toLowerCase().replace(/\s+/g, '-')}-main.svg`,
      `${post.title || 'Blog Post'} Featured Image`
    )
    
    if (imageAsset) {
      await client
        .patch(post._id)
        .set({
          mainImage: {
            _type: 'imageWithAlt',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset._id
              }
            },
            alt: `Featured image for ${post.title || 'blog post'}`
          }
        })
        .commit()
      
      console.log(`✅ Updated ${post.title || 'Untitled Post'} featured image`)
    }
  }
}

async function updateBrandCollaborations() {
  console.log('\n🤝 Updating Brand Collaboration images...')
  
  const collaborations = await client.fetch('*[_type == "brandCollaboration"]')
  console.log(`Found ${collaborations.length} brand collaborations`)
  
  for (let i = 0; i < collaborations.length; i++) {
    const collab = collaborations[i]
    const color = colors.creator[i % colors.creator.length]
    
    // Create featured image
    const imageBuffer = createStockImageBuffer('general', collab.title || 'Brand Collaboration', color, 600, 400)
    const imageAsset = await uploadImage(
      imageBuffer,
      `${(collab.title || 'collaboration').toLowerCase().replace(/\s+/g, '-')}-featured.svg`,
      `${collab.title || 'Brand Collaboration'} Featured Image`
    )
    
    if (imageAsset) {
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
                _ref: imageAsset._id
              }
            },
            alt: `Featured image for ${collab.title || 'brand collaboration'}`
          }]
        })
        .commit()
      
      console.log(`✅ Updated ${collab.title || 'Untitled Collaboration'} featured image`)
    }
  }
}

async function updateAllImages() {
  console.log('🚀 Starting comprehensive image update for all collections...\n')
  
  try {
    await updateTeamMembers()
    await updateExclusiveCreators()
    await updatePosts()
    await updateBrandCollaborations()
    
    console.log('\n🎉 Successfully updated all collection images!')
    console.log('✨ All documents now have appropriate stock images')
    
  } catch (error) {
    console.error('❌ Error updating images:', error)
  }
}

// Run the update
updateAllImages()
