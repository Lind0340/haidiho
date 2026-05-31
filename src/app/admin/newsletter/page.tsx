import { createAdminClient } from '@/lib/supabase-server'
import { listNewsletterIssues } from '@/lib/data/newsletter-issues'
import Link from 'next/link'

export default async function AdminNewsletterPage() {
  const admin = createAdminClient()
  let count = 0
  const issues = await listNewsletterIssues(12)

  if (admin) {
    const subRes = await admin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    count = subRes.count ?? 0
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        Newsletter
      </h1>
      <p className="mt-2 text-lg font-bold text-hai-blue">{count} active subscribers</p>
      <p className="mt-2 text-sm text-soft-charcoal/70">
        Weekly email via React Email + Resend. Set <code className="text-xs">RESEND_API_KEY</code> and{' '}
        <code className="text-xs">NEXT_PUBLIC_SITE_URL</code> in .env.local.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/newsletter/compose"
          className="rounded-xl bg-hai-blue px-4 py-2 font-bold text-diho-cream"
        >
          Compose new issue
        </Link>
      </div>

      <h2 className="mt-8 font-bold text-soft-charcoal">Issues</h2>
      <ul className="mt-2 space-y-2 text-sm">
        {issues.map((i) => (
          <li key={i.issue_number}>
            <Link
              href={`/admin/newsletter/${i.issue_number}`}
              className="font-semibold text-hai-blue hover:underline"
            >
              #{i.issue_number} {i.title}
            </Link>{' '}
            <span className="text-soft-charcoal/60">({i.status})</span>
          </li>
        ))}
        {!issues.length && <li className="text-soft-charcoal/60">No issues drafted yet.</li>}
      </ul>
    </div>
  )
}
