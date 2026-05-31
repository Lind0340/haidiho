import { render } from '@react-email/render'
import WeeklyNewsletter from '../../../emails/weekly-newsletter'
import type { WeeklyNewsletterProps } from '@/lib/email/newsletter-types'

export async function renderWeeklyNewsletterHtml(
  props: WeeklyNewsletterProps & { previewText?: string },
): Promise<string> {
  let html = await render(<WeeklyNewsletter {...props} />)
  html = injectOutlookRevealFallback(html, props.differences)
  return html
}

function injectOutlookRevealFallback(
  html: string,
  differences: WeeklyNewsletterProps['differences'],
): string {
  const lines = differences.map((d, i) => `${i + 1}. ${escapeHtml(d)}`).join('<br />')
  const mso = `<!--[if mso]>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;margin:16px auto;">
  <tr><td style="background:#F5F5F5;border:1px solid #DDDDDD;padding:12px;text-align:center;">
    <p style="font-family:Arial;font-size:13px;font-weight:700;color:#4A90D9;margin:0 0 8px;">Reveal Answers</p>
    <p style="font-family:Arial;font-size:10px;line-height:1.6;color:#999999;margin:0;">${lines}</p>
  </td></tr>
</table>
<![endif]-->`
  const marker = 'Reveal Answers'
  const idx = html.indexOf(marker)
  if (idx !== -1) {
    return html.slice(0, idx) + mso + html.slice(idx)
  }
  return html + mso
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
