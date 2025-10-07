import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
// import { kbShowsPagesQuery } from '../../../../../lib/sanity'

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'

    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })
    // Prefer kbItem show folders under slug "shows/*"
    const pages = await client.fetch(`
      *[_type == "kb" && kind == "show" && slug.current match "shows/*" && coalesce(hidden,false) == false && !(_id in path("drafts.**"))]
      | order(order asc, title asc) { _id, title, slug, order }
    `)
    if (Array.isArray(pages) && pages.length > 0) {
      const order = ['kb.shows.otr','kb.shows.skyline','kb.shows.tatak','kb.shows.passions','kb.shows.atb']
      const idx = new Map(order.map((id,i)=>[id,i]))
      const sorted = [...pages].sort((a:any,b:any)=>{
        const ai = idx.has(a?._id) ? idx.get(a._id)! : 999
        const bi = idx.has(b?._id) ? idx.get(b._id)! : 999
        return ai - bi || (a.order??999)-(b.order??999) || String(a.title).localeCompare(String(b.title))
      })
      return NextResponse.json({ ok: true, data: sorted })
    }
    // Fallback to youtubeShow docs (deduped by slug)
    const raw = await client.fetch(`*[_type == "youtubeShow"] | order(title asc) { _id, title, slug }`)
    const seen = new Set<string>()
    const unique = [] as any[]
    for (const s of raw) {
      const key = s?.slug?.current || s?._id
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(s)
    }
    if (unique.length > 0) return NextResponse.json({ ok: true, data: unique })

    // Final fallback: derive shows from kb page slugs matching shows/*/*
    const kbPages = await client.fetch(`*[_type=="kb" && kind=="page" && slug.current match "shows/*/*"]{ slug, title }`)
    const byShow = new Map<string, { _id: string; title: string; slug: any }>()
    for (const p of kbPages as any[]) {
      const sc = String(p?.slug?.current || '')
      const parts = sc.split('/')
      if (parts.length >= 2) {
        const showKey = parts[1]
        if (!byShow.has(showKey)) {
          const showTitle = showKey.replace(/-/g,' ').replace(/^\w|\s\w/g, (m)=>m.toUpperCase())
          byShow.set(showKey, { _id: `shows/${showKey}`, title: showTitle, slug: { current: `shows/${showKey}` } })
        }
      }
    }
    return NextResponse.json({ ok: true, data: Array.from(byShow.values()) })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
