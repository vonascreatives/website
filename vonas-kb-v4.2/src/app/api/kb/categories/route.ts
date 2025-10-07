import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'

    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })
    const categories = await client.fetch(`*[_type=='knowledgeCategory'] | order(name asc){ _id, name, slug }`)
    return NextResponse.json({ ok: true, data: categories })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}

