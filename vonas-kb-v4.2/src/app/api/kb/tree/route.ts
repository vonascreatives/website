import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

type KBItem = {
  _id: string
  _type: 'kb'
  title: string
  slug?: { current?: string }
  kind?: 'show' | 'section' | 'page'
  parent?: { _ref: string; _type: 'reference' }
  order?: number
  description?: string
  tags?: string[]
  lastUpdated?: string
  content?: any
}

interface TreeNode {
  id: string
  kind: string
  title: string
  slug?: string
  order?: number
  children?: TreeNode[]
  // Only for pages
  description?: string
  tags?: string[]
  lastUpdated?: string
  content?: any
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const rootId = url.searchParams.get('rootId') || undefined
    const rootSlug = url.searchParams.get('rootSlug') || undefined
    if (!rootId && !rootSlug) {
      return NextResponse.json({ ok: false, error: 'Missing rootId or rootSlug' }, { status: 400 })
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'

    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

    // Resolve root doc by id or slug
    const rootDoc: KBItem | null = await client.fetch(
      `*[_type=='kb' && (${rootId ? `_id == $rootId` : ''}${rootId && rootSlug ? ' || ' : ''}${rootSlug ? `slug.current == $rootSlug` : ''})][0]{
        _id, _type, title, slug, kind, order
      }`,
      { rootId, rootSlug },
    )
    if (!rootDoc) {
      return NextResponse.json({ ok: false, error: 'Root not found' }, { status: 404 })
    }

    const rootPath = rootDoc?.slug?.current || ''

    // Fetch all descendants by slug prefix; include root itself for completeness
    const all: KBItem[] = await client.fetch(
      `*[_type=='kb' && coalesce(hidden,false) == false && !(_id in path('drafts.**'))]
       | order(coalesce(order, 100) asc, coalesce(title, slug.current) asc) {
         _id, _type, title, slug, kind, parent, order, description, tags, lastUpdated, content
       }`,
    )

    // Build index by id and by parent
    const byId = new Map(all.map(d => [d._id, d]))
    const byParent = new Map<string, KBItem[]>()
    for (const item of all) {
      const p = item.parent?._ref
      if (!p) continue
      if (!byParent.has(p)) byParent.set(p, [])
      byParent.get(p)!.push(item)
    }

    // Convert to tree recursively (arrow function to satisfy ES5 target)
    const toNode = (item: KBItem): TreeNode => {
      const node: TreeNode = {
        id: item._id,
        kind: item.kind || 'page',
        title: item.title,
        slug: item.slug?.current,
        order: item.order,
      }
      if ((item.kind || 'page') !== 'section' && (item.kind || 'page') !== 'show') {
        node.description = item.description
        node.tags = item.tags
        node.lastUpdated = item.lastUpdated
        node.content = item.content
      }
      const kids = byParent.get(item._id) || []
      if (kids.length) {
        node.children = kids.map(toNode)
      }
      return node
    }

    const tree = toNode(rootDoc)
    return NextResponse.json({ ok: true, root: { id: rootDoc._id, title: rootDoc.title, slug: rootDoc.slug?.current, kind: rootDoc.kind }, tree })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
