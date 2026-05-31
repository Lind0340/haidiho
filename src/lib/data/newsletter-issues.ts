import { createAdminClient } from '@/lib/supabase-server'
import {
  getSiteUrl,
  issueRowToNewsletterProps,
  type ExclusiveType,
  type NeighborhoodPostCard,
  type NewsletterIssueRow,
} from '@/lib/email/newsletter-types'
import { buildUnsubscribeUrl } from '@/lib/email/send-weekly-newsletter'

export type NewsletterIssueInput = {
  issue_number: number
  title: string
  subject_line?: string | null
  preview_text?: string | null
  issue_date?: string | null
  opening_line?: string | null
  featured_strip_id?: string | null
  featured_mug_id?: string | null
  featured_post_id?: string | null
  featured_post_ids?: string[] | null
  strip_site_image_url?: string | null
  strip_newsletter_image_url?: string | null
  newsletter_strip_url?: string | null
  strip_page_url?: string | null
  difference_1?: string | null
  difference_2?: string | null
  difference_3?: string | null
  difference_4?: string | null
  difference_5?: string | null
  mug_image_url?: string | null
  mug_member_name?: string | null
  mug_member_title?: string | null
  mug_story?: string | null
  mug_page_url?: string | null
  tip_of_week?: string | null
  exclusive_type?: ExclusiveType | null
  exclusive_content?: string | null
  status?: 'draft' | 'scheduled' | 'sent'
}

export async function listNewsletterIssues(limit = 20) {
  const admin = createAdminClient()
  if (!admin) return []
  const { data } = await admin
    .from('newsletter_issues')
    .select('*')
    .order('issue_number', { ascending: false })
    .limit(limit)
  return (data ?? []).map(normalizeIssueRow)
}

export async function getNewsletterIssue(issueNumber: number) {
  const admin = createAdminClient()
  if (!admin) return null
  const { data } = await admin
    .from('newsletter_issues')
    .select('*')
    .eq('issue_number', issueNumber)
    .maybeSingle()
  return data ? normalizeIssueRow(data) : null
}

function normalizeIssueRow(row: Record<string, unknown>): NewsletterIssueRow {
  const ids = row.featured_post_ids
  return {
    ...(row as NewsletterIssueRow),
    featured_post_ids: Array.isArray(ids) ? (ids as string[]) : [],
    newsletter_strip_url:
      (row.newsletter_strip_url as string | null) ??
      (row.strip_newsletter_image_url as string | null),
  }
}

export async function upsertNewsletterIssue(input: NewsletterIssueInput) {
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')

  const payload = {
    ...input,
    newsletter_strip_url:
      input.newsletter_strip_url ?? input.strip_newsletter_image_url ?? null,
    strip_newsletter_image_url:
      input.strip_newsletter_image_url ?? input.newsletter_strip_url ?? null,
    featured_post_ids: input.featured_post_ids ?? [],
    status: input.status ?? 'draft',
  }

  const existing = await getNewsletterIssue(input.issue_number)

  if (existing) {
    const { data, error } = await admin
      .from('newsletter_issues')
      .update(payload)
      .eq('issue_number', input.issue_number)
      .select('*')
      .single()
    if (error) throw error
    return normalizeIssueRow(data)
  }

  const { data, error } = await admin.from('newsletter_issues').insert(payload).select('*').single()
  if (error) throw error
  return normalizeIssueRow(data)
}

export async function fetchComposerOptions() {
  const admin = createAdminClient()
  if (!admin) {
    return { mugs: [], posts: [], subscriberCount: 0, nextIssueNumber: 1 }
  }

  const [mugsRes, postsRes, subRes, issuesRes] = await Promise.all([
    admin
      .from('mug_submissions')
      .select('id, member_name, member_title, mug_story, image_url, appeared_in_strip_id')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50),
    admin
      .from('community_posts')
      .select('id, content, room, like_count, user_id, guest_author')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(80),
    admin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    admin
      .from('newsletter_issues')
      .select('issue_number')
      .order('issue_number', { ascending: false })
      .limit(1),
  ])

  const userIds = [...new Set((postsRes.data ?? []).map((p) => p.user_id).filter(Boolean))]
  const profiles: Record<string, string> = {}
  if (userIds.length) {
    const { data: profs } = await admin
      .from('profiles')
      .select('id, username, display_name')
      .in('id', userIds as string[])
    for (const p of profs ?? []) {
      profiles[p.id] = p.username ? `@${p.username}` : p.display_name ?? 'neighbor'
    }
  }

  const posts = (postsRes.data ?? []).map((p) => ({
    id: p.id as string,
    room: p.room as string,
    like_count: (p.like_count as number) ?? 0,
    preview:
      (p.content as string).length > 120
        ? `${(p.content as string).slice(0, 117)}…`
        : (p.content as string),
    username: p.user_id
      ? profiles[p.user_id as string] ?? '@neighbor'
      : (p.guest_author as string) ?? '@guest',
  }))

  return {
    mugs: mugsRes.data ?? [],
    posts,
    subscriberCount: subRes.count ?? 0,
    nextIssueNumber: ((issuesRes.data?.[0]?.issue_number as number) ?? 0) + 1,
  }
}

export async function fetchNeighborhoodPostsForIssue(
  postIds: string[],
): Promise<NeighborhoodPostCard[]> {
  if (!postIds.length) return []
  const admin = createAdminClient()
  if (!admin) return []

  const { data: posts } = await admin
    .from('community_posts')
    .select('id, content, room, like_count, user_id, guest_author')
    .in('id', postIds)

  const byId = new Map((posts ?? []).map((p) => [p.id as string, p]))
  const userIds = [...new Set((posts ?? []).map((p) => p.user_id).filter(Boolean))]
  const profiles: Record<string, string> = {}
  if (userIds.length) {
    const { data: profs } = await admin
      .from('profiles')
      .select('id, username, display_name')
      .in('id', userIds as string[])
    for (const p of profs ?? []) {
      profiles[p.id] = p.username ? `@${p.username}` : p.display_name ?? 'neighbor'
    }
  }

  return postIds
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((p) => {
      const content = p!.content as string
      return {
        id: p!.id as string,
        room: p!.room as string,
        username: p!.user_id
          ? profiles[p!.user_id as string] ?? '@neighbor'
          : (p!.guest_author as string) ?? '@guest',
        excerpt: content.length > 220 ? `${content.slice(0, 217)}…` : content,
        likeCount: (p!.like_count as number) ?? 0,
      }
    })
}

export async function hydrateIssueFromFeatured(row: NewsletterIssueRow): Promise<NewsletterIssueRow> {
  const admin = createAdminClient()
  if (!admin) return row

  const site = getSiteUrl()
  const next = { ...row }

  if (row.featured_strip_id && !row.strip_site_image_url) {
    const { data: strip } = await admin
      .from('strips')
      .select('image_url, slug')
      .eq('id', row.featured_strip_id)
      .maybeSingle()
    if (strip) {
      next.strip_site_image_url = strip.image_url as string
      if (!next.newsletter_strip_url && !next.strip_newsletter_image_url) {
        next.newsletter_strip_url = strip.image_url as string
      }
      if (!next.strip_page_url) {
        next.strip_page_url = strip.slug ? `${site}/strip/${strip.slug}` : `${site}/strip`
      }
    }
  }

  if (row.featured_mug_id) {
    const { data: mug } = await admin
      .from('mug_submissions')
      .select('image_url, member_name, member_title, mug_story, appeared_in_strip_id')
      .eq('id', row.featured_mug_id)
      .maybeSingle()
    if (mug) {
      next.mug_image_url = (mug.image_url as string) ?? next.mug_image_url
      next.mug_member_name = (mug.member_name as string) ?? next.mug_member_name
      next.mug_member_title = (mug.member_title as string) ?? next.mug_member_title
      next.mug_story = (mug.mug_story as string) ?? next.mug_story
      if (!next.mug_page_url) next.mug_page_url = `${site}/mugs`
    }
  }

  return next
}

export async function buildNewsletterPropsFromIssue(
  row: NewsletterIssueRow,
  previewUnsubscribeUrl?: string,
) {
  const postIds =
    row.featured_post_ids?.length
      ? row.featured_post_ids
      : row.featured_post_id
        ? [row.featured_post_id]
        : []
  const neighborhoodPosts = await fetchNeighborhoodPostsForIssue(postIds)
  const hydrated = await hydrateIssueFromFeatured(row)
  const props = issueRowToNewsletterProps(
    hydrated,
    getSiteUrl(),
    neighborhoodPosts,
    previewUnsubscribeUrl,
  )

  if (props.mug && row.featured_mug_id) {
    const admin = createAdminClient()
    if (admin) {
      const { data: mug } = await admin
        .from('mug_submissions')
        .select('appeared_in_strip_id')
        .eq('id', row.featured_mug_id)
        .maybeSingle()
      props.mug.appearedInStrip = !!mug?.appeared_in_strip_id
    }
  }

  return props
}

export async function fetchActiveSubscribersWithTokens() {
  const admin = createAdminClient()
  if (!admin) return []
  const { data } = await admin
    .from('newsletter_subscribers')
    .select('email, unsubscribe_token')
    .eq('status', 'active')

  return (data ?? [])
    .filter((r) => r.unsubscribe_token)
    .map((r) => ({
      email: r.email as string,
      unsubscribeUrl: buildUnsubscribeUrl(r.unsubscribe_token as string),
    }))
}

export async function countActiveSubscribers() {
  const admin = createAdminClient()
  if (!admin) return 0
  const { count } = await admin
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
  return count ?? 0
}

export async function markIssueSent(
  issueNumber: number,
  subscriberCount: number,
  failures: { email: string; error: string }[],
) {
  const admin = createAdminClient()
  if (!admin) throw new Error('Admin client not configured')
  await admin
    .from('newsletter_issues')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      subscriber_count: subscriberCount,
      send_failures: failures,
    })
    .eq('issue_number', issueNumber)
}
