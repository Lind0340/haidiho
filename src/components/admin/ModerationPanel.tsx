'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ModerationQueueItem } from '@/types/database'
import { HaidihoErrors } from '@/lib/errors'

type Item = ModerationQueueItem & { preview?: Record<string, unknown> | null }

export function ModerationPanel() {
  const [items, setItems] = useState<Item[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/moderation')
    const data = await res.json()
    if (!res.ok) setError(data.error ?? HaidihoErrors.auth)
    else setItems(data.items ?? [])
  }, [])

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
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm font-semibold text-warm-pink">{error}</p>}
      {items.length === 0 ? (
        <p className="text-sm font-semibold text-soft-charcoal/60">Queue is clear. Hai is pleased.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-[14px] border border-[#ead8c2] bg-[#fff6e8] p-4 text-sm"
            >
              <p className="font-bold capitalize">
                {item.content_type} · {new Date(item.created_at).toLocaleString()}
              </p>
              <pre className="mt-2 max-h-40 overflow-auto rounded bg-diho-cream/80 p-2 text-xs">
                {JSON.stringify(item.preview, null, 2)}
              </pre>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={busy === item.id}
                  onClick={() => act(item, 'approve')}
                  className="rounded-lg bg-hai-blue px-3 py-1.5 font-bold text-diho-cream disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busy === item.id}
                  onClick={() => act(item, 'reject')}
                  className="rounded-lg border border-warm-pink px-3 py-1.5 font-bold text-warm-pink disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
