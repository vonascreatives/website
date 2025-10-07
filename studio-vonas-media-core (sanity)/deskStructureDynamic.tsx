import {StructureResolver} from 'sanity/structure'
import {
  DocumentsIcon,
  FolderIcon,
  DocumentIcon,
  PlayIcon,
  BookIcon,
  StarIcon,
  TagIcon,
  SearchIcon,
} from '@sanity/icons'

export const deskStructure: StructureResolver = (S, context) => {
  return S.list()
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
              // Quick Access
              S.listItem()
                .title('📌 Quick Access')
                .child(
                  S.list()
                    .title('Quick Access')
                    .items([
                      S.listItem()
                        .title('Recent Documents')
                        .icon(DocumentIcon)
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Recent KB Items')
                            .filter('_type == "kbItem"')
                            .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('All KB Documents')
                        .icon(DocumentsIcon)
                        .child(
                          S.documentTypeList('kbItem')
                            .title('All KB Items')
                            .filter('_type == "kbItem"')
                        ),
                    ])
                ),

              S.divider(),

              // DYNAMIC STRUCTURE - Based on your actual data
              S.listItem()
                .title('📁 By Category')
                .child(
                  S.list()
                    .title('Categories')
                    .items([
                      // Dynamic categories from your actual kbCategory documents
                      ...context.schema.get('kbCategory') ? [
                        S.listItem()
                          .title('Shows')
                          .icon(PlayIcon)
                          .child(
                            S.documentTypeList('kbItem')
                              .title('Shows Documents')
                              .filter('_type == "kbItem" && category->title == "Shows"')
                          ),
                        S.listItem()
                          .title('YouTube Shows')
                          .icon(PlayIcon)
                          .child(
                            S.documentTypeList('kbItem')
                              .title('YouTube Shows Documents')
                              .filter('_type == "kbItem" && category->title == "4. 📺 YouTube Shows"')
                          ),
                      ] : [],

                      // Fallback categories based on content patterns
                      S.listItem()
                        .title('Company')
                        .icon(FolderIcon)
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Company Documents')
                            .filter('_type == "kbItem" && (title match "*Company*" || _id match "*company*")')
                        ),
                      S.listItem()
                        .title('Production')
                        .icon(FolderIcon)
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Production Documents')
                            .filter('_type == "kbItem" && (title match "*Production*" || _id match "*production*")')
                        ),
                      S.listItem()
                        .title('Shows & Content')
                        .icon(PlayIcon)
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Shows Documents')
                            .filter('_type == "kbItem" && (title match "*Show*" || _id match "*show*" || _id match "*otr*" || _id match "*skyline*" || _id match "*atb*")')
                        ),
                      S.listItem()
                        .title('Tools & Resources')
                        .icon(FolderIcon)
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Tools Documents')
                            .filter('_type == "kbItem" && (title match "*Tool*" || _id match "*tools*")')
                        ),
                      S.listItem()
                        .title('Partners')
                        .icon(FolderIcon)
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Partners Documents')
                            .filter('_type == "kbItem" && (title match "*Partner*" || _id match "*partners*")')
                        ),
                    ])
                ),

              // HIERARCHICAL VIEW - Using parent/child relationships
              S.listItem()
                .title('🌳 Tree View')
                .child(
                  S.list()
                    .title('Hierarchical View')
                    .items([
                      S.listItem()
                        .title('Root Sections')
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Top Level Items')
                            .filter('_type == "kbItem" && !defined(parent)')
                            .child((id) =>
                              S.document()
                                .documentId(id)
                                .views([
                                  S.view.form(),
                                  S.view
                                    .component(() => import('./components/TreeView'))
                                    .title('Tree View')
                                ])
                            )
                        ),
                      S.listItem()
                        .title('All Pages')
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Content Pages')
                            .filter('_type == "kbItem" && kind == "page"')
                        ),
                      S.listItem()
                        .title('All Sections')
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Section Folders')
                            .filter('_type == "kbItem" && kind == "section"')
                        ),
                    ])
                ),

              S.divider(),

              // BY DOCUMENT TYPE
              S.listItem()
                .title('📑 By Document Type')
                .child(
                  S.list()
                    .title('Document Types')
                    .items([
                      S.listItem()
                        .title('Guides')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "guide"')),
                      S.listItem()
                        .title('Checklists')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "checklist"')),
                      S.listItem()
                        .title('Templates')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "template"')),
                      S.listItem()
                        .title('References')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "reference"')),
                      S.listItem()
                        .title('About Pages')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "about"')),
                    ])
                ),

              S.divider(),

              // MANAGEMENT
              S.listItem()
                .title('⚙️ Management')
                .child(
                  S.list()
                    .title('KB Management')
                    .items([
                      S.listItem()
                        .title('Categories')
                        .child(S.documentTypeList('kbCategory').title('KB Categories')),
                      S.listItem()
                        .title('Search All')
                        .icon(SearchIcon)
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Search Knowledge Base')
                            .filter('_type == "kbItem"')
                        ),
                    ])
                ),
            ])
        ),

      S.divider(),

      // ============= OTHER CONTENT TYPES =============
      S.listItem()
        .title('Blog Posts')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('post').title('Blog Posts')),

      S.listItem()
        .title('HomePage Content')
        .child(
          S.list()
            .title('HomePage Content')
            .items([
              S.listItem()
                .title('Homepage Images')
                .child(S.documentTypeList('homepageImage').title('Homepage Images')),
              S.listItem()
                .title('Homepage FAQs')
                .child(S.documentTypeList('faq').title('FAQs')),
              S.listItem()
                .title('Job Board')
                .child(S.documentTypeList('jobBoard').title('Job Board')),
              S.listItem()
                .title('Job Tests')
                .child(S.documentTypeList('jobTests').title('Job Tests')),
              S.listItem()
                .title('Brand Collaborations')
                .child(S.documentTypeList('brandCollaboration').title('Brand Collaborations')),
              S.listItem()
                .title('Media Assets')
                .child(S.documentTypeList('mediaAsset').title('Media Assets')),
            ])
        ),

      S.listItem()
        .title('Creators & Channels')
        .child(
          S.list()
            .title('Creator Network')
            .items([
              S.listItem()
                .title('Exclusive Creators')
                .child(S.documentTypeList('exclusiveCreator').title('Exclusive Creators')),
              S.listItem()
                .title('Creators')
                .child(S.documentTypeList('creator').title('All Creators')),
              S.listItem()
                .title('Creator Reviews')
                .child(S.documentTypeList('creatorReview').title('Creator Reviews')),
              S.listItem()
                .title('YouTube Channels')
                .child(S.documentTypeList('youtubeId')),
              S.listItem()
                .title('YouTube IDs')
                .child(S.documentTypeList('youtubeId').title('YouTube IDs')),
              S.listItem()
                .title('YouTube Shows')
                .child(S.documentTypeList('youtubeShow').title('YouTube Shows')),
              S.listItem()
                .title('Shortlists')
                .child(S.documentTypeList('shortlist').title('Shortlists')),
            ])
        ),

      S.listItem()
        .title('Team')
        .child(
          S.list()
            .title('Team & People')
            .items([
              S.listItem()
                .title('Team Members')
                .child(S.documentTypeList('teamMember').title('Team Members')),
              S.listItem()
                .title('Authors')
                .child(S.documentTypeList('author').title('Authors')),
            ])
        ),

      S.listItem()
        .title('Documentation')
        .icon(BookIcon)
        .child(
          S.list()
            .title('Documentation')
            .items([
              S.listItem()
                .title('Doc Pages')
                .child(S.documentTypeList('docsPage').title('Documentation Pages')),
              S.listItem()
                .title('Doc Sections')
                .child(S.documentTypeList('docsSection').title('Documentation Sections')),
            ])
        ),
    ])
}
