'use client'

import { useState } from 'react'
import type { NewsletterSource } from '@/lib/data/newsletter'
import { HaidihoErrors } from '@/lib/errors'
import { cn } from '@/lib/utils'

type Props = {
  source: NewsletterSource
  className?: string
  compact?: boolean
}

export function NewsletterSignup({ source, className, compact }: Props) {
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
        'rounded-[18px] border border-[#ead8c2] bg-[#fff6e8] p-4 shadow-[0_6px_16px_rgba(45,45,45,0.06)]',
        className,
      )}
    >
      {!compact && (
        <p className="font-[family-name:var(--font-hand)] text-xl font-bold text-soft-charcoal">
          Say Haidiho to your inbox ❤️
        </p>
      )}
      <div className={cn('flex flex-col gap-2', !compact && 'mt-3')}>
        {!compact && (
          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-medium outline-none focus:border-hai-blue"
          />
        )}
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-medium outline-none focus:border-hai-blue"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-hai-blue px-4 py-2.5 font-[family-name:var(--font-hand)] text-lg font-bold text-diho-cream shadow-[0_4px_0_rgba(30,64,175,0.3)] disabled:opacity-60"
        >
          {busy ? 'Sending…' : 'Drop It In ❤️'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-warm-pink">{error}</p>}
      {message && <p className="mt-2 text-sm font-bold text-hai-blue">{message}</p>}
    </form>
  )
}
