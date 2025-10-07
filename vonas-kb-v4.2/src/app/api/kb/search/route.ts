import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { kbSearchQuery } from '../../../../../lib/sanity'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    if (!q) return NextResponse.json({ ok: true, data: [] })

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'
    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

    // Append wildcard for GROQ match
    const data = await client.fetch(kbSearchQuery, { q: `${q}*` })
    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Search failed' }, { status: 500 })
  }
}

