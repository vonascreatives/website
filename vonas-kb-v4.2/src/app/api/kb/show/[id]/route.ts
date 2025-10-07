import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'

    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })
    const show = await client.fetch(`*[_type == "youtubeShow" && _id == $id][0]{ _id, title, slug }`, { id })
    if (!show) return NextResponse.json({ ok: false, error: 'Show not found' }, { status: 404 })
    return NextResponse.json({ ok: true, show })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}

