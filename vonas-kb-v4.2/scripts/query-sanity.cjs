const { createClient } = require('@sanity/client')

async function main() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5cywtc7a',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-09-03',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN || undefined,
  })
  try {
    const types = await client.fetch("array::unique(*[][_type]{_type}[]._type)")
    console.log('Types:', types)
    const kbCount = await client.fetch("count(*[_type=='kb'])")
    console.log('kb count', kbCount)
    const kbItemCount = await client.fetch("count(*[_type=='kbItem'])")
    console.log('kbItem count', kbItemCount)
    const sampleKb = await client.fetch("*[_type=='kb'][0...20]{_id,title,slug,kind,itemType,parent,category,section,tags,faqs,content,steps}")
    console.log('kb sample', JSON.stringify(sampleKb, null, 2))
    const tree = await client.fetch("*[_type=='kb']|order(_createdAt desc)[0...50]{_id,title,slug,kind,parent->{_id,title,slug,kind,parent->{_id,slug,kind}}}")
    console.log('kb tree sample', JSON.stringify(tree, null, 2))
    const cats = await client.fetch("*[_type=='knowledgeCategory']{_id,name,slug}")
    console.log('knowledgeCategory', JSON.stringify(cats, null, 2))

    const byKind = await client.fetch("{\"show\": count(*[_type=='kb' && kind=='show']), \"section\": count(*[_type=='kb' && kind=='section']), \"page\": count(*[_type=='kb' && kind=='page'])}")
    console.log('kb by kind', byKind)
    const pages = await client.fetch("*[_type=='kb' && kind=='page']|order(_createdAt desc)[0...20]{_id,title,slug,parent->{_id,title,slug,kind,parent->{_id,title,slug,kind}},kind, category-> { _id, slug, name }}")
    console.log('kb pages sample', JSON.stringify(pages, null, 2))
  } catch (e) {
    console.error('Error querying Sanity:', e.message || e)
    process.exit(1)
  }
}

main()
