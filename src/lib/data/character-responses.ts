import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import type { AdminPostPickerOption, CharacterResponseView } from '@/lib/neighborhood-data'
import type { CharacterId } from '@/lib/characters'
import type { RoomId } from '@/types/database'

export type CharacterResponseRow = {
  id: string
  post_id: string
  character: CharacterId
  content: string
  created_at: string
}

export function rowToCharacterResponse(row: CharacterResponseRow): CharacterResponseView {
  return {
    id: row.id,
    postId: row.post_id,
    character: row.character,
    content: row.content,
    createdAt: row.created_at,
  }
}

export async function fetchCharacterResponsesForPosts(
  postIds: string[],
): Promise<Map<string, CharacterResponseView[]>> {
  const map = new Map<string, CharacterResponseView[]>()
  if (!postIds.length) return map

  const supabase = await createServerSupabaseClient()
  if (!supabase) return map

  const { data } = await supabase
    .from('character_responses')
    .select('id, post_id, character, content, created_at')
    .in('post_id', postIds)
    .order('created_at', { ascending: true })

  for (const row of (data ?? []) as CharacterResponseRow[]) {
    const list = map.get(row.post_id) ?? []
    list.push(rowToCharacterResponse(row))
    map.set(row.post_id, list)
  }
  return map
}

export async function fetchCharacterResponsesForPost(postId: string) {
  const map = await fetchCharacterResponsesForPosts([postId])
  return map.get(postId) ?? []
}

export async function countCharacterResponsesLast24h() {
  const admin = createAdminClient()
  if (!admin) return 0

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await admin
    .from('character_responses')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since)

  return count ?? 0
}

export async function createCharacterResponse(opts: {
  postId: string
  character: CharacterId
  content: string
  createdBy: string
}) {
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')

  const postedToday = await countCharacterResponsesLast24h()
  if (postedToday >= 1) {
    throw new Error('CHARACTER_DAILY_LIMIT')
  }

  const { data: post } = await admin
    .from('community_posts')
    .select('id, status, room')
    .eq('id', opts.postId)
    .single()

  if (!post || post.status !== 'approved') {
    throw new Error('POST_NOT_FOUND')
  }

  const { data, error } = await admin
    .from('character_responses')
    .insert({
      post_id: opts.postId,
      character: opts.character,
      content: opts.content.trim(),
      created_by: opts.createdBy,
    })
    .select('id, post_id, character, content, created_at')
    .single()

  if (error) throw error
  return rowToCharacterResponse(data as CharacterResponseRow)
}

export async function fetchPostsForCharacterReplyPicker() {
  const admin = createAdminClient()
  if (!admin) return []

  const { data } = await admin
    .from('community_posts')
    .select('id, room, content, created_at, guest_author, profiles(username, display_name)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(60)

  return (data ?? []).map((row) => {
    const profiles = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
    const username =
      row.guest_author ??
      (profiles?.display_name ||
        (profiles?.username ? `@${profiles.username}` : '@neighbor'))
    return {
      id: row.id,
      room: row.room as RoomId,
      content: row.content,
      username,
      created_at: row.created_at,
    } satisfies AdminPostPickerOption
  })
}

export async function fetchRecentCharacterResponses(limit = 10) {
  const admin = createAdminClient()
  if (!admin) return []

  const { data } = await admin
    .from('character_responses')
    .select('id, post_id, character, content, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  return ((data ?? []) as CharacterResponseRow[]).map(rowToCharacterResponse)
}
