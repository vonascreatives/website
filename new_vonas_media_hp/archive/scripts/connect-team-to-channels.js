const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

async function checkAndConnectTeamToChannels() {
  try {
    console.log('🔍 Checking existing YouTube channels...');
    
    // Fetch all YouTube channels
    const youtubeChannels = await client.fetch('*[_type == "youtubeId"]{_id, channel_name, slug}');
    console.log('YouTube Channels:', youtubeChannels);
    
    console.log('🔍 Checking existing team members...');
    
    // Fetch all team members
    const teamMembers = await client.fetch('*[_type == "teamMember"]{_id, name, slug}');
    console.log('Team Members:', teamMembers);
    
    if (youtubeChannels.length > 0 && teamMembers.length > 0) {
      // Connect Sarah Johnson to the first YouTube channel as an example
      const sarah = teamMembers.find(member => 
        member.name.toLowerCase().includes('sarah') || 
        member.slug?.current === 'sarah-johnson'
      );
      
      if (sarah && youtubeChannels[0]) {
        console.log(`🔗 Connecting ${sarah.name} to ${youtubeChannels[0].channel_name}...`);
        
        const result = await client
          .patch(sarah._id)
          .set({
            youtubeChannels: [{
              _type: 'reference',
              _ref: youtubeChannels[0]._id
            }]
          })
          .commit();
          
        console.log('✅ Successfully connected team member to channel:', result);
        return result;
      } else {
        console.log('❌ Could not find Sarah Johnson or YouTube channels');
      }
    }
    
    return { youtubeChannels, teamMembers };
  } catch (error) {
    console.error('❌ Error connecting team to channels:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  checkAndConnectTeamToChannels()
    .then((result) => {
      console.log('✅ Operation completed:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Operation failed:', error);
      process.exit(1);
    });
}

module.exports = checkAndConnectTeamToChannels;
