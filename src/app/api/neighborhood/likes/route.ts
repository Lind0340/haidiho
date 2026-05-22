import { getRequestUser } from '@/lib/api-auth'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { user, supabase } = await getRequestUser(request)
    if (!user || !supabase) {
      return NextResponse.json({ error: HaidihoErrors.auth }, { status: 401 })
    }

    const { postId, liked } = await request.json()
    if (!postId) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    if (liked) {
      const { error } = await supabase.from('post_likes').insert({
        post_id: postId,
        user_id: user.id,
      })
      if (error && !error.message.includes('duplicate')) {
        return NextResponse.json({ error: friendlyError(error) }, { status: 500 })
      }
    } else {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
    }

    const { data: post } = await supabase
      .from('community_posts')
      .select('like_count')
      .eq('id', postId)
      .single()

    return NextResponse.json({ ok: true, like_count: post?.like_count ?? 0 })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
