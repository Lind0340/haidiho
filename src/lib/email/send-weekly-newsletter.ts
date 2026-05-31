import { Resend } from 'resend'
import { renderWeeklyNewsletterHtml } from '@/lib/email/render-weekly-newsletter'
import { getSiteUrl, type WeeklyNewsletterProps } from '@/lib/email/newsletter-types'

const BATCH_SIZE = 100
const fromEmail = () => process.env.RESEND_FROM_EMAIL ?? 'hello@haidiho.com'
const fromHeader = () => `Hai & DiHo <${fromEmail()}>`
const replyTo = () => process.env.NEWSLETTER_REPLY_TO ?? 'wade@haidiho.com'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export type SubscriberRecipient = {
  email: string
  unsubscribeUrl: string
}

export async function sendWeeklyNewsletterTest(
  to: string,
  props: WeeklyNewsletterProps & { previewText?: string; subject?: string },
) {
  const resend = getResend()
  if (!resend) {
    return { ok: false as const, error: 'RESEND_API_KEY is not configured' }
  }

  const html = await renderWeeklyNewsletterHtml(props)
  const subject =
    props.subject ??
    `[Sample] Haidiho #${String(props.issueNumber).padStart(3, '0')} — The Weekly Neighborhood Report`

  const { data, error } = await resend.emails.send({
    from: fromHeader(),
    replyTo: replyTo(),
    to,
    subject,
    html,
  })

  if (error) {
    return { ok: false as const, error: error.message }
  }

  return { ok: true as const, id: data?.id }
}

export type BatchSendResult = {
  ok: boolean
  sent: number
  failed: number
  errors: { email: string; error: string }[]
}

export async function sendWeeklyNewsletterBatch(
  recipients: SubscriberRecipient[],
  buildProps: (unsubscribeUrl: string) => WeeklyNewsletterProps & { previewText?: string },
  subject: string,
): Promise<BatchSendResult> {
  const resend = getResend()
  if (!resend) {
    return { ok: false, sent: 0, failed: recipients.length, errors: [{ email: '*', error: 'RESEND_API_KEY missing' }] }
  }
  const client = resend

  const errors: { email: string; error: string }[] = []
  let sent = 0
  const retryQueue: SubscriberRecipient[] = []

  async function sendChunk(chunk: SubscriberRecipient[], isRetry: boolean) {
    const payloads = await Promise.all(
      chunk.map(async (r) => {
        const props = buildProps(r.unsubscribeUrl)
        const html = await renderWeeklyNewsletterHtml(props)
        return {
          from: fromHeader(),
          replyTo: replyTo(),
          to: r.email,
          subject,
          html,
        }
      }),
    )

    const { data, error } = await client.batch.send(payloads)

    if (error) {
      for (const r of chunk) {
        if (!isRetry) retryQueue.push(r)
        else errors.push({ email: r.email, error: error.message })
      }
      return
    }

    if (!error) {
      sent += chunk.length
    } else {
      for (const r of chunk) {
        if (!isRetry) retryQueue.push(r)
        else errors.push({ email: r.email, error: 'Send failed after retry' })
      }
    }
  }

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    await sendChunk(recipients.slice(i, i + BATCH_SIZE), false)
  }

  if (retryQueue.length) {
    for (let i = 0; i < retryQueue.length; i += BATCH_SIZE) {
      await sendChunk(retryQueue.slice(i, i + BATCH_SIZE), true)
    }
  }

  const failed = recipients.length - sent
  return {
    ok: sent > 0,
    sent,
    failed,
    errors,
  }
}

export { buildUnsubscribeUrl } from '@/lib/emails/render'
