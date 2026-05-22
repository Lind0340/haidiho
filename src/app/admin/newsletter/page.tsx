import { createAdminClient } from '@/lib/supabase-server'

export default async function AdminNewsletterPage() {
  const admin = createAdminClient()
  let count = 0
  let issues: { issue_number: number; title: string; status: string }[] = []

  if (admin) {
    const [subRes, issuesRes] = await Promise.all([
      admin.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      admin
        .from('newsletter_issues')
        .select('issue_number, title, status')
        .order('issue_number', { ascending: false })
        .limit(10),
    ])
    count = subRes.count ?? 0
    issues = (issuesRes.data ?? []) as typeof issues
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        Newsletter
      </h1>
      <p className="mt-2 text-lg font-bold text-hai-blue">{count} active subscribers</p>
      <h2 className="mt-6 font-bold text-soft-charcoal">Issues</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {issues.map((i) => (
          <li key={i.issue_number}>
            #{i.issue_number} {i.title} ({i.status})
          </li>
        ))}
        {!issues.length && <li className="text-soft-charcoal/60">No issues drafted yet.</li>}
      </ul>
    </div>
  )
}
