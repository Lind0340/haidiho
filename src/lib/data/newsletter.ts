import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import { sendWelcomeEmail } from '@/lib/resend'
import { HaidihoErrors } from '@/lib/errors'

export type NewsletterSource =
  | 'homepage'
  | 'say_haidiho'
  | 'strip_page'
  | 'neighborhood'
  | 'mug_wall'
  | 'guide'

export type SubscribeResult =
  | { ok: true; message: string; alreadySubscribed?: boolean }
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

  const supabase = (await createServerSupabaseClient()) ?? createAdminClient()
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

  if (existing) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'active', unsubscribed_at: null, source, first_name: firstName ?? null })
      .eq('id', existing.id)
    if (error) return { ok: false, error: HaidihoErrors.generic }
  } else {
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: normalized,
      first_name: firstName ?? null,
      source,
      status: 'active',
    })
    if (error) {
      if (error.code === '42501') {
        const admin = createAdminClient()
        if (admin) {
          const { error: adminErr } = await admin.from('newsletter_subscribers').insert({
            email: normalized,
            first_name: firstName ?? null,
            source,
            status: 'active',
          })
          if (adminErr) return { ok: false, error: HaidihoErrors.generic }
        } else return { ok: false, error: HaidihoErrors.generic }
      } else return { ok: false, error: HaidihoErrors.duplicate }
    }
  }

  try {
    await sendWelcomeEmail(normalized, firstName)
  } catch {
    // non-blocking
  }

  return {
    ok: true,
    message: "You're officially in the neighborhood. Hai is doing a little dance. ❤️",
  }
}
