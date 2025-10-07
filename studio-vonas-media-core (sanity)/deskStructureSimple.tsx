import {StructureResolver} from 'sanity/structure'
import {
  DocumentsIcon,
  FolderIcon,
  BookIcon,
  PlayIcon,
  SearchIcon,
} from '@sanity/icons'

export const deskStructure: StructureResolver = (S) => {
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
              // SIMPLE CATEGORY-BASED STRUCTURE
              S.listItem()
                .title('Company Documents')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Company Documents')
                    .filter('_type == "kbItem" && parent._ref match "kb.company.*"')
                ),

              S.listItem()
                .title('Shows & Content')
                .icon(PlayIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Shows & Content')
                    .filter('_type == "kbItem" && parent._ref match "kb.shows.*"')
                ),

              S.listItem()
                .title('Production Workflows')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Production Workflows')
                    .filter('_type == "kbItem" && parent._ref match "kb.production.*"')
                ),

              S.listItem()
                .title('Tools & Resources')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Tools & Resources')  
                    .filter('_type == "kbItem" && parent._ref match "kb.tools.*"')
                ),

              S.listItem()
                .title('Partners & Partnerships')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Partners & Partnerships')
                    .filter('_type == "kbItem" && parent._ref match "kb.partners.*"')
                ),

              S.divider(),

              // BY DOCUMENT TYPE (SIMPLE)
              S.listItem()
                .title('📑 By Type')
                .child(
                  S.list()
                    .title('By Document Type')
                    .items([
                      S.listItem()
                        .title('Guides')
                        .child(
                          S.documentTypeList('kbItem')
                            .filter('_type == "kbItem" && docType == "guide"')
                        ),
                      S.listItem()
                        .title('Checklists')
                        .child(
                          S.documentTypeList('kbItem')
                            .filter('_type == "kbItem" && docType == "checklist"')
                        ),
                      S.listItem()
                        .title('Policies')
                        .child(
                          S.documentTypeList('kbItem')
                            .filter('_type == "kbItem" && docType == "policy"')
                        ),
                      S.listItem()
                        .title('Templates')
                        .child(
                          S.documentTypeList('kbItem')
                            .filter('_type == "kbItem" && docType == "template"')
                        ),
                    ])
                ),

              S.divider(),

              // ALL DOCUMENTS
              S.listItem()
                .title('🔍 All KB Documents')
                .icon(SearchIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('All Knowledge Base Items')
                    .filter('_type == "kbItem"')
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
                .child(S.documentTypeList('homepageImage')),
              S.listItem()
                .title('FAQs')
                .child(S.documentTypeList('faq')),
              S.listItem()
                .title('Job Board')
                .child(S.documentTypeList('jobBoard')),
              S.listItem()
                .title('Brand Collaborations')
                .child(S.documentTypeList('brandCollaboration')),
            ])
        ),

      S.listItem()
        .title('Creators & Channels')
        .child(
          S.list()
            .title('Creator Network')
            .items([
              S.listItem()
                .title('Creators')
                .child(S.documentTypeList('creator')),
      S.listItem()
        .title('YouTube Channels')
        .child(S.documentTypeList('youtubeId')),
              S.listItem()
                .title('YouTube Shows')
                .child(S.documentTypeList('youtubeShow')),
            ])
        ),

      S.listItem()
        .title('Team & People')
        .child(
          S.list()
            .items([
              S.listItem()
                .title('Team Members')
                .child(S.documentTypeList('teamMember')),
              S.listItem()
                .title('Authors')
                .child(S.documentTypeList('author')),
            ])
        ),
    ])
}
