import {NextResponse, type NextRequest} from 'next/server'
import {verifyReleaseDownloadToken} from '@/lib/releaseDownloadToken'

function createManifestContent(origin: string, token: string): string {
  const encodedToken = encodeURIComponent(token)
  const ipaDownloadUrl = `${origin}/api/releases/ios/ipa?token=${encodedToken}`
  const bundleIdentifier = process.env.BAATCHEET_IOS_BUNDLE_IDENTIFIER ?? 'vermas.baatcheet.app'
  const bundleVersion = process.env.BAATCHEET_IOS_BUNDLE_VERSION ?? '1.0.0'
  const appTitle = process.env.BAATCHEET_IOS_APP_TITLE ?? 'BaatCheet'

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>${ipaDownloadUrl}</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>${bundleIdentifier}</string>
        <key>bundle-version</key>
        <string>${bundleVersion}</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>${appTitle}</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  if (!token) {
    return NextResponse.json({error: 'Missing token.'}, {status: 401})
  }

  const decodedPayload = await verifyReleaseDownloadToken(token)
  if (!decodedPayload?.iosIpaBlobPath) {
    return NextResponse.json({error: 'Invalid or expired token.'}, {status: 401})
  }

  const origin = request.nextUrl.origin
  const manifestContent = createManifestContent(origin, token)
  return new NextResponse(manifestContent, {
    headers: {
      'Content-Type': 'application/x-plist',
      'Content-Disposition': 'inline; filename="manifest.plist"',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
