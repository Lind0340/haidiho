import { getEmailLinkUrl, getEmailSiteUrl, getSiteUrl } from '@/lib/site-url'

export { getSiteUrl, getEmailLinkUrl, getEmailSiteUrl }

/** Props for the weekly React Email template and admin composer. */

export type ExclusiveType =
  | 'back_channel'
  | 'hai_entry'
  | 'compliance'
  | 'derek'
  | 'bob'

export type NeighborhoodPostCard = {
  id: string
  room: 'water_cooler' | 'training_room' | 'help_desk' | string
  username: string
  excerpt: string
  likeCount: number
}

export type WeeklyNewsletterProps = {
  siteUrl: string
  issueNumber: number
  issueDate: string
  openingLine: string
  strip: {
    siteImageUrl: string
    newsletterImageUrl: string
    pageUrl: string
    waterCoolerUrl: string
  }
  differences: [string, string, string, string, string]
  mug?: {
    imageUrl: string
    memberName: string
    memberTitle?: string
    story: string
    pageUrl: string
    appearedInStrip?: boolean
  }
  neighborhoodPosts: NeighborhoodPostCard[]
  tipOfWeek?: string
  exclusive?: {
    type: ExclusiveType
    content: string
  }
  preferencesUrl: string
  unsubscribeUrl: string
}

export type NewsletterIssueRow = {
  id: string
  issue_number: number
  title: string
  subject_line: string | null
  preview_text: string | null
  featured_strip_id: string | null
  featured_mug_id: string | null
  featured_post_id: string | null
  featured_post_ids: string[] | null
  tip_of_week: string | null
  issue_date: string | null
  opening_line: string | null
  strip_site_image_url: string | null
  strip_newsletter_image_url: string | null
  newsletter_strip_url: string | null
  strip_page_url: string | null
  difference_1: string | null
  difference_2: string | null
  difference_3: string | null
  difference_4: string | null
  difference_5: string | null
  mug_image_url: string | null
  mug_member_name: string | null
  mug_member_title: string | null
  mug_story: string | null
  mug_page_url: string | null
  neighborhood_excerpt: string | null
  neighborhood_author: string | null
  neighborhood_room: string | null
  neighborhood_page_url: string | null
  exclusive_type: ExclusiveType | null
  exclusive_content: string | null
  status: 'draft' | 'scheduled' | 'sent'
  scheduled_at: string | null
  sent_at: string | null
  subscriber_count: number | null
  send_failures: { email: string; error: string }[] | null
  created_at: string
}

export const EXCLUSIVE_LABELS: Record<ExclusiveType, string> = {
  back_channel: 'Back Channel Excerpt',
  hai_entry: "Hai's Entry of the Week",
  compliance: 'COMPLIANCE Update',
  derek: 'Derek Observation',
  bob: "BOB's Significant Events",
}

export function rowDifferences(row: NewsletterIssueRow): WeeklyNewsletterProps['differences'] {
  return [
    row.difference_1?.trim() || '—',
    row.difference_2?.trim() || '—',
    row.difference_3?.trim() || '—',
    row.difference_4?.trim() || '—',
    row.difference_5?.trim() || '—',
  ]
}

export function issueRowToNewsletterProps(
  row: NewsletterIssueRow,
  siteUrl = getEmailLinkUrl(),
  neighborhoodPosts: NeighborhoodPostCard[] = [],
  unsubscribeUrl?: string,
): WeeklyNewsletterProps {
  const base = siteUrl.replace(/\/$/, '')
  const assetBase = getEmailSiteUrl()
  const newsletterImage =
    row.newsletter_strip_url?.trim() ||
    row.strip_newsletter_image_url?.trim() ||
    `${assetBase}/images/strip-card.png`

  const issueDate = row.issue_date
    ? new Date(row.issue_date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

  const props: WeeklyNewsletterProps = {
    siteUrl: base,
    issueNumber: row.issue_number,
    issueDate,
    openingLine:
      row.opening_line?.trim() ||
      "Hey. Good week? Either way here's the good stuff. ❤️",
    strip: {
      siteImageUrl: row.strip_site_image_url?.trim() || `${assetBase}/images/strip-card.png`,
      newsletterImageUrl: newsletterImage,
      pageUrl: row.strip_page_url?.trim() || `${base}/strip`,
      waterCoolerUrl: `${base}/neighborhood/water_cooler`,
    },
    differences: rowDifferences(row),
    neighborhoodPosts,
    preferencesUrl: `${base}/say-haidiho`,
    unsubscribeUrl: unsubscribeUrl ?? `${base}/say-haidiho?unsubscribe=1`,
  }

  if (row.mug_image_url?.trim() && row.mug_member_name?.trim()) {
    props.mug = {
      imageUrl: row.mug_image_url.trim(),
      memberName: row.mug_member_name.trim(),
      memberTitle: row.mug_member_title?.trim() || undefined,
      story: row.mug_story?.trim() || '',
      pageUrl: row.mug_page_url?.trim() || `${base}/mugs`,
      appearedInStrip: false,
    }
  }

  if (row.tip_of_week?.trim()) {
    props.tipOfWeek = row.tip_of_week.trim()
  }

  if (row.exclusive_type && row.exclusive_content?.trim()) {
    props.exclusive = {
      type: row.exclusive_type,
      content: row.exclusive_content.trim(),
    }
  }

  return props
}
