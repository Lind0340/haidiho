'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { signIn, signInWithMagicLink, signUp } from '@/lib/auth'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import { cn } from '@/lib/utils'

type Mode = 'signin' | 'signup' | 'magic'

type Props = {
  mode: Mode
}

export function AuthForm({ mode: initialMode }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/account'
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'magic') {
        await signInWithMagicLink(email)
        setMessage('Check your email for the magic link. ☕')
      } else if (mode === 'signup') {
        await signUp(email, password, username)
        setMessage('Account created — you may need to confirm your email.')
        router.push(next)
      } else {
        await signIn(email, password)
        router.push(next)
      }
    } catch (err) {
      setError(friendlyError(err, HaidihoErrors.auth))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] p-6 shadow-lg">
      <h1 className="font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        {mode === 'signup' ? 'Join the neighborhood' : 'Welcome back'}
      </h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {mode === 'signup' && (
          <input
            required
            placeholder="@handle"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
          />
        )}
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
        />
        {mode !== 'magic' && (
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
          />
        )}
        {error && <p className="text-sm font-semibold text-warm-pink">{error}</p>}
        {message && <p className="text-sm font-bold text-hai-blue">{message}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-hai-blue py-3 font-[family-name:var(--font-hand)] text-xl font-bold text-diho-cream disabled:opacity-60"
        >
          {busy ? 'One sec…' : mode === 'magic' ? 'Send magic link' : mode === 'signup' ? 'Sign up' : 'Sign in'}
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
        {(['signin', 'signup', 'magic'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-lg px-3 py-1',
              mode === m ? 'bg-hai-blue/15 text-hai-blue' : 'text-soft-charcoal/60 hover:underline',
            )}
          >
            {m === 'signin' ? 'Sign in' : m === 'signup' ? 'Sign up' : 'Magic link'}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-sm">
        <Link href="/" className="font-bold text-hai-blue hover:underline">
          ← Back home
        </Link>
      </p>
    </div>
  )
}
