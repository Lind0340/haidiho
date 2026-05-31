import { createServerSupabaseClient } from '@/lib/supabase-server'
import { sendMugConfirmation } from '@/lib/resend'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: HaidihoErrors.generic }, { status: 503 })
    }

    const form = await request.formData()
    const member_name = String(form.get('member_name') ?? '').trim()
    const member_title = String(form.get('member_title') ?? '').trim() || null
    const mug_text = String(form.get('mug_text') ?? '').trim() || null
    const mug_story = String(form.get('mug_story') ?? '').trim() || null
    const email = String(form.get('email') ?? '').trim()
    const file = form.get('image') as File | null
    const terms_agreed = form.get('terms_agreed') === 'true'

    if (!terms_agreed) {
      return NextResponse.json(
        { error: 'You must agree to the Mug Submission Terms.' },
        { status: 400 },
      )
    }

    if (!member_name || !file?.size) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${user?.id ?? 'guest'}/${Date.now()}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from('mugs')
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: HaidihoErrors.upload }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('mugs').getPublicUrl(path)
    const image_url = urlData.publicUrl

    const agreedAt = new Date().toISOString()
    const { data, error } = await supabase
      .from('mug_submissions')
      .insert({
        user_id: user?.id ?? null,
        member_name,
        member_title,
        mug_text,
        mug_story,
        image_url,
        status: 'pending',
        terms_agreed: true,
        terms_agreed_at: agreedAt,
      })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: friendlyError(error) }, { status: 500 })
    }

    if (user) {
      await supabase.from('profiles').update({ mug_submitted: true }).eq('id', user.id)
    }

    if (email) {
      try {
        await sendMugConfirmation(email, member_name)
      } catch {
        /* non-blocking */
      }
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      message: 'Your mug is in the queue. Hai is already excited. ❤️',
    })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
