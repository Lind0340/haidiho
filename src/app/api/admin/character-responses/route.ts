import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/data/admin'
import {
  countCharacterResponsesLast24h,
  createCharacterResponse,
  fetchPostsForCharacterReplyPicker,
  fetchRecentCharacterResponses,
} from '@/lib/data/character-responses'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import { CHARACTER_LIST, NEIGHBORHOOD_CHARACTERS, type CharacterId } from '@/lib/characters'
import { NextResponse } from 'next/server'

const CHARACTERS = new Set(CHARACTER_LIST.map((c) => c.id))

export async function GET() {
  try {
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

    const [posts, recent, postedToday] = await Promise.all([
      fetchPostsForCharacterReplyPicker(),
      fetchRecentCharacterResponses(8),
      countCharacterResponsesLast24h(),
    ])

    return NextResponse.json({
      posts,
      recent,
      postedToday,
      canPostToday: postedToday < 1,
    })
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
    if (!user || !(await requireAdmin(user.id))) {
      return NextResponse.json({ error: HaidihoErrors.auth }, { status: 403 })
    }

    const body = await request.json()
    const postId = String(body.postId ?? '').trim()
    const character = body.character as CharacterId
    const content = String(body.content ?? '').trim()

    if (!postId || !CHARACTERS.has(character) || content.length < 5) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    const response = await createCharacterResponse({
      postId,
      character,
      content,
      createdBy: user.id,
    })

    const postedToday = await countCharacterResponsesLast24h()

    return NextResponse.json({
      ok: true,
      response,
      canPostToday: postedToday < 1,
      message: `${NEIGHBORHOOD_CHARACTERS[response.character].name} is live in the neighborhood. ❤️`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'CHARACTER_DAILY_LIMIT') {
      return NextResponse.json(
        {
          error:
            'One character response per day — save it for a post that really deserves it. Try again tomorrow. ❤️',
        },
        { status: 429 },
      )
    }
    if (msg === 'POST_NOT_FOUND') {
      return NextResponse.json({ error: 'That post is not live anymore.' }, { status: 404 })
    }
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
