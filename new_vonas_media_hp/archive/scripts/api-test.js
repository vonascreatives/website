const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function testAPI() {
  console.log('🧪 SYSTEMATIC API TESTING\n');
  
  try {
    // Test 1: Basic connection
    console.log('1. TESTING BASIC CONNECTION...');
    const basicTest = await client.fetch('*[_type == "youtubeId"][0]._id');
    console.log(basicTest ? '✅ Connection works' : '❌ Connection failed');
    
    // Test 2: Channels list data (what the /channels page uses)
    console.log('\n2. TESTING CHANNELS LIST DATA...');
    const channelsQuery = `*[_type == "youtubeId"] | order(channel_number asc) {
      _id,
      channel_number,
      category,
      channel_name,
      "name": channel_name,
      slug,
      "image": coalesce(
        visual_identity_images[0].image.asset->url,
        heroImage[0].image.asset->url,
        logoImage[0].image.asset->url,
        thumbnailExample[0].image.asset->url
      ),
      "imageAlt": coalesce(
        visual_identity_images[0].alt,
        heroImage[0].alt,
        logoImage[0].alt,
        thumbnailExample[0].alt,
        channel_name
      ),
      "about": coalesce(
        intro_description[0].children[0].text, 
        "Discover " + channel_name + " - engaging content that connects with audiences."
      ),
      channel,
      date_started,
      focus,
      cta_button_url
    }`;
    
    const channelsList = await client.fetch(channelsQuery);
    console.log(`✅ Found ${channelsList.length} channels for list page`);
    
    channelsList.forEach((ch, i) => {
      console.log(`   ${i+1}. ${ch.name} (${ch.slug?.current || 'NO SLUG'}) - Image: ${ch.image ? 'YES' : 'NO'}`);
    });
    
    // Test 3: Single channel data (what the /channels/[slug] page uses)
    console.log('\n3. TESTING SINGLE CHANNEL DATA...');
    const singleChannelQuery = `*[_type == "youtubeId" && slug.current == $slug][0]{
      _id,
      channel_number,
      category,
      channel_name,
      "intro_description_text": intro_description[0].children[0].text,
      intro_description,
      cta_button_url,
      channel,
      date_started,
      focus,
      share_links,
      visual_identity_subtitle,
      "visual_identity_description_text": visual_identity_description[0].children[0].text,
      visual_identity_description,
      visual_identity_bullets,
      typography,
      colors,
      "visual_identity_images": visual_identity_images[]{
        "url": image.asset->url,
        "alt": alt
      },
      concept_subtitle,
      "concept_text_block_1_text": concept_text_block_1[0].children[0].text,
      concept_text_block_1,
      concept_text_block_2,
      "concept_images": concept_images[]{
        "url": image.asset->url,
        "alt": alt
      }
    }`;
    
    const singleChannel = await client.fetch(singleChannelQuery, { slug: 'culture-remix' });
    
    if (singleChannel) {
      console.log('✅ Single channel query works');
      console.log(`   Name: ${singleChannel.channel_name}`);
      console.log(`   Category: ${singleChannel.category}`);
      console.log(`   Creator: ${singleChannel.channel}`);
      console.log(`   Intro text: ${singleChannel.intro_description_text || 'NO INTRO TEXT'}`);
      console.log(`   Images: ${singleChannel.visual_identity_images?.length || 0}`);
      console.log(`   CTA URL: ${singleChannel.cta_button_url || 'NO CTA'}`);
    } else {
      console.log('❌ Single channel query failed');
    }
    
    // Test 4: Suggest slug fixes
    console.log('\n4. SUGGESTED SLUG FIXES...');
    const channelsWithoutSlugs = channelsList.filter(ch => !ch.slug?.current);
    console.log(`Channels needing slugs: ${channelsWithoutSlugs.length}`);
    
    channelsWithoutSlugs.forEach(ch => {
      const suggestedSlug = ch.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      console.log(`   "${ch.name}" → suggested slug: "${suggestedSlug}"`);
    });
    
    console.log('\n🎯 SUMMARY:');
    console.log(`- Total channels: ${channelsList.length}`);
    console.log(`- Channels with slugs: ${channelsList.filter(ch => ch.slug?.current).length}`);
    console.log(`- Channels with images: ${channelsList.filter(ch => ch.image).length}`);
    console.log(`- Single page query: ${singleChannel ? 'WORKING' : 'BROKEN'}`);
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

testAPI();
