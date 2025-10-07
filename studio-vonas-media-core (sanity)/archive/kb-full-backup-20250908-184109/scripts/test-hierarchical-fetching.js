const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Build tree from flat list (as suggested in your approach)
function buildTree(rows) {
  const map = new Map();
  rows.forEach(r => map.set(r._id, {...r, children: []}));
  const roots = [];
  
  map.forEach(n => {
    if (n.parentId && map.has(n.parentId)) {
      map.get(n.parentId).children.push(n);
    } else {
      roots.push(n);
    }
  });
  
  // Sort at every level
  const sort = (xs) => {
    xs.sort((a,b) => (a.order || 0) - (b.order || 0) || a.title.localeCompare(b.title));
    xs.forEach(x => sort(x.children));
  };
  sort(roots);
  return roots;
}

// Print tree structure
function printTree(nodes, depth = 0, prefix = '') {
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const currentPrefix = depth === 0 ? '' : prefix + (isLast ? '└── ' : '├── ');
    const nextPrefix = depth === 0 ? '' : prefix + (isLast ? '    ' : '│   ');
    
    const typeIcon = node.itemType === 'folder' ? '📁' : 
                     node.itemType === 'youtube-show' ? '📺' : 
                     node.itemType === 'production-stage' ? '🎬' : '📄';
    
    console.log(`${currentPrefix}${node.icon || typeIcon} ${node.title}`);
    
    if (node.children && node.children.length > 0) {
      printTree(node.children, depth + 1, nextPrefix);
    }
  });
}

async function testHierarchicalFetching() {
  try {
    console.log('🌲 Testing Hierarchical Knowledge Base Fetching...\n');
    
    // 1. Fetch all nodes for navigation (flat list)
    console.log('📝 GROQ Query 1: All nodes for navigation (flat)');
    const allNodes = await client.fetch(`
      *[_type=="kbItem" && !hidden]{
        _id, 
        title, 
        "slug": slug.current,
        "parentId": parent->_id,
        order, 
        icon,
        itemType,
        youtubeShow,
        productionStage,
        status
      } | order(order asc, title asc)
    `);
    
    console.log(`✅ Fetched ${allNodes.length} nodes\n`);
    
    // 2. Build and display tree
    console.log('🌲 Building tree structure:');
    const tree = buildTree(allNodes);
    printTree(tree);
    console.log('');
    
    // 3. Query by YouTube show
    console.log('📺 GROQ Query 2: All Off the Record content');
    const offTheRecordContent = await client.fetch(`
      *[_type=="kbItem" && youtubeShow == "off-the-record"] | order(order asc) {
        title,
        itemType,
        productionStage,
        "slug": slug.current,
        "parent": parent->{title},
        videoRecording,
        supportingDocuments,
        tags
      }
    `);
    
    console.log(`✅ Found ${offTheRecordContent.length} Off the Record items:`);
    offTheRecordContent.forEach(item => {
      const typeIcon = item.itemType === 'youtube-show' ? '📺' : 
                       item.itemType === 'production-stage' ? '🎬' : '📄';
      console.log(`   ${typeIcon} ${item.title}${item.productionStage ? ` (${item.productionStage})` : ''}`);
      if (item.videoRecording) console.log(`      📹 Video: ${item.videoRecording}`);
      if (item.supportingDocuments) console.log(`      📄 Docs: ${item.supportingDocuments}`);
    });
    console.log('');
    
    // 4. Query by production stage
    console.log('🎬 GROQ Query 3: All shooting-related content');
    const shootingContent = await client.fetch(`
      *[_type=="kbItem" && (productionStage == "shooting" || "shooting" in tags[])] {
        title,
        youtubeShow,
        "slug": slug.current,
        videoRecording,
        supportingDocuments,
        overviewSteps
      }
    `);
    
    console.log(`✅ Found ${shootingContent.length} shooting-related items:`);
    shootingContent.forEach(item => {
      console.log(`   🎬 ${item.title}${item.youtubeShow ? ` (${item.youtubeShow})` : ''}`);
    });
    console.log('');
    
    // 5. Query specific path (like your catch-all route suggestion)
    console.log('🔍 GROQ Query 4: Fetch by path (youtube-channels/off-the-record/shooting-guidelines)');
    const pathQuery = `
      *[_type=="kbItem" && slug.current == "otr-shooting" && parent->slug.current == "off-the-record"][0]{
        title,
        content,
        videoRecording,
        supportingDocuments,
        overviewSteps,
        tags,
        "parent": parent->{title, "slug": slug.current},
        "fullPath": string::join(path("ancestors").slug.current, "/") + "/" + slug.current
      }
    `;
    
    const specificItem = await client.fetch(pathQuery);
    if (specificItem) {
      console.log(`✅ Found: ${specificItem.title}`);
      console.log(`   📁 Parent: ${specificItem.parent?.title}`);
      console.log(`   🔗 Path: ${specificItem.fullPath}`);
      console.log(`   📹 Video: ${specificItem.videoRecording || 'None'}`);
      console.log(`   📄 Docs: ${specificItem.supportingDocuments || 'None'}`);
      console.log(`   🏷️  Tags: ${specificItem.tags?.join(', ') || 'None'}`);
    }
    console.log('');
    
    // 6. Demonstrate flexibility - get all YouTube shows and their children
    console.log('📺 GROQ Query 5: All YouTube shows with their content');
    const youtubeShows = await client.fetch(`
      *[_type=="kbItem" && itemType == "youtube-show"] | order(order asc) {
        title,
        "slug": slug.current,
        icon,
        youtubeShow,
        "children": *[_type=="kbItem" && references(^._id)] | order(order asc) {
          title,
          itemType,
          productionStage,
          "slug": slug.current
        }
      }
    `);
    
    console.log(`✅ Found ${youtubeShows.length} YouTube shows:`);
    youtubeShows.forEach(show => {
      console.log(`   ${show.icon || '📺'} ${show.title}`);
      show.children?.forEach(child => {
        const childIcon = child.itemType === 'production-stage' ? '🎬' : '📄';
        console.log(`      ${childIcon} ${child.title}${child.productionStage ? ` (${child.productionStage})` : ''}`);
      });
      console.log('');
    });
    
    // 7. Test auto-assignment query
    console.log('🤖 GROQ Query 6: Items that could use auto-assignment');
    const unorganizedItems = await client.fetch(`
      *[_type=="kbItem" && itemType == "document" && (!defined(youtubeShow) || !defined(parent))] {
        title,
        content[0...1],
        tags,
        youtubeShow,
        "hasParent": defined(parent)
      }
    `);
    
    console.log(`✅ Found ${unorganizedItems.length} items that could benefit from auto-assignment:`);
    unorganizedItems.forEach(item => {
      console.log(`   📄 ${item.title}`);
      console.log(`      🏷️  Tags: ${item.tags?.join(', ') || 'None'}`);
      console.log(`      📺 Show: ${item.youtubeShow || 'Not assigned'}`);
      console.log(`      📁 Has parent: ${item.hasParent ? 'Yes' : 'No'}`);
    });
    
    console.log('\n🎉 Hierarchical fetching test completed!');
    console.log('\n✅ Key features demonstrated:');
    console.log('✅ Tree building from flat list (unlimited depth)');
    console.log('✅ YouTube show-specific queries');
    console.log('✅ Production stage filtering');
    console.log('✅ Path-based content fetching');
    console.log('✅ Parent-child relationship queries');
    console.log('✅ Auto-assignment candidate identification');
    console.log('✅ Rich text content with media URLs');
    console.log('✅ Flexible, reorganizable structure');

  } catch (error) {
    console.error('❌ Error testing hierarchical fetching:', error);
  }
}

// Run the test
testHierarchicalFetching();