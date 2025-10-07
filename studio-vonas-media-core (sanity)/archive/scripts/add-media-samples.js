const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2024-08-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// Sample media assets (these are placeholders - in real use you'd upload actual files)
const sampleMediaAssets = [
  {
    _type: 'mediaAsset',
    _id: 'sample-image-1',
    title: 'Vonas Media Brand Hero Image',
    description: 'Main hero image showcasing our digital content creation philosophy',
    category: 'images',
    tags: ['branding', 'hero', 'digital-content'],
    uploadedAt: new Date('2024-08-26').toISOString(),
    fileSize: 2.3
  },
  {
    _type: 'mediaAsset',
    _id: 'sample-image-2', 
    title: 'Millennial Content Creator Workspace',
    description: 'Behind-the-scenes photo of a content creator workspace setup',
    category: 'images',
    tags: ['workspace', 'millennials', 'behind-the-scenes'],
    uploadedAt: new Date('2024-08-25').toISOString(),
    fileSize: 1.8
  },
  {
    _type: 'mediaAsset',
    _id: 'sample-image-3',
    title: 'Social Media Analytics Dashboard',
    description: 'Screenshot of social media analytics showing engagement metrics',
    category: 'images', 
    tags: ['analytics', 'social-media', 'metrics'],
    uploadedAt: new Date('2024-08-24').toISOString(),
    fileSize: 0.9
  },
  {
    _type: 'mediaAsset',
    _id: 'sample-video-1',
    title: 'Digital Content Strategy Explainer',
    description: 'Short video explaining our approach to digital content creation for modern audiences',
    category: 'videos',
    tags: ['explainer', 'strategy', 'content-creation'],
    uploadedAt: new Date('2024-08-23').toISOString(),
    fileSize: 45.2
  },
  {
    _type: 'mediaAsset',
    _id: 'sample-video-2',
    title: 'Gen X and Millennial Engagement Trends',
    description: 'Data visualization video showing engagement patterns across different demographics',
    category: 'videos',
    tags: ['data-viz', 'demographics', 'trends', 'engagement'],
    uploadedAt: new Date('2024-08-22').toISOString(),
    fileSize: 32.7
  }
]

async function addMediaSamples() {
  try {
    console.log('🎬 Adding sample media assets...\n')
    
    for (const asset of sampleMediaAssets) {
      const result = await client.createOrReplace(asset)
      console.log(`✅ Created: ${asset.title} (${asset.category})`)
    }
    
    console.log('\n🎉 Successfully added sample media assets!')
    console.log(`📊 Added ${sampleMediaAssets.length} media assets:`)
    console.log(`   • 3 images`)
    console.log(`   • 2 videos`)
    console.log('\n🌐 Check them out at:')
    console.log('   • Local: http://localhost:3333/')
    console.log('   • Deployed: https://vonas-media.sanity.studio/')
    
  } catch (error) {
    console.error('❌ Error adding media samples:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  addMediaSamples()
}

module.exports = { addMediaSamples }
