'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ModerationQueueItem } from '@/types/database'
import { HaidihoErrors } from '@/lib/errors'
import { cn } from '@/lib/utils'

type Preview = {
  content?: string
  story_content?: string
  room?: string
  username?: string
  display_name?: string
  submitter_name?: string
  profiles?: { username?: string; display_name?: string } | { username?: string; display_name?: string }[]
}

type Item = ModerationQueueItem & { preview?: Preview | null }

const ROOM_LABEL: Record<string, string> = {
  water_cooler: '😂 Water Cooler',
  training_room: '💡 Training Room',
  help_desk: '🆘 Help Desk',
}

function displayName(preview: Preview | null | undefined) {
  if (!preview) return '@neighbor'
  if (preview.submitter_name) return preview.submitter_name
  const prof = Array.isArray(preview.profiles) ? preview.profiles[0] : preview.profiles
  return prof?.display_name ?? prof?.username ?? preview.username ?? '@neighbor'
}

function postBody(preview: Preview | null | undefined) {
  return preview?.content ?? preview?.story_content ?? ''
}

function AiBadge({ item }: { item: Item }) {
  if (item.ai_approved == null && !item.ai_reason) {
    return (
      <span className="rounded-full bg-soft-charcoal/10 px-2 py-0.5 text-xs font-bold text-soft-charcoal/60">
        Awaiting AI pre-screen
      </span>
    )
  }

  const rec = item.ai_approved ? 'AI recommends approve' : 'AI recommends reject'
  const conf = item.ai_confidence ?? '—'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          'rounded-full px-2.5 py-0.5 text-xs font-extrabold',
          item.ai_approved ? 'bg-hai-blue/15 text-hai-blue' : 'bg-warm-pink/15 text-warm-pink',
        )}
      >
        {rec}
      </span>
      <span className="rounded-full bg-accent-gold/20 px-2.5 py-0.5 text-xs font-bold text-[#9a6b12]">
        Confidence: {conf}
      </span>
      {item.ai_pre_approved && (
        <span className="rounded-full bg-[#c8e6c9] px-2.5 py-0.5 text-xs font-bold text-[#2e7d32]">
          AI pre-approved ✓
        </span>
      )}
      {item.needs_human_review && (
        <span className="rounded-full bg-warm-pink/10 px-2.5 py-0.5 text-xs font-bold text-warm-pink">
          Needs human review
        </span>
      )}
      {item.ai_confidence === 'medium' && item.ai_approved && (
        <span className="text-xs font-semibold text-soft-charcoal/65">
          AI approved with medium confidence — worth a quick look
        </span>
      )}
    </div>
  )
}

export function ModerationPanel() {
  const [tab, setTab] = useState<'pending' | 'rejected'>('pending')
  const [items, setItems] = useState<Item[]>([])
  const [skipped, setSkipped] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [focusIndex, setFocusIndex] = useState(0)

  const visible = items.filter((i) => !skipped.has(i.id))
  const focused = visible[focusIndex] ?? visible[0]

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/moderation?view=${tab}`)
    const data = await res.json()
    if (!res.ok) setError(data.error ?? HaidihoErrors.auth)
    else {
      setItems(data.items ?? [])
      setFocusIndex(0)
      setSkipped(new Set())
    }
  }, [tab])

  useEffect(() => {
    load()
  }, [load])

  async function act(item: Item, action: 'approve' | 'reject') {
    setBusy(item.id)
    const res = await fetch('/api/admin/moderation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, action }),
    })
    setBusy(null)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
      return
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setFocusIndex((i) => Math.max(0, i - 1))
  }

  function skip(item: Item) {
    setSkipped((prev) => new Set([...prev, item.id]))
    setFocusIndex((i) => Math.min(i + 1, visible.length - 1))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!focused || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      const key = e.key.toLowerCase()
      if (key === 'a') {
        e.preventDefault()
        if (tab === 'pending' && busy !== focused.id) void act(focused, 'approve')
      } else if (key === 'r') {
        e.preventDefault()
        if (tab === 'pending' && busy !== focused.id) void act(focused, 'reject')
      } else if (key === 's' || key === 'arrowright') {
        e.preventDefault()
        skip(focused)
      } else if (key === 'arrowdown') {
        e.preventDefault()
        setFocusIndex((i) => Math.min(i + 1, visible.length - 1))
      } else if (key === 'arrowup') {
        e.preventDefault()
        setFocusIndex((i) => Math.max(0, i - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused, tab, busy, visible.length])

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['pending', 'rejected'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-bold',
              tab === t ? 'bg-hai-blue text-diho-cream' : 'border border-[#ead8c2] text-soft-charcoal/70',
            )}
          >
            {t === 'pending' ? 'Wade’s queue' : 'AI rejections'}
          </button>
        ))}
        <p className="w-full text-xs font-semibold text-soft-charcoal/55">
          Shortcuts: <kbd className="rounded bg-diho-cream px-1">A</kbd> approve ·{' '}
          <kbd className="rounded bg-diho-cream px-1">R</kbd> reject ·{' '}
          <kbd className="rounded bg-diho-cream px-1">S</kbd> skip
        </p>
      </div>

      {error && <p className="mb-4 text-sm font-semibold text-warm-pink">{error}</p>}

      {visible.length === 0 ? (
        <p className="text-sm font-semibold text-soft-charcoal/60">
          {tab === 'pending' ? 'Queue is clear. Hai is pleased.' : 'No AI rejections logged yet.'}
        </p>
      ) : (
        <ul className="space-y-4">
          {visible.map((item, idx) => (
            <li
              key={item.id}
              className={cn(
                'rounded-[14px] border bg-[#fff6e8] p-4 text-sm transition-shadow',
                idx === focusIndex ? 'border-hai-blue ring-2 ring-hai-blue/25' : 'border-[#ead8c2]',
              )}
              onMouseEnter={() => setFocusIndex(idx)}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-bold capitalize text-soft-charcoal">
                  {item.content_type} · {new Date(item.created_at).toLocaleString()}
                </p>
                {item.preview?.room && (
                  <span className="font-bold text-hai-blue">
                    {ROOM_LABEL[item.preview.room] ?? item.preview.room}
                  </span>
                )}
              </div>

              <p className="mt-2 font-bold">{displayName(item.preview)}</p>

              <p className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-diho-cream/80 p-3 font-medium leading-relaxed text-soft-charcoal/90">
                {postBody(item.preview)}
              </p>

              <div className="mt-3">
                <AiBadge item={item} />
              </div>

              {item.ai_reason && (
                <p className="mt-2 text-xs font-semibold text-soft-charcoal/65">
                  <span className="font-extrabold">AI reasoning:</span> {item.ai_reason}
                </p>
              )}

              {item.ai_flags && item.ai_flags.length > 0 && (
                <p className="mt-1 text-xs text-soft-charcoal/55">
                  Flags: {item.ai_flags.join(', ')}
                </p>
              )}

              {tab === 'pending' ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy === item.id}
                    onClick={() => act(item, 'approve')}
                    className="rounded-lg bg-hai-blue px-4 py-2 font-bold text-diho-cream disabled:opacity-50"
                  >
                    Approve ✅
                  </button>
                  <button
                    type="button"
                    disabled={busy === item.id}
                    onClick={() => act(item, 'reject')}
                    className="rounded-lg border border-warm-pink px-4 py-2 font-bold text-warm-pink disabled:opacity-50"
                  >
                    Reject ❌
                  </button>
                  <button
                    type="button"
                    onClick={() => skip(item)}
                    className="rounded-lg border border-[#ead8c2] px-4 py-2 font-bold text-soft-charcoal/70"
                  >
                    Skip →
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-xs font-semibold text-soft-charcoal/55">
                  Rejected by AI · not shown on the board
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
