import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { MugSubmission } from '@/types/database'
import { MUG_WALL_ENTRIES, type MugWallEntry } from '@/lib/mug-wall-data'

function hashRotate(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) % 7
  return (h - 3) * 1.5
}

export function dbMugToEntry(row: MugSubmission, featured = false): MugWallEntry {
  return {
    id: row.id,
    polaroidSrc: row.image_url,
    mugText: row.mug_text ?? '',
    name: row.member_name,
    role: row.member_title ?? 'Community member',
    rotate: hashRotate(row.id),
    isFeatured: featured || row.is_featured,
  }
}

export async function fetchApprovedMugs() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return { mugs: MUG_WALL_ENTRIES, featuredId: null as string | null }
  }

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekOf = weekStart.toISOString().slice(0, 10)

  const { data } = await supabase
    .from('mug_submissions')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (!data?.length) {
    return { mugs: MUG_WALL_ENTRIES, featuredId: null }
  }

  const featured = data.find((m) => m.is_featured && m.featured_week === weekOf)
  const sorted = [...data].sort((a, b) => {
    if (featured && a.id === featured.id) return -1
    if (featured && b.id === featured.id) return 1
    return 0
  })

  return {
    mugs: sorted.map((m) => dbMugToEntry(m, m.id === featured?.id)),
    featuredId: featured?.id ?? null,
  }
}
