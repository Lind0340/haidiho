import { FeatureCardRow } from '@/components/home/FeatureCardRow'
import { LegalFooterLinks } from '@/components/legal/LegalFooterLinks'

/** Bottom nav row — same graphic cards and layout as the landing page. */
export function SiteFooter() {
  return (
    <footer className="relative mt-auto w-full pt-6">
      <div className="mx-auto w-full max-w-[1024px] px-3 sm:px-6 lg:px-10">
        <section className="px-1 pb-10 pt-2 sm:px-[62px] sm:pb-16 sm:pt-3">
          <FeatureCardRow />
          <LegalFooterLinks />
        </section>
      </div>
    </footer>
  )
}
