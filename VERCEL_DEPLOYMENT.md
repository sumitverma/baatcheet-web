# Vercel deployment for BaatCheet install page

This repository is a single git repo with two apps:

- `web/` -> Next.js install page (deploy this on Vercel)
- `baatcheet/` -> Sanity Studio (run separately with `sanity deploy`)

## Project settings in Vercel

- Framework Preset: `Next.js`
- Root Directory: `web`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.next` (managed by Next.js on Vercel)

## Required environment variables

Set these in Vercel Project Settings -> Environment Variables:

- `BAATCHEET_ACCESS_CODE`
- `BAATCHEET_SESSION_SECRET` (minimum 32 characters)
- `BLOB_READ_WRITE_TOKEN` (auto-added when Blob is connected to this Vercel project)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (for this setup: `fxy8dhsm`)
- `NEXT_PUBLIC_SANITY_DATASET` (for this setup: `production`)
- `NEXT_PUBLIC_SITE_URL` (for this setup: `https://baatcheet-bay.vercel.app`)

## Build artifacts

When Vercel builds this project (`web` root), Next.js generates:

- `.next/` -> primary production build output
- `.next/server/` -> server-rendered route bundles (App Router, API routes)
- `.next/static/` -> hashed static assets served by the CDN

Vercel then packages server output into functions and serves static assets from its edge network.

## Local verification

Run this from `web/`:

```bash
npm run build
```

Expected routes include:

- `/`
- `/login`
- `/api/auth/verify`
- `/api/auth/logout`
- `/api/releases/ios/manifest`
- `/api/releases/ios/ipa`
- `/api/releases/android/apk`

## Private release hosting flow

Release binaries stay in a private Vercel Blob store (not in git, not in `public/`):

- iOS IPA blob pathname in Sanity: `iosIpaBlobPath`
- Android APK blob pathname in Sanity: `androidApkBlobPath`

After access-code login, the server creates a short-lived token and exposes authenticated download endpoints:

- `https://baatcheet-bay.vercel.app/api/releases/ios/manifest?token=...`
- `https://baatcheet-bay.vercel.app/api/releases/ios/ipa?token=...`
- `https://baatcheet-bay.vercel.app/api/releases/android/apk?token=...`
