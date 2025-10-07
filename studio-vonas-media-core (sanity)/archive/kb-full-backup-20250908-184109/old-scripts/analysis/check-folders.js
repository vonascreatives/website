const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01'
});

async function checkFolders() {
  try {
    // Check for existing folder structure
    const folderQuery = `*[_type == "sanity.folder"]{
      _id,
      title,
      name,
      parent
    }`;
    
    console.log('=== EXISTING FOLDERS ===');
    const folders = await client.fetch(folderQuery);
    console.log(JSON.stringify(folders, null, 2));
    
    // Check all document types to understand structure
    const typesQuery = `*[]{_type} | order(_type) | {_type}[0...20]`;
    console.log('\n=== DOCUMENT TYPES ===');
    const types = await client.fetch(typesQuery);
    console.log(JSON.stringify(types, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkFolders();
