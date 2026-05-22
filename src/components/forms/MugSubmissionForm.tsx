'use client'

import { useState } from 'react'
import { HaidihoErrors } from '@/lib/errors'

export function MugSubmissionForm() {
  const [memberName, setMemberName] = useState('')
  const [memberTitle, setMemberTitle] = useState('')
  const [mugText, setMugText] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
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
    form.set('email', email)
    form.set('image', file)

    try {
      const res = await fetch('/api/mugs', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? HaidihoErrors.generic)
      else {
        setMessage(data.message)
        setMemberName('')
        setMugText('')
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
      className="mt-6 rounded-[18px] border border-[#ead8c2] bg-[#fff6e8] p-5 shadow-[0_6px_16px_rgba(45,45,45,0.06)]"
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
          className="w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
        />
        <input
          placeholder="Title / role (optional)"
          value={memberTitle}
          onChange={(e) => setMemberTitle(e.target.value)}
          className="w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
        />
        <input
          placeholder="What does your mug say?"
          value={mugText}
          onChange={(e) => setMugText(e.target.value)}
          className="w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="Email for confirmation"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-warm-pink">{error}</p>}
      {message && <p className="mt-2 text-sm font-bold text-hai-blue">{message}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-xl bg-warm-pink px-4 py-3 font-[family-name:var(--font-hand)] text-xl font-bold text-diho-cream disabled:opacity-60"
      >
        {busy ? 'Uploading…' : 'Drop Your Mug In ❤️'}
      </button>
    </form>
  )
}
