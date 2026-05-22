import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { User } from '@supabase/supabase-js'

/** Resolve the signed-in user from cookies or Authorization: Bearer (client session). */
export async function getRequestUser(request: Request) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return { user: null as User | null, supabase: null }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) return { user, supabase }

  const header = request.headers.get('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : null
  if (!token) return { user: null, supabase }

  const {
    data: { user: tokenUser },
    error,
  } = await supabase.auth.getUser(token)
  if (error || !tokenUser) return { user: null, supabase }

  return { user: tokenUser, supabase }
}
