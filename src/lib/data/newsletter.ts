import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import { sendWelcomeEmailWithToken } from '@/lib/emails/send'
import { HaidihoErrors } from '@/lib/errors'

export type NewsletterSource =
  | 'homepage'
  | 'say_haidiho'
  | 'strip_page'
  | 'neighborhood'
  | 'mug_wall'
  | 'guide'

export type SubscribeResult =
  | { ok: true; message: string; alreadySubscribed?: boolean; emailSent?: boolean }
  | { ok: false; error: string }

export async function subscribeNewsletter(
  email: string,
  source: NewsletterSource,
  firstName?: string,
): Promise<SubscribeResult> {
  const normalized = email.trim().toLowerCase()
  if (!normalized.includes('@')) {
    return { ok: false, error: HaidihoErrors.validation }
  }

  const admin = createAdminClient()
  const supabase = admin ?? (await createServerSupabaseClient())
  if (!supabase) {
    return { ok: false, error: HaidihoErrors.generic }
  }

  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, status')
    .eq('email', normalized)
    .maybeSingle()

  if (existing?.status === 'active') {
    return {
      ok: true,
      alreadySubscribed: true,
      message: "You're already on the list — we see you. ❤️",
    }
  }

  const wasUnsubscribed = existing?.status === 'unsubscribed'
  let subscriberId = existing?.id as string | undefined

  if (existing) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'active', unsubscribed_at: null, source, first_name: firstName ?? null })
      .eq('id', existing.id)
    if (error) return { ok: false, error: HaidihoErrors.generic }
  } else {
    const row = {
      email: normalized,
      first_name: firstName ?? null,
      source,
      status: 'active' as const,
    }

    if (admin) {
      const { data, error } = await admin
        .from('newsletter_subscribers')
        .insert(row)
        .select('id')
        .single()
      if (error) return { ok: false, error: HaidihoErrors.generic }
      subscriberId = data?.id
    } else {
      const { error } = await supabase.from('newsletter_subscribers').insert(row)
      if (error) {
        return { ok: false, error: error.code === '23505' ? HaidihoErrors.duplicate : HaidihoErrors.generic }
      }
    }
  }

  // RLS blocks anon SELECT on newsletter_subscribers — always resolve id via service role
  if (!subscriberId && admin) {
    const { data } = await admin
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', normalized)
      .single()
    subscriberId = data?.id
  }

  let emailSent = false
  if (subscriberId) {
    try {
      const sendResult = await sendWelcomeEmailWithToken(
        normalized,
        subscriberId,
        firstName,
        wasUnsubscribed,
      )
      emailSent = sendResult && 'ok' in sendResult && sendResult.ok === true
      if (sendResult && 'skipped' in sendResult && sendResult.skipped) {
        console.error(
          '[newsletter] welcome email skipped — check RESEND_API_KEY and RESEND_FROM_EMAIL on the server',
        )
      }
    } catch (err) {
      console.error('[newsletter] welcome email failed:', err)
    }
  } else {
    console.error(
      '[newsletter] welcome email skipped — no subscriber id (set SUPABASE_SERVICE_ROLE_KEY)',
    )
  }

  return {
    ok: true,
    emailSent,
    message: wasUnsubscribed
      ? "Welcome back — you're on the list again. ❤️"
      : emailSent
        ? "You're officially in the neighborhood. Check your inbox — Hai is doing a little dance. ❤️"
        : "You're on the list. If the welcome email doesn't show up in a few minutes, check spam or try again later. ❤️",
  }
}
