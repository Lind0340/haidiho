import { createAdminClient } from '@/lib/supabase-server'

export type EmailTemplateId =
  | 'confirmation'
  | 'welcome'
  | 'mug_confirmation'
  | 'story_confirmation'
  | 'post_approved'
  | 'reply_notification'
  | 'moderation_alert'
  | 'order_confirmation'
  | 'weekly_newsletter'

type LogOpts = {
  template: EmailTemplateId
  to: string
  subject: string
  resendId?: string | null
  error?: string | null
  meta?: Record<string, unknown>
}

/** Best-effort audit trail for sent mail (requires email_sent_log migration). */
export async function logSentEmail(opts: LogOpts) {
  const admin = createAdminClient()
  if (!admin) return

  try {
    await admin.from('email_sent_log').insert({
      template: opts.template,
      recipient: opts.to,
      subject: opts.subject,
      resend_id: opts.resendId ?? null,
      error_message: opts.error ?? null,
      meta: opts.meta ?? {},
    })
  } catch (err) {
    console.error('[email_sent_log]', err)
  }
}
