const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01'
});

async function verifyNestedStructure() {
  try {
    // Query to show the hierarchical structure
    const hierarchyQuery = `*[_type == "knowledgeBase"] | order(nestingLevel asc, parentCategory asc, subCategory asc) {
      _id,
      title,
      parentCategory,
      subCategory,
      nestingLevel,
      slug
    }`;
    
    const results = await client.fetch(hierarchyQuery);
    
    console.log('=== KNOWLEDGE BASE NESTED STRUCTURE ===\n');
    
    // Group by parent categories
    const grouped = {};
    results.forEach(item => {
      const parent = item.parentCategory || 'root';
      if (!grouped[parent]) {
        grouped[parent] = { parent: [], children: [] };
      }
      
      if (item.nestingLevel === 1) {
        grouped[parent].parent.push(item);
      } else {
        grouped[parent].children.push(item);
      }
    });
    
    // Display the hierarchy
    Object.keys(grouped).forEach(parentKey => {
      const group = grouped[parentKey];
      
      // Show parent categories
      group.parent.forEach(parent => {
        console.log(`📁 ${parent.title} (Level ${parent.nestingLevel})`);
        console.log(`   Category: ${parent.parentCategory}`);
        console.log(`   Slug: ${parent.slug.current}`);
        
        // Show children under this parent
        const children = group.children.filter(child => 
          child.parentCategory === parent.parentCategory
        );
        
        children.forEach(child => {
          console.log(`   └── 📄 ${child.title} (Level ${child.nestingLevel})`);
          console.log(`       Subcategory: ${child.subCategory}`);
          console.log(`       Slug: ${child.slug.current}`);
        });
        console.log('');
      });
    });
    
  } catch (error) {
    console.error('Error verifying structure:', error);
  }
}

verifyNestedStructure();
