import {SignJWT, jwtVerify} from 'jose'
import {DISTRIBUTION_SESSION_MAX_AGE_SECONDS} from '@/constants/distributionSession'

const DISTRIBUTION_JWT_CLAIM = 'distribution_install_page' as const

function getSessionSecretKey(): Uint8Array {
  const secret = process.env.BAATCHEET_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('BAATCHEET_SESSION_SECRET must be set and at least 32 characters.')
  }
  return new TextEncoder().encode(secret)
}

export async function createDistributionSessionToken(): Promise<string> {
  return new SignJWT({purpose: DISTRIBUTION_JWT_CLAIM})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime(`${DISTRIBUTION_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSessionSecretKey())
}

export async function verifyDistributionSessionToken(token: string): Promise<boolean> {
  try {
    const {payload} = await jwtVerify(token, getSessionSecretKey())
    return payload.purpose === DISTRIBUTION_JWT_CLAIM
  } catch {
    return false
  }
}
