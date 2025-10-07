// URL and Breadcrumb utilities for Knowledge Base

import {createClient} from '@sanity/client'

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
})

// Types
interface KBItem {
  _id: string
  title: string
  slug: { current: string }
  kind: 'section' | 'folder' | 'page' | 'show' | 'link'
  parent?: { _ref: string }
  order?: number
}

interface Breadcrumb {
  _id: string
  title: string
  slug: string
  path: string
  kind: string
}

/**
 * Build full URL path by traversing parent chain
 * @param item - The KB item to get path for
 * @param ancestors - Optional pre-fetched ancestors
 * @returns Full URL path like /company/policies/hr-policy
 */
export async function buildUrlPath(
  item: KBItem,
  ancestors?: KBItem[]
): Promise<string> {
  if (!item.parent?._ref) {
    // Root item
    return `/${item.slug.current}`
  }

  // If ancestors not provided, fetch them
  if (!ancestors) {
    ancestors = await fetchAncestors(item._id)
  }

  // Build path from ancestors
  const pathSegments = ancestors.map((a) => a.slug.current)
  pathSegments.push(item.slug.current)
  
  return '/' + pathSegments.join('/')
}

/**
 * Fetch all ancestors of an item in order (root to parent)
 * @param itemId - The item ID to get ancestors for
 * @returns Array of ancestors from root to immediate parent
 */
export async function fetchAncestors(itemId: string): Promise<KBItem[]> {
  const query = `
    *[_type == "kbItem" && _id == $itemId][0] {
      _id,
      "ancestors": [
        parent->{_id, title, slug, kind, order, parent},
        parent->parent->{_id, title, slug, kind, order, parent},
        parent->parent->parent->{_id, title, slug, kind, order, parent},
        parent->parent->parent->parent->{_id, title, slug, kind, order, parent},
        parent->parent->parent->parent->parent->{_id, title, slug, kind, order, parent}
      ][defined(_id)]
    }
  `
  
  const result = await client.fetch(query, {itemId})
  
  if (!result?.ancestors) return []
  
  // Reverse to get root-first order
  return result.ancestors.reverse()
}

/**
 * Generate breadcrumbs for navigation
 * @param itemId - Current item ID
 * @returns Array of breadcrumb objects with paths
 */
export async function generateBreadcrumbs(itemId: string): Promise<Breadcrumb[]> {
  const query = `
    *[_type == "kbItem" && _id == $itemId][0] {
      _id,
      title,
      slug,
      kind,
      "ancestors": [
        parent->{_id, title, slug, kind},
        parent->parent->{_id, title, slug, kind},
        parent->parent->parent->{_id, title, slug, kind},
        parent->parent->parent->parent->{_id, title, slug, kind},
        parent->parent->parent->parent->parent->{_id, title, slug, kind}
      ][defined(_id)]
    }
  `
  
  const item = await client.fetch(query, {itemId})
  
  if (!item) return []
  
  const breadcrumbs: Breadcrumb[] = []
  const ancestors = item.ancestors?.reverse() || []
  
  // Build breadcrumbs with cumulative paths
  let currentPath = ''
  
  // Add home
  breadcrumbs.push({
    _id: 'home',
    title: 'Knowledge Base',
    slug: '',
    path: '/kb',
    kind: 'root'
  })
  
  // Add ancestors
  for (const ancestor of ancestors) {
    currentPath += '/' + ancestor.slug.current
    breadcrumbs.push({
      _id: ancestor._id,
      title: ancestor.title,
      slug: ancestor.slug.current,
      path: '/kb' + currentPath,
      kind: ancestor.kind
    })
  }
  
  // Add current item
  currentPath += '/' + item.slug.current
  breadcrumbs.push({
    _id: item._id,
    title: item.title,
    slug: item.slug.current,
    path: '/kb' + currentPath,
    kind: item.kind
  })
  
  return breadcrumbs
}

/**
 * Resolve a document by its path segments
 * @param pathSegments - Array of slug segments like ['company', 'policies', 'hr-policy']
 * @returns The matching KB item or null
 */
export async function resolveByPath(pathSegments: string[]): Promise<KBItem | null> {
  if (pathSegments.length === 0) return null
  
  let currentParentId: string | null = null
  let currentItem: KBItem | null = null
  
  // Traverse path segments
  for (const segment of pathSegments) {
    const query = currentParentId
      ? `*[_type == "kbItem" && slug.current == $slug && parent._ref == $parentId][0]`
      : `*[_type == "kbItem" && slug.current == $slug && !defined(parent)][0]`
    
    const params = currentParentId
      ? {slug: segment, parentId: currentParentId}
      : {slug: segment}
    
    currentItem = await client.fetch(query, params)
    
    if (!currentItem) {
      return null // Path not found
    }
    
    currentParentId = currentItem._id
  }
  
  return currentItem
}

/**
 * Get sibling items (same parent)
 * @param itemId - Current item ID
 * @returns Array of sibling items
 */
export async function getSiblings(itemId: string): Promise<KBItem[]> {
  const query = `
    *[_type == "kbItem" && _id == $itemId][0] {
      parent
    }
  `
  
  const item = await client.fetch(query, {itemId})
  
  if (!item) return []
  
  const siblingsQuery = item.parent?._ref
    ? `*[_type == "kbItem" && parent._ref == $parentId && _id != $itemId && !hidden] | order(order asc, title asc)`
    : `*[_type == "kbItem" && !defined(parent) && _id != $itemId && !hidden] | order(order asc, title asc)`
  
  const params = item.parent?._ref
    ? {parentId: item.parent._ref, itemId}
    : {itemId}
  
  return await client.fetch(siblingsQuery, params)
}

/**
 * Check if a slug is unique among siblings
 * @param slug - The slug to check
 * @param parentId - Parent ID (null for root items)
 * @param excludeId - Item ID to exclude (for updates)
 * @returns True if slug is unique
 */
export async function isSlugUnique(
  slug: string,
  parentId: string | null,
  excludeId?: string
): Promise<boolean> {
  const query = parentId
    ? `count(*[_type == "kbItem" && slug.current == $slug && parent._ref == $parentId && _id != $excludeId])`
    : `count(*[_type == "kbItem" && slug.current == $slug && !defined(parent) && _id != $excludeId])`
  
  const params = {
    slug,
    parentId,
    excludeId: excludeId || ''
  }
  
  const count = await client.fetch(query, params)
  return count === 0
}

/**
 * Build a navigation tree for sidebar
 * @param currentId - Current item ID for highlighting
 * @param maxDepth - Maximum depth to traverse
 * @returns Tree structure for navigation
 */
export async function buildNavTree(
  currentId?: string,
  maxDepth: number = 3
): Promise<any> {
  const query = `
    {
      "roots": *[_type == "kbItem" && !defined(parent) && !hidden] | order(order asc, title asc) {
        _id,
        title,
        slug,
        kind,
        "isActive": _id == $currentId,
        "hasChildren": count(*[_type == "kbItem" && parent._ref == ^._id]) > 0
      }
    }
  `
  
  const result = await client.fetch(query, {currentId})
  
  // Recursively fetch children if needed
  const fetchChildren = async (parentId: string, depth: number): Promise<any[]> => {
    if (depth >= maxDepth) return []
    
    const childQuery = `
      *[_type == "kbItem" && parent._ref == $parentId && !hidden] | order(order asc, title asc) {
        _id,
        title,
        slug,
        kind,
        "isActive": _id == $currentId,
        "hasChildren": count(*[_type == "kbItem" && parent._ref == ^._id]) > 0
      }
    `
    
    const children = await client.fetch(childQuery, {parentId, currentId})
    
    // Fetch grandchildren for each child
    for (const child of children) {
      if (child.hasChildren) {
        child.children = await fetchChildren(child._id, depth + 1)
      }
    }
    
    return children
  }
  
  // Fetch children for root items
  for (const root of result.roots) {
    if (root.hasChildren) {
      root.children = await fetchChildren(root._id, 1)
    }
  }
  
  return result.roots
}

/**
 * Helper: Check for circular references
 * @param itemId - Item to check
 * @param newParentId - Proposed new parent
 * @returns True if setting parent would create a cycle
 */
export async function wouldCreateCycle(
  itemId: string,
  newParentId: string
): Promise<boolean> {
  if (itemId === newParentId) return true
  
  const ancestors = await fetchAncestors(newParentId)
  return ancestors.some(a => a._id === itemId)
}

/**
 * Calculate depth of an item in the tree
 * @param itemId - Item ID
 * @returns Depth (0 for root items)
 */
export async function getItemDepth(itemId: string): Promise<number> {
  const ancestors = await fetchAncestors(itemId)
  return ancestors.length
}
