'use client'

import { useEffect, useState } from 'react'
import { LegalLink, TermsCheckbox } from '@/components/forms/TermsCheckbox'
import { authFetch } from '@/lib/auth-fetch'
import { NEIGHBORHOOD_ROOMS, type RoomId } from '@/lib/neighborhood-data'
import { HaidihoErrors } from '@/lib/errors'

type Props = {
  open: boolean
  onClose: () => void
  onSubmitted: (message: string, room: RoomId) => void
  defaultRoom?: RoomId | null
  displayName: string
}

export function SubmitStoryModal({
  open,
  onClose,
  onSubmitted,
  defaultRoom,
  displayName,
}: Props) {
  const [room, setRoom] = useState<RoomId>(defaultRoom ?? 'water_cooler')
  const [story, setStory] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [termsAgreed, setTermsAgreed] = useState(false)

  useEffect(() => {
    if (!open) return
    if (defaultRoom) setRoom(defaultRoom)
    setError(null)
    setTermsAgreed(false)
  }, [open, defaultRoom])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    try {
      const res = await authFetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: story.trim(),
          story_content: story.trim(),
          room,
          terms_agreed: true,
        }),
      })
      const data = await res.json().catch(() => ({}))
      setBusy(false)

      if (!res.ok) {
        setError(
          res.status === 401
            ? (data.error ?? HaidihoErrors.authToPost)
            : (data.error ?? HaidihoErrors.generic),
        )
        return
      }

      setStory('')
      onSubmitted(data.message ?? HaidihoErrors.storySuccess, room)
      onClose()
    } catch {
      setBusy(false)
      setError(HaidihoErrors.generic)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-soft-charcoal/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-story-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] p-5 shadow-[0_16px_40px_rgba(45,45,45,0.2)] sm:p-6">
        <h2
          id="submit-story-title"
          className="font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal sm:text-3xl"
        >
          Submit Your Story ❤️
        </h2>
        <p className="mt-1 text-sm font-semibold text-soft-charcoal/75">
          Posting as <span className="font-bold text-soft-charcoal">{displayName}</span>. Hai
          reads it in a second — if it fits, it goes live right away.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label className="block text-xs font-bold text-soft-charcoal/70">
            Which room?
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value as RoomId)}
              className="mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-semibold outline-none focus:border-hai-blue"
            >
              {NEIGHBORHOOD_ROOMS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.emoji} {r.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-bold text-soft-charcoal/70">
            Your story
            <textarea
              required
              minLength={20}
              rows={5}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="What did your AI coworker do this time?"
              className="mt-1 w-full resize-y rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-medium leading-relaxed outline-none focus:border-hai-blue"
            />
          </label>
          <TermsCheckbox
            id="story-terms-modal"
            checked={termsAgreed}
            onChange={setTermsAgreed}
          >
            I have read and agree to the{' '}
            <LegalLink href="/story-terms">Story Submission Terms</LegalLink>
          </TermsCheckbox>
          {error && <p className="text-sm font-semibold text-warm-pink">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#ead8c2] px-4 py-3 text-sm font-bold text-soft-charcoal/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || !termsAgreed}
              className="flex-1 rounded-xl bg-hai-blue px-4 py-3 font-[family-name:var(--font-hand)] text-xl font-bold text-diho-cream shadow-[0_6px_0_rgba(30,64,175,0.3)] disabled:opacity-60"
            >
              {busy ? 'Dropping…' : 'Drop It In ❤️'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
