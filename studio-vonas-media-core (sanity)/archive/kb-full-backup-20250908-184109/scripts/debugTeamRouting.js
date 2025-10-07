import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
})

async function debugTeamRouting() {
  try {
    console.log('=== TEAM MEMBER ROUTING DEBUGGING ===\n')
    
    // Test the same queries used in the Next.js app
    
    // 1. Generate Static Params Query
    console.log('1. GENERATE STATIC PARAMS QUERY:')
    const staticParams = await client.fetch(`*[_type == "teamMember"].slug.current`)
    console.log('Static params (for URLs):', staticParams)
    
    // 2. Test specific slug lookups
    const testSlugs = [
      'sarah-johnson',
      'sarah-johnson-clean', 
      'emily-rodriguez',
      'mike-chen',
      'david-kim',
      'theo-rodriguez'
    ]
    
    console.log('\n2. INDIVIDUAL SLUG LOOKUPS:')
    for (const slug of testSlugs) {
      console.log(`\n--- Testing slug: "${slug}" ---`)
      
      const teamMember = await client.fetch(
        `*[_type == "teamMember" && slug.current == $slug][0]{
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
          order,
          "youtubeChannels": youtubeChannels[]->{ 
            _id,
            channel_name,
            slug,
            cta_button_url,
            category,
            channel_number
          }
        }`,
        { slug }
      )
      
      if (teamMember) {
        console.log(`✅ FOUND: ${teamMember.name}`)
        console.log(`   Real slug: ${teamMember.slug?.current}`)
        console.log(`   Role: ${teamMember.role}`)
        console.log(`   Photo: ${teamMember.photo ? 'YES' : 'NO'}`)
        console.log(`   Bio: ${teamMember.bioText ? 'YES' : 'NO'}`)
        console.log(`   Channels: ${teamMember.youtubeChannels?.length || 0}`)
      } else {
        console.log('❌ NOT FOUND')
      }
    }
    
    // 3. Check team data used in About page  
    console.log('\n3. TEAM DATA FOR ABOUT PAGE:')
    const aboutTeamData = await client.fetch(`*[_type == "teamMember"] | order(order asc){
      _id,
      name,
      slug,
      "photo": photo[0].image.asset->url,
      "photoAlt": photo[0].alt,
      role,
      "bioText": bio[0].children[0].text,
      bio,
      socialLinks,
      email,
      order
    }`)
    
    console.log(`Found ${aboutTeamData.length} team members for about page:`)
    aboutTeamData.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.name}`)
      console.log(`     Slug: ${member.slug?.current || 'NO SLUG'}`)
      console.log(`     Role: ${member.role}`) 
      console.log(`     Photo: ${member.photo ? 'YES' : 'NO'}`)
      console.log(`     Order: ${member.order}`)
      console.log(`     Generated URL would be: /team-details/${member.slug?.current || 'NO-SLUG'}`)
      console.log('')
    })

    console.log('4. SLUG MISMATCH ANALYSIS:')
    console.log('   - URLs you tried: /team-details/sarah-johnson, /team-details/emily-rodriguez')
    console.log('   - CMS slugs found:', staticParams)
    console.log('   - The mismatch is causing "Team Member Not Found" errors')

  } catch (error) {
    console.error('Error in debug:', error)
  }
}

debugTeamRouting()
