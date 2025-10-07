// Run with: sanity exec scripts/cleanup-invalid-fields.js --with-user-token

import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function cleanupBlogPosts() {
  console.log('Cleaning up invalid featuredImages field from blog posts...')
  
  // Get all posts that have the invalid featuredImages field
  const posts = await client.fetch(`*[_type == "post" && defined(featuredImages)]`)
  
  for (const post of posts) {
    console.log(`Cleaning up post: ${post.title}`)
    
    // Remove the invalid featuredImages field
    await client.patch(post._id).unset(['featuredImages']).commit()
    
    console.log(`✅ Cleaned up ${post.title}`)
  }
}

async function main() {
  try {
    console.log('🧹 Starting cleanup process...')
    
    await cleanupBlogPosts()
    
    console.log('✅ Cleanup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  }
}

main()
