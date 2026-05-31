import { NewsletterComposer } from '@/components/admin/NewsletterComposer'
import {
  getNewsletterIssue,
  hydrateIssueFromFeatured,
} from '@/lib/data/newsletter-issues'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ issueNumber: string }> }

export default async function NewsletterEditPage({ params }: Props) {
  const { issueNumber: raw } = await params
  const issueNumber = parseInt(raw, 10)
  if (Number.isNaN(issueNumber)) notFound()

  let issue = await getNewsletterIssue(issueNumber)
  if (!issue) notFound()
  issue = await hydrateIssueFromFeatured(issue)

  return (
    <div>
      <Link href="/admin/newsletter" className="text-sm font-bold text-hai-blue hover:underline">
        ← Newsletter
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        Edit issue #{issueNumber}
      </h1>
      <p className="mt-1 text-sm text-soft-charcoal/60">Status: {issue.status}</p>
      <div className="mt-8">
        <NewsletterComposer initialIssue={issue} />
      </div>
    </div>
  )
}
