import { requireAdmin } from '@/lib/data/admin'
import {
  buildNewsletterPropsFromIssue,
  getNewsletterIssue,
  hydrateIssueFromFeatured,
  upsertNewsletterIssue,
  type NewsletterIssueInput,
} from '@/lib/data/newsletter-issues'
import { renderWeeklyNewsletterHtml } from '@/lib/email/render-weekly-newsletter'
import { HaidihoErrors } from '@/lib/errors'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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

  try {
    const body = (await request.json()) as NewsletterIssueInput & { save?: boolean }
    const row = body.save
      ? await upsertNewsletterIssue(body)
      : body.issue_number
        ? await hydrateIssueFromFeatured(
            (await getNewsletterIssue(body.issue_number)) ?? (await upsertNewsletterIssue(body)),
          )
        : await upsertNewsletterIssue(body)

    const props = await buildNewsletterPropsFromIssue(row)
    const html = await renderWeeklyNewsletterHtml({
      ...props,
      previewText: row.preview_text ?? undefined,
    })

    return NextResponse.json({ html, issue: row })
  } catch (e) {
    const message = e instanceof Error ? e.message : HaidihoErrors.generic
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
