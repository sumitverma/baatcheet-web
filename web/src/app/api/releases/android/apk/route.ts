import {get} from '@vercel/blob'
import {NextResponse, type NextRequest} from 'next/server'
import {verifyReleaseDownloadToken} from '@/lib/releaseDownloadToken'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  if (!token) {
    return NextResponse.json({error: 'Missing token.'}, {status: 401})
  }

  const decodedPayload = await verifyReleaseDownloadToken(token)
  const androidApkBlobPath = decodedPayload?.androidApkBlobPath ?? ''
  if (!androidApkBlobPath) {
    return NextResponse.json({error: 'Invalid or expired token.'}, {status: 401})
  }

  const blobResult = await get(androidApkBlobPath, {access: 'private'})
  if (!blobResult || !blobResult.stream) {
    return NextResponse.json({error: 'Android build file not found.'}, {status: 404})
  }

  return new NextResponse(blobResult.stream, {
    headers: {
      'Content-Type': blobResult.blob.contentType || 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename="BaatCheet.apk"',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
