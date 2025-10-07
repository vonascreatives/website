const { getCliClient } = require('sanity/cli');

const client = getCliClient();

async function patchTeamMember() {
  try {
    console.log('🔗 Adding YouTube channel reference to Sarah Johnson...');
    
    const result = await client
      .patch('team-member-1')
      .set({
        youtubeChannels: [
          {
            _type: 'reference',
            _ref: 'youtube-05'
          }
        ]
      })
      .commit();
    
    console.log('✅ Successfully connected Sarah Johnson to Culture Remix channel:', result);
    
    // Verify the connection
    const verification = await client.fetch(`
      *[_type == "teamMember" && _id == "team-member-1"][0]{
        name,
        "youtubeChannels": youtubeChannels[]->{
          _id,
          channel_name,
          slug
        }
      }
    `);
    
    console.log('✅ Verification - Sarah Johnson now connected to:', verification);
    
    return result;
  } catch (error) {
    console.error('❌ Error patching team member:', error);
    throw error;
  }
}

patchTeamMember();
