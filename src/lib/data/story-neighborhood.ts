import { createAdminClient } from '@/lib/supabase-server'
import type { RoomId } from '@/types/database'

function displayHandle(name: string) {
  const t = name.trim()
  if (!t) return 'Neighbor'
  return t.startsWith('@') ? t : t.includes(' ') ? t : `@${t}`
}

/** Pending feed post linked to a story submission (moderation queue). */
export async function createPendingFeedPostFromStory(opts: {
  storySubmissionId: string
  room: RoomId
  content: string
  userId: string | null
  submitterName: string
}) {
  const admin = createAdminClient()
  if (!admin) return { error: 'Admin client not configured' as const }

  const { error } = await admin.from('community_posts').insert({
    story_submission_id: opts.storySubmissionId,
    user_id: opts.userId,
    guest_author: opts.userId ? null : displayHandle(opts.submitterName),
    room: opts.room,
    content: opts.content,
    status: 'pending',
  })

  return { error: error?.message ?? null }
}

/** When a story is approved, publish (or approve) its neighborhood feed post. */
export async function publishStoryToNeighborhoodFeed(storySubmissionId: string) {
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')

  const { data: story, error: storyErr } = await admin
    .from('story_submissions')
    .select('id, user_id, submitter_name, room, story_content, status')
    .eq('id', storySubmissionId)
    .single()

  if (storyErr || !story) throw new Error(storyErr?.message ?? 'Story not found')
  if (!story.room) return

  const { data: existing } = await admin
    .from('community_posts')
    .select('id')
    .eq('story_submission_id', story.id)
    .maybeSingle()

  if (existing) {
    const { error } = await admin
      .from('community_posts')
      .update({ status: 'approved' })
      .eq('id', existing.id)
    if (error) throw error
    return
  }

  const { error } = await admin.from('community_posts').insert({
    story_submission_id: story.id,
    user_id: story.user_id,
    guest_author: story.user_id ? null : displayHandle(story.submitter_name),
    room: story.room,
    content: story.story_content,
    status: 'approved',
  })

  if (error) throw error
}
