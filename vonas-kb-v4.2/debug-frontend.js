// Debug frontend data loading
import { createClient } from '@sanity/client'

console.log('🔍 Debugging Frontend Data Loading...')

// Test environment variables
console.log('Environment variables:')
console.log('NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'undefined')
console.log('NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'undefined')

// Create client with explicit values
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-09-03',
  token: process.env.SANITY_API_TOKEN,
})

console.log('Client config:')
console.log('ProjectId:', client.config().projectId)
console.log('Dataset:', client.config().dataset)

// Test queries
const queries = {
  allItems: `*[_type == "kbItem"] | order(_createdAt desc) [0..5] {
    _id, title, itemType, category, slug
  }`,
  typeSummary: `{
    "total": count(*[_type != "sanity.imageAsset" && _type != "sanity.fileAsset"]),
    "types": *[_type != "sanity.imageAsset" && _type != "sanity.fileAsset"]._type
  }`,
  pages: `*[_type == "kbItem" && itemType == "page"] {
    _id, title, slug, category
  }`,
  sections: `*[_type == "kbItem" && itemType == "section"] {
    _id, title, parentPage
  }`,
  shows: `*[_type == "youtubeShow"] | order(title asc) [0..20]{ _id, title, slug }`
  ,
  knowledgeArticles: `*[_type == "knowledgeArticle"] | order(_createdAt desc) [0..5]{
    _id, title, slug, section, category, show->{ _id, title, slug }
  }`,
  oneShow: `*[_type == "youtubeShow"][0]{...}`
}

async function runTests() {
  for (const [name, query] of Object.entries(queries)) {
    try {
      console.log(`\n📋 Testing query: ${name}`)
      const result = await client.fetch(query)
      if (Array.isArray(result)) {
        console.log(`✅ Success: Found ${result.length} items`)
        if (result.length > 0) console.log('Sample:', result[0])
      } else {
        console.log('✅ Success: Object result:', JSON.stringify(result, null, 2))
      }
    } catch (error) {
      console.error(`❌ Failed: ${error.message}`)
    }
  }
}

runTests()
