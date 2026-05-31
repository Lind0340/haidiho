'use client'

import { EXCLUSIVE_LABELS, type ExclusiveType, type NewsletterIssueRow } from '@/lib/email/newsletter-types'
import { useCallback, useEffect, useState } from 'react'

type MugOption = {
  id: string
  member_name: string
  member_title: string | null
  mug_story: string | null
  image_url: string
  appeared_in_strip_id: string | null
}

type PostOption = {
  id: string
  room: string
  like_count: number
  preview: string
  username: string
}

type FormState = {
  issue_number: string
  title: string
  subject_line: string
  preview_text: string
  issue_date: string
  opening_line: string
  strip_site_image_url: string
  strip_newsletter_image_url: string
  strip_page_url: string
  difference_1: string
  difference_2: string
  difference_3: string
  difference_4: string
  difference_5: string
  featured_mug_id: string
  featured_post_ids: string[]
  tip_of_week: string
  exclusive_type: ExclusiveType | ''
  exclusive_content: string
}

function rowToForm(row?: NewsletterIssueRow | null, nextNumber = 1): FormState {
  return {
    issue_number: String(row?.issue_number ?? nextNumber),
    title: row?.title ?? `Haidiho #${String(row?.issue_number ?? nextNumber).padStart(3, '0')}`,
    subject_line: row?.subject_line ?? '',
    preview_text: row?.preview_text ?? '',
    issue_date: row?.issue_date ?? new Date().toISOString().slice(0, 10),
    opening_line: row?.opening_line ?? '',
    strip_site_image_url: row?.strip_site_image_url ?? '',
    strip_newsletter_image_url:
      row?.newsletter_strip_url ?? row?.strip_newsletter_image_url ?? '',
    strip_page_url: row?.strip_page_url ?? '',
    difference_1: row?.difference_1 ?? '',
    difference_2: row?.difference_2 ?? '',
    difference_3: row?.difference_3 ?? '',
    difference_4: row?.difference_4 ?? '',
    difference_5: row?.difference_5 ?? '',
    featured_mug_id: row?.featured_mug_id ?? '',
    featured_post_ids: row?.featured_post_ids ?? [],
    tip_of_week: row?.tip_of_week ?? '',
    exclusive_type: row?.exclusive_type ?? '',
    exclusive_content: row?.exclusive_content ?? '',
  }
}

function formToPayload(form: FormState) {
  const num = parseInt(form.issue_number, 10)
  return {
    issue_number: num,
    title: form.title.trim() || `Haidiho #${String(num).padStart(3, '0')}`,
    subject_line: form.subject_line.trim() || null,
    preview_text: form.preview_text.trim() || null,
    issue_date: form.issue_date || null,
    opening_line: form.opening_line.trim() || null,
    strip_site_image_url: form.strip_site_image_url.trim() || null,
    strip_newsletter_image_url: form.strip_newsletter_image_url.trim() || null,
    newsletter_strip_url: form.strip_newsletter_image_url.trim() || null,
    strip_page_url: form.strip_page_url.trim() || null,
    difference_1: form.difference_1.trim() || null,
    difference_2: form.difference_2.trim() || null,
    difference_3: form.difference_3.trim() || null,
    difference_4: form.difference_4.trim() || null,
    difference_5: form.difference_5.trim() || null,
    featured_mug_id: form.featured_mug_id || null,
    featured_post_ids: form.featured_post_ids,
    tip_of_week: form.tip_of_week.trim() || null,
    exclusive_type: form.exclusive_type || null,
    exclusive_content: form.exclusive_content.trim() || null,
    status: 'draft' as const,
  }
}

type Props = {
  initialIssue?: NewsletterIssueRow | null
  nextIssueNumber?: number
}

export function NewsletterComposer({ initialIssue, nextIssueNumber = 1 }: Props) {
  const [form, setForm] = useState(() => rowToForm(initialIssue, nextIssueNumber))
  const [mugs, setMugs] = useState<MugOption[]>([])
  const [posts, setPosts] = useState<PostOption[]>([])
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [testEmail, setTestEmail] = useState('')
  const [showSendModal, setShowSendModal] = useState(false)

  useEffect(() => {
    fetch('/api/admin/newsletter/options')
      .then((r) => r.json())
      .then((data) => {
        setMugs(data.mugs ?? [])
        setPosts(data.posts ?? [])
        setSubscriberCount(data.subscriberCount ?? 0)
        if (!initialIssue && data.nextIssueNumber) {
          setForm((f) => ({
            ...f,
            issue_number: String(data.nextIssueNumber),
            title: `Haidiho #${String(data.nextIssueNumber).padStart(3, '0')}`,
          }))
        }
      })
      .catch(() => {})
  }, [initialIssue])

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
    }

  const save = useCallback(async () => {
    setBusy('save')
    setMessage(null)
    const res = await fetch('/api/admin/newsletter/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formToPayload(form)),
    })
    const data = await res.json()
    setBusy(null)
    if (!res.ok) {
      setMessage(data.error ?? 'Save failed')
      return false
    }
    setMessage('Draft saved.')
    return true
  }, [form])

  const preview = useCallback(async () => {
    setBusy('preview')
    setMessage(null)
    const res = await fetch('/api/admin/newsletter/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formToPayload(form), save: true }),
    })
    const data = await res.json()
    setBusy(null)
    if (!res.ok) {
      setMessage(data.error ?? 'Preview failed')
      return
    }
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(data.html)
      w.document.close()
    }
    setMessage('Preview opened in a new tab.')
  }, [form])

  const sendTest = useCallback(async () => {
    if (!testEmail.trim()) {
      setMessage('Enter a test email address.')
      return
    }
    setBusy('test')
    if (!(await save())) {
      setBusy(null)
      return
    }
    const res = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issue_number: parseInt(form.issue_number, 10),
        mode: 'test',
        test_email: testEmail.trim(),
      }),
    })
    const data = await res.json()
    setBusy(null)
    setMessage(res.ok ? `Test email sent to ${testEmail}.` : data.error ?? 'Send failed')
  }, [form, testEmail, save])

  const broadcast = useCallback(async () => {
    setBusy('broadcast')
    setShowSendModal(false)
    if (!(await save())) {
      setBusy(null)
      return
    }
    const res = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issue_number: parseInt(form.issue_number, 10),
        mode: 'broadcast',
      }),
    })
    const data = await res.json()
    setBusy(null)
    setMessage(res.ok ? data.message : data.error ?? 'Send failed')
  }, [form, save])

  function togglePost(id: string) {
    setForm((f) => {
      const has = f.featured_post_ids.includes(id)
      if (has) {
        return { ...f, featured_post_ids: f.featured_post_ids.filter((x) => x !== id) }
      }
      if (f.featured_post_ids.length >= 5) return f
      return { ...f, featured_post_ids: [...f.featured_post_ids, id] }
    })
  }

  function movePost(id: string, dir: -1 | 1) {
    setForm((f) => {
      const idx = f.featured_post_ids.indexOf(id)
      if (idx === -1) return f
      const next = [...f.featured_post_ids]
      const swap = idx + dir
      if (swap < 0 || swap >= next.length) return f
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return { ...f, featured_post_ids: next }
    })
  }

  function onMugSelect(id: string) {
    setForm((f) => ({ ...f, featured_mug_id: id }))
  }

  const selectedMug = mugs.find((m) => m.id === form.featured_mug_id)
  const fieldClass =
    'mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm font-medium outline-none focus:border-hai-blue'
  const tipLen = form.tip_of_week.length

  return (
    <div className="space-y-8">
      <section className="rounded-[16px] border border-[#ead8c2] bg-[#fff6e8] p-5">
        <h2 className="font-bold text-soft-charcoal">Issue meta</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-soft-charcoal/80">
            Issue # (auto)
            <input className={fieldClass} value={form.issue_number} readOnly />
          </label>
          <label className="block text-sm font-semibold text-soft-charcoal/80">
            Date
            <input type="date" className={fieldClass} value={form.issue_date} onChange={set('issue_date')} />
          </label>
          <label className="col-span-full block text-sm font-semibold text-soft-charcoal/80">
            Subject line
            <span className="ml-1 font-normal text-soft-charcoal/50">
              Haidiho #[number] — [one punchy line]
            </span>
            <input
              className={fieldClass}
              placeholder='Haidiho #001 — The sandwich is under Professional Development.'
              value={form.subject_line}
              onChange={set('subject_line')}
            />
          </label>
          <p className="col-span-full text-xs text-soft-charcoal/55">
            e.g. &quot;Haidiho #007 — Total: who even knows.&quot;
          </p>
          <label className="col-span-full block text-sm font-semibold text-soft-charcoal/80">
            Preview text
            <span className="ml-1 font-normal text-soft-charcoal/50">DiHo&apos;s voice. One sentence.</span>
            <input className={fieldClass} value={form.preview_text} onChange={set('preview_text')} />
          </label>
          <label className="col-span-full block text-sm font-semibold text-soft-charcoal/80">
            Opening line
            <textarea
              className={`${fieldClass} min-h-[72px]`}
              placeholder="Hey. Good week? Either way here's the good stuff. ❤️"
              value={form.opening_line}
              onChange={set('opening_line')}
            />
          </label>
        </div>
      </section>

      <section className="rounded-[16px] border border-[#ead8c2] bg-[#fff6e8] p-5">
        <h2 className="font-bold text-soft-charcoal">Strip — spot the difference</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-soft-charcoal/80">
            Public strip URL
            <span className="block font-normal text-xs text-soft-charcoal/55">Already on the site</span>
            <input className={fieldClass} value={form.strip_site_image_url} onChange={set('strip_site_image_url')} />
            {form.strip_site_image_url && (
              <img src={form.strip_site_image_url} alt="" className="mt-2 max-h-32 rounded border" />
            )}
          </label>
          <label className="block text-sm font-semibold text-soft-charcoal/80">
            Newsletter strip URL (5 differences)
            <span className="block font-normal text-xs text-soft-charcoal/55">
              ChatGPT variant — never post publicly
            </span>
            <input
              className={fieldClass}
              value={form.strip_newsletter_image_url}
              onChange={set('strip_newsletter_image_url')}
            />
            {form.strip_newsletter_image_url && (
              <img src={form.strip_newsletter_image_url} alt="" className="mt-2 max-h-32 rounded border" />
            )}
          </label>
          <label className="col-span-full block text-sm font-semibold text-soft-charcoal/80">
            Strip page link
            <input className={fieldClass} value={form.strip_page_url} onChange={set('strip_page_url')} />
          </label>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="block text-sm font-semibold text-soft-charcoal/80">
              Difference {n}
              {n === 1 && (
                <span className="block font-normal text-xs text-soft-charcoal/55">
                  Populates upside-down reveal at bottom
                </span>
              )}
              <input
                className={fieldClass}
                placeholder={n === 1 ? "DiHo's notepad changed from 'Help.' to 'Send Help.'" : ''}
                value={form[`difference_${n}` as keyof FormState] as string}
                onChange={set(`difference_${n}` as keyof FormState)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[16px] border border-[#ead8c2] bg-[#fff6e8] p-5">
        <h2 className="font-bold text-soft-charcoal">Mug of the week</h2>
        <select
          className={fieldClass}
          value={form.featured_mug_id}
          onChange={(e) => onMugSelect(e.target.value)}
        >
          <option value="">Select approved mug…</option>
          {mugs.map((m) => (
            <option key={m.id} value={m.id}>
              {m.member_name}
              {m.appeared_in_strip_id ? ' ⭐' : ''}
            </option>
          ))}
        </select>
        {selectedMug && (
          <div className="mt-3 flex gap-4">
            <img src={selectedMug.image_url} alt="" className="h-24 w-24 rounded object-cover" />
            <p className="text-sm text-soft-charcoal/80">{selectedMug.mug_story}</p>
          </div>
        )}
      </section>

      <section className="rounded-[16px] border border-[#ead8c2] bg-[#fff6e8] p-5">
        <h2 className="font-bold text-soft-charcoal">Community posts (3–5)</h2>
        <p className="text-xs text-soft-charcoal/55">Selected: {form.featured_post_ids.length} / 5</p>
        <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
          {posts.map((p) => {
            const selected = form.featured_post_ids.includes(p.id)
            const order = form.featured_post_ids.indexOf(p.id)
            return (
              <li
                key={p.id}
                className={`rounded-lg border px-3 py-2 text-sm ${selected ? 'border-hai-blue bg-[#E8F2FC]' : 'border-[#ead8c2]'}`}
              >
                <label className="flex cursor-pointer gap-2">
                  <input type="checkbox" checked={selected} onChange={() => togglePost(p.id)} />
                  <span>
                    <span className="font-bold text-hai-blue">{p.username}</span> · {p.room.replace(/_/g, ' ')}
                    <br />
                    <span className="text-soft-charcoal/75">{p.preview}</span>
                  </span>
                </label>
                {selected && (
                  <div className="mt-2 flex gap-2">
                    <button type="button" className="text-xs font-bold" onClick={() => movePost(p.id, -1)}>
                      ↑
                    </button>
                    <button type="button" className="text-xs font-bold" onClick={() => movePost(p.id, 1)}>
                      ↓
                    </button>
                    <span className="text-xs text-soft-charcoal/50">#{order + 1}</span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-[16px] border border-[#ead8c2] bg-[#fff6e8] p-5">
        <h2 className="font-bold text-soft-charcoal">Tip of the week</h2>
        <textarea
          className={`${fieldClass} min-h-[96px]`}
          maxLength={300}
          value={form.tip_of_week}
          onChange={set('tip_of_week')}
        />
        <p className={`mt-1 text-xs ${tipLen > 300 ? 'text-warm-pink' : 'text-soft-charcoal/50'}`}>
          {tipLen}/300 — Practical. Specific. Hai&apos;s voice. Ends with ❤️
        </p>
      </section>

      <section className="rounded-[16px] border border-[#ead8c2] bg-[#fff6e8] p-5">
        <h2 className="font-bold text-soft-charcoal">Newsletter exclusive</h2>
        <select className={fieldClass} value={form.exclusive_type} onChange={set('exclusive_type')}>
          <option value="">Select type…</option>
          {(Object.keys(EXCLUSIVE_LABELS) as ExclusiveType[]).map((k) => (
            <option key={k} value={k}>
              {EXCLUSIVE_LABELS[k]}
            </option>
          ))}
        </select>
        <textarea
          className={`${fieldClass} mt-3 min-h-[120px] font-mono text-sm`}
          placeholder="Stay in character voice…"
          value={form.exclusive_content}
          onChange={set('exclusive_content')}
        />
      </section>

      <div className="flex flex-wrap items-end gap-3">
        <button
          type="button"
          disabled={!!busy}
          onClick={() => void save()}
          className="rounded-xl border border-[#ead8c2] bg-diho-cream px-4 py-2 font-bold text-soft-charcoal disabled:opacity-60"
        >
          {busy === 'save' ? 'Saving…' : 'Save draft'}
        </button>
        <button
          type="button"
          disabled={!!busy}
          onClick={() => void preview()}
          className="rounded-xl bg-hai-blue px-4 py-2 font-bold text-diho-cream disabled:opacity-60"
        >
          {busy === 'preview' ? 'Rendering…' : 'Preview Email'}
        </button>
        <label className="flex flex-col text-sm font-semibold text-soft-charcoal/80">
          Test send
          <input
            type="email"
            className="mt-1 rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
            placeholder="wade.lindgren@gmail.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </label>
        <button
          type="button"
          disabled={!!busy}
          onClick={() => void sendTest()}
          className="rounded-xl bg-warm-pink px-4 py-2 font-bold text-diho-cream disabled:opacity-60"
        >
          {busy === 'test' ? 'Sending…' : 'Send Test'}
        </button>
        <button
          type="button"
          disabled={!!busy || form.featured_post_ids.length < 3}
          onClick={() => setShowSendModal(true)}
          className="rounded-xl bg-[#16284C] px-4 py-2 font-bold text-diho-cream disabled:opacity-60"
        >
          Send Newsletter ❤️
        </button>
      </div>

      {form.featured_post_ids.length < 3 && (
        <p className="text-xs text-warm-pink">Select at least 3 neighborhood posts to send.</p>
      )}

      {message && <p className="text-sm font-bold text-hai-blue">{message}</p>}

      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-soft-charcoal/40 p-4">
          <div className="max-w-md rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] p-6 shadow-xl">
            <p className="font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal">
              Send Haidiho #{form.issue_number}?
            </p>
            <p className="mt-3 text-soft-charcoal/85">
              Send to <strong>{subscriberCount}</strong> subscribers? This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => void broadcast()}
                className="rounded-xl bg-hai-blue px-4 py-2 font-bold text-diho-cream"
              >
                Send It ❤️
              </button>
              <button
                type="button"
                onClick={() => setShowSendModal(false)}
                className="rounded-xl border border-[#ead8c2] px-4 py-2 font-bold"
              >
                Not yet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
