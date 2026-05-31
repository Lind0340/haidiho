import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl overflow-x-clip px-3 py-6 sm:px-6 sm:py-8">
      <nav className="mb-6 flex flex-wrap gap-2 gap-y-3 border-b border-[#ead8c2] pb-4 text-xs font-bold sm:mb-8 sm:gap-3 sm:text-sm">
        <Link href="/admin" className="text-hai-blue hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/moderation" className="text-soft-charcoal/70 hover:text-hai-blue">
          Moderation
        </Link>
        <Link href="/admin/neighborhood" className="text-soft-charcoal/70 hover:text-hai-blue">
          Neighborhood
        </Link>
        <Link href="/admin/strips" className="text-soft-charcoal/70 hover:text-hai-blue">
          Strips
        </Link>
        <Link href="/admin/featured" className="text-soft-charcoal/70 hover:text-hai-blue">
          Featured
        </Link>
        <Link href="/admin/newsletter" className="text-soft-charcoal/70 hover:text-hai-blue">
          Newsletter
        </Link>
        <Link href="/admin/merch" className="text-soft-charcoal/70 hover:text-hai-blue">
          Merch
        </Link>
      </nav>
      {children}
    </div>
  )
}
