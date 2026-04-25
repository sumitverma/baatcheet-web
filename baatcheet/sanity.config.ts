import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'BaatCheet',

  projectId: 'fxy8dhsm',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (structureBuilder) =>
        structureBuilder
          .list()
          .title('Content')
          .items([
            structureBuilder
              .listItem()
              .title('Install page')
              .child(
                structureBuilder
                  .document()
                  .schemaType('releaseDownloadPage')
                  .documentId('releaseDownloadPage'),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
