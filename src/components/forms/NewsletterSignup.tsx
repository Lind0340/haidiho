'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { NewsletterSource } from '@/lib/data/newsletter'
import { HaidihoErrors } from '@/lib/errors'
import { cn } from '@/lib/utils'

type Props = {
  source: NewsletterSource
  className?: string
  compact?: boolean
  variant?: 'default' | 'landing'
}

export function NewsletterSignup({ source, className, compact, variant = 'default' }: Props) {
  const landing = variant === 'landing'
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: firstName || undefined, source }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? HaidihoErrors.generic)
      } else {
        setMessage(data.message)
        setEmail('')
        setFirstName('')
      }
    } catch {
      setError(HaidihoErrors.generic)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'rounded-[18px] border border-[#ead8c2] p-4 shadow-[0_6px_16px_rgba(45,45,45,0.06)]',
        landing ? 'bg-[#fffef8]' : 'bg-[#fff6e8]',
        className,
      )}
    >
      {!compact && (
        <p className="text-center font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal">
          {landing ? (
            <>
              Say haidiho to your inbox <span className="text-warm-pink">❤️</span>
            </>
          ) : (
            'Say Haidiho to your inbox ❤️'
          )}
        </p>
      )}
      <div className={cn('flex flex-col gap-2', !compact && 'mt-3')}>
        {!compact && (
          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="field-touch rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2.5 text-base font-medium outline-none focus:border-hai-blue sm:text-sm"
          />
        )}
        <input
          type="email"
          required
          placeholder={landing ? 'Your email address' : 'you@email.com'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-touch rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2.5 text-base font-medium outline-none focus:border-hai-blue sm:text-sm"
        />
        <button
          type="submit"
          disabled={busy}
          className={cn(
            'field-touch rounded-xl bg-[#0867e8] px-4 py-3 font-[family-name:var(--font-hand)] text-lg font-bold text-white shadow-[0_6px_0_rgba(30,64,175,0.35)] disabled:opacity-60',
            !landing && 'bg-hai-blue text-diho-cream shadow-[0_4px_0_rgba(30,64,175,0.3)]',
          )}
        >
          {busy ? 'Sending…' : landing ? 'Yes, please! ❤️' : 'Drop It In ❤️'}
        </button>
      </div>
      <p className="mt-3 text-center text-xs font-semibold text-soft-charcoal/55">
        {landing ? (
          <>
            <span aria-hidden>🔒</span> We hate spam more than meetings. Pinky swear.{' '}
            <Link href="/privacy" className="text-hai-blue hover:underline">
              Privacy Policy
            </Link>
          </>
        ) : (
          <>
            By subscribing you agree to our{' '}
            <Link href="/privacy" className="text-hai-blue hover:underline">
              Privacy Policy
            </Link>
            . Unsubscribe anytime.
          </>
        )}
      </p>
      {error && <p className="mt-2 text-sm font-semibold text-warm-pink">{error}</p>}
      {message && <p className="mt-2 text-sm font-bold text-hai-blue">{message}</p>}
    </form>
  )
}
