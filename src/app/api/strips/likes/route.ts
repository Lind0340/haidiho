import { createServerSupabaseClient } from '@/lib/supabase-server'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: HaidihoErrors.generic }, { status: 503 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: HaidihoErrors.auth }, { status: 401 })
    }

    const { stripId, liked } = await request.json()
    if (!stripId) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    if (liked) {
      await supabase.from('strip_likes').insert({ strip_id: stripId, user_id: user.id })
    } else {
      await supabase.from('strip_likes').delete().eq('strip_id', stripId).eq('user_id', user.id)
    }

    const { count } = await supabase
      .from('strip_likes')
      .select('*', { count: 'exact', head: true })
      .eq('strip_id', stripId)

    return NextResponse.json({ ok: true, count: count ?? 0 })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
