import { createServerSupabaseClient } from '@/lib/supabase-server'
import { reviewContentWithClaude } from '@/lib/ai-moderator'
import { requireModerator } from '@/lib/data/admin'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import type { RoomId } from '@/types/database'
import { NextResponse } from 'next/server'

const ROOMS: RoomId[] = ['water_cooler', 'training_room', 'help_desk']

/**
 * Claude content pre-screening.
 * Used by admins to re-run moderation; story/post submissions call the lib directly.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: HaidihoErrors.generic }, { status: 503 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json()
    const content = String(body.content ?? '').trim()
    const room = body.room as RoomId | undefined
    const contentType = body.contentType as 'story' | 'post' | 'comment' | undefined

    if (!content || content.length < 5) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    if (room && !ROOMS.includes(room)) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    const isInternal = request.headers.get('x-haidiho-internal') === process.env.MODERATION_INTERNAL_SECRET?.trim()
    if (!isInternal) {
      if (!user || !(await requireModerator(user.id))) {
        return NextResponse.json({ error: HaidihoErrors.auth }, { status: 403 })
      }
    }

    const result = await reviewContentWithClaude({
      content,
      room: room ?? null,
      contentType: contentType ?? 'post',
    })

    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
