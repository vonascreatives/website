import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function updateCategories() {
  console.log('Updating category names...')
  
  const updates = [
    {
      id: 'kbCategory.company-foundation',
      title: 'Company'
    },
    {
      id: 'kbCategory.team-operations', 
      title: 'Team'
    },
    {
      id: 'kbCategory.production-workflows',
      title: 'Production'
    },
    {
      id: 'kbCategory.youtube-shows',
      title: 'Shows'
    },
    {
      id: 'kbCategory.tools-systems',
      title: 'Tools'
    },
    {
      id: 'kbCategory.external-partnerships',
      title: 'Partners'
    },
    {
      id: 'kbCategory.policies-procedures',
      title: 'Policies'
    }
  ]

  for (const update of updates) {
    try {
      await client.patch(update.id).set({title: update.title}).commit()
      console.log(`✅ Updated ${update.id} to "${update.title}"`)
    } catch (error) {
      console.error(`❌ Failed to update ${update.id}:`, error.message)
    }
  }
  
  console.log('Done!')
}

updateCategories().catch(console.error)