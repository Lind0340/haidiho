'use client'

import { useState } from 'react'
import { NEIGHBORHOOD_ROOMS } from '@/lib/neighborhood-data'
import type { RoomId } from '@/types/database'
import { HaidihoErrors } from '@/lib/errors'

export function StorySubmissionForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [room, setRoom] = useState<RoomId>('water_cooler')
  const [story, setStory] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, room, story_content: story }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? HaidihoErrors.generic)
      else {
        setMessage(data.message)
        setStory('')
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
      className="mx-auto mt-6 max-w-lg rounded-[18px] border border-[#ead8c2] bg-[#fff6e8] p-5 text-left shadow-[0_6px_16px_rgba(45,45,45,0.06)]"
    >
      <label className="block text-xs font-bold text-soft-charcoal/70">
        Your name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
        />
      </label>
      <label className="mt-3 block text-xs font-bold text-soft-charcoal/70">
        Email (for confirmation)
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
        />
      </label>
      <label className="mt-3 block text-xs font-bold text-soft-charcoal/70">
        Room
        <select
          value={room}
          onChange={(e) => setRoom(e.target.value as RoomId)}
          className="mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-semibold"
        >
          {NEIGHBORHOOD_ROOMS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.emoji} {r.name}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block text-xs font-bold text-soft-charcoal/70">
        Your story
        <textarea
          required
          rows={5}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="mt-1 w-full resize-y rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm leading-relaxed"
        />
      </label>
      {error && <p className="mt-2 text-sm font-semibold text-warm-pink">{error}</p>}
      {message && <p className="mt-2 text-sm font-bold text-hai-blue">{message}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-xl bg-hai-blue px-4 py-3 font-[family-name:var(--font-hand)] text-xl font-bold text-diho-cream disabled:opacity-60"
      >
        {busy ? 'Sending…' : 'Submit Your Story ❤️'}
      </button>
    </form>
  )
}
