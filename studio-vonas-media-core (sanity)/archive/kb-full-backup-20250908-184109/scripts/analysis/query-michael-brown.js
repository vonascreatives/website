const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skpuWw73xnJyKN3eYukpkUg0yzZgW3tpuUmW0oguz0Q5n57YOTHvxuUjsmj05ezFx9q5Z5kkzLtqScPMS'
});

async function queryMichaelBrown() {
  try {
    const query = `*[(_type == "creator" || _type == "exclusiveCreator") && slug.current == "michael-brown"][0]{
      _id,
      _type,
      name,
      slug,
      heroImage,
      gallery
    }`;
    
    const result = await client.fetch(query);
    console.log('Michael Brown data:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result) {
      console.log('\n--- Analysis ---');
      console.log('Document type:', result._type);
      console.log('Has heroImage:', !!result.heroImage);
      console.log('heroImage value:', result.heroImage);
      console.log('Has gallery:', !!result.gallery);
      console.log('gallery value:', result.gallery);
    } else {
      console.log('No document found for michael-brown slug');
    }
  } catch (error) {
    console.error('Error querying Sanity:', error);
  }
}

queryMichaelBrown();