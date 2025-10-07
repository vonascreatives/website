import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'

    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })
    const pages = await client.fetch(`
      *[_type == "kb" && coalesce(hidden,false) == false && !(_id in path("drafts.**")) &&
        defined(kind) && kind == "page" &&
        (category->slug.current == "team-management" || slug.current match "team/*")
      ]
      | order(order asc, title asc) { _id, title, slug, order }
    `)
    return NextResponse.json({ ok: true, data: pages })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
