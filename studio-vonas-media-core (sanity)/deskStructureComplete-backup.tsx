import {StructureResolver} from 'sanity/structure'
import {
  DocumentsIcon,
  UsersIcon,
  StarIcon,
  BookIcon,
  FolderIcon,
  DocumentIcon,
  PlayIcon,
  HomeIcon,
  SearchIcon,
  TagIcon,
  ImagesIcon,
  BillIcon,
  RocketIcon,
  EarthGlobeIcon,
  HeartIcon,
  AddIcon,
} from '@sanity/icons'
import React from 'react'

export const deskStructure: StructureResolver = (S, context) => {
  // Helper to create KB hierarchy with sections
  const createKBHierarchy = () => {
    return S.list()
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
                  .title('Favorites')
                  .icon(StarIcon)
                  .child(
                    S.documentTypeList('kbItem')
                      .title('Favorite Items')
                      .filter('_type == "kbItem" && isFavorite == true')
                  ),
                S.listItem()
                  .title('All Documents')
                  .icon(DocumentsIcon)
                  .child(
                    S.documentTypeList('kbItem')
                      .title('All KB Items')
                      .filter('_type == "kbItem"')
                  ),
              ])
          ),

        S.divider(),

        // === MAIN SECTIONS ===
        S.listItem()
          .title('🏢 Company')
          .icon(FolderIcon)
          .child(
            S.list()
              .title('Company')
              .items([
                S.listItem()
                  .title('About & History')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && (title match "*About*" || title match "*History*")')
                  ),
                S.listItem()
                  .title('Policies')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && (docType == "policy" || title match "*Policy*")')
                  ),
                S.listItem()
                  .title('HR & Benefits')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && (title match "*HR*" || title match "*Benefits*" || title match "*Employee*")')
                  ),
                S.listItem()
                  .title('Training & Onboarding')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && (title match "*Training*" || title match "*Onboarding*" || title match "*Intern*")')
                  ),
                S.divider(),
                S.listItem()
                  .title('All Company Docs')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && title match "Company*"')
                  ),
              ])
          ),

        S.listItem()
          .title('🎬 Production')
          .icon(FolderIcon)
          .child(
            S.list()
              .title('Production')
              .items([
                S.listItem()
                  .title('Pre-Production')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && (title match "*Pre-Production*" || title match "*Planning*")')
                  ),
                S.listItem()
                  .title('Production Guides')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && title match "*Production*" && docType == "guide"')
                  ),
                S.listItem()
                  .title('Post-Production')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && (title match "*Post*" || title match "*Edit*")')
                  ),
                S.listItem()
                  .title('Equipment & Tech')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && (title match "*Equipment*" || title match "*Tech*")')
                  ),
                S.listItem()
                  .title('Templates & Checklists')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && (docType == "template" || docType == "checklist") && title match "*Production*"')
                  ),
                S.divider(),
                S.listItem()
                  .title('All Production Docs')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && title match "Production*"')
                  ),
              ])
          ),

        S.listItem()
          .title('📺 Shows')
          .icon(PlayIcon)
          .child(
            S.list()
              .title('Shows')
              .items([
                // Individual Shows
                S.listItem()
                  .title('🎙️ Off The Record')
                  .child(
                    S.list()
                      .title('Off The Record')
                      .items([
                        S.listItem()
                          .title('OTR Overview')
                          .child(
                            S.documentTypeList('kbItem')
                              .filter('_type == "kbItem" && title match "*OTR*Overview*"')
                          ),
                        S.listItem()
                          .title('OTR Guidelines')
                          .child(
                            S.documentTypeList('kbItem')
                              .filter('_type == "kbItem" && title match "*OTR*" && docType == "guide"')
                          ),
                        S.listItem()
                          .title('OTR Templates')
                          .child(
                            S.documentTypeList('kbItem')
                              .filter('_type == "kbItem" && title match "*OTR*" && docType == "template"')
                          ),
                        S.divider(),
                        S.listItem()
                          .title('All OTR Documents')
                          .child(
                            S.documentTypeList('kbItem')
                              .filter('_type == "kbItem" && (title match "*OTR*" || title match "*Off the Record*")')
                          ),
                      ])
                  ),
                
                S.listItem()
                  .title('🌆 Skyline')
                  .child(
                    S.list()
                      .title('Skyline')
                      .items([
                        S.listItem()
                          .title('Skyline Overview')
                          .child(
                            S.documentTypeList('kbItem')
                              .filter('_type == "kbItem" && title match "*Skyline*Overview*"')
                          ),
                        S.listItem()
                          .title('Skyline Guidelines')
                          .child(
                            S.documentTypeList('kbItem')
                              .filter('_type == "kbItem" && title match "*Skyline*" && docType == "guide"')
                          ),
                        S.divider(),
                        S.listItem()
                          .title('All Skyline Documents')
                          .child(
                            S.documentTypeList('kbItem')
                              .filter('_type == "kbItem" && title match "*Skyline*"')
                          ),
                      ])
                  ),

                S.divider(),
                
                S.listItem()
                  .title('All Shows')
                  .icon(PlayIcon)
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && kind == "show"')
                  ),
                
                S.listItem()
                  .title('Guest Resources')
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && (title match "*Guest*" || audience match "*guest*")')
                  ),
              ])
          ),

        S.listItem()
          .title('🛠️ Tools')
          .icon(FolderIcon)
          .child(
            S.documentTypeList('kbItem')
              .title('Tools & Resources')
              .filter('_type == "kbItem" && (title match "*Tool*" || title match "*Software*")')
          ),

        S.listItem()
          .title('🤝 Partners')
          .icon(FolderIcon)
          .child(
            S.documentTypeList('kbItem')
              .title('Partner Resources')
              .filter('_type == "kbItem" && (title match "*Partner*" || title match "*Sponsor*")')
          ),

        S.divider(),

        // === ORGANIZE BY TYPE ===
        S.listItem()
          .title('📑 By Document Type')
          .child(
            S.list()
              .title('Document Types')
              .items([
                S.listItem()
                  .title('📚 Guides')
                  .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "guide"')),
                S.listItem()
                  .title('✅ Checklists')
                  .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "checklist"')),
                S.listItem()
                  .title('📝 Templates')
                  .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "template"')),
                S.listItem()
                  .title('📖 References')
                  .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "reference"')),
                S.listItem()
                  .title('🎓 Tutorials')
                  .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "tutorial"')),
                S.listItem()
                  .title('📋 Policies')
                  .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "policy"')),
                S.listItem()
                  .title('❓ FAQs')
                  .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "faq"')),
                S.listItem()
                  .title('📊 SOPs')
                  .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && docType == "sop"')),
              ])
          ),

        // === ORGANIZE BY VIEW ===
        S.listItem()
          .title('👁️ Views')
          .child(
            S.list()
              .title('Views')
              .items([
                S.listItem()
                  .title('Pages Only')
                  .icon(DocumentIcon)
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && kind == "page"')
                  ),
                S.listItem()
                  .title('Folders Only')
                  .icon(FolderIcon)
                  .child(
                    S.documentTypeList('kbItem')
                      .filter('_type == "kbItem" && kind == "section"')
                  ),
              ])
          ),

        S.divider(),

        // === TAGS ===
        S.listItem()
          .title('🏷️ KB Tags')
          .icon(TagIcon)
          .child(S.documentTypeList('kbTag').title('Knowledge Base Tags')),

        // === SEARCH ===
        S.listItem()
          .title('🔍 Search KB')
          .icon(SearchIcon)
          .child(
            S.documentTypeList('kbItem')
              .title('Search Knowledge Base')
              .filter('_type == "kbItem"')
          ),
      ])
  }

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
              // Main Sections - SIMPLIFIED STRUCTURE
              S.listItem()
                .title('Company')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Company')
                    .items([
                      S.listItem()
                        .title('About & Company Info')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.company.about"')),
                      S.listItem()
                        .title('Policies & SOPs')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.company.policies"')),
                      S.listItem()
                        .title('Team & HR')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.company.hr"')),
                      S.listItem()
                        .title('Interns & Training')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.company.interns"')),
                      S.listItem()
                        .title('Freelancers')
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.company.freelancers"')),
                      S.divider(),
                      S.listItem()
                        .title('All Company Documents')
                        .icon(DocumentsIcon)
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref match "kb.company.*"')),
                    ])
                ),
              
              S.listItem()
                .title('Production')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Production')
                    .items([
                      S.listItem()
                        .title('Pre-Production')
                        .child(
                          S.list()
                            .title('Pre-Production')
                            .items([
                              S.listItem()
                                .title('Checklists & Templates')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.production.pre-production.checklists-templates"')),
                              S.listItem()
                                .title('Schedules & Call Sheets')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.production.pre-production.schedules-call-sheets"')),
                              S.listItem()
                                .title('Casting & Outreach')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.production.pre-production.casting-outreach"')),
                              S.divider(),
                              S.listItem()
                                .title('All Pre-Production Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.production.pre-production.checklists-templates", "kb.production.pre-production.schedules-call-sheets", "kb.production.pre-production.casting-outreach"]')),
                            ])
                        ),
                      S.listItem()
                        .title('Production (Shoots)')
                        .child(
                          S.list()
                            .title('Production (Shoots)')
                            .items([
                              S.listItem()
                                .title('Protocols & Safety')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.production.shoots.protocols-safety"')),
                              S.listItem()
                                .title('Gear Lists & Rentals')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.production.shoots.gear-lists-rentals"')),
                              S.listItem()
                                .title('Locations & Permits')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.production.shoots.locations-permits"')),
                              S.divider(),
                              S.listItem()
                                .title('All Production Shoots Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.production.shoots.protocols-safety", "kb.production.shoots.gear-lists-rentals", "kb.production.shoots.locations-permits"]')),
                            ])
                        ),
                      S.listItem()
                        .title('Post-Production')
                        .child(
                          S.list()
                            .title('Post-Production')
                            .items([
                              S.listItem()
                                .title('Editing & Color')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.production.post-production.editing-color"')),
                              S.listItem()
                                .title('Audio & Music')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.production.post-production.audio-music"')),
                              S.listItem()
                                .title('Deliverables & QC')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.production.post-production.deliverables-qc"')),
                              S.divider(),
                              S.listItem()
                                .title('All Post-Production Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.production.post-production.editing-color", "kb.production.post-production.audio-music", "kb.production.post-production.deliverables-qc"]')),
                            ])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All Production Documents')
                        .icon(DocumentsIcon)
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref match "kb.production.*"')),
                    ])
                ),
              
              S.listItem()
                .title('Shows')
                .icon(PlayIcon)
                .child(
                  S.list()
                    .title('Shows')
                    .items([
                      S.listItem()
                        .title('OTR')
                        .icon(FolderIcon)
                        .child(
                          S.list()
                            .title('OTR')
                            .items([
                              S.listItem()
                                .title('About')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.otr.about"')),
                              S.listItem()
                                .title('Pre-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.otr.pre-production"')),
                              S.listItem()
                                .title('Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.otr.production"')),
                              S.listItem()
                                .title('Post-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.otr.post-production"')),
                              S.listItem()
                                .title('Distribution')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.otr.distribution"')),
                              S.listItem()
                                .title('Visual Identity')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.otr.visual-identity"')),
                              S.listItem()
                                .title('Other')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.otr.other"')),
                              S.divider(),
                              S.listItem()
                                .title('All OTR Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.shows.otr.about", "kb.shows.otr.pre-production", "kb.shows.otr.production", "kb.shows.otr.post-production", "kb.shows.otr.distribution", "kb.shows.otr.visual-identity", "kb.shows.otr.other"]')),
                            ])
                        ),
                      S.listItem()
                        .title('Skyline')
                        .icon(FolderIcon)
                        .child(
                          S.list()
                            .title('Skyline')
                            .items([
                              S.listItem()
                                .title('Pre-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.skyline.pre-production"')),
                              S.listItem()
                                .title('Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.skyline.production"')),
                              S.listItem()
                                .title('Post-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.skyline.post-production"')),
                              S.listItem()
                                .title('Distribution')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.skyline.distribution"')),
                              S.listItem()
                                .title('Visual Identity')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.skyline.visual-identity"')),
                              S.divider(),
                              S.listItem()
                                .title('All Skyline Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.shows.skyline.pre-production", "kb.shows.skyline.production", "kb.shows.skyline.post-production", "kb.shows.skyline.distribution", "kb.shows.skyline.visual-identity"]')),
                            ])
                        ),
                      S.listItem()
                        .title('ATB')
                        .icon(FolderIcon)
                        .child(
                          S.list()
                            .title('ATB')
                            .items([
                              S.listItem()
                                .title('About')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.atb.about"')),
                              S.listItem()
                                .title('Pre-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.atb.pre-production"')),
                              S.listItem()
                                .title('Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.atb.production"')),
                              S.listItem()
                                .title('Post-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.atb.post-production"')),
                              S.listItem()
                                .title('Distribution')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.atb.distribution"')),
                              S.listItem()
                                .title('Visual Identity')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.atb.visual-identity"')),
                              S.listItem()
                                .title('Other')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.atb.other"')),
                              S.divider(),
                              S.listItem()
                                .title('All ATB Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.shows.atb.pre-production", "kb.shows.atb.production", "kb.shows.atb.post-production", "kb.shows.atb.distribution", "kb.shows.atb.visual-identity"]')),
                            ])
                        ),
                      S.listItem()
                        .title('Tatak')
                        .icon(FolderIcon)
                        .child(
                          S.list()
                            .title('Tatak')
                            .items([
                              S.listItem()
                                .title('Pre-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.tatak.pre-production"')),
                              S.listItem()
                                .title('Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.tatak.production"')),
                              S.listItem()
                                .title('Post-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.tatak.post-production"')),
                              S.listItem()
                                .title('Distribution')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.tatak.distribution"')),
                              S.listItem()
                                .title('Visual Identity')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.tatak.visual-identity"')),
                              S.divider(),
                              S.listItem()
                                .title('All Tatak Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.shows.tatak.pre-production", "kb.shows.tatak.production", "kb.shows.tatak.post-production", "kb.shows.tatak.distribution", "kb.shows.tatak.visual-identity"]')),
                            ])
                        ),
                      S.listItem()
                        .title('Passions')
                        .icon(FolderIcon)
                        .child(
                          S.list()
                            .title('Passions')
                            .items([
                              S.listItem()
                                .title('Pre-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.passions.pre-production"')),
                              S.listItem()
                                .title('Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.passions.production"')),
                              S.listItem()
                                .title('Post-Production')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.passions.post-production"')),
                              S.listItem()
                                .title('Distribution')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.passions.distribution"')),
                              S.listItem()
                                .title('Visual Identity')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.shows.passions.visual-identity"')),
                              S.divider(),
                              S.listItem()
                                .title('All Passions Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.shows.passions.pre-production", "kb.shows.passions.production", "kb.shows.passions.post-production", "kb.shows.passions.distribution", "kb.shows.passions.visual-identity"]')),
                            ])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All Shows Documents')
                        .icon(DocumentsIcon)
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref match "kb.shows.*"')),
                    ])
                ),
              
              S.listItem()
                .title('Tools')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Tools')
                    .items([
                      S.listItem()
                        .title('Editing & Design')
                        .child(
                          S.list()
                            .title('Editing & Design')
                            .items([
                              S.listItem()
                                .title('DaVinci')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.tools.editing-design.davinci"')),
                              S.listItem()
                                .title('After Effects')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.tools.editing-design.after-effects"')),
                              S.divider(),
                              S.listItem()
                                .title('All Editing & Design Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.tools.editing-design.davinci", "kb.tools.editing-design.after-effects"]')),
                            ])
                        ),
                      S.listItem()
                        .title('Automation & Data')
                        .child(
                          S.list()
                            .title('Automation & Data')
                            .items([
                              S.listItem()
                                .title('Airtable')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.tools.automation-data.airtable"')),
                              S.listItem()
                                .title('n8n')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.tools.automation-data.n8n"')),
                              S.listItem()
                                .title('Windmill')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.tools.automation-data.windmill"')),
                              S.listItem()
                                .title('AI / RAG')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.tools.automation-data.ai-rag"')),
                              S.divider(),
                              S.listItem()
                                .title('All Automation & Data Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.tools.automation-data.airtable", "kb.tools.automation-data.n8n", "kb.tools.automation-data.windmill", "kb.tools.automation-data.ai-rag"]')),
                            ])
                        ),
                      S.listItem()
                        .title('Comms & Ops')
                        .child(
                          S.list()
                            .title('Comms & Ops')
                            .items([
                              S.listItem()
                                .title('Slack')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.tools.comms-ops.slack"')),
                              S.listItem()
                                .title('ClickUp')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.tools.comms-ops.clickup"')),
                              S.listItem()
                                .title('Email')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.tools.comms-ops.email"')),
                              S.divider(),
                              S.listItem()
                                .title('All Comms & Ops Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.tools.comms-ops.slack", "kb.tools.comms-ops.clickup", "kb.tools.comms-ops.email"]')),
                            ])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All Tools Documents')
                        .icon(DocumentsIcon)
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref match "kb.tools.*"')),
                    ])
                ),
              
              S.listItem()
                .title('Partners')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Partners')
                    .items([
                      S.listItem()
                        .title('Influencers')
                        .child(
                          S.list()
                            .title('Influencers')
                            .items([
                              S.listItem()
                                .title('Joining')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.partners.influencers.joining"')),
                              S.listItem()
                                .title('Agreements & Rates')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.partners.influencers.agreements-rates"')),
                              S.listItem()
                                .title('Assets & Collabs')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.partners.influencers.assets-collabs"')),
                              S.divider(),
                              S.listItem()
                                .title('All Influencers Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.partners.influencers.joining", "kb.partners.influencers.agreements-rates", "kb.partners.influencers.assets-collabs"]')),
                            ])
                        ),
                      S.listItem()
                        .title('Brands')
                        .child(
                          S.list()
                            .title('Brands')
                            .items([
                              S.listItem()
                                .title('Joining')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.partners.brands.joining"')),
                              S.listItem()
                                .title('Agreements & Rates')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.partners.brands.agreements-rates"')),
                              S.listItem()
                                .title('Brand Kits & Guidelines')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.partners.brands.brand-kits-guidelines"')),
                              S.divider(),
                              S.listItem()
                                .title('All Brands Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.partners.brands.joining", "kb.partners.brands.agreements-rates", "kb.partners.brands.brand-kits-guidelines"]')),
                            ])
                        ),
                      S.listItem()
                        .title('Content Creators')
                        .child(
                          S.list()
                            .title('Content Creators')
                            .items([
                              S.listItem()
                                .title('Joining')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.partners.content-creators.joining"')),
                              S.listItem()
                                .title('Collab Formats')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.partners.content-creators.collab-formats"')),
                              S.listItem()
                                .title('Agreements & Rev Share')
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref == "kb.partners.content-creators.agreements-rev-share"')),
                              S.divider(),
                              S.listItem()
                                .title('All Content Creators Documents')
                                .icon(DocumentsIcon)
                                .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref in ["kb.partners.content-creators.joining", "kb.partners.content-creators.collab-formats", "kb.partners.content-creators.agreements-rev-share"]')),
                            ])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All Partners Documents')
                        .icon(DocumentsIcon)
                        .child(S.documentTypeList('kbItem').filter('_type == "kbItem" && parent._ref match "kb.partners.*"')),
                    ])
                ),

              S.divider(),
              
              // All Documents
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

      // ============= BLOG & CONTENT =============
      S.listItem()
        .title('Blog Posts')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('post').title('Blog Posts')),

      S.divider(),

      // ============= HOMEPAGE =============
      S.listItem()
        .title('HomePage Content')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('HomePage Content')
            .items([
              S.listItem()
                .title('Homepage Images')
                .icon(ImagesIcon)
                .child(S.documentTypeList('homepageImage').title('Homepage Images')),
              
              S.listItem()
                .title('Homepage FAQs')
                .child(S.documentTypeList('faq').title('FAQs')),
              
              S.listItem()
                .title('Job Board')
                .icon(BillIcon)
                .child(S.documentTypeList('jobBoard').title('Job Board')),
              
              S.listItem()
                .title('Job Tests')
                .icon(DocumentsIcon)
                .child(S.documentTypeList('jobTests').title('Job Tests')),
              
              S.listItem()
                .title('Brand Collaborations')
                .icon(StarIcon)
                .child(S.documentTypeList('brandCollaboration').title('Brand Collaborations')),

              // Media Assets if needed
              S.divider(),
              
              S.listItem()
                .title('Media Assets')
                .child(S.documentTypeList('mediaAsset').title('Media Assets')),
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
                .title('Creators')
                .child(S.documentTypeList('creator').title('All Creators')),
              
              S.listItem()
                .title('Creator Reviews')
                .child(S.documentTypeList('creatorReview').title('Creator Reviews')),
              
              S.listItem()
                .title('Channels')
                .child(S.documentTypeList('channel').title('Channels')),
              
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

      S.divider(),

      // ============= TEAM & PEOPLE =============
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

      S.divider(),

      // ============= DOCUMENTATION (if using AriaDoc) =============
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

      // Settings section removed - add back when you have settings schemas
    ])
}
