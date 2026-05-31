'use client'

import { useEffect, useState } from 'react'
import { LegalLink, TermsCheckbox } from '@/components/forms/TermsCheckbox'
import { PushPin } from '@/components/neighborhood/bulletin/PushPin'
import { authFetch } from '@/lib/auth-fetch'
import { NEIGHBORHOOD_ROOMS, type RoomId } from '@/lib/neighborhood-data'
import { HaidihoErrors } from '@/lib/errors'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
  onSubmitted: (message: string, room: RoomId) => void
  defaultRoom?: RoomId | null
  displayName: string
}

export function BulletinSubmitModal({
  open,
  onClose,
  onSubmitted,
  defaultRoom,
  displayName,
}: Props) {
  const [room, setRoom] = useState<RoomId>(defaultRoom ?? 'water_cooler')
  const [story, setStory] = useState('')
  const [city, setCity] = useState('')
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

    const trimmed = story.trim()
    const loc = city.trim()
    const payload = loc ? `📍 ${loc}\n\n${trimmed}` : trimmed

    try {
      const res = await authFetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: payload,
          story_content: payload,
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
      setCity('')
      onSubmitted(data.message ?? HaidihoErrors.storySuccess, room)
      onClose()
    } catch {
      setBusy(false)
      setError(HaidihoErrors.generic)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#1a1208]/65 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulletin-submit-title"
    >
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 max-h-[min(92vh,100dvh)] w-full max-w-lg overflow-y-auto rounded-t-2xl sm:max-h-[90vh] sm:rounded-none">
        <div className="relative rounded-t-2xl bg-[#f5efe0] px-4 pb-5 pt-7 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:rounded-sm sm:px-6">
          <PushPin color="#f5a623" />
          <h2
            id="bulletin-submit-title"
            className="font-[family-name:var(--font-caveat)] text-3xl font-bold text-guide-navy"
          >
            Share Your Story ❤️
          </h2>
          <p className="mt-1 font-sans text-sm font-semibold text-soft-charcoal/75">
            Pinning as <span className="font-bold">{displayName}</span>
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <fieldset>
              <legend className="font-sans text-xs font-bold text-soft-charcoal/70">Which room?</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {NEIGHBORHOOD_ROOMS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoom(r.id)}
                    className={cn(
                      'min-h-[2.75rem] rounded-full border px-3 py-2 font-sans text-xs font-extrabold transition-colors touch-manipulation',
                      room === r.id
                        ? 'border-hai-blue bg-hai-blue text-diho-cream shadow-sm'
                        : 'border-[#d4c4a8] bg-white/60 text-soft-charcoal hover:border-hai-blue/50',
                    )}
                  >
                    {r.emoji} {r.name.replace('The ', '')}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block font-sans text-xs font-bold text-soft-charcoal/70">
              Your city <span className="font-normal">(optional)</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Seattle, Austin, wherever home is…"
                className="mt-1 w-full rounded-lg border border-[#d4c4a8] bg-white px-3 py-2 text-sm font-medium outline-none focus:border-hai-blue"
              />
            </label>

            <label className="block font-sans text-xs font-bold text-soft-charcoal/70">
              Your story
              <textarea
                required
                minLength={20}
                rows={6}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="What happened with your AI coworker?"
                className="notebook-lines mt-1 w-full resize-y rounded-lg border border-[#d4c4a8] bg-white px-3 py-2 font-[family-name:var(--font-caveat)] text-xl leading-relaxed outline-none focus:border-hai-blue"
              />
            </label>

            <TermsCheckbox id="bulletin-story-terms" checked={termsAgreed} onChange={setTermsAgreed}>
              I have read and agree to the{' '}
              <LegalLink href="/story-terms">Story Submission Terms</LegalLink>
            </TermsCheckbox>

            {error && <p className="font-sans text-sm font-semibold text-warm-pink">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#d4c4a8] px-4 py-3 font-sans text-sm font-bold text-soft-charcoal/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || !termsAgreed}
                className="flex-1 rounded-xl bg-accent-gold px-4 py-3 font-[family-name:var(--font-caveat)] text-2xl font-bold text-soft-charcoal shadow-[0_5px_0_rgba(154,107,18,0.3)] disabled:opacity-60"
              >
                {busy ? 'Pinning…' : 'Pin It ❤️'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
