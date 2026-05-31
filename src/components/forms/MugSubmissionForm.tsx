'use client'

import { useState } from 'react'
import { LegalLink, TermsCheckbox } from '@/components/forms/TermsCheckbox'
import { HaidihoErrors } from '@/lib/errors'

export function MugSubmissionForm() {
  const [memberName, setMemberName] = useState('')
  const [memberTitle, setMemberTitle] = useState('')
  const [mugText, setMugText] = useState('')
  const [mugStory, setMugStory] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [termsAgreed, setTermsAgreed] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !termsAgreed) {
      setError(HaidihoErrors.validation)
      return
    }
    setBusy(true)
    setError(null)
    setMessage(null)

    const form = new FormData()
    form.set('member_name', memberName)
    form.set('member_title', memberTitle)
    form.set('mug_text', mugText)
    form.set('mug_story', mugStory)
    form.set('email', email)
    form.set('image', file)
    form.set('terms_agreed', 'true')

    try {
      const res = await fetch('/api/mugs', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? HaidihoErrors.generic)
      else {
        setMessage(data.message)
        setMemberName('')
        setMemberTitle('')
        setMugText('')
        setMugStory('')
        setFile(null)
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
      className="mt-6 rounded-[18px] border border-[#ead8c2] bg-[#fff6e8] p-4 shadow-[0_6px_16px_rgba(45,45,45,0.06)] sm:p-5"
    >
      <p className="font-[family-name:var(--font-hand)] text-xl font-bold text-soft-charcoal">
        Share your mug ☕
      </p>
      <p className="mt-1 text-xs font-semibold text-soft-charcoal/65">
        Community sharing only — a photo of a mug you already own.
      </p>
      <div className="mt-3 space-y-3">
        <input
          required
          placeholder="Your name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          className="field-touch w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-base sm:text-sm"
        />
        <input
          placeholder="Title / role (optional)"
          value={memberTitle}
          onChange={(e) => setMemberTitle(e.target.value)}
          className="field-touch w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-base sm:text-sm"
        />
        <input
          placeholder="What does your mug say? (optional)"
          value={mugText}
          onChange={(e) => setMugText(e.target.value)}
          className="field-touch w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-base sm:text-sm"
        />
        <label className="block text-xs font-bold text-soft-charcoal/70">
          Why do you love this mug?
          <span className="ml-1 font-normal text-soft-charcoal/50">(optional)</span>
          <textarea
            rows={3}
            placeholder="Gift from a friend, survived 200 standups, the handle fits your hand perfectly…"
            value={mugStory}
            onChange={(e) => setMugStory(e.target.value)}
            className="mt-1 w-full resize-y rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-medium leading-relaxed outline-none focus:border-hai-blue"
          />
        </label>
        <input
          type="email"
          placeholder="Email for confirmation"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-touch w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-base sm:text-sm"
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>
      <TermsCheckbox id="mug-terms" checked={termsAgreed} onChange={setTermsAgreed}>
        I have read and agree to the{' '}
        <LegalLink href="/mug-terms">Mug Submission Terms</LegalLink>
        {' '}
        (including possible use on the Mug Wall, in the newsletter, or in future strips)
      </TermsCheckbox>
      {error && <p className="mt-2 text-sm font-semibold text-warm-pink">{error}</p>}
      {message && <p className="mt-2 text-sm font-bold text-hai-blue">{message}</p>}
      <button
        type="submit"
        disabled={busy || !termsAgreed}
        className="field-touch mt-4 w-full rounded-xl bg-warm-pink px-4 py-3 font-[family-name:var(--font-hand)] text-xl font-bold text-diho-cream disabled:opacity-60"
      >
        {busy ? 'Uploading…' : 'Drop Your Mug In ❤️'}
      </button>
    </form>
  )
}
