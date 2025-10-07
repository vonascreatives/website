const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-01-01'
});

async function updateKnowledgeBaseFolders() {
  try {
    // Update Post-Production document to be in the Editing subfolder
    const postProdUpdate = await client
      .patch('kb-postproduction-editing')
      .set({
        '_folder': {
          _type: 'reference',
          _ref: 'folder-postproduction-editing'
        }
      })
      .commit();
    
    console.log('Updated Post-Production Editing:', postProdUpdate._id);

    // Update YouTube document to be in the Off The Record subfolder
    const youtubeUpdate = await client
      .patch('kb-youtube-offtherecord')
      .set({
        '_folder': {
          _type: 'reference',
          _ref: 'folder-youtube-offtherecord'
        }
      })
      .commit();
    
    console.log('Updated YouTube Off The Record:', youtubeUpdate._id);

    // Verify the folder structure
    const foldersQuery = `*[_type == "sanity.folder"] | order(title) {
      _id,
      title,
      name,
      parent
    }`;
    
    console.log('\n=== FOLDER STRUCTURE ===');
    const folders = await client.fetch(foldersQuery);
    console.log(JSON.stringify(folders, null, 2));

    // Check documents in folders
    const docsInFoldersQuery = `*[defined(_folder)] {
      _id,
      title,
      _folder
    }`;
    
    console.log('\n=== DOCUMENTS IN FOLDERS ===');
    const docsInFolders = await client.fetch(docsInFoldersQuery);
    console.log(JSON.stringify(docsInFolders, null, 2));
    
  } catch (error) {
    console.error('Error updating folders:', error);
  }
}

updateKnowledgeBaseFolders();
