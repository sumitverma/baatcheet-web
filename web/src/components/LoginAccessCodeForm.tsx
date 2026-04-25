'use client'

import {useRouter} from 'next/navigation'
import {type FormEvent, useState} from 'react'

export function LoginAccessCodeForm() {
  const router = useRouter()
  const [accessCode, setAccessCode] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({accessCode}),
      })
      const payload = (await response.json().catch(() => null)) as {error?: string} | null
      if (!response.ok) {
        setErrorMessage(payload?.error ?? 'Something went wrong. Try again.')
        return
      }
      router.replace('/')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/60 p-8 shadow-xl backdrop-blur-md"
    >
      <label className="flex flex-col gap-2 text-sm text-zinc-300">
        Access code
        <input
          name="accessCode"
          type="password"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={accessCode}
          onChange={(event) => setAccessCode(event.target.value)}
          className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-base text-white outline-none ring-emerald-500/40 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-2"
          placeholder="Enter your code"
          required
        />
      </label>
      {errorMessage ? (
        <p className="text-sm text-rose-300" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-emerald-600 px-4 py-3 text-base font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Checking…' : 'Continue'}
      </button>
    </form>
  )
}
