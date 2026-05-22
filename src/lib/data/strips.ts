import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Strip } from '@/types/database'
import { STRIP_ENTRIES, type StripEntry } from '@/lib/strip-data'

export function dbStripToEntry(row: Strip): StripEntry {
  return {
    id: row.id,
    number: row.strip_number ?? 0,
    title: row.title,
    caption: row.caption ?? '',
    emphasizeLastLine: true,
    imageSrc: row.image_url,
    imageWidth: 1024,
    imageHeight: 682,
    inspiredByMember: row.inspired_by_member ?? undefined,
    slug: row.slug ?? undefined,
    category: row.category ?? undefined,
  } as StripEntry & { inspiredByMember?: string; slug?: string; category?: string }
}

export async function fetchPublishedStrips(): Promise<StripEntry[]> {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return [...STRIP_ENTRIES].sort((a, b) => a.number - b.number)

  const { data } = await supabase
    .from('strips')
    .select('id, strip_number, title, slug, image_url, caption, category, inspired_by_member, published_at, status')
    .eq('status', 'published')
    .order('strip_number', { ascending: true })

  if (!data?.length) {
    return [...STRIP_ENTRIES].sort((a, b) => a.number - b.number)
  }

  return data.map((row) => dbStripToEntry(row as Strip))
}

export async function fetchStripLikeCounts(stripIds: string[]) {
  const supabase = await createServerSupabaseClient()
  if (!supabase || !stripIds.length) return {} as Record<string, number>

  const { data } = await supabase.from('strip_likes').select('strip_id').in('strip_id', stripIds)
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.strip_id] = (counts[row.strip_id] ?? 0) + 1
  }
  return counts
}
