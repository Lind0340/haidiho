/** Shared Haidiho email colors (inline-safe for clients). */
export const EMAIL_COLORS = {
  pageTan: '#f2dfc6',
  cream: '#fff8f0',
  card: '#fff6e8',
  border: '#ead8c2',
  charcoal: '#2d2d2d',
  charcoalMuted: '#5c5c5c',
  haiBlue: '#0867e8',
  haiBlueLight: '#4a90d9',
  warmPink: '#ff6b8a',
} as const

type LayoutOpts = {
  preheader: string
  title: string
  bodyHtml: string
  ctaHref: string
  ctaLabel: string
  footerNote?: string
  siteUrl?: string
}

/** Branded HTML wrapper for Resend and reference when editing Supabase templates. */
export function haidihoEmailLayout(opts: LayoutOpts) {
  const site = (opts.siteUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://haidiho.com').replace(
    /\/$/,
    '',
  )
  const logoUrl = `${site}/images/haidiho-wordmark-transparent.png`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${EMAIL_COLORS.pageTan};font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${EMAIL_COLORS.pageTan};background-image:radial-gradient(${EMAIL_COLORS.haiBlueLight} 1px, transparent 1px);background-size:26px 26px;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td style="padding:0 0 16px;text-align:center;">
              <img src="${logoUrl}" alt="Haidiho" width="220" style="display:inline-block;max-width:220px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="background-color:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:20px;padding:28px 24px;box-shadow:0 12px 26px rgba(45,45,45,0.08);">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:${EMAIL_COLORS.haiBlueLight};">haidiho.com</p>
              <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;font-weight:700;line-height:1.2;color:${EMAIL_COLORS.charcoal};">${opts.title}</h1>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:${EMAIL_COLORS.charcoalMuted};">
                ${opts.bodyHtml}
              </div>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 8px;">
                <tr>
                  <td align="center" style="border-radius:12px;background-color:${EMAIL_COLORS.haiBlue};box-shadow:0 6px 0 #1e40af;">
                    <a href="${opts.ctaHref}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;color:#fff8f0;text-decoration:none;border-radius:12px;">${escapeHtml(opts.ctaLabel)}</a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${EMAIL_COLORS.charcoalMuted};word-break:break-all;">
                Or copy this link:<br />
                <a href="${opts.ctaHref}" style="color:${EMAIL_COLORS.haiBlue};">${opts.ctaHref}</a>
              </p>
              ${opts.footerNote ? `<p style="margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:${EMAIL_COLORS.charcoalMuted};">${opts.footerNote}</p>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 8px 0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${EMAIL_COLORS.charcoalMuted};">
              <p style="margin:0;">Real humans. AI coworkers. Figuring it out one coffee at a time. ☕</p>
              <p style="margin:8px 0 0;">— Hai &amp; DiHo ❤️</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
