import {createHash, timingSafeEqual} from 'node:crypto'

function sha256DigestForUtf8String(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest()
}

/**
 * Compares a user-entered code to the configured value without leaking timing or length hints.
 */
export function verifyDistributionAccessCode(
  providedAccessCode: string,
  expectedAccessCode: string,
): boolean {
  const providedDigest = sha256DigestForUtf8String(providedAccessCode.normalize('NFKC'))
  const expectedDigest = sha256DigestForUtf8String(expectedAccessCode.normalize('NFKC'))
  return timingSafeEqual(providedDigest, expectedDigest)
}
