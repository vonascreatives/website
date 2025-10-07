import { createClient } from '@sanity/client'

async function loadOTR() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a'
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_TOKEN
  const apiVersion = '2024-09-03'
  const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

  const show = await client.fetch(`*[_id == $id][0]{ _id, title, slug }`, { id: 'kb.shows.otr' })
  if (!show) return null

  const sections = await client.fetch(
    `*[_type == "kb" && kind == "section" && parent._ref == $showId && coalesce(hidden,false) == false && !(_id in path("drafts.**"))]
      | order(order asc, title asc) { _id, title, slug }`,
    { showId: show._id },
  )
  const sectionIds = (sections as any[]).map((s) => s._id)
  const items = await client.fetch(
    `*[_type == "kb" && coalesce(hidden,false) == false && !(_id in path("drafts.**")) && kind != "show" && kind != "section" &&
        ( parent._ref in $sectionIds || slug.current match ($showSlug + "/*") )]
      | order(order asc, title asc) {
        _id, title, slug, description, content, parent
      }`,
    { sectionIds, showSlug: show.slug?.current || '' },
  )

  const bySection: Record<string, any[]> = {}
  for (const s of sections as any[]) bySection[s._id] = []
  for (const it of items as any[]) {
    const ref = it?.parent?._ref
    if (ref && bySection[ref]) { bySection[ref].push(it); continue }
    const slug = String(it?.slug?.current || '')
    for (const s of sections as any[]) {
      const secSlug = String(s?.slug?.current || '')
      if (slug === secSlug || slug.startsWith(secSlug + '/')) { bySection[s._id].push(it); break }
    }
  }
  const sectionsWithItems = (sections as any[]).map((s) => ({ ...s, items: bySection[s._id] || [] }))
  return { show, sectionsWithItems }
}

export default async function DebugPage() {
  const data = await loadOTR()
  if (!data) return <pre>Show not found</pre>
  return (
    <div style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Debug: OTR Content</h1>
      <p style={{ color: '#555' }}>{data.show.title} ({data.show.slug?.current})</p>
      {data.sectionsWithItems.map((s:any) => (
        <div key={s._id} style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>{s.title}</h2>
          <ul>
            {(s.items || []).map((it:any) => (
              <li key={it._id} style={{ marginLeft: 12 }}>
                <strong>{it.title}</strong> — <code>{it.slug?.current}</code>
                {Array.isArray(it.content) && it.content[0]?.children?.[0]?.text && (
                  <div style={{ color: '#666', marginTop: 4 }}>{it.content[0].children[0].text}</div>
                )}
              </li>
            ))}
            {(!s.items || s.items.length === 0) && <li style={{ marginLeft: 12, color: '#999' }}>(no items)</li>}
          </ul>
        </div>
      ))}
    </div>
  )
}
