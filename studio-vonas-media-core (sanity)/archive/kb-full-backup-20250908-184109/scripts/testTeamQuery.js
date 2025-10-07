import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
})

async function testTeamQuery() {
  try {
    console.log('🔍 TESTING TEAM MEMBERS QUERY (EXACT SAME AS NEXT.JS APP)\n')
    
    // This is the EXACT query from getTeamMembersData in sanity.ts
    const query = `*[_type == "teamMember"] | order(order asc){
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
    }`

    console.log('Query:', query)
    console.log('\n--- EXECUTING QUERY ---')
    
    const result = await client.fetch(query)
    
    console.log('✅ QUERY SUCCESS!')
    console.log('📊 Result count:', result.length)
    console.log('📋 Raw result:', JSON.stringify(result, null, 2))
    
    console.log('\n--- FORMATTED RESULTS ---')
    result.forEach((member, index) => {
      console.log(`\n${index + 1}. ${member.name}`)
      console.log(`   ID: ${member._id}`)
      console.log(`   Slug: ${member.slug?.current || 'NO SLUG'}`)
      console.log(`   Role: ${member.role || 'NO ROLE'}`)
      console.log(`   Photo: ${member.photo || 'NO PHOTO'}`)
      console.log(`   Photo Alt: ${member.photoAlt || 'NO ALT'}`)
      console.log(`   Bio: ${member.bioText || 'NO BIO'}`)
      console.log(`   Order: ${member.order || 'NO ORDER'}`)
      console.log(`   Email: ${member.email || 'NO EMAIL'}`)
      console.log(`   Social Links:`, member.socialLinks || 'NONE')
    })

    console.log('\n--- CHECK IF DATA WOULD BE USED IN NEXT.JS ---')
    const wouldUseCMS = result && result.length > 0
    console.log('Would use CMS data?', wouldUseCMS ? '✅ YES' : '❌ NO - WOULD USE FALLBACK')
    
    if (!wouldUseCMS) {
      console.log('\n❌ PROBLEM IDENTIFIED:')
      console.log('The query returns no data or empty array!')
      console.log('This is why the about page uses static fallback data.')
    }

  } catch (error) {
    console.error('❌ QUERY FAILED:', error)
    console.log('\n💡 This explains why the about page uses static fallback data!')
  }
}

testTeamQuery()
