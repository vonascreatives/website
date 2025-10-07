import {StructureResolver} from 'sanity/structure'
import {
  DocumentsIcon,
  UsersIcon,
  StarIcon,
  CaseIcon,
  ImageIcon,
  BookIcon,
  FolderIcon,
  DocumentIcon,
  SearchIcon,
  ClockIcon,
  TagIcon,
  UserIcon,
  PlayIcon,
  EyeOpenIcon,
  DocumentTextIcon,
  HomeIcon,
} from '@sanity/icons'
import {distinctUntilChanged, switchMap, map, combineLatest} from 'rxjs/operators'
import {Observable} from 'rxjs'
import isEqual from 'lodash/isEqual'

const apiVersion = '2023-01-01'

// Helper: Build hierarchical tree from flat list
const buildTree = (items: any[], parentId: string | null = null): any[] => {
  return items
    .filter((item) => item.parent?._ref === parentId || (!item.parent && !parentId))
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => ({
      ...item,
      children: buildTree(items, item._id),
    }))
}

// Custom Tree Component for Page Hierarchy
const PageHierarchyTree = (S: any, documentStore: any) =>
  documentStore
    .listenQuery(
      `*[_type == "kbItem" && !hidden] {
        _id,
        _type,
        title,
        slug,
        kind,
        docType,
        parent,
        order,
        audience,
        status
      }`,
      {},
      {apiVersion}
    )
    .pipe(
      distinctUntilChanged(isEqual as any),
      map((items: any[]) => {
        const tree = buildTree(items)
        
        const renderTreeItems = (nodes: any[]): any[] => {
          return nodes.map((node) => {
            const hasChildren = node.children && node.children.length > 0
            const icon = node.kind === 'page' ? DocumentIcon : 
                        node.kind === 'show' ? PlayIcon : FolderIcon
            
            if (hasChildren) {
              return S.listItem()
                .id(node._id)
                .title(node.title)
                .icon(icon)
                .child(
                  S.list()
                    .title(node.title)
                    .items([
                      // Edit this item
                      S.listItem()
                        .title('Edit This Item')
                        .icon(DocumentIcon)
                        .child(S.document().documentId(node._id).schemaType('kbItem')),
                      S.divider(),
                      // Children
                      ...renderTreeItems(node.children),
                    ])
                )
            }
            
            return S.listItem()
              .id(node._id)
              .title(node.title)
              .icon(icon)
              .child(S.document().documentId(node._id).schemaType('kbItem'))
          })
        }
        
        return S.list()
          .title('Page Hierarchy')
          .items(renderTreeItems(tree))
      })
    )

// Helper: Folder pane with combined sections and pages
const folderPane = (S: any, documentStore: any) => (folderId: string) =>
  documentStore
    .listenQuery(
      `*[_type=="kbItem" && _id==$id][0]{_id, title, slug, kind}`,
      {id: folderId},
      {apiVersion}
    )
    .pipe(
      distinctUntilChanged(isEqual as any),
      switchMap((parent: any) =>
        documentStore
          .listenQuery(
            `*[_type=="kbItem" && parent._ref==$id && !hidden]|order(order asc, title asc){
              _id, title, kind, docType, audience, status
            }`,
            {id: folderId},
            {apiVersion}
          )
          .pipe(
            distinctUntilChanged(isEqual as any),
            map((children: any[]) => {
              const sections = children.filter(c => ['section', 'folder', 'show'].includes(c?.kind))
              const pages = children.filter(c => c?.kind === 'page')
              const links = children.filter(c => c?.kind === 'link')
              
              return S.list()
                .title(parent?.title || 'Folder')
                .menuItems([
                  S.menuItem()
                    .title('Create New Page')
                    .intent({
                      type: 'create',
                      params: [
                        {type: 'kbItem'},
                        {parentId: parent?._id, kind: 'page'},
                      ],
                    }),
                  S.menuItem()
                    .title('Create New Folder')
                    .intent({
                      type: 'create',
                      params: [
                        {type: 'kbItem'},
                        {parentId: parent?._id, kind: 'folder'},
                      ],
                    }),
                ])
                .items([
                  // Folders/Sections
                  ...sections.map((child: any) =>
                    S.listItem()
                      .id(child._id)
                      .title(child.title)
                      .icon(child.kind === 'show' ? PlayIcon : FolderIcon)
                      .child(folderPane(S, documentStore)(child._id))
                  ),
                  sections.length > 0 && pages.length > 0 && S.divider(),
                  // Pages
                  ...pages.map((child: any) =>
                    S.listItem()
                      .id(child._id)
                      .title(child.title)
                      .icon(DocumentIcon)
                      .child(S.document().documentId(child._id).schemaType('kbItem'))
                  ),
                  (sections.length > 0 || pages.length > 0) && links.length > 0 && S.divider(),
                  // Links
                  ...links.map((child: any) =>
                    S.listItem()
                      .id(child._id)
                      .title(child.title)
                      .icon(LinkIcon)
                      .child(S.document().documentId(child._id).schemaType('kbItem'))
                  ),
                ].filter(Boolean))
            })
          )
      )
    )

export const deskStructure: StructureResolver = (S, context) =>
  S.list()
    .title('Vonas Media CMS')
    .items([
      // ============= KNOWLEDGE BASE =============
      S.listItem()
        .title('Knowledge Base')
        .icon(BookIcon)
        .child(
          S.list()
            .title('Knowledge Base')
            .items([
              // Root Sections
              S.listItem()
                .title('Sections')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Root Sections')
                    .filter('_type == "kbItem" && kind == "section" && !defined(parent) && !hidden')
                    .defaultOrdering([{field: 'order', direction: 'asc'}])
                    .child(folderPane(S, (context as any).documentStore))
                ),
              
              // Page Hierarchy (Tree View)
              S.listItem()
                .title('Page Hierarchy')
                .icon(HomeIcon)
                .child(PageHierarchyTree(S, (context as any).documentStore)),
              
              S.divider(),
              
              // All Documents
              S.listItem()
                .title('All Documents')
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('All KB Items')
                    .filter('_type == "kbItem"')
                ),
              
              // Drafts
              S.listItem()
                .title('Drafts')
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Draft Items')
                    .filter('_type == "kbItem" && status == "draft"')
                ),
              
              // Published
              S.listItem()
                .title('Published')
                .icon(EyeOpenIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Published Items')
                    .filter('_type == "kbItem" && status == "published"')
                ),
              
              S.divider(),
              
              // By Document Type
              S.listItem()
                .title('By Document Type')
                .icon(DocumentTextIcon)
                .child(
                  S.list()
                    .title('Document Types')
                    .items([
                      {title: 'Policies', value: 'policy'},
                      {title: 'SOPs', value: 'sop'},
                      {title: 'Guides', value: 'guide'},
                      {title: 'Templates', value: 'template'},
                      {title: 'Checklists', value: 'checklist'},
                      {title: 'FAQs', value: 'faq'},
                      {title: 'Playbooks', value: 'playbook'},
                      {title: 'Briefs', value: 'brief'},
                      {title: 'Contracts', value: 'contract'},
                      {title: 'Rate Cards', value: 'ratecard'},
                    ].map(({title, value}) =>
                      S.listItem()
                        .title(title)
                        .child(
                          S.documentTypeList('kbItem')
                            .title(title)
                            .filter(`_type == "kbItem" && docType == "${value}"`)
                            .defaultOrdering([{field: 'title', direction: 'asc'}])
                        )
                    ))
                ),
              
              // By Audience
              S.listItem()
                .title('By Audience')
                .icon(UsersIcon)
                .child(
                  S.list()
                    .title('Audience Groups')
                    .items([
                      {title: 'All', value: 'All'},
                      {title: 'Team', value: 'Team'},
                      {title: 'Interns', value: 'Interns'},
                      {title: 'Freelancers', value: 'Freelancers'},
                      {title: 'Partners', value: 'Partners'},
                    ].map(({title, value}) =>
                      S.listItem()
                        .title(title)
                        .icon(UserIcon)
                        .child(
                          S.documentTypeList('kbItem')
                            .title(`${title} Content`)
                            .filter(`_type == "kbItem" && audience == "${value}"`)
                            .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                        )
                    ))
                ),
              
              // By Show
              S.listItem()
                .title('By Show')
                .icon(PlayIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Shows')
                    .filter('_type == "kbItem" && kind == "show"')
                    .child(folderPane(S, (context as any).documentStore))
                ),
              
              S.divider(),
              
              // Recently Updated
              S.listItem()
                .title('Recently Updated')
                .icon(ClockIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Recent Updates')
                    .filter('_type == "kbItem"')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
              
              // Search
              S.listItem()
                .title('Search')
                .icon(SearchIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Search KB')
                    .filter('_type == "kbItem"')
                ),
              
              S.divider(),
              
              // Tags Management
              S.listItem()
                .title('Tags')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('kbTag')
                    .title('Manage Tags')
                ),
              
              // Legacy Categories (hidden but accessible)
              S.listItem()
                .title('Categories (Legacy)')
                .child(
                  S.documentTypeList('kbCategory')
                    .title('Legacy Categories')
                ),
            ])
        ),

      S.divider(),

      // ============= BLOG POSTS =============
      S.listItem()
        .title('Blog Posts')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('post').title('Blog Posts')),

      S.divider(),

      // ============= HOMEPAGE CONTENT =============
      S.listItem()
        .title('HomePage Content')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('HomePage Content')
            .items([
              S.listItem()
                .title('All Homepage Images')
                .child(
                  S.list()
                    .title('Images by Page')
                    .items([
                      ...['Homepage','About Us','Channels','Creators','Services','Contact','Blog','Portfolio','News','Global Assets'].map((page) =>
                        S.listItem()
                          .title(page)
                          .child(
                            S.documentTypeList('homepageImage')
                              .title(page)
                              .filter('_type == "homepageImage" && page == $page')
                              .params({page})
                              .defaultOrdering([
                                {field: 'category', direction: 'asc'},
                                {field: 'displayOrder', direction: 'asc'},
                              ])
                          )
                      )
                    ])
                ),
              S.listItem()
                .title('Job Board')
                .child(S.documentTypeList('jobBoard').title('Job Board')),
              S.listItem()
                .title('Docs Sections')
                .child(S.documentTypeList('docsSection').title('Documentation Sections')),
              S.listItem()
                .title('Docs Pages')
                .child(S.documentTypeList('docsPage').title('Documentation Pages')),
              S.listItem()
                .title('Homepage FAQs')
                .child(S.documentTypeList('faq').title('Homepage FAQs')),
            ])
        ),

      S.divider(),

      // ============= CREATORS & CHANNELS =============
      S.listItem()
        .title('Creators & Channels')
        .icon(StarIcon)
        .child(
          S.list()
            .title('Creator Network')
            .items([
              S.listItem()
                .title('Exclusive Creators')
                .child(S.documentTypeList('exclusiveCreator').title('Exclusive Creators')),
              S.listItem()
                .title('Channels')
                .child(S.documentTypeList('channel').title('Channels')),
              S.listItem()
                .title('YouTube IDs')
                .child(S.documentTypeList('youtubeId').title('YouTube IDs')),
            ])
        ),

      S.divider(),

      // ============= BUSINESS =============
      S.listItem()
        .title('Business')
        .icon(CaseIcon)
        .child(
          S.list()
            .title('Business Operations')
            .items([
              S.listItem()
                .title('Brand Collaborations')
                .child(S.documentTypeList('brandCollaboration').title('Brand Collaborations')),
            ])
        ),

      S.divider(),

      // ============= TEAM =============
      S.listItem()
        .title('Team')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Team & People')
            .items([
              S.listItem()
                .title('Team Members')
                .child(S.documentTypeList('teamMember').title('Team Members')),
              S.listItem()
                .title('Authors (Legacy)')
                .child(S.documentTypeList('author').title('Authors')),
            ])
        ),
    ])
