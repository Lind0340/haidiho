import { getSubscriberByToken, unsubscribeByToken } from '@/lib/data/newsletter-subscribers'
import { HaidihoErrors } from '@/lib/errors'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
  }

  const sub = await getSubscriberByToken(token)
  if (!sub) {
    return NextResponse.json({ error: 'Invalid link' }, { status: 404 })
  }

  return NextResponse.json({
    email: sub.email,
    status: sub.status,
    alreadyUnsubscribed: sub.status === 'unsubscribed',
  })
}

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string }
  if (!body.token) {
    return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
  }

  const result = await unsubscribeByToken(body.token)
  if (!result.ok) {
    return NextResponse.json({ error: 'Could not unsubscribe' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, message: 'unsubscribed' })
}
