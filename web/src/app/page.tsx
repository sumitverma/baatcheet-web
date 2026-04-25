import {ReleaseInstallPage} from '@/components/ReleaseInstallPage'
import {fetchReleaseDownloadPageContentFromSanity} from '@/services/fetchReleaseDownloadPageContentFromSanity'

export const revalidate = 60

export default async function Home() {
  const releaseDownloadPageContent = await fetchReleaseDownloadPageContentFromSanity()
  return <ReleaseInstallPage content={releaseDownloadPageContent} />
}
