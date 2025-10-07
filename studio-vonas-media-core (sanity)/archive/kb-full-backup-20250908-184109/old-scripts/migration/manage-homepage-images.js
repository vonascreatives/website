const {createClient} = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function listHomepageImages() {
  try {
    console.log('🖼️ Fetching all homepage images from Sanity...\n');

    const images = await client.fetch(`
      *[_type == "homepageImage"] | order(category asc, displayOrder asc) {
        _id,
        title,
        category,
        placement,
        displayOrder,
        isActive,
        deviceVisibility,
        dimensions,
        originalFilename,
        usage,
        notes,
        "imageUrl": image[0].image.asset->url,
        "imageAlt": image[0].alt,
        lastUpdated
      }
    `);

    if (images.length === 0) {
      console.log('❌ No homepage images found in Sanity.');
      return;
    }

    console.log(`📊 Found ${images.length} homepage images\n`);

    // Group by category
    const categories = {};
    images.forEach(img => {
      if (!categories[img.category]) categories[img.category] = [];
      categories[img.category].push(img);
    });

    // Display organized results
    Object.entries(categories).forEach(([category, categoryImages]) => {
      const activeCount = categoryImages.filter(img => img.isActive).length;
      console.log(`📁 ${category.toUpperCase()} (${categoryImages.length} total, ${activeCount} active)`);
      console.log('=' .repeat(50));
      
      categoryImages.forEach((img, index) => {
        const status = img.isActive ? '🟢' : '🔴';
        const devices = img.deviceVisibility?.join(', ') || 'all';
        
        console.log(`${status} ${index + 1}. ${img.title}`);
        console.log(`   📍 Placement: ${img.placement}`);
        console.log(`   📱 Devices: ${devices}`);
        console.log(`   📐 Dimensions: ${img.dimensions?.width || 'N/A'}x${img.dimensions?.height || 'N/A'} (${img.dimensions?.aspectRatio || 'N/A'})`);
        console.log(`   📝 Usage: ${img.usage}`);
        console.log(`   🔗 Image URL: ${img.imageUrl || 'N/A'}`);
        console.log(`   🆔 Document ID: ${img._id}`);
        console.log(`   📄 Original File: ${img.originalFilename}`);
        if (img.notes) {
          console.log(`   💬 Notes: ${img.notes}`);
        }
        console.log('');
      });
      console.log('');
    });

    return images;

  } catch (error) {
    console.error('❌ Error fetching homepage images:', error);
  }
}

async function generateNextJSQueries() {
  try {
    console.log('🔧 Generating Next.js GROQ queries for homepage images...\n');

    const categories = ['hero', 'about', 'team', 'portfolio', 'services', 'gallery', 'testimonials'];
    
    categories.forEach(category => {
      console.log(`// ${category.toUpperCase()} SECTION IMAGES`);
      console.log(`export const get${category.charAt(0).toUpperCase() + category.slice(1)}Images = async () => {`);
      console.log(`  return await client.fetch(\`*[_type == "homepageImage" && category == "${category}" && isActive == true] | order(displayOrder asc) {`);
      console.log(`    _id,`);
      console.log(`    title,`);
      console.log(`    placement,`);
      console.log(`    displayOrder,`);
      console.log(`    deviceVisibility,`);
      console.log(`    dimensions,`);
      console.log(`    "imageUrl": image[0].image.asset->url,`);
      console.log(`    "imageAlt": image[0].alt,`);
      console.log(`    "imageCaption": image[0].caption`);
      console.log(`  }\`);`);
      console.log(`};\n`);
    });

    console.log('// GET ALL ACTIVE HOMEPAGE IMAGES');
    console.log('export const getAllActiveHomepageImages = async () => {');
    console.log('  return await client.fetch(`*[_type == "homepageImage" && isActive == true] | order(category asc, displayOrder asc) {');
    console.log('    _id,');
    console.log('    title,');
    console.log('    category,');
    console.log('    placement,');
    console.log('    displayOrder,');
    console.log('    deviceVisibility,');
    console.log('    dimensions,');
    console.log('    "imageUrl": image[0].image.asset->url,');
    console.log('    "imageAlt": image[0].alt,');
    console.log('    "imageCaption": image[0].caption');
    console.log('  }`);');
    console.log('};\n');

  } catch (error) {
    console.error('❌ Error generating queries:', error);
  }
}

async function updateImageStatus(imageId, isActive) {
  try {
    console.log(`🔄 ${isActive ? 'Activating' : 'Deactivating'} image: ${imageId}`);
    
    const result = await client
      .patch(imageId)
      .set({
        isActive: isActive,
        lastUpdated: new Date().toISOString()
      })
      .commit();
    
    console.log(`✅ Successfully updated image status`);
    return result;
  } catch (error) {
    console.error('❌ Error updating image status:', error);
  }
}

// Main CLI interface
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'list':
    listHomepageImages();
    break;
  case 'queries':
    generateNextJSQueries();
    break;
  case 'activate':
    if (args[0]) {
      updateImageStatus(args[0], true);
    } else {
      console.log('❌ Please provide an image ID');
      console.log('Usage: node manage-homepage-images.js activate <imageId>');
    }
    break;
  case 'deactivate':
    if (args[0]) {
      updateImageStatus(args[0], false);
    } else {
      console.log('❌ Please provide an image ID');
      console.log('Usage: node manage-homepage-images.js deactivate <imageId>');
    }
    break;
  default:
    console.log('🔧 Homepage Images Management Tool');
    console.log('=====================================');
    console.log('');
    console.log('Available commands:');
    console.log('  list         - List all homepage images');
    console.log('  queries      - Generate Next.js GROQ queries');
    console.log('  activate <id>   - Activate an image');
    console.log('  deactivate <id> - Deactivate an image');
    console.log('');
    console.log('Examples:');
    console.log('  node manage-homepage-images.js list');
    console.log('  node manage-homepage-images.js queries');
    console.log('  node manage-homepage-images.js activate XBGFXMpDh7tc33O1ZiNT85');
    console.log('');
}

// Check environment variables
if (!process.env.SANITY_API_TOKEN && command) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}
