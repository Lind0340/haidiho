'use client'

import { useCallback, useEffect, useState } from 'react'
import { CHARACTER_LIST, type CharacterId } from '@/lib/characters'
import { CharacterResponseCard } from '@/components/neighborhood/CharacterResponseCard'
import { getRoom, type CharacterResponseView } from '@/lib/neighborhood-data'
import type { AdminPostPickerOption } from '@/lib/neighborhood-data'
import { HaidihoErrors } from '@/lib/errors'
import { cn } from '@/lib/utils'

export function CharacterResponsePanel() {
  const [posts, setPosts] = useState<AdminPostPickerOption[]>([])
  const [recent, setRecent] = useState<CharacterResponseView[]>([])
  const [canPostToday, setCanPostToday] = useState(true)
  const [postedToday, setPostedToday] = useState(0)
  const [character, setCharacter] = useState<CharacterId>('diho')
  const [postId, setPostId] = useState('')
  const [content, setContent] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/character-responses')
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? HaidihoErrors.auth)
      return
    }
    setPosts(data.posts ?? [])
    setRecent(data.recent ?? [])
    setCanPostToday(Boolean(data.canPostToday))
    setPostedToday(data.postedToday ?? 0)
    setPostId((current) => current || data.posts?.[0]?.id || '')
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setSuccess(null)

    const res = await fetch('/api/admin/character-responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, character, content }),
    })
    const data = await res.json()
    setBusy(false)

    if (!res.ok) {
      setError(data.error ?? HaidihoErrors.generic)
      return
    }

    setContent('')
    setSuccess(data.message ?? 'Posted.')
    setCanPostToday(Boolean(data.canPostToday))
    setPostedToday((n) => n + 1)
    if (data.response) {
      setRecent((prev) => [data.response, ...prev].slice(0, 8))
    }
    void load()
  }

  const selectedPost = posts.find((p) => p.id === postId)

  return (
    <div className="space-y-8">
      <div className="rounded-[14px] border border-[#ead8c2] bg-[#fff6e8] p-4 text-sm font-semibold text-soft-charcoal/85">
        <p>
          Manual only — Wade posts when a neighbor deserves a surprise reply from DiHo, Hai, or BOB.
          Not automated. Aim for occasional, unexpected moments.
        </p>
        <p className="mt-2 font-bold text-soft-charcoal">
          {canPostToday
            ? 'You can post one character response today.'
            : `Daily limit reached (${postedToday} in the last 24h). Try again tomorrow.`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-[14px] border border-[#ead8c2] bg-[#fff6e8] p-5">
        <h2 className="font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal">
          Compose character response
        </h2>

        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wide text-soft-charcoal/60">
            Character
          </legend>
          <div className="flex flex-wrap gap-2">
            {CHARACTER_LIST.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCharacter(c.id)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-bold transition-colors',
                  character === c.id
                    ? c.id === 'diho'
                      ? 'border-accent-gold bg-accent-gold/20 text-[#9a6b12]'
                      : c.id === 'hai'
                        ? 'border-hai-blue bg-hai-blue/15 text-hai-blue'
                        : 'border-[#d4c4a8] bg-[#faf6ef] text-soft-charcoal'
                    : 'border-[#ead8c2] text-soft-charcoal/65 hover:bg-diho-cream',
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-soft-charcoal/55">{CHARACTER_LIST.find((c) => c.id === character)?.title}</p>
        </fieldset>

        <label className="block text-xs font-bold text-soft-charcoal/70">
          Reply to post
          <select
            required
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-semibold"
          >
            <option value="">Select a post…</option>
            {posts.map((p) => {
              const room = getRoom(p.room)
              return (
                <option key={p.id} value={p.id}>
                  {room.emoji} {p.username}: {p.content.slice(0, 72)}
                  {p.content.length > 72 ? '…' : ''}
                </option>
              )
            })}
          </select>
        </label>

        {selectedPost && (
          <blockquote className="rounded-lg border border-dashed border-[#ead8c2] bg-diho-cream/60 px-3 py-2 text-xs font-medium text-soft-charcoal/80">
            <span className="font-bold">{selectedPost.username}</span> {selectedPost.content}
          </blockquote>
        )}

        <label className="block text-xs font-bold text-soft-charcoal/70">
          Response (in character voice)
          <textarea
            required
            minLength={5}
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              character === 'diho'
                ? 'Dry, warm, a little sarcastic…'
                : character === 'hai'
                  ? 'Enthusiastic, helpful, maybe too many exclamation points…'
                  : 'Done. ✅ (or three words max)…'
            }
            className="mt-1 w-full resize-y rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-medium leading-relaxed"
          />
        </label>

        {error && <p className="text-sm font-semibold text-warm-pink">{error}</p>}
        {success && <p className="text-sm font-bold text-hai-blue">{success}</p>}

        <button
          type="submit"
          disabled={busy || !canPostToday}
          className="rounded-xl bg-hai-blue px-4 py-3 font-[family-name:var(--font-hand)] text-xl font-bold text-diho-cream disabled:opacity-50"
        >
          {busy ? 'Posting…' : 'Post as character ❤️'}
        </button>
      </form>

      {recent.length > 0 && (
        <section>
          <h3 className="mb-3 font-[family-name:var(--font-hand)] text-xl font-bold text-soft-charcoal">
            Recent character responses
          </h3>
          <ul className="space-y-3">
            {recent.map((r) => (
              <li key={r.id}>
                <CharacterResponseCard response={r} />
                <p className="mt-1 text-xs font-semibold text-soft-charcoal/50">
                  On post {r.postId.slice(0, 8)}…
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
