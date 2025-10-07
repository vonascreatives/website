/**
 * Webhook handler for AI processing and vector DB upsert
 * Triggered on kbItem publish events
 * 
 * Deploy as serverless function (Vercel, Netlify, etc.)
 * Set webhook URL in Sanity: https://your-api.com/api/webhook-ai-upsert
 */

import {createClient} from '@sanity/client'
import {WeaviateClient} from 'weaviate-ts-client'
import {QdrantClient} from '@qdrant/js-client-rest'
import OpenAI from 'openai'

// Environment variables (set in .env or serverless config)
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID!
const SANITY_DATASET = process.env.SANITY_DATASET || 'production'
const SANITY_TOKEN = process.env.SANITY_API_READ_TOKEN!
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!
const VECTOR_DB_TYPE = process.env.VECTOR_DB_TYPE || 'weaviate' // 'weaviate' or 'qdrant'
const WEAVIATE_URL = process.env.WEAVIATE_URL || 'http://localhost:8080'
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333'
const QDRANT_API_KEY = process.env.QDRANT_API_KEY
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
const EMBEDDING_DIM = parseInt(process.env.EMBEDDING_DIM || '768')
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET // For validation

// Initialize clients
const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: false,
})

const openai = new OpenAI({apiKey: OPENAI_API_KEY})

// Vector DB clients (initialize based on type)
let weaviateClient: WeaviateClient | null = null
let qdrantClient: QdrantClient | null = null

if (VECTOR_DB_TYPE === 'weaviate') {
  weaviateClient = new WeaviateClient({
    scheme: WEAVIATE_URL.includes('https') ? 'https' : 'http',
    host: WEAVIATE_URL.replace(/https?:\/\//, ''),
  })
} else if (VECTOR_DB_TYPE === 'qdrant') {
  qdrantClient = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
  })
}

// Types
interface WebhookPayload {
  _id: string
  _type: string
  _rev: string
  _updatedAt: string
}

interface ProcessedContent {
  plainText: string
  summary: string
  keywords: string[]
  entities: string[]
  qa: Array<{question: string; answer: string}>
  chunks: Array<{
    anchorId: string
    heading: string
    plainText: string
    order: number
    tokensApprox: number
    embedding?: number[]
  }>
}

/**
 * Extract plain text from modules
 */
function extractPlainTextFromModules(modules: any[]): string {
  if (!modules || !Array.isArray(modules)) return ''
  
  let text = ''
  
  for (const module of modules) {
    switch (module._type) {
      case 'richTextModule':
        text += extractFromPortableText(module.content) + '\n\n'
        break
      case 'heroModule':
        text += `${module.heading}\n${module.subheading || ''}\n\n`
        break
      case 'quoteModule':
        text += `"${module.text}" - ${module.author || 'Anonymous'}\n\n`
        break
      case 'stepsModule':
        if (module.title) text += `${module.title}\n`
        module.steps?.forEach((step: any, i: number) => {
          text += `${i + 1}. ${step.title}\n`
          text += extractFromPortableText(step.content) + '\n'
        })
        text += '\n'
        break
      case 'checklistModule':
        if (module.title) text += `${module.title}\n`
        module.items?.forEach((item: any) => {
          text += `☐ ${item.label}`
          if (item.description) text += ` - ${item.description}`
          text += '\n'
        })
        text += '\n'
        break
      case 'faqListModule':
        if (module.title) text += `${module.title}\n`
        module.manualItems?.forEach((faq: any) => {
          text += `Q: ${faq.question}\n`
          text += `A: ${extractFromPortableText(faq.answer)}\n\n`
        })
        break
      case 'videoAnnotationsModule':
        if (module.title) text += `${module.title}\n`
        if (module.transcript) text += module.transcript + '\n\n'
        break
    }
  }
  
  return text.trim()
}

/**
 * Extract plain text from Portable Text blocks
 */
function extractFromPortableText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks
    .map(block => {
      if (block._type === 'block') {
        return block.children
          ?.map((child: any) => child.text)
          ?.join('') || ''
      }
      return ''
    })
    .join('\n')
}

/**
 * Create text chunks for vector search
 */
function createChunks(text: string, maxTokens: number = 500): ProcessedContent['chunks'] {
  const chunks: ProcessedContent['chunks'] = []
  const paragraphs = text.split(/\n\n+/)
  
  let currentChunk = ''
  let currentTokens = 0
  let chunkIndex = 0
  
  for (const para of paragraphs) {
    const paraTokens = Math.ceil(para.length / 4) // Rough estimate
    
    if (currentTokens + paraTokens > maxTokens && currentChunk) {
      // Save current chunk
      chunks.push({
        anchorId: `chunk-${chunkIndex}`,
        heading: extractHeading(currentChunk),
        plainText: currentChunk.trim(),
        order: chunkIndex,
        tokensApprox: currentTokens,
      })
      chunkIndex++
      currentChunk = para
      currentTokens = paraTokens
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para
      currentTokens += paraTokens
    }
  }
  
  // Add final chunk
  if (currentChunk) {
    chunks.push({
      anchorId: `chunk-${chunkIndex}`,
      heading: extractHeading(currentChunk),
      plainText: currentChunk.trim(),
      order: chunkIndex,
      tokensApprox: currentTokens,
    })
  }
  
  return chunks
}

/**
 * Extract heading from chunk text
 */
function extractHeading(text: string): string {
  const lines = text.split('\n')
  const firstNonEmpty = lines.find(l => l.trim())
  return firstNonEmpty?.substring(0, 100) || ''
}

/**
 * Generate AI metadata using OpenAI
 */
async function generateAIMetadata(text: string, title: string): Promise<Partial<ProcessedContent>> {
  try {
    // Generate summary
    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise summaries of knowledge base articles.',
        },
        {
          role: 'user',
          content: `Summarize this knowledge base article titled "${title}" in 2-3 sentences:\n\n${text.substring(0, 3000)}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    })
    
    const summary = summaryResponse.choices[0].message.content || ''
    
    // Extract keywords and entities
    const extractionResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Extract keywords and named entities from text. Return JSON with "keywords" and "entities" arrays.',
        },
        {
          role: 'user',
          content: `Extract from this text:\n\n${text.substring(0, 3000)}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.2,
      response_format: {type: 'json_object'},
    })
    
    const extraction = JSON.parse(extractionResponse.choices[0].message.content || '{}')
    
    // Generate Q&A pairs
    const qaResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Generate 2-3 Q&A pairs that could be answered by this content. Return JSON with "qa" array containing "question" and "answer" objects.',
        },
        {
          role: 'user',
          content: `Generate Q&A from:\n\n${text.substring(0, 3000)}`,
        },
      ],
      max_tokens: 400,
      temperature: 0.4,
      response_format: {type: 'json_object'},
    })
    
    const qaData = JSON.parse(qaResponse.choices[0].message.content || '{}')
    
    return {
      summary,
      keywords: extraction.keywords || [],
      entities: extraction.entities || [],
      qa: qaData.qa || [],
    }
  } catch (error) {
    console.error('Error generating AI metadata:', error)
    return {
      summary: '',
      keywords: [],
      entities: [],
      qa: [],
    }
  }
}

/**
 * Generate embeddings for chunks
 */
async function generateEmbeddings(chunks: ProcessedContent['chunks']): Promise<void> {
  try {
    for (const chunk of chunks) {
      const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: chunk.plainText,
      })
      
      chunk.embedding = response.data[0].embedding
    }
  } catch (error) {
    console.error('Error generating embeddings:', error)
  }
}

/**
 * Upsert to Weaviate
 */
async function upsertToWeaviate(
  docId: string,
  doc: any,
  chunks: ProcessedContent['chunks']
): Promise<void> {
  if (!weaviateClient) return
  
  const className = 'KnowledgeBase'
  
  // Ensure class exists
  try {
    await weaviateClient.schema
      .classCreator()
      .withClass({
        class: className,
        vectorizer: 'none', // We provide our own vectors
        properties: [
          {name: 'kbItemId', dataType: ['string']},
          {name: 'path', dataType: ['string']},
          {name: 'title', dataType: ['string']},
          {name: 'content', dataType: ['text']},
          {name: 'chunkIndex', dataType: ['int']},
          {name: 'kind', dataType: ['string']},
          {name: 'docType', dataType: ['string']},
          {name: 'audience', dataType: ['string']},
          {name: 'tags', dataType: ['string[]']},
          {name: 'safetyLevel', dataType: ['string']},
          {name: 'updatedAt', dataType: ['date']},
        ],
      })
      .do()
  } catch (error) {
    // Class might already exist
  }
  
  // Delete existing chunks for this document
  await weaviateClient.batch
    .objectsBatchDeleter()
    .withClassName(className)
    .withWhere({
      path: ['kbItemId'],
      operator: 'Equal',
      valueString: docId,
    })
    .do()
  
  // Insert new chunks
  const objects = chunks.map(chunk => ({
    class: className,
    properties: {
      kbItemId: docId,
      path: doc.path || '',
      title: doc.title,
      content: chunk.plainText,
      chunkIndex: chunk.order,
      kind: doc.kind,
      docType: doc.docType,
      audience: doc.audience,
      tags: doc.tags?.map((t: any) => t.name) || [],
      safetyLevel: doc.safetyLevel,
      updatedAt: new Date().toISOString(),
    },
    vector: chunk.embedding,
  }))
  
  await weaviateClient.batch
    .objectsBatcher()
    .withObjects(objects)
    .do()
}

/**
 * Upsert to Qdrant
 */
async function upsertToQdrant(
  docId: string,
  doc: any,
  chunks: ProcessedContent['chunks']
): Promise<void> {
  if (!qdrantClient) return
  
  const collectionName = 'knowledge_base'
  
  // Ensure collection exists
  try {
    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: EMBEDDING_DIM,
        distance: 'Cosine',
      },
    })
  } catch (error) {
    // Collection might already exist
  }
  
  // Delete existing points for this document
  await qdrantClient.delete(collectionName, {
    filter: {
      must: [
        {
          key: 'kb_item_id',
          match: {value: docId},
        },
      ],
    },
  })
  
  // Insert new points
  const points = chunks.map((chunk, i) => ({
    id: `${docId}-${i}`,
    vector: chunk.embedding!,
    payload: {
      kb_item_id: docId,
      path: doc.path || '',
      title: doc.title,
      content: chunk.plainText,
      chunk_index: chunk.order,
      kind: doc.kind,
      doc_type: doc.docType,
      audience: doc.audience,
      tags: doc.tags?.map((t: any) => t.name) || [],
      safety_level: doc.safetyLevel,
      updated_at: new Date().toISOString(),
    },
  }))
  
  await qdrantClient.upsert(collectionName, {
    wait: true,
    points,
  })
}

/**
 * Main webhook handler
 */
export default async function handler(req: any, res: any) {
  // Validate webhook secret
  const signature = req.headers['x-sanity-signature']
  if (WEBHOOK_SECRET && signature !== WEBHOOK_SECRET) {
    return res.status(401).json({error: 'Invalid signature'})
  }
  
  // Parse webhook payload
  const payload: WebhookPayload = req.body
  
  if (payload._type !== 'kbItem') {
    return res.status(200).json({message: 'Not a kbItem, skipping'})
  }
  
  console.log(`Processing kbItem: ${payload._id}`)
  
  try {
    // Fetch full document from Sanity
    const doc = await sanityClient.fetch(
      `*[_type == "kbItem" && _id == $id][0] {
        _id,
        title,
        slug,
        description,
        kind,
        docType,
        audience,
        safetyLevel,
        status,
        modules,
        content,
        tags[]->{name, slug},
        "path": select(
          !defined(parent) => slug.current,
          defined(parent) => parent->slug.current + "/" + slug.current
        )
      }`,
      {id: payload._id}
    )
    
    if (!doc || doc.status !== 'published' || doc.hidden) {
      return res.status(200).json({message: 'Document not published or hidden'})
    }
    
    // Extract plain text
    const plainText = doc.modules 
      ? extractPlainTextFromModules(doc.modules)
      : extractFromPortableText(doc.content || [])
    
    if (!plainText) {
      return res.status(200).json({message: 'No content to process'})
    }
    
    // Create chunks
    const chunks = createChunks(plainText)
    
    // Generate AI metadata
    const aiMetadata = await generateAIMetadata(plainText, doc.title)
    
    // Generate embeddings
    await generateEmbeddings(chunks)
    
    // Prepare processed content
    const processedContent: ProcessedContent = {
      plainText,
      summary: aiMetadata.summary || '',
      keywords: aiMetadata.keywords || [],
      entities: aiMetadata.entities || [],
      qa: aiMetadata.qa || [],
      chunks,
    }
    
    // Update Sanity document with AI metadata
    await sanityClient
      .patch(doc._id)
      .set({
        ai: {
          plainText: processedContent.plainText,
          summary: processedContent.summary,
          keywords: processedContent.keywords,
          entities: processedContent.entities,
          qa: processedContent.qa,
          chunks: processedContent.chunks.map(c => ({
            _key: c.anchorId,
            anchorId: c.anchorId,
            heading: c.heading,
            plainText: c.plainText,
            order: c.order,
            tokensApprox: c.tokensApprox,
          })),
          embeddingDimension: EMBEDDING_DIM,
          lastProcessedAt: new Date().toISOString(),
        },
      })
      .commit()
    
    // Upsert to vector database
    if (VECTOR_DB_TYPE === 'weaviate') {
      await upsertToWeaviate(doc._id, doc, chunks)
    } else if (VECTOR_DB_TYPE === 'qdrant') {
      await upsertToQdrant(doc._id, doc, chunks)
    }
    
    console.log(`Successfully processed ${doc._id} with ${chunks.length} chunks`)
    
    return res.status(200).json({
      success: true,
      documentId: doc._id,
      chunksProcessed: chunks.length,
      vectorDb: VECTOR_DB_TYPE,
    })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return res.status(500).json({
      error: 'Processing failed',
      details: error.message,
    })
  }
}
