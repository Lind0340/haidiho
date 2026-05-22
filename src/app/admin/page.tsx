import Link from 'next/link'

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-hand)] text-4xl font-bold text-soft-charcoal">
        Admin
      </h1>
      <p className="mt-2 text-sm font-semibold text-soft-charcoal/75">
        Moderate community content, publish strips, and manage featured picks.
      </p>
      <ul className="mt-6 space-y-2 text-sm font-bold">
        <li>
          <Link href="/admin/moderation" className="text-hai-blue hover:underline">
            Moderation queue →
          </Link>
        </li>
        <li>
          <Link href="/admin/neighborhood" className="text-hai-blue hover:underline">
            Character responses →
          </Link>
        </li>
        <li>
          <Link href="/admin/strips" className="text-hai-blue hover:underline">
            Strips →
          </Link>
        </li>
        <li>
          <Link href="/admin/featured" className="text-hai-blue hover:underline">
            Featured content →
          </Link>
        </li>
      </ul>
    </div>
  )
}
