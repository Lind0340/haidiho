import { createAdminClient } from '@/lib/supabase-server'
import {
  getUserEmail,
  notifyModerationQueue,
  sendPostApprovedEmail,
  sendReplyNotificationEmail,
} from '@/lib/emails/send'
import type { ModerationQueueItem } from '@/types/database'

export async function notifyPostApproved(item: ModerationQueueItem) {
  if (item.content_type !== 'post') return

  const admin = createAdminClient()
  if (!admin) return

  const { data: post } = await admin
    .from('community_posts')
    .select('content, room, user_id, guest_author, profiles(display_name, username)')
    .eq('id', item.content_id)
    .single()

  if (!post) return

  let email: string | null = null
  let username =
    (post.profiles as { display_name?: string; username?: string } | null)?.display_name ??
    (post.profiles as { username?: string } | null)?.username ??
    post.guest_author ??
    'neighbor'

  if (post.user_id) {
    email = await getUserEmail(post.user_id)
    if (!email) return
  } else {
    return
  }

  try {
    await sendPostApprovedEmail({
      email,
      username,
      postExcerpt: post.content,
      room: post.room,
      postId: item.content_id,
    })
  } catch (err) {
    console.error('[notifyPostApproved]', err)
  }
}

export async function notifyReplyPublished(commentId: string, postId: string) {
  const admin = createAdminClient()
  if (!admin) return

  const { data: post } = await admin
    .from('community_posts')
    .select('content, user_id, profiles(display_name, username)')
    .eq('id', postId)
    .single()

  const { data: comment } = await admin
    .from('post_comments')
    .select('content, user_id')
    .eq('id', commentId)
    .single()

  if (!post?.user_id || !comment) return
  if (comment.user_id === post.user_id) return

  const email = await getUserEmail(post.user_id)
  if (!email) return

  const username =
    (post.profiles as { display_name?: string; username?: string } | null)?.display_name ??
    (post.profiles as { username?: string } | null)?.username ??
    'neighbor'

  try {
    await sendReplyNotificationEmail({
      email,
      username,
      postExcerpt: post.content,
      replyExcerpt: comment.content,
      postId,
    })
  } catch (err) {
    console.error('[notifyReplyPublished]', err)
  }
}

export { notifyModerationQueue }
