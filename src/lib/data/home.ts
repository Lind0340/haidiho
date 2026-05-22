import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { PostWithProfile, Strip } from '@/types/database'
import { SEED_POSTS } from '@/lib/neighborhood-data'
import { STRIP_ENTRIES } from '@/lib/strip-data'
import type { StripEntry } from '@/lib/strip-data'

export type HomeStats = {
  subscriberCount: number
  postCount: number
  mugCount: number
}

export type HomePageData = {
  latestStrip: StripEntry | null
  recentPosts: PostWithProfile[]
  featuredMug: {
    id: string
    member_name: string
    mug_text: string | null
    image_url: string
    member_title: string | null
  } | null
  stats: HomeStats
}

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

export async function fetchHomePageData(): Promise<HomePageData> {
  const supabase = await createServerSupabaseClient()
  const fallback: HomePageData = {
    latestStrip: staticLatestStrip(),
    recentPosts: [],
    featuredMug: null,
    stats: { subscriberCount: 0, postCount: SEED_POSTS.length, mugCount: 0 },
  }

  if (!supabase) return fallback

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekOf = weekStart.toISOString().slice(0, 10)

  const [stripRes, postsRes, mugRes, subCount, postCount, mugCount] = await Promise.all([
    supabase
      .from('strips')
      .select('*')
      .eq('status', 'published')
      .order('strip_number', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('community_posts')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('mug_submissions')
      .select('id, member_name, member_title, mug_text, image_url')
      .eq('status', 'approved')
      .eq('is_featured', true)
      .eq('featured_week', weekOf)
      .maybeSingle(),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('community_posts').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('mug_submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
  ])

  const latestStrip = stripRes.data ? dbStripToEntry(stripRes.data) : staticLatestStrip()

  return {
    latestStrip,
    recentPosts: (postsRes.data ?? []) as PostWithProfile[],
    featuredMug: mugRes.data,
    stats: {
      subscriberCount: subCount.count ?? 0,
      postCount: postCount.count ?? 0,
      mugCount: mugCount.count ?? 0,
    },
  }
}
