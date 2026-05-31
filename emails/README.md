# Haidiho transactional emails (React Email)

All transactional templates use the shared design system in `emails/components/`.

## Templates

| File | Subject | Trigger |
|------|---------|---------|
| `confirmation.tsx` | Confirm your Haidiho account 👋 | Auth signup (Supabase or `sendConfirmationEmail`) |
| `welcome.tsx` | Haidiho! Welcome to the neighborhood 👋 | Newsletter signup |
| `mug-confirmation.tsx` | Your mug is in the queue ☕ | Mug upload |
| `story-confirmation.tsx` | Your story is pinned ❤️ | Story submission |
| `post-approved.tsx` | You're on the board 📌 | Moderator approves a post |
| `reply-notification.tsx` | Someone replied to your post ❤️ | Approved comment on your post |
| `moderation-alert.tsx` | [N] posts waiting… | New item in moderation queue |

Weekly digest: `weekly-newsletter.tsx` (separate layout).

## Preview locally

```bash
npx react-email dev
```

Open each `.tsx` file in the preview UI. Image URLs use `NEXT_PUBLIC_APP_URL` — run the site locally so `/images/*` assets load.

## Send test pack to your inbox

```bash
npx tsx scripts/send-all-transactional-emails.mts wade@haidiho.com
```

Requires `RESEND_API_KEY` and verified `RESEND_FROM_EMAIL` in `.env.local`.

## Supabase auth templates

Paste rendered HTML from `confirmation.tsx` into Supabase Dashboard → Auth → Email templates, or point custom SMTP at Resend (`supabase/email-templates/README.md`).

## Email log

Run `supabase/migrate-email-log.sql` in the SQL editor. Sends are logged to `email_sent_log` (best-effort).
