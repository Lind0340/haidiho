import { getRequestUser } from '@/lib/api-auth'
import { createAdminClient } from '@/lib/supabase-server'
import { prescreenCommunitySubmission } from '@/lib/data/ai-moderation'
import { createPendingFeedPostFromStory } from '@/lib/data/story-neighborhood'
import { neighborhoodDisplayName } from '@/lib/neighborhood-profile'
import { sendStoryConfirmation } from '@/lib/resend'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import type { RoomId } from '@/types/database'
import { NextResponse } from 'next/server'

const ROOMS: RoomId[] = ['water_cooler', 'training_room', 'help_desk']

export async function POST(request: Request) {
  try {
    const admin = createAdminClient()
    if (!admin) {
      return NextResponse.json({ error: HaidihoErrors.generic }, { status: 503 })
    }

    const { user, supabase } = await getRequestUser(request)
    if (!user || !supabase) {
      return NextResponse.json({ error: HaidihoErrors.authToPost }, { status: 401 })
    }

    const body = await request.json()
    const submitter_email = String(body.email ?? body.submitter_email ?? user.email ?? '').trim()
    const story_content = String(body.story ?? body.story_content ?? '').trim()
    const room = body.room as RoomId | undefined
    const ai_tool_used = body.ai_tool_used ? String(body.ai_tool_used).trim() : null
    const terms_agreed = body.terms_agreed === true

    if (!terms_agreed) {
      return NextResponse.json(
        { error: 'You must agree to the Story Submission Terms.' },
        { status: 400 },
      )
    }

    if (story_content.length < 20) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }
    if (!room || !ROOMS.includes(room)) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('username, display_name')
      .eq('id', user.id)
      .maybeSingle()

    const submitter_name = neighborhoodDisplayName(profile, user.email)

    await supabase.from('profiles').upsert({
      id: user.id,
      username: profile?.username ?? submitter_name.replace(/^@/, ''),
      display_name: submitter_name,
      story_submitted: true,
    })

    const agreedAt = new Date().toISOString()
    const row = {
      user_id: user.id,
      submitter_name,
      submitter_email: submitter_email || null,
      room,
      story_content,
      ai_tool_used,
      status: 'pending' as const,
      terms_agreed: true,
      terms_agreed_at: agreedAt,
    }

    const result = await supabase.from('story_submissions').insert(row).select('id').single()

    if (result.error) {
      console.error('[api/stories] insert failed:', result.error.message, result.error.code)
      return NextResponse.json(
        { error: friendlyError(result.error, HaidihoErrors.generic) },
        { status: 500 },
      )
    }

    const data = 'data' in result && result.data ? result.data : { id: null }
    const storyId = data && typeof data === 'object' && 'id' in data ? String(data.id) : null

    if (room && storyId && admin) {
      const feed = await createPendingFeedPostFromStory({
        storySubmissionId: storyId,
        room,
        content: story_content,
        userId: user.id,
        submitterName: submitter_name,
      })
      if (feed.error) {
        console.error('[api/stories] feed post failed:', feed.error)
      }
    }

    let successMessage: string = HaidihoErrors.storySuccess

    if (storyId && admin) {
      try {
        const verdict = await prescreenCommunitySubmission({
          contentType: 'story',
          contentId: storyId,
          content: story_content,
          room: room ?? null,
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
        console.error('[api/stories] AI moderation failed:', modErr)
        return NextResponse.json({ error: HaidihoErrors.generic }, { status: 500 })
      }
    } else if (storyId && !admin) {
      successMessage =
        "Got it! Hai will post it once the server is fully wired up (service role key). ❤️"
    }

    if (submitter_email) {
      try {
        await sendStoryConfirmation(submitter_email, submitter_name)
      } catch {
        /* non-blocking */
      }
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      message: successMessage,
    })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
