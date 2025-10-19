import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {dashboardTool} from '@sanity/dashboard'
import {colorInput} from '@sanity/color-input'
import {media} from 'sanity-plugin-media'
import {assist} from '@sanity/assist'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './deskStructureKnowledgebaseV2'

// Custom actions and templates for hierarchical kbItem
import {SetSlugAndPublishAction} from './studio/actions/set-slug-and-publish-action'
import {createFolderAction} from './studio/actions/create-folder-action'
import {slugPrefixTpl} from './studio/templates/slug-prefix-template'
import {showTemplate} from './studio/templates/show-template'
import {basicFolderTpl} from './studio/templates/basic-folder-template'

export default defineConfig({
  name: 'default',
  title: 'Vonas Media Core',

  projectId: '5cywtc7a',
  dataset: 'production',

  plugins: [
    structureTool({structure: deskStructure}),
    media(),
    visionTool(),
    dashboardTool({}),
    colorInput(),
    assist(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => {
      return [
        ...prev,
        slugPrefixTpl('kb', 'Create KB Item (with parent)'),
        showTemplate('kb'),
        basicFolderTpl('kb')
      ]
    },
  },
  actions: (prev: any[], context: any) => {
    switch (context.schemaType) {
      case 'kb':
        return [SetSlugAndPublishAction, ...prev]
      default:
        return prev
    }
  },
})
