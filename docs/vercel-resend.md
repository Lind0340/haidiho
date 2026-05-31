# Vercel + Resend

Haidiho sends mail from **API routes and server actions** via the Resend SDK (`src/lib/emails/send.ts`). No extra Vercel plugin is required beyond env vars.

## Environment variables (Vercel dashboard)

Set these for **Production** (and **Preview** if you test newsletters there):

| Variable | Required | Example |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes | `re_...` (from [Resend](https://resend.com/api-keys) or Vercel Resend integration) |
| `RESEND_FROM_EMAIL` | Yes | `hello@haidiho.com` |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://haidiho.com` |
| `NEWSLETTER_REPLY_TO` | Recommended | `wade@haidiho.com` |
| `MODERATION_ALERT_EMAIL` | Optional | `wade@haidiho.com` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (admin mail / DB) | service role secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | anon key |

`VERCEL_URL` is set automatically; server-side `getSiteUrl()` falls back to it only if `NEXT_PUBLIC_SITE_URL` is missing. **Always set `NEXT_PUBLIC_SITE_URL` in production** so email images and links use `haidiho.com`, not a `*.vercel.app` preview URL.

## Resend domain

1. Resend → **Domains** → add `haidiho.com`
2. Add DNS records at your registrar
3. Wait for verified status before production sends

## What runs on Vercel

| Flow | Trigger |
|------|---------|
| Newsletter welcome | `POST /api/newsletter` after signup |
| Mug / story confirmation | `POST /api/mugs`, `POST /api/stories` |
| Post approved / reply | Moderation approve + comment publish |
| Moderation alert | New pending queue item |
| Weekly newsletter | `POST /api/admin/newsletter/send` (admin) |

Sends are logged to `email_sent_log` after you run `supabase/migrate-email-log.sql`.

## Supabase auth email (optional)

Transactional app mail uses Resend directly. **Signup confirmation** can still come from Supabase unless you enable Resend SMTP there — see `supabase/email-templates/README.md`.

## Test after deploy

```bash
# From your machine (uses .env.local)
npx tsx scripts/send-all-transactional-emails.mts you@email.com
```

Or subscribe on `/say-haidiho` on the live site and check Resend → **Logs**.

## Troubleshooting

- **Domain not verified** — Resend returns sender errors; fix DNS in Resend dashboard.
- **Images broken in email** — `NEXT_PUBLIC_SITE_URL` must be the public HTTPS origin serving `/images/...`.
- **Skips / no mail** — missing `RESEND_API_KEY` on Vercel; redeploy after adding variables.
