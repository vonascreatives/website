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

    // Load the show by id; can be kb or youtubeShow
    const show = await client.fetch(`*[_id == $id][0]{ _id, _type, title, slug }`, { id })
    if (!show) return NextResponse.json({ ok: false, error: 'Show not found' }, { status: 404 })

    const showSlug: string = show.slug?.current || ''
    if (show._type === 'kb' && showSlug.startsWith('shows/')) {
      const sections = await client.fetch(
        `*[_type == "kb" && kind == "section" && parent._ref == $showId && coalesce(hidden,false) == false && !(_id in path("drafts.**"))]
          | order(order asc, title asc) { _id, title, slug, order, description, content, tags, lastUpdated }`,
        { showId: id },
      )
      const sectionIds = (sections as any[]).map((s) => s._id)
      const items = await client.fetch(
        `*[_type == "kb" && coalesce(hidden,false) == false && !(_id in path("drafts.**")) && kind != "show" && kind != "section" &&
            parent._ref in $sectionIds]
          | order(order asc, title asc) {
            _id,
            title,
            slug,
            description,
            tags,
            order,
            content,
            lastUpdated,
            videoUrl,
            embedCode,
            steps,
            checklist,
            parent
          }`,
        { sectionIds },
      )

      // Group items and include section-overview content when present
      const bySection: Record<string, any[]> = {}
      for (const s of sections as any[]) bySection[s._id] = []
      for (const it of items as any[]) {
        const ref = it?.parent?._ref
        if (ref && bySection[ref]) { bySection[ref].push(it); continue }
        // No slug fallback in KB v2 — pure parent refs
      }
      const sectionsWithItems = (sections as any[]).map((s) => {
        const arr = bySection[s._id] || []
        if ((s?.content && s.content.length) || s?.description) {
          arr.unshift({
            _id: s._id,
            title: s.title,
            slug: s.slug,
            description: s.description,
            content: s.content,
            tags: s.tags,
            lastUpdated: s.lastUpdated,
            parent: { _ref: s._id, _type: 'reference' },
          })
        }
        return { ...s, items: arr }
      })

      return NextResponse.json({ ok: true, show, sections, items, sectionsWithItems })
    }

    // Legacy path: knowledgeArticle linked to youtubeShow
    const articles = await client.fetch(
      `*[_type == "knowledgeArticle" && (show._ref == $showId || show->slug.current == $showSlug)]
        | order(coalesce(order, 100) asc, coalesce(title, slug.current) asc) {
          _id,
          title,
          slug,
          section,
          category->{ title },
          content,
          lastUpdated,
          order,
          tags,
          type
        }`,
      { showId: id, showSlug },
    )
    let merged = articles || []
    if ((!merged || merged.length === 0) && showSlug) {
      const acronym = showSlug.split('-').map(s=>s[0]).join('').toLowerCase()
      const compact = showSlug.replace(/-/g,'')
      const p1 = `*${acronym}*`
      const p2 = `*${showSlug}*`
      const p3 = `*${compact}*`
      const kbItems = await client.fetch(
        `*[_type == "kb" && coalesce(hidden,false) == false && !(_id in path("drafts.**")) && (slug.current match $p1 || slug.current match $p2 || slug.current match $p3)]
          | order(coalesce(order, 100) asc, coalesce(title, slug.current) asc) {
            _id,
            title,
            slug,
            section,
            content,
            lastUpdated,
            order,
            tags,
            type
          }`,
        { p1, p2, p3 }
      )
      merged = kbItems || []
    }

    return NextResponse.json({ ok: true, show, articles: merged })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
