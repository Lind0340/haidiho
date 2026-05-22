import { Resend } from 'resend'
import { haidihoEmailLayout } from '@/lib/email/haidiho-email-layout'

const from = process.env.RESEND_FROM_EMAIL ?? 'hello@haidiho.com'
const fromHeader = `Haidiho <${from}>`

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export async function sendWelcomeEmail(email: string, firstName?: string) {
  const resend = getResend()
  if (!resend) return { skipped: true }

  const name = firstName?.trim() || 'neighbor'
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://haidiho.com'
  return resend.emails.send({
    from: fromHeader,
    to: email,
    subject: "You're officially in the neighborhood ❤️",
    html: haidihoEmailLayout({
      preheader: 'Welcome to Haidiho — cartoons, tips, and the neighborhood await.',
      title: "You're in the neighborhood",
      bodyHtml: `
        <p style="margin:0 0 12px;">Hey <strong>${escapeHtml(name)}</strong>,</p>
        <p style="margin:0 0 12px;">Welcome to Haidiho — real humans, real AI coworkers, real stories.</p>
        <p style="margin:0;"><strong>DiHo says:</strong> Coat's still on but the coffee's hot. Come look around. ☕</p>
      `,
      ctaHref: `${siteUrl.replace(/\/$/, '')}/neighborhood`,
      ctaLabel: 'Visit the neighborhood 👋',
      siteUrl,
    }),
  })
}

export async function sendMugConfirmation(email: string, memberName: string) {
  const resend = getResend()
  if (!resend) return { skipped: true }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://haidiho.com'
  return resend.emails.send({
    from: fromHeader,
    to: email,
    subject: 'Your mug is in the queue ☕',
    html: haidihoEmailLayout({
      preheader: 'Your mug submission is in the queue.',
      title: 'Mug received ☕',
      bodyHtml: `
        <p style="margin:0 0 12px;">Hey <strong>${escapeHtml(memberName)}</strong>,</p>
        <p style="margin:0 0 12px;">We got your mug photo. It's in the queue — we'll put it on the wall when it's ready.</p>
        <p style="margin:0;"><strong>Hai says:</strong> I have reviewed your mug. It has potential. Many potential. ❤️</p>
      `,
      ctaHref: `${siteUrl.replace(/\/$/, '')}/mugs`,
      ctaLabel: 'See the mug wall',
      siteUrl,
    }),
  })
}

export async function sendStoryConfirmation(email: string, name: string) {
  const resend = getResend()
  if (!resend) return { skipped: true }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://haidiho.com'
  return resend.emails.send({
    from: fromHeader,
    to: email,
    subject: 'Your story could become a strip',
    html: haidihoEmailLayout({
      preheader: 'Your neighborhood story landed safely.',
      title: 'Story received',
      bodyHtml: `
        <p style="margin:0 0 12px;">Hey <strong>${escapeHtml(name)}</strong>,</p>
        <p style="margin:0 0 12px;">Your story landed safely. It might even become the next strip.</p>
        <p style="margin:0;"><strong>DiHo says:</strong> I've seen worse. That's a compliment. ☕</p>
      `,
      ctaHref: `${siteUrl.replace(/\/$/, '')}/neighborhood`,
      ctaLabel: 'Back to the neighborhood',
      siteUrl,
    }),
  })
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  total: string,
  downloadUrl?: string,
) {
  const resend = getResend()
  if (!resend) return { skipped: true }

  return resend.emails.send({
    from: fromHeader,
    to: email,
    subject: 'Your Haidiho order — thank you ❤️',
    html: `
      <p>Order ${orderId} — total ${total}</p>
      ${downloadUrl ? `<p><a href="${downloadUrl}">Download your digital goods</a></p>` : '<p>We will email tracking when your order ships.</p>'}
      <p>— Haidiho</p>
    `,
  })
}
