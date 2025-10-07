import {StructureResolver} from 'sanity/structure'
import {
  DocumentsIcon,
  UsersIcon,
  StarIcon,
  CaseIcon,
  ImageIcon,
  BookIcon,
} from '@sanity/icons'
import {distinctUntilChanged, switchMap, map} from 'rxjs/operators'
import isEqual from 'lodash/isEqual'

const apiVersion = '2023-01-01'

// Helper: pane that shows both child folders (sections) and pages in ONE list, titled by the folder name
const folderPane = (S: any, documentStore: any) => (folderId: string) =>
  // Title pane from parent, then render children combined (sections first, then pages)
  documentStore
    .listenQuery(`*[_type=="kbItem" && _id==$id][0]{_id, title, slug}`, {id: folderId}, {apiVersion})
    .pipe(
      distinctUntilChanged(isEqual as any),
      switchMap((parent: any) =>
        documentStore
          .listenQuery(
            `*[_type=="kbItem" && parent._ref==$id]|order(order asc, title asc){_id, title, kind}`,
            {id: folderId},
            {apiVersion}
          )
          .pipe(
            distinctUntilChanged(isEqual as any),
            map((children: any[]) =>
              S.list()
                .title(parent?.title || 'Folder')
                .menuItems([
                  S.menuItem()
                    .title('Create new item')
                    .intent({
                      type: 'create',
                      params: [
                        {type: 'kbItem', template: 'kbItem-with-initial-slug'},
                        {parentId: parent?._id, parentSlug: parent?.slug?.current},
                      ],
                    }),
                ])
                .items([
                  // Subfolders (sections and shows)
                  ...children
                    .filter((c: any) => c?.kind === 'section' || c?.kind === 'show')
                    .map((child: any) =>
                      S.listItem()
                        .id(child._id)
                        .title(child.title)
                        .child(folderPane(S, documentStore)(child._id))
                    ),
                  children.some((c: any) => c?.kind === 'section' || c?.kind === 'show') && S.divider(),
                  // Pages
                  ...children
                    .filter((c: any) => c?.kind === 'page')
                    .map((child: any) =>
                      S.listItem()
                        .id(child._id)
                        .title(child.title)
                        .child(S.document().documentId(child._id).schemaType('kbItem'))
                    ),
                ].filter(Boolean))
            )
          )
      )
    )

export const deskStructure: StructureResolver = (S, context) =>
  S.list()
    .title('Vonas Media CMS')
    .items([
      // Blog Posts
      S.listItem()
        .title('Blog Posts')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('post').title('Blog Posts')),

      // Knowledge Base root - Hierarchical Structure
      S.listItem()
        .title('Knowledge Base')
        .icon(BookIcon)
        .child(
          (context as any).documentStore
            .listenQuery(
              `*[_type == "kbItem" && kind in ["section", "show"] && !defined(parent._ref)] | order(order asc, title asc) { _id, title, kind }`,
              {},
              {apiVersion}
            )
            .pipe(
              distinctUntilChanged(isEqual as any),
              map((rootFolders: any[]) =>
                S.list()
                  .title('Knowledge Base')
                  .items([
                    // Root-level folders (Company, Production, Shows, Tools, Partners)
                    ...rootFolders.map((folder: any) =>
                      S.listItem()
                        .id(folder._id)
                        .title(folder.title)
                        .child(folderPane(S, (context as any).documentStore)(folder._id))
                    ),
                    
                    S.divider(),
                    
                    // All KB Documents view
                    S.listItem()
                      .title('All KB Documents')
                      .child(
                        S.documentTypeList('kbItem')
                          .title('All KB Documents')
                          .filter('_type == "kbItem"')
                          .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                      ),
                  ])
              )
            )
        ),

      S.divider(),

      // HomePage Content
      S.listItem()
        .title('HomePage Content')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('HomePage Content')
            .items([
              // Images grouped by Page (restores folder-like navigation)
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
                                {field: 'title', direction: 'asc'},
                              ])
                          )
                      )
                    ])
                ),
              S.listItem()
                .title('Job Board')
                .child(S.documentTypeList('jobBoard').title('Job Board')),
              S.listItem()
                .title('Job Tests')
                .child(S.documentTypeList('jobTests').title('Job Tests')),
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

      // Creators & Channels
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

      // Business
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

      // Team
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
