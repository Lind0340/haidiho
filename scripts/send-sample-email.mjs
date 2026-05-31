/**
 * Send a sample branded auth email (preview of Supabase confirm template).
 * Usage: node scripts/send-sample-email.mjs [recipient@email.com]
 */
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Resend } from 'resend'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnvLocal() {
  const path = resolve(root, '.env.local')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

function confirmSignupHtml(siteUrl, email) {
  const base = siteUrl.replace(/\/$/, '')
  const confirmUrl = `${base}/auth/confirm?sample=1`
  return readFileSync(resolve(root, 'supabase/email-templates/confirm-signup.html'), 'utf8')
    .replaceAll('{{ .SiteURL }}', base)
    .replaceAll('{{ .ConfirmationURL }}', confirmUrl)
    .replaceAll('{{ .Email }}', email)
}

loadEnvLocal()

const to = process.argv[2] ?? 'wade.lindgren@gmail.com'
const apiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@haidiho.com'
const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://haidiho.com'

if (!apiKey) {
  console.error('RESEND_API_KEY missing in .env.local')
  process.exit(1)
}

const resend = new Resend(apiKey)
const html = confirmSignupHtml(siteUrl, to)

const { data, error } = await resend.emails.send({
  from: `Haidiho <${fromEmail}>`,
  to,
  subject: '[Sample] Confirm your email — Haidiho ❤️',
  html,
})

if (error) {
  console.error('Send failed:', error.message ?? error)
  process.exit(1)
}

console.log(`Sample email sent to ${to} (id: ${data?.id ?? 'ok'})`)
if (siteUrl.includes('localhost')) {
  console.warn(
    'Note: Site URL is localhost — the logo image may not load in the email. Use a live URL in .env.local for a full preview.',
  )
}
