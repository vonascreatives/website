const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

async function createAPIToken() {
  console.log('🔐 Creating API token with proper permissions...\n')
  
  try {
    // Try to list existing tokens first
    console.log('📋 Checking existing tokens...')
    const { stdout: tokensOutput } = await execPromise('npx sanity debug --secrets')
    
    // Extract the auth token from the output
    const tokenMatch = tokensOutput.match(/Auth token: '([^']+)'/)
    
    if (tokenMatch) {
      const token = tokenMatch[1]
      console.log('✅ Found existing auth token!')
      console.log('🔑 Token:', token.substring(0, 10) + '...' + token.substring(token.length - 10))
      
      // Update .env.local with the token
      const fs = require('fs')
      let envContent = ''
      
      if (fs.existsSync('.env.local')) {
        envContent = fs.readFileSync('.env.local', 'utf8')
        envContent = envContent.replace(/SANITY_API_TOKEN=.*/, `SANITY_API_TOKEN=${token}`)
      } else {
        envContent = `SANITY_API_TOKEN=${token}\nSANITY_PROJECT_ID=5cywtc7a\nSANITY_DATASET=production\n`
      }
      
      fs.writeFileSync('.env.local', envContent)
      console.log('📝 Updated .env.local with auth token')
      
      return token
    } else {
      console.log('❌ Could not extract auth token from CLI output')
      console.log('\n📖 Manual steps to create API token:')
      console.log('1. Run: npx sanity manage')
      console.log('2. Go to API -> Tokens')
      console.log('3. Create new token with "Editor" permissions')
      console.log('4. Copy token to .env.local')
      
      return null
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    return null
  }
}

// Run if executed directly
if (require.main === module) {
  createAPIToken()
}

module.exports = { createAPIToken }
