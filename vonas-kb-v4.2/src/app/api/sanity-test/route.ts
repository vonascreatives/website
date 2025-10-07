import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { kbShowsPagesQuery, kbCompanyPagesQuery } from '../../../../lib/sanity'

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'

    const serverClient = createClient({ projectId, dataset, apiVersion, useCdn: false, token })
    const [shows, company] = await Promise.all([
      serverClient.fetch(kbShowsPagesQuery).catch(() => []),
      serverClient.fetch(kbCompanyPagesQuery).catch(() => []),
    ])
    return NextResponse.json({ ok: true, showsCount: shows.length, companyCount: company.length, sampleShow: shows[0] || null })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
