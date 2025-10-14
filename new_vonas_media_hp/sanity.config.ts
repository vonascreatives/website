import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// Schema imports - you'll need to create these
import { teamMember } from './sanity/schemas/teamMember'
import { youtubeId } from './sanity/schemas/youtubeId'
import { homepageImage } from './sanity/schemas/homepageImage'
import { brandCollaboration } from './sanity/schemas/brandCollaboration'
import { exclusiveCreator } from './sanity/schemas/exclusiveCreator'
import { award } from './sanity/schemas/award'
import { caseStudy } from './sanity/schemas/caseStudy'
import funFact from './sanity/schemas/funFact'

export default defineConfig({
  name: 'default',
  title: 'Vonas Media',
  
  projectId: '5cywtc7a',
  dataset: 'production',
  
  plugins: [
    structureTool(),
    visionTool()
  ],
  
  schema: {
    types: [
      // Document types
      teamMember,
      youtubeId,
      homepageImage,
      brandCollaboration,
      exclusiveCreator,
      award,
      caseStudy,
      funFact,
    ],
  },
})
