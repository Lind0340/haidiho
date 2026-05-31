import { createServerSupabaseClient } from '@/lib/supabase-server'
import { STRIP_ENTRIES } from '@/lib/strip-data'
import type { StripEntry } from '@/lib/strip-data'
import type { Strip } from '@/types/database'

function staticLatestStrip(): StripEntry {
  return STRIP_ENTRIES[0]!
}

function dbStripToEntry(row: Strip): StripEntry {
  return {
    id: row.id,
    number: row.strip_number ?? 0,
    title: row.title,
    caption: row.caption ?? '',
    emphasizeLastLine: true,
    imageSrc: row.image_url,
    imageWidth: 1024,
    imageHeight: 682,
  }
}

export async function fetchHomeLatestStrip(): Promise<StripEntry> {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return staticLatestStrip()

  const { data } = await supabase
    .from('strips')
    .select('*')
    .eq('status', 'published')
    .order('strip_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data ? dbStripToEntry(data) : staticLatestStrip()
}
