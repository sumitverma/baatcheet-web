'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'

export function SignOutButton() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      await fetch('/api/auth/logout', {method: 'POST'})
      router.replace('/login')
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 disabled:opacity-50"
    >
      {isSigningOut ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
