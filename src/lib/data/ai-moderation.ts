import { createAdminClient } from '@/lib/supabase-server'
import { notifyModerationQueue } from '@/lib/emails/notify'
import {
  reviewContentWithClaude,
  verdictFromAiResult,
  type AiModerationResult,
  type ModerationVerdict,
} from '@/lib/ai-moderator'
import type { RoomId } from '@/types/database'

const AI_MODERATOR_NOTE = '[Hai AI pre-screen]'

function queueNotes(ai: AiModerationResult): string {
  const parts = [
    `${AI_MODERATOR_NOTE}`,
    `Recommendation: ${ai.approved ? 'approve' : 'reject'}`,
    `Confidence: ${ai.confidence}`,
    ai.reason,
  ]
  if (ai.confidence === 'medium' && ai.approved) {
    parts.push('AI approved with medium confidence — worth a quick look')
  }
  if (ai.confidence === 'low') {
    parts.push('Needs human review (low AI confidence)')
  }
  if (ai.flags.length) parts.push(`Flags: ${ai.flags.join(', ')}`)
  return parts.join(' · ')
}

async function rejectLinkedStoryPost(admin: ReturnType<typeof createAdminClient>, storyId: string) {
  if (!admin) return
  await admin
    .from('community_posts')
    .update({ status: 'rejected' })
    .eq('story_submission_id', storyId)
}

async function updateModerationQueue(opts: {
  contentType: 'story' | 'post' | 'comment'
  contentId: string
  ai: AiModerationResult
  queueStatus: 'pending' | 'rejected' | 'approved'
}) {
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')

  const needsHumanReview = opts.ai.confidence === 'low'
  const aiPreApproved = opts.ai.approved && opts.ai.confidence === 'high'

  await admin
    .from('moderation_queue')
    .update({
      status: opts.queueStatus,
      ai_approved: opts.ai.approved,
      ai_confidence: opts.ai.confidence,
      ai_reason: opts.ai.reason,
      ai_flags: opts.ai.flags,
      ai_pre_approved: aiPreApproved,
      needs_human_review: needsHumanReview,
      moderator_notes: queueNotes(opts.ai),
      reviewed_at: opts.queueStatus !== 'pending' ? new Date().toISOString() : null,
    })
    .eq('content_type', opts.contentType)
    .eq('content_id', opts.contentId)
}

/**
 * Two-stage moderation (story & post):
 * AI pre-screen only — never publishes. Wade approves in /admin/moderation.
 */
export async function prescreenCommunitySubmission(opts: {
  contentType: 'story' | 'post'
  contentId: string
  content: string
  room?: RoomId | null
}): Promise<ModerationVerdict> {
  const ai = await reviewContentWithClaude({
    content: opts.content,
    contentType: opts.contentType,
    room: opts.room,
  })
  const verdict = verdictFromAiResult(ai)
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')

  const table = opts.contentType === 'story' ? 'story_submissions' : 'community_posts'

  if (!ai.approved) {
    await admin.from(table).update({ status: 'rejected' }).eq('id', opts.contentId)
    if (opts.contentType === 'story') {
      await rejectLinkedStoryPost(admin, opts.contentId)
      const { data: linkedPost } = await admin
        .from('community_posts')
        .select('id')
        .eq('story_submission_id', opts.contentId)
        .maybeSingle()
      if (linkedPost?.id) {
        await updateModerationQueue({
          contentType: 'post',
          contentId: linkedPost.id,
          ai,
          queueStatus: 'rejected',
        })
      }
    }
    await updateModerationQueue({
      contentType: opts.contentType,
      contentId: opts.contentId,
      ai,
      queueStatus: 'rejected',
    })
    return verdict
  }

  await admin.from(table).update({ status: 'pending' }).eq('id', opts.contentId)
  await updateModerationQueue({
    contentType: opts.contentType,
    contentId: opts.contentId,
    ai,
    queueStatus: 'pending',
  })
  void notifyModerationQueue()

  if (opts.contentType === 'story') {
    const { data: linkedPost } = await admin
      .from('community_posts')
      .select('id')
      .eq('story_submission_id', opts.contentId)
      .maybeSingle()
    if (linkedPost?.id) {
      await admin.from('community_posts').update({ status: 'pending' }).eq('id', linkedPost.id)
      await updateModerationQueue({
        contentType: 'post',
        contentId: linkedPost.id,
        ai,
        queueStatus: 'pending',
      })
      void notifyModerationQueue()
    }
  }

  return verdict
}

/**
 * Comments: AI can reject; on pass publish immediately (replies stay conversational).
 */
export async function prescreenComment(opts: {
  contentId: string
  content: string
}): Promise<ModerationVerdict> {
  const ai = await reviewContentWithClaude({ content: opts.content, contentType: 'comment' })
  const verdict = verdictFromAiResult(ai)
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')

  if (!ai.approved) {
    await admin.from('post_comments').update({ status: 'rejected' }).eq('id', opts.contentId)
    await updateModerationQueue({
      contentType: 'comment',
      contentId: opts.contentId,
      ai,
      queueStatus: 'rejected',
    })
    return verdict
  }

  await admin.from('post_comments').update({ status: 'approved' }).eq('id', opts.contentId)
  await updateModerationQueue({
    contentType: 'comment',
    contentId: opts.contentId,
    ai,
    queueStatus: 'approved',
  })
  await admin
    .from('moderation_queue')
    .update({
      reviewed_at: new Date().toISOString(),
      moderator_notes: `${AI_MODERATOR_NOTE} Auto-approved comment · ${ai.reason}`,
    })
    .eq('content_type', 'comment')
    .eq('content_id', opts.contentId)

  return verdict
}

/** @deprecated Use prescreenCommunitySubmission or prescreenComment */
export async function moderateAndApply(opts: {
  contentType: 'story' | 'post' | 'comment'
  contentId: string
  content: string
  room?: RoomId | null
}): Promise<ModerationVerdict> {
  if (opts.contentType === 'comment') {
    return prescreenComment({ contentId: opts.contentId, content: opts.content })
  }
  return prescreenCommunitySubmission({
    contentType: opts.contentType,
    contentId: opts.contentId,
    content: opts.content,
    room: opts.room,
  })
}
