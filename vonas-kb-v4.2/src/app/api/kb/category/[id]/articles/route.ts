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
    const category = await client.fetch(`*[_type=='knowledgeCategory' && _id==$id][0]{ _id, name, slug }`, { id })
    if (!category) return NextResponse.json({ ok: false, error: 'Category not found' }, { status: 404 })

    const articles = await client.fetch(
      `*[_type == "knowledgeArticle" && category._ref == $catId]
        | order(coalesce(order, 100) asc, coalesce(title, slug.current) asc) {
          _id,
          title,
          slug,
          section,
          category->{ name, slug },
          content,
          lastUpdated,
          order,
          tags,
          type
        }`,
      { catId: id },
    )

    return NextResponse.json({ ok: true, category, articles })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}

