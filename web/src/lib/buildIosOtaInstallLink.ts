/**
 * Builds the itms-services link Safari uses to start an OTA install from manifest.plist.
 */
export function buildIosOtaInstallLink(manifestHttpsUrl: string): string {
  const encodedManifestUrl = encodeURIComponent(manifestHttpsUrl.trim())
  return `itms-services://?action=download-manifest&url=${encodedManifestUrl}`
}
