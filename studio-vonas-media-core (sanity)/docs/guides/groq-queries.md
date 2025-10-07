# Knowledge Base GROQ Queries

## 1. Fetch Node by Slug Path with Breadcrumbs

```groq
// Get node by computing full path from parent chain
*[_type == "kbItem" && slug.current == $leafSlug] {
  _id,
  title,
  slug,
  description,
  kind,
  docType,
  audience,
  status,
  modules,
  content,
  attachments,
  ai,
  
  // Get parent chain for breadcrumbs
  "breadcrumbs": [...*[_type == "kbItem" && references(^._id)] {
    _id,
    title,
    slug,
    kind,
    "parent": parent->{_id, title, slug}
  }],
  
  // Get immediate parent
  parent->{
    _id,
    title,
    slug,
    kind
  },
  
  // Get all ancestors recursively
  "ancestors": [...*[_type == "kbItem"] | 
    select(
      ^.parent._ref == _id => {_id, title, slug, order},
      ^.parent->parent._ref == _id => {_id, title, slug, order},
      ^.parent->parent->parent._ref == _id => {_id, title, slug, order},
      ^.parent->parent->parent->parent._ref == _id => {_id, title, slug, order},
      ^.parent->parent->parent->parent->parent._ref == _id => {_id, title, slug, order}
    )
  ][defined(_id)] | order(order asc),
  
  // Get tags with details
  tags[]->{
    _id,
    name,
    slug,
    category,
    color
  },
  
  // Get author details
  writtenBy->{
    _id,
    name,
    "image": image.asset->url
  }
}[0]
```

## 2. Build Sidebar Tree (Siblings + Children)

```groq
// Get siblings and children for navigation
{
  // Current node
  "current": *[_type == "kbItem" && _id == $nodeId][0] {
    _id,
    title,
    slug,
    kind,
    parent
  },
  
  // Siblings (same parent, ordered)
  "siblings": *[_type == "kbItem" && parent._ref == $parentId && !hidden] | order(order asc, title asc) {
    _id,
    title,
    slug,
    kind,
    docType,
    "isActive": _id == $nodeId
  },
  
  // Children (direct descendants)
  "children": *[_type == "kbItem" && parent._ref == $nodeId && !hidden] | order(order asc, title asc) {
    _id,
    title,
    slug,
    kind,
    docType,
    audience,
    "hasChildren": count(*[_type == "kbItem" && parent._ref == ^._id]) > 0
  },
  
  // Parent info for "up" navigation
  "parentNode": *[_type == "kbItem" && _id == $parentId][0] {
    _id,
    title,
    slug,
    parent
  }
}
```

## 3. Related Content Queries

### Automatic Related Content
```groq
// Find related content based on tags, audience, and docType
*[_type == "kbItem" 
  && _id != $currentId
  && status == "published"
  && !hidden
  && (
    // Match at least one tag
    count(tags[@._ref in $tagIds]) > 0
    || audience == $audience
    || docType == $docType
  )
] | score(
  // Scoring: more tag matches = higher score
  count(tags[@._ref in $tagIds]),
  // Boost for same audience
  audience == $audience,
  // Boost for same doc type
  docType == $docType,
  // Prefer recent updates
  _updatedAt > now() - 30*24*60*60
) | order(_score desc, _updatedAt desc) [0...$limit] {
  _id,
  title,
  slug,
  description,
  kind,
  docType,
  audience,
  "matchedTags": tags[@._ref in $tagIds]->{name, color},
  "path": select(
    count(*[_type == "kbItem" && references(^._id)]) > 0 => 
      string::join([...ancestors[]{slug.current}], "/") + "/" + slug.current,
    slug.current
  ),
  _updatedAt
}
```

### Manual Related Content
```groq
// Fetch specific items by ID
*[_type == "kbItem" && _id in $itemIds] {
  _id,
  title,
  slug,
  description,
  kind,
  docType,
  audience,
  tags[]->{name, color},
  "path": select(
    defined(parent) => parent->slug.current + "/" + slug.current,
    slug.current
  )
}
```

## 4. Recently Updated / What's New

```groq
// Get recently updated items across different audiences
{
  "allUpdates": *[_type == "kbItem" 
    && status == "published" 
    && !hidden
    && _updatedAt > now() - 7*24*60*60
  ] | order(_updatedAt desc) [0...10] {
    _id,
    title,
    slug,
    description,
    kind,
    docType,
    audience,
    _updatedAt,
    "isNew": _createdAt > now() - 7*24*60*60,
    "path": string::join([...parent->{slug.current}], "/") + "/" + slug.current
  },
  
  "byAudience": {
    "team": *[_type == "kbItem" 
      && status == "published" 
      && audience in ["All", "Team"]
      && _updatedAt > now() - 7*24*60*60
    ] | order(_updatedAt desc) [0...5] {
      title, slug, _updatedAt
    },
    
    "interns": *[_type == "kbItem" 
      && status == "published" 
      && audience in ["All", "Interns"]
      && _updatedAt > now() - 7*24*60*60
    ] | order(_updatedAt desc) [0...5] {
      title, slug, _updatedAt
    }
  }
}
```

## 5. Search-Ready Queries

```groq
// Full-text search with filtering
*[_type == "kbItem" 
  && !hidden
  && status == "published"
  && (
    title match $searchTerm + "*"
    || description match $searchTerm + "*"
    || pt::text(content) match $searchTerm + "*"
    || ai.plainText match $searchTerm + "*"
  )
  && ($audience == "all" || audience == $audience)
  && ($docType == "all" || docType == $docType)
] | order(_score desc, _updatedAt desc) [0...20] {
  _id,
  title,
  slug,
  description,
  kind,
  docType,
  audience,
  "excerpt": array::join(string::split(ai.plainText, " ")[0...30], " ") + "...",
  "highlights": select(
    title match $searchTerm + "*" => {"field": "title", "text": title},
    description match $searchTerm + "*" => {"field": "description", "text": description},
    {"field": "content", "text": array::join(string::split(ai.plainText, " ")[0...50], " ")}
  ),
  "path": [...ancestors[]{slug.current}, slug.current],
  _updatedAt
}
```

## 6. Tree Structure for Entire KB

```groq
// Get complete tree structure
*[_type == "kbItem" && !hidden] {
  _id,
  title,
  slug,
  kind,
  docType,
  audience,
  parent,
  order,
  status,
  "childCount": count(*[_type == "kbItem" && parent._ref == ^._id]),
  "path": select(
    !defined(parent) => slug.current,
    defined(parent) => parent->slug.current + "/" + slug.current
  )
} | order(coalesce(parent._ref, ""), order asc, title asc)
```

## 7. Governance Queries

```groq
// Find items needing review
*[_type == "kbItem" 
  && docType in ["policy", "sop"]
  && defined(reviewCycleDays)
  && dateTime(lastReviewedAt) < dateTime(now()) - reviewCycleDays * 24 * 60 * 60
] {
  _id,
  title,
  slug,
  docType,
  ownerTeam,
  lastReviewedAt,
  reviewCycleDays,
  "daysOverdue": round((dateTime(now()) - dateTime(lastReviewedAt)) / (24 * 60 * 60) - reviewCycleDays),
  writtenBy->{name, email}
}
```

## 8. Show-Specific Queries

```groq
// Get all content for a specific show
*[_type == "kbItem" && (kind == "show" && slug.current == $showSlug) || parent->slug.current == $showSlug] {
  _id,
  title,
  slug,
  kind,
  docType,
  order,
  "isShow": kind == "show",
  "sections": *[_type == "kbItem" && parent._ref == ^._id && kind == "folder"] | order(order asc) {
    title,
    slug,
    "pages": *[_type == "kbItem" && parent._ref == ^._id && kind == "page"] | order(order asc) {
      title,
      slug,
      docType
    }
  },
  youtubeShow->{
    _id,
    title,
    channelId
  }
}
```

## 9. Tag Cloud Query

```groq
// Get tag usage statistics
*[_type == "kbTag" && isActive] {
  _id,
  name,
  slug,
  category,
  color,
  "usageCount": count(*[_type == "kbItem" && references(^._id)]),
  "recentlyUsed": *[_type == "kbItem" && references(^._id)] | order(_updatedAt desc) [0...3] {
    title,
    slug
  }
} | order(usageCount desc)
```

## 10. Audit Queries

```groq
// Find orphaned items, duplicates, and issues
{
  "orphans": *[_type == "kbItem" && defined(parent._ref) && !defined(*[_type == "kbItem" && _id == ^.parent._ref][0])] {
    _id,
    title,
    slug,
    "invalidParent": parent._ref
  },
  
  "duplicateSlugs": *[_type == "kbItem"] {
    slug,
    parent,
    "items": *[_type == "kbItem" && slug.current == ^.slug.current && parent._ref == ^.parent._ref] {
      _id,
      title
    }
  }[count(items) > 1],
  
  "missingContent": *[_type == "kbItem" && kind == "page" && !defined(modules) && !defined(content)] {
    _id,
    title,
    slug
  },
  
  "confidentialWithAllAudience": *[_type == "kbItem" && safetyLevel == "confidential" && audience == "All"] {
    _id,
    title,
    slug
  }
}
```
