import { createAdminClient } from '@/lib/supabase-server'
import { reviewNeighborhoodContent, type ModerationVerdict } from '@/lib/ai-moderator'
import { publishStoryToNeighborhoodFeed } from '@/lib/data/story-neighborhood'
import type { RoomId } from '@/types/database'

const AI_MODERATOR_NOTE = '[Hai AI moderator]'

export async function applyAiModerationVerdict(opts: {
  contentType: 'story' | 'post' | 'comment'
  contentId: string
  decision: 'approve' | 'reject'
  notes: string
}) {
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')

  const tableMap = {
    story: 'story_submissions',
    post: 'community_posts',
    comment: 'post_comments',
  } as const
  const table = tableMap[opts.contentType]
  const status = opts.decision === 'approve' ? 'approved' : 'rejected'

  await admin.from(table).update({ status }).eq('id', opts.contentId)

  if (opts.contentType === 'story') {
    if (opts.decision === 'approve') {
      await publishStoryToNeighborhoodFeed(opts.contentId)
    } else {
      await admin
        .from('community_posts')
        .update({ status: 'rejected' })
        .eq('story_submission_id', opts.contentId)
    }
  }

  const queueNote = `${AI_MODERATOR_NOTE} ${opts.notes}`.trim()
  await admin
    .from('moderation_queue')
    .update({
      status,
      moderator_id: null,
      moderator_notes: queueNote,
      reviewed_at: new Date().toISOString(),
    })
    .eq('content_type', opts.contentType)
    .eq('content_id', opts.contentId)
}

export async function moderateAndApply(opts: {
  contentType: 'story' | 'post' | 'comment'
  contentId: string
  content: string
  room?: RoomId | null
}): Promise<ModerationVerdict> {
  const verdict = await reviewNeighborhoodContent({
    content: opts.content,
    contentType: opts.contentType,
    room: opts.room,
  })

  await applyAiModerationVerdict({
    contentType: opts.contentType,
    contentId: opts.contentId,
    decision: verdict.decision,
    notes: verdict.reason,
  })

  return verdict
}
