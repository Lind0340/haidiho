'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function UnsubscribeContent() {
  const params = useSearchParams()
  const token = params.get('token')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!token) {
    return (
      <p className="text-center font-semibold text-soft-charcoal">
        This unsubscribe link is missing a token. Try the link from your latest Haidiho email.
      </p>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal">
          You&apos;re unsubscribed.
        </p>
        <p className="mt-4 text-soft-charcoal/80">
          The neighborhood will miss you. BOB filed it under Significant Events. ❤️
        </p>
        <Link href="/say-haidiho" className="mt-6 inline-block font-bold text-hai-blue hover:underline">
          Say Haidiho again anytime
        </Link>
      </div>
    )
  }

  async function confirmUnsubscribe() {
    setBusy(true)
    setError(null)
    const res = await fetch('/api/newsletter/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    setBusy(false)
    if (!res.ok) {
      setError('Something went wrong. Try again or email hello@haidiho.com.')
      return
    }
    setDone(true)
  }

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <div className="rounded-[16px] border border-[#ead8c2] bg-[#fff6e8] p-5 text-left">
        <p className="font-semibold italic text-[#F5A623]">
          Oh. Okay. No hard feelings. You can always come back. ❤️
        </p>
        <p className="mt-2 text-sm text-soft-charcoal/80">— DiHo</p>
      </div>
      <div className="rounded-[16px] border border-[#ead8c2] bg-[#E8F2FC] p-5 text-left">
        <p className="text-sm text-soft-charcoal">
          I have prepared a re-engagement sequence—
        </p>
        <p className="mt-2 text-sm font-semibold text-soft-charcoal/80">— Hai</p>
      </div>
      <div className="rounded-[16px] border border-[#ead8c2] bg-[#fff6e8] p-5 text-left">
        <p className="font-semibold text-soft-charcoal">Hai. No.</p>
        <p className="mt-2 text-sm text-soft-charcoal/80">— DiHo</p>
      </div>
      <div className="rounded-[16px] border border-[#ead8c2] bg-[#E8F2FC] p-5 text-left">
        <p className="text-sm text-soft-charcoal">Understood. ❤️</p>
        <p className="mt-2 text-sm text-soft-charcoal/80">— Hai</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          disabled={busy}
          onClick={() => void confirmUnsubscribe()}
          className="field-touch rounded-xl border border-[#ead8c2] bg-diho-cream px-5 py-3 font-bold text-soft-charcoal disabled:opacity-60"
        >
          {busy ? 'One sec…' : 'Yes, unsubscribe me'}
        </button>
        <Link
          href="/"
          className="field-touch rounded-xl bg-hai-blue px-5 py-3 font-bold text-diho-cream"
        >
          Actually nevermind ❤️
        </Link>
      </div>
      {error && <p className="text-sm font-semibold text-warm-pink">{error}</p>}
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-center font-[family-name:var(--font-hand)] text-4xl font-bold text-soft-charcoal">
        unsubscribe
      </h1>
      <div className="mt-10">
        <Suspense fallback={<p className="text-center text-soft-charcoal/70">Loading…</p>}>
          <UnsubscribeContent />
        </Suspense>
      </div>
    </div>
  )
}
