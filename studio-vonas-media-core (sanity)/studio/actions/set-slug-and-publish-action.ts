import {useDocumentOperation, useClient} from 'sanity'
import {useEffect, useState} from 'react'
import groq from 'groq'

const slugify = (input?: string) =>
  (input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-/]/g, '')
    .replace(/[\s/]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getAncestorSlugs = async (client: any, parentId?: string | null) => {
  if (!parentId) return ''

  let id: string | null = parentId
  const slugs: string[][] = []

  while (id) {
    const parent = await client.fetch(
      groq`*[_id == $id][0]{slug, parent}`,
      {id}
    )
    const parentSlug = parent?.slug?.current as string
    const grandParentRef = parent?.parent?._ref

    if (parentSlug) {
      slugs.unshift(parentSlug.split('/').filter(Boolean))
    }
    if (grandParentRef) {
      id = grandParentRef
    } else {
      return [...new Set(slugs.flat())].join('/')
    }
  }
  return ''
}

const getChildrenIds = async (client: any, id: string, schemaType: string): Promise<string[]> => {
  if (!id) return []
  const children = await client.fetch(
    groq`*[_type == $schemaType && parent._ref == $id]{_id}`,
    {schemaType, id}
  )
  return children.map((c: {_id: string}) => c._id)
}

const updateParentsChildren = async (client: any, parentId: string, childId: string, schemaType: string) => {
  if (!parentId || !childId) return null
  const parent = await client.fetch(
    groq`*[_type == $schemaType && _id == $parentId][0]{_id, children}`,
    {schemaType, parentId}
  )
  if (!parent) return null
  const exists = parent.children?.some((id: string) => id === childId)
  if (exists) return null

  const newChildren = parent.children?.length ? [...parent.children.filter(Boolean), childId] : [childId]
  return await client.patch(parent._id).set({children: newChildren}).commit()
}

const setNewSlugForChild = async (
  client: any,
  id: string,
  slugifiedDraftTitle: string,
  slugifiedPublishedTitle: string,
  schemaType: string,
) => {
  if (!id) return

  const children = await client.fetch(
    groq`*[_type == $schemaType && (_id == $id || _id == $draftId)]{_id, slug, children}`,
    {schemaType, id, draftId: `drafts.${id}`}
  )

  if (!children.length) return

  for (const child of children as any[]) {
    let newSlug = (child.slug?.current || '').replace(slugifiedPublishedTitle, slugifiedDraftTitle)
    await client.patch(child._id).set({slug: {current: newSlug, _type: 'slug'}}).commit()

    if (child.children?.length) {
      for (const childId of child.children) {
        await setNewSlugForChild(client, childId, slugifiedDraftTitle, slugifiedPublishedTitle, schemaType)
      }
    }
  }
}

export function SetSlugAndPublishAction(props: any) {
  const client = useClient({apiVersion: '2023-01-01'})
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (isPublishing && !props.draft) setIsPublishing(false)
  }, [isPublishing, props.draft])

  return {
    disabled: Boolean(publish.disabled),
    label: isPublishing ? 'Publishing…' : 'Publish & Update',
    onHandle: async () => {
      try {
        setIsPublishing(true)
        const doc = props.draft || props.published
        // current slug and parent
        let parentsSlug = doc?.slug?.current || ''
        const parentId = doc?.parent?._ref || ''
        const schemaType = doc?._type

        const ancestors = await getAncestorSlugs(client, parentId)
        parentsSlug = ancestors
        if (parentsSlug) parentsSlug += '/'

        const newSlug = `${parentsSlug}${slugify(doc?.title as string)}`

        // Auto-assign category if youtubeShow is set but category is missing
        const patches = [{set: {slug: {_type: 'slug', current: newSlug}}}]
        
        if (doc?.youtubeShow?._ref && !doc?.category?._ref) {
          // Get YouTube Shows category ID
          const ytCategory = await client.fetch(`*[_type=="kbCategory" && slug.current=="youtube-shows"][0]{_id}`)
          if (ytCategory?._id) {
            patches.push({set: {category: {_type: 'reference', _ref: ytCategory._id}}})
          }
        }
        
        patch.execute(patches)

        if (parentId && doc?._id && schemaType) {
          const childId = doc._id.replace('drafts.', '')
          await updateParentsChildren(client, parentId, childId, schemaType)
        }

        if (doc?._id && schemaType) {
          const id = doc._id.replace('drafts.', '')
          const children = await getChildrenIds(client, id, schemaType)

          if (children?.length) {
            const slugifiedDraftTitle = slugify(props.draft?.title as string)
            const slugifiedPublishedTitle = slugify(props.published?.title as string)

            if (slugifiedDraftTitle && slugifiedPublishedTitle && slugifiedDraftTitle !== slugifiedPublishedTitle) {
              for (const childId of children) {
                await setNewSlugForChild(client, childId, slugifiedDraftTitle, slugifiedPublishedTitle, schemaType)
              }
            }

            // keep children in parent
            if (JSON.stringify(props.draft?.children || []) !== JSON.stringify(children)) {
              patch.execute([{set: {children}}])
            }
          }
        }

        publish.execute()
        props.onComplete()
      } catch (e) {
        console.error(e)
      }
    },
  }
}
