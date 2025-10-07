import { createClient } from '@sanity/client'

async function loadData() {
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
      | order(order asc, title asc) { _id, title, slug, description, content, parent }`,
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

export default async function KBPage() {
  const data = await loadData()
  if (!data) return <div style={{ padding: 24 }}>OTR not found</div>
  return (
    <div style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{data.show.title}</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>{data.show.slug?.current}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
        <aside style={{ borderRight: '1px solid #e5e7eb', paddingRight: 16 }}>
          {data.sectionsWithItems.map((s:any) => (
            <div key={s._id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
              <ul style={{ marginTop: 6 }}>
                {(s.items || []).map((it:any) => (
                  <li key={it._id} style={{ fontSize: 14, color: '#374151' }}>{it.title}</li>
                ))}
                {(!s.items || s.items.length === 0) && (
                  <li style={{ color: '#9ca3af', fontSize: 13 }}>(no items)</li>
                )}
              </ul>
            </div>
          ))}
        </aside>
        <main>
          <div style={{ color: '#6b7280', fontSize: 14 }}>
            Select an item on the left — this SSR view proves content is flowing correctly. The interactive UI can be re-enabled once dev assets are stable.
          </div>
        </main>
      </div>
    </div>
  )
}
