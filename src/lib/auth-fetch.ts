import { createClient } from '@/lib/supabase'

/** Same-origin fetch that forwards the Supabase session to API routes. */
export async function authFetch(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers)
  const supabase = createClient()
  if (supabase) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`)
    }
  }
  return fetch(input, {
    ...init,
    headers,
    credentials: 'same-origin',
  })
}
