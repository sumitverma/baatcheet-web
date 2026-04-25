import {createClient, type SanityClient} from '@sanity/client'

export type ReleaseDownloadPageContent = {
  pageHeading: string | null
  pageSubheading: string | null
  iosIpaBlobPath: string | null
  androidApkBlobPath: string | null
  currentVersionLabel: string | null
  whatsNew: string | null
}

const RELEASE_DOWNLOAD_PAGE_QUERY = `*[_id == "releaseDownloadPage"][0]{
  pageHeading,
  pageSubheading,
  "iosIpaBlobPath": coalesce(iosIpaBlobPath, iosManifestUrl),
  "androidApkBlobPath": coalesce(androidApkBlobPath, androidApkUrl),
  currentVersionLabel,
  whatsNew
}`

function createSanityReadClient(): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId) {
    return null
  }
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  return createClient({
    projectId,
    dataset,
    useCdn: true,
    apiVersion: '2025-04-01',
  })
}

export async function fetchReleaseDownloadPageContentFromSanity(): Promise<ReleaseDownloadPageContent | null> {
  const client = createSanityReadClient()
  const fallbackContent: ReleaseDownloadPageContent = {
    pageHeading: null,
    pageSubheading: null,
    iosIpaBlobPath: null,
    androidApkBlobPath: null,
    currentVersionLabel: null,
    whatsNew: null,
  }

  if (!client) {
    return fallbackContent
  }

  const sanityContent = await client.fetch<ReleaseDownloadPageContent | null>(RELEASE_DOWNLOAD_PAGE_QUERY)
  if (!sanityContent) {
    return fallbackContent
  }

  return {
    ...fallbackContent,
    ...sanityContent,
  }
}
