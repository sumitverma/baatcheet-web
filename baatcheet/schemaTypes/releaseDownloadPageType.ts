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
      name: 'iosIpaBlobPath',
      title: 'iOS IPA blob path',
      type: 'string',
      description:
        'Private Vercel Blob pathname for the IPA (for example releases/ios/BaatCheet.ipa).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'androidApkBlobPath',
      title: 'Android APK blob path',
      type: 'string',
      description: 'Private Vercel Blob pathname for the APK (for example releases/android/BaatCheet.apk).',
      validation: (rule) => rule.required(),
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
