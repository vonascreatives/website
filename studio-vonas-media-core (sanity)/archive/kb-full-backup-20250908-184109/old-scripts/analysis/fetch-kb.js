const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01'
});

async function fetchKnowledgeBase() {
  try {
    // Query for Post-Production -> Editing content
    const postProductionQuery = `*[_type == "knowledgeBase" && parentCategory == "postproduction" && subCategory match "*Editing*"]{
      _id,
      title,
      parentCategory,
      subCategory,
      body,
      slug,
      summary,
      topic
    }`;
    
    // Query for Youtube -> Off The Record content
    const youtubeQuery = `*[_type == "knowledgeBase" && subCategory match "*Off The Record*"]{
      _id,
      title,
      parentCategory,
      subCategory,
      body,
      slug,
      summary,
      topic
    }`;
    
    console.log('=== POST-PRODUCTION -> EDITING ===');
    const postProdResults = await client.fetch(postProductionQuery);
    console.log(JSON.stringify(postProdResults, null, 2));
    
    console.log('\n=== YOUTUBE -> OFF THE RECORD ===');
    const youtubeResults = await client.fetch(youtubeQuery);
    console.log(JSON.stringify(youtubeResults, null, 2));
    
    // Also fetch all knowledge base categories to see structure
    console.log('\n=== ALL KNOWLEDGE BASE CATEGORIES ===');
    const allCategoriesQuery = `*[_type == "knowledgeBase"]{parentCategory, subCategory, title} | order(parentCategory asc)`;
    const allCategories = await client.fetch(allCategoriesQuery);
    console.log(JSON.stringify(allCategories, null, 2));
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchKnowledgeBase();
