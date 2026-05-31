import { requireAdmin } from '@/lib/data/admin'
import {
  getNewsletterIssue,
  hydrateIssueFromFeatured,
  listNewsletterIssues,
  upsertNewsletterIssue,
  type NewsletterIssueInput,
} from '@/lib/data/newsletter-issues'
import { HaidihoErrors } from '@/lib/errors'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

async function assertAdmin() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !(await requireAdmin(user.id))) return null
  return user
}

export async function GET(request: Request) {
  const user = await assertAdmin()
  if (!user) return NextResponse.json({ error: HaidihoErrors.auth }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const issueNumber = searchParams.get('issue_number')

  if (issueNumber) {
    const num = parseInt(issueNumber, 10)
    if (Number.isNaN(num)) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }
    let issue = await getNewsletterIssue(num)
    if (!issue) return NextResponse.json({ issue: null })
    issue = await hydrateIssueFromFeatured(issue)
    return NextResponse.json({ issue })
  }

  const issues = await listNewsletterIssues()
  return NextResponse.json({ issues })
}

export async function POST(request: Request) {
  const user = await assertAdmin()
  if (!user) return NextResponse.json({ error: HaidihoErrors.auth }, { status: 403 })

  try {
    const body = (await request.json()) as NewsletterIssueInput
    if (!body.issue_number || !body.title?.trim()) {
      return NextResponse.json({ error: HaidihoErrors.validation }, { status: 400 })
    }
    const issue = await upsertNewsletterIssue(body)
    return NextResponse.json({ issue })
  } catch (e) {
    const message = e instanceof Error ? e.message : HaidihoErrors.generic
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
