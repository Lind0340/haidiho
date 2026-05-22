import { createServerSupabaseClient } from '@/lib/supabase-server'
import {
  approveModerationItem,
  fetchPendingModeration,
  rejectModerationItem,
  requireModerator,
} from '@/lib/data/admin'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import type { ModerationQueueItem } from '@/types/database'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: HaidihoErrors.generic }, { status: 503 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || !(await requireModerator(user.id))) {
      return NextResponse.json({ error: HaidihoErrors.auth }, { status: 403 })
    }

    const items = await fetchPendingModeration()
    const admin = await import('@/lib/supabase-server').then((m) => m.createAdminClient())
    if (!admin) return NextResponse.json({ items })

    const enriched = await Promise.all(
      items.map(async (item) => {
        let preview: Record<string, unknown> | null = null
        if (item.content_type === 'post') {
          const { data } = await admin
            .from('community_posts')
            .select('content, room, profiles(display_name, username)')
            .eq('id', item.content_id)
            .single()
          preview = data as Record<string, unknown> | null
        } else if (item.content_type === 'mug') {
          const { data } = await admin
            .from('mug_submissions')
            .select('member_name, mug_text, image_url')
            .eq('id', item.content_id)
            .single()
          preview = data as Record<string, unknown> | null
        } else if (item.content_type === 'story') {
          const { data } = await admin
            .from('story_submissions')
            .select('submitter_name, story_content, room')
            .eq('id', item.content_id)
            .single()
          preview = data as Record<string, unknown> | null
        }
        return { ...item, preview }
      }),
    )

    return NextResponse.json({ items: enriched })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: HaidihoErrors.generic }, { status: 503 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || !(await requireModerator(user.id))) {
      return NextResponse.json({ error: HaidihoErrors.auth }, { status: 403 })
    }

    const body = await request.json()
    const item = body.item as ModerationQueueItem
    const action = body.action as 'approve' | 'reject'

    if (action === 'approve') {
      await approveModerationItem(item, user.id)
    } else {
      await rejectModerationItem(item, user.id, body.notes)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
