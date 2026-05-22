import { getRequestUser } from '@/lib/api-auth'
import { moderateAndApply } from '@/lib/data/ai-moderation'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import {
  fetchCommunityPosts,
  fetchRoomStats,
  postRowToNeighborhood,
} from '@/lib/data/neighborhood'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import type { RoomId } from '@/types/database'
import { NextResponse } from 'next/server'

const ROOMS: RoomId[] = ['water_cooler', 'training_room', 'help_desk']

const POST_SELECT = `
  id,
  room,
  content,
  like_count,
  comment_count,
  created_at,
  status,
  profiles ( username, display_name, avatar_url )
`

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const room = searchParams.get('room') as RoomId | 'all' | null
    const cursor = searchParams.get('cursor') ?? undefined
    const statsOnly = searchParams.get('stats') === '1'

    const supabase = await createServerSupabaseClient()
    const userId = supabase ? (await supabase.auth.getUser()).data.user?.id : null

    if (statsOnly) {
      const roomStats = await fetchRoomStats()
      return NextResponse.json({ roomStats })
    }

    const { posts, nextCursor, error } = await fetchCommunityPosts({
      room: room && room !== 'all' ? room : 'all',
      cursor,
      userId,
    })

    if (error) {
      return NextResponse.json({ error: friendlyError(error) }, { status: 500 })
    }

    return NextResponse.json({ posts, nextCursor })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { user, supabase } = await getRequestUser(request)
    if (!user || !supabase) {
      return NextResponse.json({ error: HaidihoErrors.auth }, { status: 401 })
    }

    const body = await request.json()
    const room = body.room as RoomId
    const username = String(body.username ?? '').trim()
    const content = String(body.content ?? '').trim()

    if (!ROOMS.includes(room)) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }
    if (!username || content.length < 10) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    const handle = username.replace(/^@/, '')
    await supabase.from('profiles').upsert({
      id: user.id,
      username: handle,
      display_name: username.startsWith('@') ? username : `@${handle}`,
      story_submitted: true,
    })

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        room,
        content,
        status: 'pending',
      })
      .select(POST_SELECT)
      .single()

    if (error) {
      return NextResponse.json({ error: friendlyError(error) }, { status: 500 })
    }

    const admin = createAdminClient()
    if (admin) {
      try {
        const verdict = await moderateAndApply({
          contentType: 'post',
          contentId: data.id,
          content,
          room,
        })
        if (verdict.decision === 'reject') {
          return NextResponse.json(
            {
              error: verdict.userMessage || HaidihoErrors.storyRejected,
              rejected: true,
            },
            { status: 422 },
          )
        }
      } catch (modErr) {
        console.error('[api/neighborhood/posts] AI moderation failed:', modErr)
        return NextResponse.json({ error: HaidihoErrors.generic }, { status: 500 })
      }
    }

    const { data: live } = await supabase
      .from('community_posts')
      .select(POST_SELECT)
      .eq('id', data.id)
      .single()

    return NextResponse.json({
      ok: true,
      message: HaidihoErrors.postSuccess,
      post: postRowToNeighborhood((live ?? data) as never),
    })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
