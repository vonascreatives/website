import {StructureResolver} from 'sanity/structure'
import {
  DocumentsIcon,
  UsersIcon,
  StarIcon,
  CaseIcon,
  BookIcon,
  FolderIcon,
  DocumentIcon,
  PlayIcon,
  HomeIcon,
  SearchIcon,
} from '@sanity/icons'

const apiVersion = '2023-01-01'

export const deskStructure: StructureResolver = (S, context) => {
  // Helper to create KB sections dynamically
  const createKBSection = (title: string, filter: string, icon?: any) =>
    S.listItem()
      .title(title)
      .icon(icon || FolderIcon)
      .child(
        S.documentTypeList('kbItem')
          .title(title)
          .filter(filter)
          .defaultOrdering([
            {field: 'order', direction: 'asc'},
            {field: 'title', direction: 'asc'}
          ])
      )

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
              // All Documents
              S.listItem()
                .title('All Documents')
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('All KB Items')
                    .filter('_type == "kbItem"')
                ),

              S.divider(),

              // Top-level folders (no parent)
              S.listItem()
                .title('Company')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Company')
                    .filter('_type == "kbItem" && title match "Company*"')
                    .child((id: string) =>
                      S.document()
                        .documentId(id)
                        .schemaType('kbItem')
                    )
                ),

              S.listItem()
                .title('Production')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Production')
                    .filter('_type == "kbItem" && title match "Production*"')
                    .child((id: string) =>
                      S.document()
                        .documentId(id)
                        .schemaType('kbItem')
                    )
                ),

              S.listItem()
                .title('Shows')
                .icon(PlayIcon)
                .child(
                  S.list()
                    .title('Shows')
                    .items([
                      // Off The Record
                      S.listItem()
                        .title('Off The Record')
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Off The Record')
                            .filter('_type == "kbItem" && (title match "*OTR*" || title match "*Off the Record*")')
                        ),
                      // Skyline
                      S.listItem()
                        .title('Skyline')
                        .child(
                          S.documentTypeList('kbItem')
                            .title('Skyline')
                            .filter('_type == "kbItem" && title match "*Skyline*"')
                        ),
                      S.divider(),
                      // All Shows
                      S.listItem()
                        .title('All Shows')
                        .child(
                          S.documentTypeList('kbItem')
                            .title('All Shows')
                            .filter('_type == "kbItem" && kind == "show"')
                        ),
                    ])
                ),

              S.listItem()
                .title('Tools')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Tools')
                    .filter('_type == "kbItem" && title match "Tools*"')
                ),

              S.listItem()
                .title('Partners')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Partners')
                    .filter('_type == "kbItem" && title match "Partners*"')
                ),

              S.divider(),

              // Quick Filters
              S.listItem()
                .title('Pages Only')
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('All Pages')
                    .filter('_type == "kbItem" && kind == "page"')
                ),

              S.listItem()
                .title('Folders Only')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('All Folders')
                    .filter('_type == "kbItem" && kind == "section"')
                ),

              S.divider(),

              // By Document Type
              S.listItem()
                .title('By Type')
                .child(
                  S.list()
                    .title('Document Types')
                    .items([
                      createKBSection('Guides', '_type == "kbItem" && docType == "guide"'),
                      createKBSection('Checklists', '_type == "kbItem" && docType == "checklist"'),
                      createKBSection('Templates', '_type == "kbItem" && docType == "template"'),
                      createKBSection('References', '_type == "kbItem" && docType == "reference"'),
                      createKBSection('Tutorials', '_type == "kbItem" && docType == "tutorial"'),
                      createKBSection('Policies', '_type == "kbItem" && docType == "policy"'),
                    ])
                ),

              // Search
              S.listItem()
                .title('Search KB')
                .icon(SearchIcon)
                .child(
                  S.documentTypeList('kbItem')
                    .title('Search Knowledge Base')
                    .filter('_type == "kbItem"')
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
        .icon(HomeIcon)
        .child(
          S.list()
            .title('HomePage Content')
            .items([
              S.listItem()
                .title('Homepage Images')
                .child(
                  S.documentTypeList('homepageImage')
                    .title('All Homepage Images')
                ),
              S.listItem()
                .title('Job Board')
                .child(S.documentTypeList('jobBoard').title('Job Board')),
              S.listItem()
                .title('Homepage FAQs')
                .child(S.documentTypeList('faq').title('FAQs')),
              S.listItem()
                .title('Homepage Sections')
                .child(
                  S.documentTypeList('homepage')
                    .title('Homepage Sections')
                ),
              S.listItem()
                .title('Hero Content')
                .child(
                  S.documentTypeList('hero')
                    .title('Hero Content')
                ),
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
                .title('Authors')
                .child(S.documentTypeList('author').title('Authors')),
            ])
        ),
    ])
}
