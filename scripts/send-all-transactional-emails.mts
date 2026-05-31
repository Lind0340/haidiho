/**
 * Send all 7 transactional templates (fully rendered) to a test inbox.
 * Usage: npx tsx scripts/send-all-transactional-emails.mts [email]
 */
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Resend } from 'resend'
import {
  renderConfirmationHtml,
  renderWelcomeHtml,
  renderMugConfirmationHtml,
  renderStoryConfirmationHtml,
  renderPostApprovedHtml,
  renderReplyNotificationHtml,
  renderModerationAlertHtml,
} from '../src/lib/emails/render'

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

loadEnvLocal()

const to = process.argv[2] ?? process.env.NEWSLETTER_TEST_EMAIL ?? 'wade@haidiho.com'
const apiKey = process.env.RESEND_API_KEY
if (!apiKey) {
  console.error('RESEND_API_KEY missing')
  process.exit(1)
}

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  'http://localhost:3000'
).replace(/\/$/, '')

const from = process.env.RESEND_FROM_EMAIL ?? 'hello@haidiho.com'
const resend = new Resend(apiKey)

async function send(subject: string, html: string) {
  const { data, error } = await resend.emails.send({
    from: `Hai & DiHo <${from}>`,
    to,
    subject: `[Test] ${subject}`,
    html,
  })
  if (error) throw new Error(`${subject}: ${error.message}`)
  console.log(`✓ ${subject} → ${data?.id}`)
}

const confirmUrl = `${siteUrl}/auth/confirm?token=test-preview`

await send(
  'Confirm your Haidiho account 👋',
  await renderConfirmationHtml(siteUrl, confirmUrl),
)
await send(
  'Haidiho! Welcome to the neighborhood 👋',
  await renderWelcomeHtml(siteUrl, false, `${siteUrl}/unsubscribe?token=test`),
)
await send('Your mug is in the queue ☕', await renderMugConfirmationHtml(siteUrl, 'Wade'))
await send('Your story is pinned ❤️', await renderStoryConfirmationHtml(siteUrl, 'Wade'))
await send(
  "You're on the board 📌",
  await renderPostApprovedHtml(
    siteUrl,
    'Wade',
    'My AI coworker scheduled a meeting about meetings. I attended ironically.',
    'water_cooler',
  ),
)
await send(
  'Someone replied to your post ❤️',
  await renderReplyNotificationHtml(
    siteUrl,
    'Wade',
    'My AI coworker scheduled a meeting about meetings.',
    'BOB says: Done. ✅',
  ),
)
await send(
  '[3] posts waiting in the neighborhood ❤️',
  await renderModerationAlertHtml(siteUrl, {
    total: 3,
    communityPosts: 1,
    mugSubmissions: 1,
    storySubmissions: 1,
  }),
)

console.log(`\nAll 7 templates sent to ${to}`)
