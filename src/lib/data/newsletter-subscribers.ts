import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import { randomUUID } from 'crypto'

export async function ensureUnsubscribeToken(subscriberId: string) {
  const admin = createAdminClient()
  if (!admin) return null

  const { data } = await admin
    .from('newsletter_subscribers')
    .select('unsubscribe_token')
    .eq('id', subscriberId)
    .single()

  if (data?.unsubscribe_token) return data.unsubscribe_token as string

  const token = randomUUID()
  await admin
    .from('newsletter_subscribers')
    .update({ unsubscribe_token: token })
    .eq('id', subscriberId)

  return token
}

export async function getSubscriberByToken(token: string) {
  const admin = createAdminClient()
  if (!admin) return null

  const { data } = await admin
    .from('newsletter_subscribers')
    .select('id, email, status, first_name')
    .eq('unsubscribe_token', token)
    .maybeSingle()

  return data
}

export async function unsubscribeByToken(token: string) {
  const admin = createAdminClient()
  if (!admin) return { ok: false as const, error: 'not_configured' }

  const sub = await getSubscriberByToken(token)
  if (!sub) return { ok: false as const, error: 'invalid_token' }

  const { error } = await admin
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('id', sub.id)

  if (error) return { ok: false as const, error: 'update_failed' }
  return { ok: true as const, email: sub.email as string }
}
