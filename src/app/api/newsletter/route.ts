import { subscribeNewsletter, type NewsletterSource } from '@/lib/data/newsletter'
import { HaidihoErrors, friendlyError } from '@/lib/errors'
import { NextResponse } from 'next/server'

const SOURCES: NewsletterSource[] = [
  'homepage',
  'say_haidiho',
  'strip_page',
  'neighborhood',
  'mug_wall',
  'guide',
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email ?? '').trim()
    const firstName = body.firstName ? String(body.firstName).trim() : undefined
    const source = (body.source ?? 'homepage') as NewsletterSource

    if (!SOURCES.includes(source)) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    const result = await subscribeNewsletter(email, source, firstName)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
