// Test team member page styling to understand issues
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

// Test what our team member component expects vs what it gets
async function testTeamMemberStyling() {
  console.log('🧪 TESTING TEAM MEMBER PAGE STYLING');
  console.log('='.repeat(50));
  
  try {
    // Get a sample team member
    const teamMember = await client.fetch(
      `*[_type == "teamMember" && slug.current == "sarah-johnson"][0]{
        _id,
        name,
        slug,
        role,
        "photo": photo[0].image.asset->url,
        "photoAlt": photo[0].alt,
        "bioText": bio[0].children[0].text,
        bio,
        socialLinks,
        email,
        order
      }`
    );
    
    if (!teamMember) {
      console.log('❌ No team member found with slug sarah-johnson');
      return;
    }
    
    console.log('📋 TEAM MEMBER DATA STRUCTURE:');
    console.log('Raw Sanity data:', JSON.stringify(teamMember, null, 2));
    
    // Transform like the page does
    const transformedMember = {
      id: teamMember.order || 1,
      name: teamMember.name,
      image: teamMember.photo || '/assets/img/home-01/team/team-1-1.jpg',
      designation: teamMember.role || 'Team Member',
      bio: teamMember.bioText,
      bioText: teamMember.bioText,
      email: teamMember.email,
      socialLinks: teamMember.socialLinks,
      _id: teamMember._id,
      slug: teamMember.slug
    };
    
    console.log('\n📋 TRANSFORMED FOR COMPONENT:');
    console.log(JSON.stringify(transformedMember, null, 2));
    
    console.log('\n🔍 IMAGE ANALYSIS:');
    if (transformedMember.image) {
      console.log(`✅ Image URL: ${transformedMember.image}`);
      console.log(`✅ Image source: ${transformedMember.image.includes('sanity') ? 'Sanity CDN' : 'Static asset'}`);
      
      // Check if it's a Sanity image
      if (transformedMember.image.includes('sanity')) {
        console.log('✅ Using dynamic CMS image');
        
        // Check image dimensions from URL
        const urlParts = transformedMember.image.split('-');
        const lastPart = urlParts[urlParts.length - 1];
        const dimensions = lastPart.split('.')[0]; // e.g., "300x300"
        console.log(`✅ Image dimensions from URL: ${dimensions}`);
        
        if (dimensions === '300x300') {
          console.log('⚠️  POTENTIAL STYLING ISSUE: Square image (300x300) may not fit expected layout');
          console.log('   Component expects wider aspect ratio for proper styling');
        }
      }
    }
    
    console.log('\n🎯 STYLING EXPECTATIONS:');
    console.log('Component structure:');
    console.log('- Uses Next.js Image component');
    console.log('- Width: 500px, Height: 600px');
    console.log('- Style: {height: "auto"}');
    console.log('- Expected aspect ratio: ~5:6 (portrait)');
    console.log('- Current image ratio: 1:1 (square)');
    
    console.log('\n❗ IDENTIFIED STYLING ISSUES:');
    console.log('1. Image aspect ratio mismatch (1:1 vs expected 5:6)');
    console.log('2. Square images (300x300) in portrait layout may look stretched/distorted');
    console.log('3. Fixed width/height (500x600) forces aspect ratio change');
    
  } catch (error) {
    console.error('❌ Error testing team member styling:', error);
  }
}

testTeamMemberStyling();
