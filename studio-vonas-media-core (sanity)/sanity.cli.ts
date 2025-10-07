import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '5cywtc7a',
    dataset: 'production'
  },
  studioHost: 'vonas-media',
  /**
   * Enable auto-updates for studios
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  deployment: {
    autoUpdates: true,
    appId: 'gwytfe73t451ek2xuoa6h9mp',
  },
})
