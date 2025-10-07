const { exec } = require('child_process')

console.log('🔐 Setting up Sanity API Token...\n')

console.log('To create your API token:')
console.log('1. Run: npx sanity manage')
console.log('2. Go to the "API" tab')
console.log('3. Click "Add API token"')
console.log('4. Give it a name like "Vonas Media Studio"')
console.log('5. Select "Editor" permissions')
console.log('6. Copy the token')
console.log('7. Paste it in .env.local replacing "your_token_here"\n')

console.log('Alternatively, you can run:')
console.log('npx sanity debug --secrets\n')

console.log('Or open the management interface directly:')
exec('npx sanity manage', (error, stdout, stderr) => {
  if (error) {
    console.log('⚠️  Could not automatically open management interface')
    console.log('Please visit: https://sanity.io/manage')
    return
  }
  console.log('✅ Opening Sanity management interface...')
})
