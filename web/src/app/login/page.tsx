import type {Metadata} from 'next'
import {LoginAccessCodeForm} from '@/components/LoginAccessCodeForm'

export const metadata: Metadata = {
  title: 'BaatCheet — Access',
  description: 'Enter your access code to open the BaatCheet install page.',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-950 px-4 py-16 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(16, 185, 129, 0.28), transparent)',
        }}
      />
      <div className="relative flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-400/90">
            BaatCheet
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Installs</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            This page is private. Enter the access code you were given to continue.
          </p>
        </div>
        <LoginAccessCodeForm />
      </div>
    </div>
  )
}
