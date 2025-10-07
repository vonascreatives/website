import {StructureResolver} from 'sanity/structure'
import {
  DocumentsIcon,
  FolderIcon,
  BookIcon,
  PlayIcon,
  SearchIcon,
  StarIcon,
  CogIcon,
  UsersIcon,
} from '@sanity/icons'

export const deskStructure: StructureResolver = (S) => {
  return S.list()
    .title('Vonas Media CMS')
    .items([
      // ============= KNOWLEDGE BASE V2 =============
      S.listItem()
        .title('📚 Knowledge Base')
        .icon(BookIcon)
        .child(
          S.list()
            .title('Knowledge Base')
            .items([
              // COMPANY SECTION - MATCH ACTUAL DATA
              S.listItem()
                .title('Company')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Company')
                    .items([
                      S.listItem()
                        .title('About')
                        .child(
                          S.documentTypeList('kb')
                            .title('About Company')
                            .filter('_type == "kb" && parent._ref == "kb.company.about"')
                        ),
                      S.listItem()
                        .title('HR & Finance')
                        .child(
                          S.documentTypeList('kb')
                            .title('HR & Finance')
                            .filter('_type == "kb" && parent._ref == "kb.company.hr"')
                        ),
                      S.listItem()
                        .title('Policies')
                        .child(
                          S.documentTypeList('kb')
                            .title('Policies')
                            .filter('_type == "kb" && parent._ref == "kb.company.policies"')
                        ),
                      S.listItem()
                        .title('Interns')
                        .child(
                          S.documentTypeList('kb')
                            .title('Interns')
                            .filter('_type == "kb" && parent._ref == "kb.company.interns"')
                        ),
                      S.listItem()
                        .title('Freelancers')
                        .child(
                          S.documentTypeList('kb')
                            .title('Freelancers')
                            .filter('_type == "kb" && parent._ref == "kb.company.freelancers"')
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All Company Documents')
                        .icon(DocumentsIcon)
                        .child(
                          S.documentTypeList('kb')
                            .title('All Company Documents')
                            .filter('_type == "kb" && parent._ref match "kb.company.*"')
                        ),
                    ])
                ),

              // PRODUCTION SECTION - EXACT CURRENT STRUCTURE
              S.listItem()
                .title('Production')
                .icon(CogIcon)
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Checklists & Templates')
                                    .filter('_type == "kb" && parent._ref == "kb.production.pre-production.checklists-templates"')
                                ),
                              S.listItem()
                                .title('Schedules & Call Sheets')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Schedules & Call Sheets')
                                    .filter('_type == "kb" && parent._ref == "kb.production.pre-production.schedules-call-sheets"')
                                ),
                              S.listItem()
                                .title('Casting & Outreach')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Casting & Outreach')
                                    .filter('_type == "kb" && parent._ref == "kb.production.pre-production.casting-outreach"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Pre-Production Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Pre-Production Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.production.pre-production.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Protocols & Safety')
                                    .filter('_type == "kb" && parent._ref == "kb.production.shoots.protocols-safety"')
                                ),
                              S.listItem()
                                .title('Gear Lists & Rentals')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Gear Lists & Rentals')
                                    .filter('_type == "kb" && parent._ref == "kb.production.shoots.gear-lists-rentals"')
                                ),
                              S.listItem()
                                .title('Locations & Permits')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Locations & Permits')
                                    .filter('_type == "kb" && parent._ref == "kb.production.shoots.locations-permits"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Production Shoots Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Production Shoots Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.production.shoots.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Editing & Color')
                                    .filter('_type == "kb" && parent._ref == "kb.production.post-production.editing-color"')
                                ),
                              S.listItem()
                                .title('Audio & Music')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Audio & Music')
                                    .filter('_type == "kb" && parent._ref == "kb.production.post-production.audio-music"')
                                ),
                              S.listItem()
                                .title('Deliverables & QC')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Deliverables & QC')
                                    .filter('_type == "kb" && parent._ref == "kb.production.post-production.deliverables-qc"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Post-Production Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Post-Production Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.production.post-production.*"')
                                ),
                            ])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All Production Documents')
                        .icon(DocumentsIcon)
                        .child(
                          S.documentTypeList('kb')
                            .title('All Production Documents')
                            .filter('_type == "kb" && parent._ref match "kb.production.*"')
                        ),
                    ])
                ),

              // SHOWS SECTION - EXACT CURRENT STRUCTURE
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('About OTR')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.otr.about"')
                                ),
                              S.listItem()
                                .title('Pre-Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Pre-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.otr.pre-production"')
                                ),
                              S.listItem()
                                .title('Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.otr.production"')
                                ),
                              S.listItem()
                                .title('Post-Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Post-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.otr.post-production"')
                                ),
                              S.listItem()
                                .title('Distribution')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Distribution')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.otr.distribution"')
                                ),
                              S.listItem()
                                .title('Visual Identity')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Visual Identity')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.otr.visual-identity"')
                                ),
                              S.listItem()
                                .title('Other')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Other OTR Documents')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.otr.other"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All OTR Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All OTR Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.shows.otr.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Pre-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.skyline.pre-production"')
                                ),
                              S.listItem()
                                .title('Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.skyline.production"')
                                ),
                              S.listItem()
                                .title('Post-Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Post-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.skyline.post-production"')
                                ),
                              S.listItem()
                                .title('Distribution')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Distribution')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.skyline.distribution"')
                                ),
                              S.listItem()
                                .title('Visual Identity')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Visual Identity')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.skyline.visual-identity"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Skyline Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Skyline Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.shows.skyline.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Pre-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.tatak.pre-production"')
                                ),
                              S.listItem()
                                .title('Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.tatak.production"')
                                ),
                              S.listItem()
                                .title('Post-Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Post-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.tatak.post-production"')
                                ),
                              S.listItem()
                                .title('Distribution')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Distribution')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.tatak.distribution"')
                                ),
                              S.listItem()
                                .title('Visual Identity')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Visual Identity')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.tatak.visual-identity"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Tatak Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Tatak Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.shows.tatak.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Pre-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.passions.pre-production"')
                                ),
                              S.listItem()
                                .title('Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.passions.production"')
                                ),
                              S.listItem()
                                .title('Post-Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Post-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.passions.post-production"')
                                ),
                              S.listItem()
                                .title('Distribution')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Distribution')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.passions.distribution"')
                                ),
                              S.listItem()
                                .title('Visual Identity')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Visual Identity')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.passions.visual-identity"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Passions Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Passions Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.shows.passions.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('About ATB')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.atb.about"')
                                ),
                              S.listItem()
                                .title('Pre-Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Pre-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.atb.pre-production"')
                                ),
                              S.listItem()
                                .title('Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.atb.production"')
                                ),
                              S.listItem()
                                .title('Post-Production')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Post-Production')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.atb.post-production"')
                                ),
                              S.listItem()
                                .title('Distribution')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Distribution')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.atb.distribution"')
                                ),
                              S.listItem()
                                .title('Visual Identity')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Visual Identity')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.atb.visual-identity"')
                                ),
                              S.listItem()
                                .title('Other')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Other ATB Documents')
                                    .filter('_type == "kb" && parent._ref == "kb.shows.atb.other"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All ATB Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All ATB Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.shows.atb.*"')
                                ),
                            ])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All Shows Documents')
                        .icon(DocumentsIcon)
                        .child(
                          S.documentTypeList('kb')
                            .title('All Shows Documents')
                            .filter('_type == "kb" && parent._ref match "kb.shows.*"')
                        ),
                    ])
                ),

              // TOOLS SECTION - EXACT CURRENT STRUCTURE  
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('DaVinci')
                                    .filter('_type == "kb" && parent._ref == "kb.tools.editing-design.davinci"')
                                ),
                              S.listItem()
                                .title('After Effects')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('After Effects')
                                    .filter('_type == "kb" && parent._ref == "kb.tools.editing-design.after-effects"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Editing & Design Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Editing & Design Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.tools.editing-design.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Airtable')
                                    .filter('_type == "kb" && parent._ref == "kb.tools.automation-data.airtable"')
                                ),
                              S.listItem()
                                .title('n8n')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('n8n')
                                    .filter('_type == "kb" && parent._ref == "kb.tools.automation-data.n8n"')
                                ),
                              S.listItem()
                                .title('Windmill')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Windmill')
                                    .filter('_type == "kb" && parent._ref == "kb.tools.automation-data.windmill"')
                                ),
                              S.listItem()
                                .title('AI / RAG')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('AI / RAG')
                                    .filter('_type == "kb" && parent._ref == "kb.tools.automation-data.ai-rag"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Automation & Data Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Automation & Data Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.tools.automation-data.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Slack')
                                    .filter('_type == "kb" && parent._ref == "kb.tools.comms-ops.slack"')
                                ),
                              S.listItem()
                                .title('ClickUp')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('ClickUp')
                                    .filter('_type == "kb" && parent._ref == "kb.tools.comms-ops.clickup"')
                                ),
                              S.listItem()
                                .title('Email')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Email')
                                    .filter('_type == "kb" && parent._ref == "kb.tools.comms-ops.email"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Comms & Ops Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Comms & Ops Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.tools.comms-ops.*"')
                                ),
                            ])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All Tools Documents')
                        .icon(DocumentsIcon)
                        .child(
                          S.documentTypeList('kb')
                            .title('All Tools Documents')
                            .filter('_type == "kb" && parent._ref match "kb.tools.*"')
                        ),
                    ])
                ),

              // PARTNERS SECTION - EXACT CURRENT STRUCTURE
              S.listItem()
                .title('Partners')
                .icon(UsersIcon)
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Joining')
                                    .filter('_type == "kb" && parent._ref == "kb.partners.influencers.joining"')
                                ),
                              S.listItem()
                                .title('Agreements & Rates')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Agreements & Rates')
                                    .filter('_type == "kb" && parent._ref == "kb.partners.influencers.agreements-rates"')
                                ),
                              S.listItem()
                                .title('Assets & Collabs')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Assets & Collabs')
                                    .filter('_type == "kb" && parent._ref == "kb.partners.influencers.assets-collabs"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Influencers Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Influencers Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.partners.influencers.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Joining')
                                    .filter('_type == "kb" && parent._ref == "kb.partners.brands.joining"')
                                ),
                              S.listItem()
                                .title('Agreements & Rates')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Agreements & Rates')
                                    .filter('_type == "kb" && parent._ref == "kb.partners.brands.agreements-rates"')
                                ),
                              S.listItem()
                                .title('Brand Kits & Guidelines')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Brand Kits & Guidelines')
                                    .filter('_type == "kb" && parent._ref == "kb.partners.brands.brand-kits-guidelines"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Brands Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Brands Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.partners.brands.*"')
                                ),
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
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Joining')
                                    .filter('_type == "kb" && parent._ref == "kb.partners.content-creators.joining"')
                                ),
                              S.listItem()
                                .title('Collab Formats')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Collab Formats')
                                    .filter('_type == "kb" && parent._ref == "kb.partners.content-creators.collab-formats"')
                                ),
                              S.listItem()
                                .title('Agreements & Rev Share')
                                .child(
                                  S.documentTypeList('kb')
                                    .title('Agreements & Rev Share')
                                    .filter('_type == "kb" && parent._ref == "kb.partners.content-creators.agreements-rev-share"')
                                ),
                              S.divider(),
                              S.listItem()
                                .title('All Content Creators Documents')
                                .icon(DocumentsIcon)
                                .child(
                                  S.documentTypeList('kb')
                                    .title('All Content Creators Documents')
                                    .filter('_type == "kb" && parent._ref match "kb.partners.content-creators.*"')
                                ),
                            ])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All Partners Documents')
                        .icon(DocumentsIcon)
                        .child(
                          S.documentTypeList('kb')
                            .title('All Partners Documents')
                            .filter('_type == "kb" && parent._ref match "kb.partners.*"')
                        ),
                    ])
                ),

              S.divider(),

              // QUICK ACCESS - BY TYPE
              S.listItem()
                .title('📑 By Document Type')
                .icon(SearchIcon)
                .child(
                  S.list()
                    .title('By Document Type')
                    .items([
                      S.listItem()
                        .title('📋 Guides')
                        .child(
                          S.documentTypeList('kb')
                            .title('All Guides')
                            .filter('_type == "kb" && docType == "guide"')
                        ),
                      S.listItem()
                        .title('✅ Checklists')
                        .child(
                          S.documentTypeList('kb')
                            .title('All Checklists')
                            .filter('_type == "kb" && docType == "checklist"')
                        ),
                      S.listItem()
                        .title('📝 Templates')
                        .child(
                          S.documentTypeList('kb')
                            .title('All Templates')
                            .filter('_type == "kb" && docType == "template"')
                        ),
                      S.listItem()
                        .title('📖 References')
                        .child(
                          S.documentTypeList('kb')
                            .title('All References')
                            .filter('_type == "kb" && docType == "reference"')
                        ),
                      S.listItem()
                        .title('🎓 Tutorials')
                        .child(
                          S.documentTypeList('kb')
                            .title('All Tutorials')
                            .filter('_type == "kb" && docType == "tutorial"')
                        ),
                      S.listItem()
                        .title('📋 Policies')
                        .child(
                          S.documentTypeList('kb')
                            .title('All Policies')
                            .filter('_type == "kb" && docType == "policy"')
                        ),
                      S.listItem()
                        .title('❓ FAQs')
                        .child(
                          S.documentTypeList('kb')
                            .title('All FAQs')
                            .filter('_type == "kb" && docType == "faq"')
                        ),
                      S.listItem()
                        .title('📊 SOPs')
                        .child(
                          S.documentTypeList('kb')
                            .title('All SOPs')
                            .filter('_type == "kb" && docType == "sop"')
                        ),
                    ])
                ),

              S.divider(),

              // ALL KB DOCUMENTS
              S.listItem()
                .title('🔍 All KB Documents')
                .icon(SearchIcon)
                .child(
                  S.documentTypeList('kb')
                    .title('All Knowledge Base Items')
                    .filter('_type == "kb"')
                    .defaultOrdering([
                      {field: 'parent._ref', direction: 'asc'},
                      {field: 'title', direction: 'asc'}
                    ])
                ),
            ])
        ),


      S.divider(),

      // ============= OTHER CONTENT TYPES (UNTOUCHED) =============
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
                .title('Page Images')
                .child(
                  S.list()
                    .title('Images by Page')
                    .items([
                      S.listItem()
                        .title('🏠 Homepage')
                        .child(
                          S.list()
                            .title('Homepage Sections')
                            .items([
                              S.listItem()
                                .title('Hero Section')
                                .child(S.documentTypeList('homepageImage').filter('page == "Homepage" && category == "Hero Section"')),
                              S.listItem()
                                .title('Brand Section')
                                .child(S.documentTypeList('homepageImage').filter('page == "Homepage" && category == "Brand Section"')),
                              S.listItem()
                                .title('Service Section')
                                .child(S.documentTypeList('homepageImage').filter('page == "Homepage" && category == "Service Section"')),
                              S.listItem()
                                .title('Project Section')
                                .child(S.documentTypeList('homepageImage').filter('page == "Homepage" && category == "Project Section"')),
                              S.listItem()
                                .title('Award Section')
                                .child(S.documentTypeList('homepageImage').filter('page == "Homepage" && category == "Award Section"')),
                              S.listItem()
                                .title('Footer Section')
                                .child(S.documentTypeList('homepageImage').filter('page == "Homepage" && category == "Footer Section"')),
                              S.divider(),
                              S.listItem()
                                .title('All Homepage Images')
                                .child(S.documentTypeList('homepageImage').filter('page == "Homepage"')),
                            ])
                        ),
                      S.listItem()
                        .title('ℹ️ About Us')
                        .child(S.documentTypeList('homepageImage').filter('page == "About Us"')),
                      S.listItem()
                        .title('📺 Channels')
                        .child(S.documentTypeList('homepageImage').filter('page == "Channels"')),
                      S.listItem()
                        .title('👥 Creators')
                        .child(S.documentTypeList('homepageImage').filter('page == "Creators"')),
                      S.divider(),
                      S.listItem()
                        .title('All Page Images')
                        .child(S.documentTypeList('homepageImage')),
                    ])
                ),
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
            ])
        ),

      S.listItem()
        .title('Team & People')
        .child(
          S.list()
            .title('Team & People')
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
