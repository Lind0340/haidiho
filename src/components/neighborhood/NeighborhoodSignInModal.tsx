'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LegalLink, TermsCheckbox } from '@/components/forms/TermsCheckbox'
import { signIn, signUp } from '@/lib/auth'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'

function scrollKey(room?: string) {
  return room ? `neighborhood_scroll_${room}` : 'neighborhood_scroll_y'
}

type Props = {
  open: boolean
  onClose: () => void
  onSignedIn: () => void
  /** First-time posters: default to sign-up tab */
  defaultMode?: 'signin' | 'signup'
  /** Preserve scroll position for this room after auth */
  scrollRoom?: string
}

export function saveNeighborhoodScroll(room?: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(scrollKey(room), String(window.scrollY))
  }
}

export function restoreNeighborhoodScroll(room?: string) {
  if (typeof window === 'undefined') return
  const key = scrollKey(room)
  const raw = sessionStorage.getItem(key)
  if (!raw) return
  const y = Number(raw)
  sessionStorage.removeItem(key)
  requestAnimationFrame(() => {
    window.scrollTo(0, y)
  })
}

export function NeighborhoodSignInModal({
  open,
  onClose,
  onSignedIn,
  defaultMode = 'signin',
  scrollRoom,
}: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(defaultMode)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [termsAgreed, setTermsAgreed] = useState(false)

  useEffect(() => {
    if (!open) return
    setAuthMode(defaultMode)
    setError(null)
    setTermsAgreed(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, defaultMode])

  if (!open) return null

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    if (!supabase) {
      setError('Sign-in is not configured yet.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      if (authMode === 'signup') {
        if (!username.trim()) {
          setError('Pick a @handle for the neighborhood.')
          setBusy(false)
          return
        }
        await signUp(email, password, username)
      } else {
        await signIn(email, password)
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setBusy(false)
        setError(
          authMode === 'signup'
            ? 'Account created! Check your email to confirm, then sign in to post. ❤️'
            : 'Sign-in did not complete. Try again or check your email confirmation.',
        )
        return
      }
    } catch (err) {
      setBusy(false)
      setError(err instanceof Error ? err.message : 'Sign-in failed')
      return
    }
    setBusy(false)
    router.refresh()
    restoreNeighborhoodScroll(scrollRoom)
    onSignedIn()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center bg-soft-charcoal/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="neighborhood-signin-title"
    >
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 max-h-[min(90vh,100dvh)] w-full max-w-md overflow-y-auto rounded-t-[20px] border border-[#ead8c2] bg-[#fff6e8] p-5 shadow-[0_16px_40px_rgba(45,45,45,0.2)] sm:max-h-none sm:rounded-[20px] sm:p-6">
        <h2
          id="neighborhood-signin-title"
          className="font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal"
        >
          Join the neighborhood
        </h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-soft-charcoal/80">
          Join the neighborhood to pin your own stories and like others. ❤️
        </p>

        <form onSubmit={handleAuth} className="mt-5 space-y-3">
          <div className="flex gap-2">
            {(['signin', 'signup'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAuthMode(mode)}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-sm font-bold transition-colors',
                  authMode === mode
                    ? 'border-hai-blue bg-hai-blue/15 text-hai-blue'
                    : 'border-[#ead8c2] text-soft-charcoal/70 hover:bg-diho-cream',
                )}
              >
                {mode === 'signup' ? 'Sign up' : 'Sign in'}
              </button>
            ))}
          </div>
          {authMode === 'signup' && (
            <label className="block text-xs font-bold text-soft-charcoal/70">
              Your @handle
              <input
                type="text"
                required
                placeholder="@you"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-medium outline-none focus:border-hai-blue"
              />
            </label>
          )}
          <label className="block text-xs font-bold text-soft-charcoal/70">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-medium outline-none focus:border-hai-blue"
            />
          </label>
          <label className="block text-xs font-bold text-soft-charcoal/70">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-medium outline-none focus:border-hai-blue"
            />
          </label>
          {authMode === 'signup' && (
            <TermsCheckbox
              id="neighborhood-signup-terms"
              checked={termsAgreed}
              onChange={setTermsAgreed}
            >
              I agree to the <LegalLink href="/terms">Terms of Service</LegalLink> and{' '}
              <LegalLink href="/privacy">Privacy Policy</LegalLink>
            </TermsCheckbox>
          )}
          {error && <p className="text-sm font-semibold text-warm-pink">{error}</p>}
          <button
            type="submit"
            disabled={busy || (authMode === 'signup' && !termsAgreed)}
            className="w-full rounded-xl bg-warm-pink px-4 py-3 font-[family-name:var(--font-hand)] text-xl font-bold text-diho-cream shadow-[0_6px_0_rgba(180,60,90,0.35)] disabled:opacity-60"
          >
            {busy ? 'One sec…' : authMode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
