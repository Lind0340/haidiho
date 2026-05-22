import { createAdminClient } from '@/lib/supabase-server'
import type { FeaturedContent } from '@/types/database'

export default async function AdminFeaturedPage() {
  const admin = createAdminClient()
  let featured: FeaturedContent[] = []
  if (admin) {
    const { data } = await admin
      .from('featured_content')
      .select('*')
      .order('week_of', { ascending: false })
      .limit(5)
    featured = (data ?? []) as FeaturedContent[]
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        Featured content
      </h1>
      <p className="mt-1 text-sm text-soft-charcoal/70">
        Set weekly featured strip, mug, and post in the featured_content table.
      </p>
      <ul className="mt-6 space-y-2 text-sm font-mono text-soft-charcoal/80">
        {featured.map((f) => (
          <li key={f.id}>
            Week {f.week_of}: strip {f.featured_strip_id ?? '—'} · mug {f.featured_mug_id ?? '—'}
          </li>
        ))}
        {!featured.length && <li>No featured weeks configured yet.</li>}
      </ul>
    </div>
  )
}
