import Link from 'next/link'

export function LegalFooterLinks() {
  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-[#ead8c2]/80 pt-6 text-xs font-semibold text-soft-charcoal/55"
      aria-label="Legal"
    >
      <Link href="/terms" className="hover:text-hai-blue hover:underline">
        Terms of Service
      </Link>
      <span aria-hidden>·</span>
      <Link href="/privacy" className="hover:text-hai-blue hover:underline">
        Privacy Policy
      </Link>
      <span aria-hidden>·</span>
      <Link href="/story-terms" className="hover:text-hai-blue hover:underline">
        Story Terms
      </Link>
      <span aria-hidden>·</span>
      <Link href="/mug-terms" className="hover:text-hai-blue hover:underline">
        Mug Submission Terms
      </Link>
    </nav>
  )
}
