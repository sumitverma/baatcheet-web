import {NextResponse} from 'next/server'
import {
  DISTRIBUTION_SESSION_COOKIE_NAME,
  DISTRIBUTION_SESSION_MAX_AGE_SECONDS,
} from '@/constants/distributionSession'
import {createDistributionSessionToken} from '@/lib/distributionSession'
import {verifyDistributionAccessCode} from '@/services/verifyDistributionAccessCode'

type VerifyRequestBody = {
  accessCode?: unknown
}

export async function POST(request: Request) {
  const expectedAccessCode = process.env.BAATCHEET_ACCESS_CODE?.trim() ?? ''
  if (!expectedAccessCode) {
    return NextResponse.json(
      {error: 'This site is not ready yet. Ask the person who sent you the link for help.'},
      {status: 500},
    )
  }

  let body: VerifyRequestBody
  try {
    body = (await request.json()) as VerifyRequestBody
  } catch {
    return NextResponse.json({error: 'Something went wrong. Try again.'}, {status: 400})
  }

  const providedAccessCode =
    typeof body.accessCode === 'string' ? body.accessCode.trim() : ''

  if (!providedAccessCode) {
    return NextResponse.json({error: 'Enter the access code you were given.'}, {status: 400})
  }

  const isCodeValid = verifyDistributionAccessCode(providedAccessCode, expectedAccessCode)
  if (!isCodeValid) {
    return NextResponse.json({error: 'That code is not valid. Try again.'}, {status: 401})
  }

  let sessionToken: string
  try {
    sessionToken = await createDistributionSessionToken()
  } catch {
    return NextResponse.json(
      {error: 'This site is not ready yet. Ask the person who sent you the link for help.'},
      {status: 500},
    )
  }

  const response = NextResponse.json({ok: true})
  response.cookies.set(DISTRIBUTION_SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DISTRIBUTION_SESSION_MAX_AGE_SECONDS,
  })
  return response
}
