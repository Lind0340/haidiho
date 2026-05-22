import { createAdminClient } from '@/lib/supabase-server'
import type { Strip } from '@/types/database'

export default async function AdminStripsPage() {
  const admin = createAdminClient()
  let strips: Pick<Strip, 'id' | 'strip_number' | 'title' | 'status' | 'published_at'>[] = []
  if (admin) {
    const { data } = await admin
      .from('strips')
      .select('id, strip_number, title, status, published_at')
      .order('strip_number')
    strips = data ?? []
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        Strips
      </h1>
      <p className="mt-1 text-sm text-soft-charcoal/70">
        Publish from Supabase or upload to the strips/ storage bucket.
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        {strips.map((s) => (
          <li key={s.id} className="rounded-lg border border-[#ead8c2] bg-[#fff6e8] px-3 py-2">
            #{s.strip_number} {s.title} — <span className="font-bold">{s.status}</span>
          </li>
        ))}
        {!strips.length && (
          <li className="text-soft-charcoal/60">No strips in database yet — static assets still show on /strip.</li>
        )}
      </ul>
    </div>
  )
}
