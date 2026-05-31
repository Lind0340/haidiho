import { requireAdmin } from '@/lib/data/admin'
import {
  buildNewsletterPropsFromIssue,
  fetchActiveSubscribersWithTokens,
  getNewsletterIssue,
  hydrateIssueFromFeatured,
  markIssueSent,
  upsertNewsletterIssue,
  type NewsletterIssueInput,
} from '@/lib/data/newsletter-issues'
import { sendWeeklyNewsletterBatch, sendWeeklyNewsletterTest } from '@/lib/email/send-weekly-newsletter'
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
    const body = (await request.json()) as {
      issue_number: number
      mode?: 'test' | 'broadcast'
      test_email?: string
      issue?: NewsletterIssueInput
    }

    if (body.issue) {
      await upsertNewsletterIssue(body.issue)
    }

    if (!body.issue_number) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }

    let issue = await getNewsletterIssue(body.issue_number)
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found. Save draft first.' }, { status: 404 })
    }
    issue = await hydrateIssueFromFeatured(issue)

    const subject =
      issue.subject_line?.trim() ||
      `Haidiho #${String(issue.issue_number).padStart(3, '0')} — The Weekly Neighborhood Report`

    if (body.mode === 'test') {
      const to = body.test_email?.trim() || process.env.NEWSLETTER_TEST_EMAIL?.trim()
      if (!to) {
        return NextResponse.json({ error: 'test_email required' }, { status: 400 })
      }
      const props = await buildNewsletterPropsFromIssue(issue)
      const result = await sendWeeklyNewsletterTest(to, {
        ...props,
        previewText: issue.preview_text ?? undefined,
        subject: `[Sample] ${subject}`,
      })
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ ok: true, id: result.id, mode: 'test' })
    }

    if (issue.status === 'sent') {
      return NextResponse.json({ error: 'Issue already sent' }, { status: 409 })
    }

    const recipients = await fetchActiveSubscribersWithTokens()
    if (!recipients.length) {
      return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
    }

    const previewText = issue.preview_text ?? undefined
    const baseProps = await buildNewsletterPropsFromIssue(issue)
    const result = await sendWeeklyNewsletterBatch(
      recipients,
      (unsubscribeUrl) => ({
        ...baseProps,
        unsubscribeUrl,
        previewText,
      }),
      subject,
    )

    await markIssueSent(issue.issue_number, result.sent, result.errors)

    return NextResponse.json({
      ok: result.ok,
      sent: result.sent,
      failed: result.failed,
      errors: result.errors,
      message: `Haidiho #${issue.issue_number} sent to ${result.sent} neighbors. ❤️ BOB has filed this under Significant Events.`,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : HaidihoErrors.generic
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
