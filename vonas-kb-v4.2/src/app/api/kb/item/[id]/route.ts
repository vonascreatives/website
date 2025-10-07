import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { kbItemByIdQuery } from '../../../../../../lib/sanity'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'
    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

    const item = await client.fetch(kbItemByIdQuery, { itemId: id })
    if (!item) return NextResponse.json({ ok: false, error: 'Item not found' }, { status: 404 })
    return NextResponse.json({ ok: true, data: item })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
