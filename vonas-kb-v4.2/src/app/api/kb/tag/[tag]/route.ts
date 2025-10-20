import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag: rawTag } = await params
    const tag = decodeURIComponent(rawTag)

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID 
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET 
    const token = process.env.SANITY_API_TOKEN
    const apiVersion = '2024-09-03'

    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

    const items = await client.fetch(
      `*[_type == "kb" && $tag in tags && coalesce(hidden,false) == false && !(_id in path("drafts.**"))] 
      | order(_createdAt desc) {
        _id,
        title,
        slug,
        description,
        tags,
        itemType,
        type,
        readTime,
        lastUpdated,
        _createdAt
      }`,
      { tag } as Record<string, any>
    )

    return NextResponse.json({
      ok: true,
      items,
      tag,
      count: items.length
    })
  } catch (error) {
    console.error('Error fetching items by tag:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch items by tag' },
      { status: 500 }
    )
  }
}
