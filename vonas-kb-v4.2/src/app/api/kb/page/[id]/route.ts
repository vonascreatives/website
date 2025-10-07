import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { kbSectionsForPageQuery, kbItemsForPageQuery } from '../../../../../../lib/sanity'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'
    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

    const page = await client.fetch(
      `*[_type == "kb" && _id == $id][0]{ _id, title, slug }`,
      { id },
    )
    if (!page) {
      // Path-based fallback: treat id as a slug root (e.g., "shows/otr")
      const slugRoot = id.includes('/') ? id : undefined
      if (!slugRoot) return NextResponse.json({ ok: false, error: 'Page not found' }, { status: 404 })

      const items = await client.fetch(
        `*[_type == "kb" && coalesce(hidden,false) == false && !(_id in path("drafts.**")) && kind != "show" && kind != "section" &&
            slug.current match ($root + "/*")]
          | order(order asc, title asc) {
            _id, title, slug, description, type, tags, readTime, imageUrl, videoUrl, embedCode, supportingDocs, lastUpdated, content, steps, checklist
          }`,
        { root: slugRoot },
      )

      // Derive sections from slug path segments after the root
      const sectionMap = new Map<string, any[]>()
      for (const it of items as any[]) {
        const sc = String(it?.slug?.current || '')
        const rest = sc.slice(slugRoot.length + 1) // remove root + '/'
        const seg = rest.split('/')[0] || 'overview'
        const sectionKey = `${slugRoot}/${seg}`
        if (!sectionMap.has(sectionKey)) sectionMap.set(sectionKey, [])
        sectionMap.get(sectionKey)!.push(it)
      }

      const sectionsWithItems = Array.from(sectionMap.entries()).map(([key, arr]) => ({
        _id: key,
        title: key.split('/').pop(),
        slug: { current: key },
        items: arr,
      }))
      const pageFallback = { _id: slugRoot, title: slugRoot.split('/').pop(), slug: { current: slugRoot } }
      return NextResponse.json({ ok: true, page: pageFallback, sections: [], items, sectionsWithItems })
    }

    // Prefer relationship-based resolution: sections directly under this page (show)
    const sections = await client.fetch(
      `*[_type == "kb" && kind == "section" && parent._ref == $pageId && coalesce(hidden,false) == false && !(_id in path("drafts.**"))]
        | order(order asc, title asc) { _id, title, slug, order, description, content, tags, lastUpdated }`,
      { pageId: id },
    )
    const sectionIds = (sections as any[]).map((s) => s._id)
    let items: any[] = []
    if (sectionIds.length) {
      items = await client.fetch(
        `*[_type == "kb" && coalesce(hidden,false) == false && !(_id in path("drafts.**")) && kind != "show" && kind != "section" &&
            parent._ref in $sectionIds]
          | order(order asc, title asc) {
            _id,
            title,
            slug,
            description,
            type,
            tags,
            readTime,
            imageUrl,
            videoUrl,
            embedCode,
            supportingDocs,
            lastUpdated,
            content,
            steps,
            checklist,
            parent
          }`,
        { sectionIds },
      )
    } else {
      // No explicit section docs; derive by slug under the page slug
      const root = String(page?.slug?.current || '')
      if (root) {
        items = await client.fetch(
          `*[_type == "kb" && coalesce(hidden,false) == false && !(_id in path("drafts.**")) && kind != "show" && kind != "section" &&
              slug.current match ($root + "/*")]
            | order(order asc, title asc) {
              _id, title, slug, description, type, tags, readTime, imageUrl, videoUrl, embedCode, supportingDocs, lastUpdated, content, steps, checklist
            }`,
          { root },
        )
      }
    }

    // Group items under their parent sections (by ref)
    const bySection: Record<string, any[]> = {}
    for (const s of sections as any[]) bySection[s._id] = []
    for (const it of items as any[]) {
      const ref = it?.parent?._ref
      if (ref && bySection[ref]) { bySection[ref].push(it); continue }
      // No slug fallback in KB v2 — pure parent refs
    }
    // If section docs themselves carry content, add them as an overview item for that section
    let sectionsWithItems = (sections as any[]).map((s) => {
      const itemsArr = bySection[s._id] || []
      if ((s?.content && s.content.length) || s?.description) {
        itemsArr.unshift({
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
      return { ...s, items: itemsArr }
    })

    // If still empty (no explicit sections), derive sections off slug path
    if (sectionsWithItems.length === 0 && Array.isArray(items) && items.length) {
      const root = String(page?.slug?.current || '')
      const sectionMap = new Map<string, any[]>()
      for (const it of items) {
        const sc = String(it?.slug?.current || '')
        if (!root || !sc.startsWith(root + '/')) continue
        const rest = sc.slice(root.length + 1)
        const seg = rest.split('/')[0] || 'overview'
        const sectionKey = `${root}/${seg}`
        if (!sectionMap.has(sectionKey)) sectionMap.set(sectionKey, [])
        sectionMap.get(sectionKey)!.push(it)
      }
      sectionsWithItems = Array.from(sectionMap.entries()).map(([key, arr]) => ({
        _id: key,
        title: key.split('/').pop(),
        slug: { current: key },
        items: arr,
      }))
    }

    return NextResponse.json({ ok: true, page, sections, items, sectionsWithItems })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
