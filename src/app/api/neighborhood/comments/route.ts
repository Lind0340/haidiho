import { getRequestUser } from '@/lib/api-auth'
import { moderateAndApply } from '@/lib/data/ai-moderation'
import { createAdminClient } from '@/lib/supabase-server'
import { fetchPostComments } from '@/lib/data/neighborhood'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const postId = new URL(request.url).searchParams.get('postId')
    if (!postId) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }
    const comments = await fetchPostComments(postId)
    return NextResponse.json({ comments })
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

    const { postId, content } = await request.json()
    if (!postId || !String(content).trim()) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    const { data: comment, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: String(content).trim(),
        status: 'pending',
      })
      .select('id')
      .single()

    if (error || !comment) {
      return NextResponse.json({ error: friendlyError(error) }, { status: 500 })
    }

    const admin = createAdminClient()
    if (admin) {
      try {
        const verdict = await moderateAndApply({
          contentType: 'comment',
          contentId: comment.id,
          content: String(content).trim(),
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
        console.error('[api/neighborhood/comments] AI moderation failed:', modErr)
        return NextResponse.json({ error: HaidihoErrors.generic }, { status: 500 })
      }
    }

    return NextResponse.json({
      ok: true,
      message: HaidihoErrors.commentSuccess,
    })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
