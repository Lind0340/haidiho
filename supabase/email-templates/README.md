# Haidiho auth email templates (Supabase)

Supabase sends signup confirmation, magic link, and password reset emails. By default they look generic ("Supabase Auth"). Use these templates so mail matches **haidiho.com**.

## 1. Site URL (required for logo + links)

In **Supabase Dashboard → Project Settings → Authentication → URL Configuration**:

| Setting | Production | Local dev |
|--------|------------|-----------|
| **Site URL** | `https://haidiho.com` | `http://localhost:3000` |
| **Redirect URLs** | `https://haidiho.com/**`, `http://localhost:3000/**` | same pattern |

Templates use `{{ .SiteURL }}/images/haidiho-email-logo.png` for the logo.

## 2. Paste HTML templates

**Authentication → Email Templates** (or **Emails** in newer dashboard):

### Confirm signup

- **Subject:** `Confirm your email — Haidiho ❤️`
- **Body:** Copy all of `confirm-signup.html` into the HTML editor.

### Magic link

- **Subject:** `Your Haidiho sign-in link ☕`
- **Body:** Copy all of `magic-link.html`.

### Reset password (optional)

- **Subject:** `Reset your Haidiho password`
- **Body:** Copy all of `reset-password.html`.

Save each template. Send a test signup to verify.

## 3. Sender name: "Haidiho" instead of "Supabase Auth"

Default Supabase mail comes from `noreply@mail.app.supabase.io`. To show **Haidiho &lt;hello@haidiho.com&gt;** (or your domain), use **custom SMTP**.

### Option A — Resend (matches this repo)

1. [Resend](https://resend.com) → verify domain `haidiho.com` (DNS records).
2. Resend → **SMTP** → create credentials.
3. Supabase → **Authentication → SMTP Settings** → Enable custom SMTP:

| Field | Value |
|-------|--------|
| Host | `smtp.resend.com` |
| Port | `465` (SSL) or `587` (TLS) |
| Username | `resend` |
| Password | Your Resend API key |
| Sender email | `hello@haidiho.com` (must be on verified domain) |
| Sender name | `Haidiho` |

4. Use the same `RESEND_API_KEY` and `RESEND_FROM_EMAIL` as in `.env.local`.

### Option B — Keep Supabase default sender

You can still use the HTML templates above; only the **From** line stays Supabase until SMTP is configured.

## 4. After signup — welcome email (optional)

The app can send a separate welcome via Resend (`sendWelcomeEmail` in `src/lib/resend.ts`) once the user is confirmed. That is independent of Supabase auth mail.

## Files

| File | Supabase template |
|------|-------------------|
| `confirm-signup.html` | Confirm signup |
| `magic-link.html` | Magic link |
| `reset-password.html` | Reset password |

Shared layout logic for app-sent mail: `src/lib/email/haidiho-email-layout.ts`.
