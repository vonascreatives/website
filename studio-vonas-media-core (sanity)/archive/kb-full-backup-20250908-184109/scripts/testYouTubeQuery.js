import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
})

const query = `*[_type == "youtubeId"]{
  _id,
  channel_number,
  category,
  channel_name,
  "heroImage": heroImage[0].image.asset->url,
  "heroImageAlt": heroImage[0].alt,
  "logoImage": logoImage[0].image.asset->url,
  "logoImageAlt": logoImage[0].alt,
  "thumbnailImage": thumbnailExample[0].image.asset->url,
  "thumbnailImageAlt": thumbnailExample[0].alt,
  "image": coalesce(heroImage[0].image.asset->url, visual_identity_images[0].image.asset->url),
  "imageAlt": coalesce(heroImage[0].alt, visual_identity_images[0].alt),
  cta_button_url,
  channel,
  date_started,
  slug
} | order(channel_number asc)[0...10]`

async function testQuery() {
  try {
    console.log('Testing YouTube ID query...')
    const result = await client.fetch(query)
    console.log('Result:', JSON.stringify(result, null, 2))
    console.log('Total found:', result.length)
  } catch (error) {
    console.error('Query error:', error)
  }
}

testQuery()
