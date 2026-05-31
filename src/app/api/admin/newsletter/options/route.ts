import { requireAdmin } from '@/lib/data/admin'
import { fetchComposerOptions } from '@/lib/data/newsletter-issues'
import { HaidihoErrors } from '@/lib/errors'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: HaidihoErrors.generic }, { status: 503 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !(await requireAdmin(user.id))) {
    return NextResponse.json({ error: HaidihoErrors.auth }, { status: 403 })
  }

  const options = await fetchComposerOptions()
  return NextResponse.json(options)
}
