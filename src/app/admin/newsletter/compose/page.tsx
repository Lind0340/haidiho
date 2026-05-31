import { NewsletterComposer } from '@/components/admin/NewsletterComposer'
import { listNewsletterIssues } from '@/lib/data/newsletter-issues'
import Link from 'next/link'

export default async function NewsletterComposePage() {
  const issues = await listNewsletterIssues(1)
  const nextIssueNumber = (issues[0]?.issue_number ?? 0) + 1

  return (
    <div>
      <Link href="/admin/newsletter" className="text-sm font-bold text-hai-blue hover:underline">
        ← Newsletter
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        Compose issue #{nextIssueNumber}
      </h1>
      <p className="mt-2 text-sm text-soft-charcoal/70">
        React Email template · Resend · run <code className="text-xs">migrate-newsletter-composer.sql</code>{' '}
        in Supabase if columns are missing.
      </p>
      <div className="mt-8">
        <NewsletterComposer nextIssueNumber={nextIssueNumber} />
      </div>
    </div>
  )
}
