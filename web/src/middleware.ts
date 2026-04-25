import {type NextRequest, NextResponse} from 'next/server'
import {DISTRIBUTION_SESSION_COOKIE_NAME} from '@/constants/distributionSession'
import {verifyDistributionSessionToken} from '@/lib/distributionSession'

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl

  if (pathname.startsWith('/login')) {
    const existingSessionToken = request.cookies.get(DISTRIBUTION_SESSION_COOKIE_NAME)?.value
    if (existingSessionToken) {
      const isExistingSessionValid = await verifyDistributionSessionToken(existingSessionToken)
      if (isExistingSessionValid) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/auth/verify') || pathname.startsWith('/api/auth/logout')) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(DISTRIBUTION_SESSION_COOKIE_NAME)?.value
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isSessionValid = await verifyDistributionSessionToken(sessionToken)
  if (!isSessionValid) {
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
    redirectResponse.cookies.delete(DISTRIBUTION_SESSION_COOKIE_NAME)
    return redirectResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
