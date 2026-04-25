import {ReleaseInstallPage} from '@/components/ReleaseInstallPage'
import {headers} from 'next/headers'
import {createReleaseDownloadToken} from '@/lib/releaseDownloadToken'
import {fetchReleaseDownloadPageContentFromSanity} from '@/services/fetchReleaseDownloadPageContentFromSanity'

export const revalidate = 60

export default async function Home() {
  const releaseDownloadPageContent = await fetchReleaseDownloadPageContentFromSanity()
  const requestHeaders = await headers()
  const forwardedProtocol = requestHeaders.get('x-forwarded-proto') ?? 'https'
  const forwardedHost = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? ''
  const inferredBaseUrl = forwardedHost ? `${forwardedProtocol}://${forwardedHost}` : ''
  const configuredBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? ''
  const baseUrl = configuredBaseUrl || inferredBaseUrl

  let iosManifestDownloadUrl: string | null = null
  let androidApkDownloadUrl: string | null = null

  const iosIpaBlobPath = releaseDownloadPageContent?.iosIpaBlobPath ?? null
  const androidApkBlobPath = releaseDownloadPageContent?.androidApkBlobPath ?? null

  if (baseUrl && (iosIpaBlobPath || androidApkBlobPath)) {
    const token = await createReleaseDownloadToken({
      iosIpaBlobPath,
      androidApkBlobPath,
    })
    const encodedToken = encodeURIComponent(token)

    if (iosIpaBlobPath) {
      iosManifestDownloadUrl = `${baseUrl}/api/releases/ios/manifest?token=${encodedToken}`
    }
    if (androidApkBlobPath) {
      androidApkDownloadUrl = `${baseUrl}/api/releases/android/apk?token=${encodedToken}`
    }
  }

  return (
    <ReleaseInstallPage
      content={releaseDownloadPageContent}
      iosManifestDownloadUrl={iosManifestDownloadUrl}
      androidApkDownloadUrl={androidApkDownloadUrl}
    />
  )
}
