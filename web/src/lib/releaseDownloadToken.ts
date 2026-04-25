import {SignJWT, jwtVerify} from 'jose'

const RELEASE_DOWNLOAD_JWT_CLAIM = 'release_download_link' as const
const RELEASE_DOWNLOAD_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24

type ReleaseDownloadTokenPayload = {
  iosIpaBlobPath: string | null
  androidApkBlobPath: string | null
}

type DecodedReleaseDownloadPayload = ReleaseDownloadTokenPayload & {
  purpose: typeof RELEASE_DOWNLOAD_JWT_CLAIM
}

function getReleaseTokenSecretKey(): Uint8Array {
  const secret = process.env.BAATCHEET_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('BAATCHEET_SESSION_SECRET must be set and at least 32 characters.')
  }
  return new TextEncoder().encode(secret)
}

export async function createReleaseDownloadToken(
  payload: ReleaseDownloadTokenPayload,
): Promise<string> {
  return new SignJWT({purpose: RELEASE_DOWNLOAD_JWT_CLAIM, ...payload})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime(`${RELEASE_DOWNLOAD_TOKEN_MAX_AGE_SECONDS}s`)
    .sign(getReleaseTokenSecretKey())
}

export async function verifyReleaseDownloadToken(
  token: string,
): Promise<DecodedReleaseDownloadPayload | null> {
  try {
    const {payload} = await jwtVerify(token, getReleaseTokenSecretKey())
    if (payload.purpose !== RELEASE_DOWNLOAD_JWT_CLAIM) {
      return null
    }
    const iosIpaBlobPath =
      typeof payload.iosIpaBlobPath === 'string' ? payload.iosIpaBlobPath : null
    const androidApkBlobPath =
      typeof payload.androidApkBlobPath === 'string' ? payload.androidApkBlobPath : null
    return {
      purpose: RELEASE_DOWNLOAD_JWT_CLAIM,
      iosIpaBlobPath,
      androidApkBlobPath,
    }
  } catch {
    return null
  }
}
