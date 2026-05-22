import { createServerSupabaseClient } from '@/lib/supabase-server'
import { fetchCharacterResponsesForPosts } from '@/lib/data/character-responses'
import type { PostWithProfile, RoomId, RoomStats } from '@/types/database'
import { postRowToNeighborhood } from '@/lib/data/neighborhood-map'
import type { NeighborhoodPost } from '@/lib/neighborhood-data'

export { postRowToNeighborhood, PAGE_SIZE } from '@/lib/data/neighborhood-map'

const PAGE_SIZE = 20

function profileName(
  p: { username: string | null; display_name: string | null } | null | undefined,
) {
  if (!p) return '@neighbor'
  if (p.username) return p.username.startsWith('@') ? p.username : `@${p.username}`
  if (p.display_name) return p.display_name
  return '@neighbor'
}

export async function fetchRoomStats(): Promise<RoomStats[]> {
  const rooms: RoomId[] = ['water_cooler', 'training_room', 'help_desk']
  const empty = rooms.map((room) => ({
    room,
    post_count: 0,
    latest_post: null,
    latest_preview: null,
  }))

  const supabase = await createServerSupabaseClient()
  if (!supabase) return empty

  const { data, error } = await supabase
    .from('community_posts')
    .select('room, created_at, content, profiles(username, display_name)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error || !data?.length) return empty

  const map = new Map<
    RoomId,
    {
      count: number
      latest_post: string | null
      latest_preview: RoomStats['latest_preview']
    }
  >()
  for (const room of rooms) {
    map.set(room, { count: 0, latest_post: null, latest_preview: null })
  }

  for (const row of data) {
    const r = row.room as RoomId
    const cur = map.get(r)
    if (!cur) continue
    cur.count++
    if (!cur.latest_preview) {
      const profiles = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
      cur.latest_post = row.created_at
      cur.latest_preview = {
        username: profileName(profiles),
        content: row.content,
        createdAt: row.created_at,
      }
    }
  }

  return rooms.map((room) => {
    const v = map.get(room)!
    return {
      room,
      post_count: v.count,
      latest_post: v.latest_post,
      latest_preview: v.latest_preview,
    }
  })
}

export async function fetchCommunityPosts(opts: {
  room?: RoomId | 'all'
  cursor?: string
  limit?: number
  userId?: string | null
}): Promise<{ posts: NeighborhoodPost[]; nextCursor: string | null; error?: string }> {
  const supabase = await createServerSupabaseClient()
  const limit = opts.limit ?? PAGE_SIZE

  if (!supabase) {
    return { posts: [], nextCursor: null, error: 'not_configured' }
  }

  let query = supabase
    .from('community_posts')
    .select('*, profiles(username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (opts.userId) {
    query = query.or(`status.eq.approved,and(user_id.eq.${opts.userId},status.eq.pending)`)
  } else {
    query = query.eq('status', 'approved')
  }

  if (opts.room && opts.room !== 'all') query = query.eq('room', opts.room)
  if (opts.cursor) query = query.lt('created_at', opts.cursor)

  const { data, error } = await query
  if (error) {
    return { posts: [], nextCursor: null, error: error.message }
  }

  if (!data?.length) {
    return { posts: [], nextCursor: null }
  }

  let likedSet = new Set<string>()
  if (opts.userId) {
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', opts.userId)
      .in(
        'post_id',
        data.map((p) => p.id),
      )
    likedSet = new Set((likes ?? []).map((l) => l.post_id))
  }

  const postIds = (data as PostWithProfile[]).map((r) => r.id)
  const characterMap = await fetchCharacterResponsesForPosts(postIds)

  const posts = (data as PostWithProfile[]).map((row) => {
    const mapped = postRowToNeighborhood(row, likedSet.has(row.id))
    return {
      ...mapped,
      characterResponses: characterMap.get(row.id) ?? [],
    }
  })

  const nextCursor = data.length === limit ? data[data.length - 1]!.created_at : null
  return { posts, nextCursor }
}

export async function fetchPostComments(postId: string) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('post_comments')
    .select('*, profiles(username, display_name)')
    .eq('post_id', postId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true })

  return (data ?? []).map((c) => {
    const profiles = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
    return {
      id: c.id,
      content: c.content,
      username: profileName(profiles),
      createdAt: c.created_at,
    }
  })
}
