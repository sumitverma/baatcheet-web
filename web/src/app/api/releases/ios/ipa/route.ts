import {get} from '@vercel/blob'
import {NextResponse, type NextRequest} from 'next/server'
import {verifyReleaseDownloadToken} from '@/lib/releaseDownloadToken'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  if (!token) {
    return NextResponse.json({error: 'Missing token.'}, {status: 401})
  }

  const decodedPayload = await verifyReleaseDownloadToken(token)
  const iosIpaBlobPath = decodedPayload?.iosIpaBlobPath ?? ''
  if (!iosIpaBlobPath) {
    return NextResponse.json({error: 'Invalid or expired token.'}, {status: 401})
  }

  const blobResult = await get(iosIpaBlobPath, {access: 'private'})
  if (!blobResult || !blobResult.stream) {
    return NextResponse.json({error: 'iOS build file not found.'}, {status: 404})
  }

  return new NextResponse(blobResult.stream, {
    headers: {
      'Content-Type': blobResult.blob.contentType || 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="BaatCheet.ipa"',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
