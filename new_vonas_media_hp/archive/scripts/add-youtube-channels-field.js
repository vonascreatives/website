const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_WRITE_TOKEN || 'your-token-here', // You need to provide this
  useCdn: false
});

async function addYouTubeChannelsField() {
  try {
    console.log('Starting to add youtubeChannels field to team members...');
    
    // Fetch all team members
    const teamMembers = await client.fetch('*[_type == "teamMember"]');
    console.log(`Found ${teamMembers.length} team members`);
    
    // Add empty youtubeChannels array to each team member
    const patches = teamMembers.map(member => ({
      id: member._id,
      patch: {
        set: {
          youtubeChannels: []
        }
      }
    }));
    
    // Apply patches
    const transaction = client.transaction();
    patches.forEach(({ id, patch }) => {
      transaction.patch(id, patch);
    });
    
    const result = await transaction.commit();
    console.log('Successfully added youtubeChannels field to all team members:', result);
    
    return result;
  } catch (error) {
    console.error('Error adding youtubeChannels field:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  addYouTubeChannelsField()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addYouTubeChannelsField;
