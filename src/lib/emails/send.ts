import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase-server'
import { getSiteUrl } from '@/lib/email/newsletter-types'
import { fetchPendingModeration } from '@/lib/data/admin'
import { logSentEmail } from '@/lib/emails/log'
import {
  buildUnsubscribeUrl,
  renderConfirmationHtml,
  renderModerationAlertHtml,
  renderMugConfirmationHtml,
  renderPostApprovedHtml,
  renderReplyNotificationHtml,
  renderStoryConfirmationHtml,
  renderWelcomeHtml,
} from '@/lib/emails/render'

const fromEmail = () => process.env.RESEND_FROM_EMAIL ?? 'hello@haidiho.com'
const fromHeader = () => `Hai & DiHo <${fromEmail()}>`
const replyTo = () => process.env.NEWSLETTER_REPLY_TO ?? 'wade@haidiho.com'
const moderationInbox = () =>
  process.env.MODERATION_ALERT_EMAIL ?? 'wade@haidiho.com'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

async function sendHtml(opts: {
  template: Parameters<typeof logSentEmail>[0]['template']
  to: string
  subject: string
  html: string
  replyTo?: string
  meta?: Record<string, unknown>
}) {
  const resend = getResend()
  if (!resend) {
    await logSentEmail({
      template: opts.template,
      to: opts.to,
      subject: opts.subject,
      error: 'RESEND_API_KEY missing',
      meta: opts.meta,
    })
    return { skipped: true as const }
  }

  const { data, error } = await resend.emails.send({
    from: fromHeader(),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  })

  await logSentEmail({
    template: opts.template,
    to: opts.to,
    subject: opts.subject,
    resendId: data?.id ?? null,
    error: error?.message ?? null,
    meta: opts.meta,
  })

  if (error) throw error
  return { ok: true as const, id: data?.id }
}

export async function sendConfirmationEmail(email: string, confirmationUrl: string) {
  const siteUrl = getSiteUrl()
  const html = await renderConfirmationHtml(siteUrl, confirmationUrl)
  return sendHtml({
    template: 'confirmation',
    to: email,
    subject: 'Confirm your Haidiho account 👋',
    html,
    meta: { confirmationUrl },
  })
}

export async function sendWelcomeEmail(
  email: string,
  firstName?: string,
  welcomeBack?: boolean,
  unsubscribeUrl?: string,
) {
  void firstName
  const siteUrl = getSiteUrl()
  const html = await renderWelcomeHtml(siteUrl, welcomeBack, unsubscribeUrl)
  return sendHtml({
    template: 'welcome',
    to: email,
    subject: welcomeBack
      ? 'Welcome back to the neighborhood 👋'
      : 'Haidiho! Welcome to the neighborhood 👋',
    html,
    replyTo: replyTo(),
    meta: { welcomeBack },
  })
}

export async function sendWelcomeEmailWithToken(
  email: string,
  subscriberId: string,
  firstName?: string,
  welcomeBack?: boolean,
) {
  const admin = createAdminClient()
  let unsubscribeUrl: string | undefined
  if (admin) {
    const { data } = await admin
      .from('newsletter_subscribers')
      .select('unsubscribe_token')
      .eq('id', subscriberId)
      .single()
    if (data?.unsubscribe_token) {
      unsubscribeUrl = buildUnsubscribeUrl(data.unsubscribe_token as string)
    }
  }
  return sendWelcomeEmail(email, firstName, welcomeBack, unsubscribeUrl)
}

export async function sendMugConfirmation(email: string, memberName: string) {
  const html = await renderMugConfirmationHtml(getSiteUrl(), memberName)
  return sendHtml({
    template: 'mug_confirmation',
    to: email,
    subject: 'Your mug is in the queue ☕',
    html,
    meta: { memberName },
  })
}

export async function sendStoryConfirmation(email: string, name: string) {
  const html = await renderStoryConfirmationHtml(getSiteUrl(), name)
  return sendHtml({
    template: 'story_confirmation',
    to: email,
    subject: 'Your story is pinned ❤️',
    html,
    meta: { name },
  })
}

export async function sendPostApprovedEmail(opts: {
  email: string
  username: string
  postExcerpt: string
  room: string
  postId: string
}) {
  const html = await renderPostApprovedHtml(
    getSiteUrl(),
    opts.username,
    opts.postExcerpt,
    opts.room,
  )
  return sendHtml({
    template: 'post_approved',
    to: opts.email,
    subject: "You're on the board 📌",
    html,
    meta: { postId: opts.postId, room: opts.room },
  })
}

export async function sendReplyNotificationEmail(opts: {
  email: string
  username: string
  postExcerpt: string
  replyExcerpt: string
  postId: string
}) {
  const html = await renderReplyNotificationHtml(
    getSiteUrl(),
    opts.username,
    opts.postExcerpt,
    opts.replyExcerpt,
  )
  return sendHtml({
    template: 'reply_notification',
    to: opts.email,
    subject: 'Someone replied to your post ❤️',
    html,
    meta: { postId: opts.postId },
  })
}

export async function sendModerationAlertEmail() {
  const items = await fetchPendingModeration()
  const communityPosts = items.filter((i) => i.content_type === 'post').length
  const mugSubmissions = items.filter((i) => i.content_type === 'mug').length
  const storySubmissions = items.filter((i) => i.content_type === 'story').length
  const total = communityPosts + mugSubmissions + storySubmissions
  if (total === 0) return { skipped: true as const, reason: 'empty_queue' }

  const html = await renderModerationAlertHtml(getSiteUrl(), {
    total,
    communityPosts,
    mugSubmissions,
    storySubmissions,
  })

  return sendHtml({
    template: 'moderation_alert',
    to: moderationInbox(),
    subject: `[${total}] posts waiting in the neighborhood ❤️`,
    html,
    meta: { total, communityPosts, mugSubmissions, storySubmissions },
  })
}

export async function getUserEmail(userId: string): Promise<string | null> {
  const admin = createAdminClient()
  if (!admin) return null
  const { data, error } = await admin.auth.admin.getUserById(userId)
  if (error || !data.user?.email) return null
  return data.user.email
}

/** Notify Wade when the moderation queue gains a pending item. */
export async function notifyModerationQueue() {
  try {
    return await sendModerationAlertEmail()
  } catch (err) {
    console.error('[moderation-alert]', err)
    return { skipped: true as const }
  }
}

export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  total: string,
  downloadUrl?: string,
) {
  const resend = getResend()
  if (!resend) return { skipped: true as const }

  const html = `
    <p style="font-family:Arial,sans-serif;color:#2D2D2D;">Order ${orderId} — total ${total}</p>
    ${downloadUrl ? `<p><a href="${downloadUrl}">Download your digital goods</a></p>` : '<p>We will email tracking when your order ships.</p>'}
    <p>— Haidiho</p>
  `

  return sendHtml({
    template: 'order_confirmation',
    to: email,
    subject: 'Your Haidiho order — thank you ❤️',
    html,
  })
}
