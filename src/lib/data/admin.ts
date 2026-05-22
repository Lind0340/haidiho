import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import { publishStoryToNeighborhoodFeed } from '@/lib/data/story-neighborhood'
import type { ModerationQueueItem, UserRole } from '@/types/database'

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return null
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
  return (data?.role as UserRole) ?? null
}

export async function requireAdmin(userId: string) {
  const role = await getUserRole(userId)
  return role === 'admin'
}

export async function requireModerator(userId: string) {
  const role = await getUserRole(userId)
  return role === 'admin' || role === 'moderator'
}

export async function fetchPendingModeration() {
  const admin = createAdminClient()
  if (!admin) return []

  const { data } = await admin
    .from('moderation_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return (data ?? []) as ModerationQueueItem[]
}

export async function approveModerationItem(item: ModerationQueueItem, moderatorId: string) {
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')

  const tableMap = {
    post: 'community_posts',
    comment: 'post_comments',
    mug: 'mug_submissions',
    story: 'story_submissions',
  } as const

  const table = tableMap[item.content_type]
  const status =
    item.content_type === 'story' ? 'approved' : ('approved' as const)

  await admin.from(table).update({ status }).eq('id', item.content_id)

  if (item.content_type === 'story') {
    await publishStoryToNeighborhoodFeed(item.content_id)
  }

  await admin
    .from('moderation_queue')
    .update({
      status: 'approved',
      moderator_id: moderatorId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', item.id)
}

export async function rejectModerationItem(
  item: ModerationQueueItem,
  moderatorId: string,
  notes?: string,
) {
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')

  const tableMap = {
    post: 'community_posts',
    comment: 'post_comments',
    mug: 'mug_submissions',
    story: 'story_submissions',
  } as const

  await admin.from(tableMap[item.content_type]).update({ status: 'rejected' }).eq('id', item.content_id)

  if (item.content_type === 'story') {
    await admin
      .from('community_posts')
      .update({ status: 'rejected' })
      .eq('story_submission_id', item.content_id)
  }
  await admin
    .from('moderation_queue')
    .update({
      status: 'rejected',
      moderator_id: moderatorId,
      moderator_notes: notes ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', item.id)
}
