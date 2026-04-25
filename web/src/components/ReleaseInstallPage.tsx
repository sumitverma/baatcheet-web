import {buildIosOtaInstallLink} from '@/lib/buildIosOtaInstallLink'
import type {ReleaseDownloadPageContent} from '@/services/fetchReleaseDownloadPageContentFromSanity'
import {SignOutButton} from '@/components/SignOutButton'

type ReleaseInstallPageProps = {
  content: ReleaseDownloadPageContent | null
}

export function ReleaseInstallPage({content}: ReleaseInstallPageProps) {
  const heading = content?.pageHeading?.trim() || 'BaatCheet'
  const subheading = content?.pageSubheading?.trim() || 'Private install for people you trust.'
  const iosManifestUrl = content?.iosManifestUrl?.trim() || ''
  const androidApkUrl = content?.androidApkUrl?.trim() || ''
  const versionLabel = content?.currentVersionLabel?.trim()
  const whatsNew = content?.whatsNew?.trim()

  const iosInstallHref = iosManifestUrl ? buildIosOtaInstallLink(iosManifestUrl) : ''
  const hasIos = Boolean(iosInstallHref)
  const hasAndroid = Boolean(androidApkUrl)

  return (
    <div className="relative min-h-full overflow-hidden bg-zinc-950 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.35), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(59, 130, 246, 0.12), transparent)',
        }}
      />
      <div className="relative mx-auto flex min-h-full w-full max-w-2xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-400/90">
              BaatCheet
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {heading}
            </h1>
            <p className="mt-2 max-w-lg text-base leading-relaxed text-zinc-400">{subheading}</p>
            {versionLabel ? (
              <p className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">
                Version {versionLabel}
              </p>
            ) : null}
          </div>
          <SignOutButton />
        </header>

        {content === null ? (
          <section
            className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 text-sm leading-relaxed text-zinc-400"
            aria-live="polite"
          >
            Install links are not available yet. Please contact the person who shared this page with
            you.
          </section>
        ) : null}

        <section className="grid gap-5 sm:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xs font-semibold tracking-wide text-white">
              iOS
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">iPhone (Safari)</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Use <strong className="font-medium text-zinc-200">Safari</strong> on your iPhone. Tap
              install, then follow the prompts on screen.
            </p>
            {hasIos ? (
              <a
                href={iosInstallHref}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                Install on iPhone
              </a>
            ) : (
              <p className="mt-6 text-sm text-zinc-500">No iOS link has been published yet.</p>
            )}
          </article>

          <article className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-xs font-semibold tracking-wide text-emerald-100">
              APK
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">Android</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Download the APK, allow installs from this source if your phone asks, then open the
              file to install.
            </p>
            {hasAndroid ? (
              <a
                href={androidApkUrl}
                download
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Download APK
              </a>
            ) : (
              <p className="mt-6 text-sm text-zinc-500">No Android link has been published yet.</p>
            )}
          </article>
        </section>

        {whatsNew ? (
          <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              What is new
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
              {whatsNew}
            </p>
          </section>
        ) : null}

        <footer className="mt-auto border-t border-white/5 pt-8 text-center text-xs text-zinc-600">
          <p>Need help? Ask whoever shared this page with you.</p>
        </footer>
      </div>
    </div>
  )
}
