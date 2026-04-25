import {defineField, defineType} from 'sanity'

export const releaseDownloadPageType = defineType({
  name: 'releaseDownloadPage',
  title: 'Install page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageHeading',
      title: 'Heading',
      type: 'string',
      initialValue: 'BaatCheet',
    }),
    defineField({
      name: 'pageSubheading',
      title: 'Subheading',
      type: 'string',
      description: 'Short line under the heading (for example who this build is for).',
    }),
    defineField({
      name: 'iosManifestUrl',
      title: 'iOS manifest URL',
      type: 'url',
      description:
        'Public HTTPS URL to manifest.plist from your release export. iPhone installs use this with Safari.',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'androidApkUrl',
      title: 'Android APK URL',
      type: 'url',
      description: 'Public HTTPS URL to the signed APK file.',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'currentVersionLabel',
      title: 'Version label',
      type: 'string',
      description: 'Shown on the page (for example 1.2.0 or 1.2.0 (42)).',
    }),
    defineField({
      name: 'whatsNew',
      title: "What's new",
      type: 'text',
      rows: 6,
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Install page'}
    },
  },
})
