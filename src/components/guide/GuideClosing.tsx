import Link from 'next/link'
import { GuideAvatar } from '@/components/guide/GuideAvatar'
import { GUIDE_DIHO_VOICE } from '@/components/guide/guide-typography'
import { FilledHeart } from '@/components/mug-wall/MugWallDecor'
import { cn } from '@/lib/utils'

export function GuideClosing() {
  return (
    <section className="border-t-2 border-[#ead8c2] bg-[#fff6e8] px-5 py-12 sm:px-10 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <FilledHeart className="text-3xl" />
        <h2 className="mt-3 font-sans text-3xl font-extrabold text-guide-navy sm:text-4xl">
          You read the whole guide
        </h2>
        <p
          className={cn(
            GUIDE_DIHO_VOICE,
            'mx-auto mt-4 max-w-lg text-center font-medium text-soft-charcoal/85',
          )}
        >
          Welcome to the neighborhood. Hai&apos;s glowing on the right. DiHo&apos;s on the left with
          coffee. Come say hi when you get stuck.
        </p>

        <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
          <div className="guide-hai-note relative rounded-2xl border border-hai-blue-dark/20 bg-hai-blue p-4 text-diho-cream shadow-[4px_6px_0_rgba(30,64,175,0.2)] sm:rotate-[0.4deg]">
            <div className="flex gap-3">
              <GuideAvatar character="hai" size="md" borderClassName="border-2 border-white/60" />
              <p className="text-sm font-semibold leading-[1.65]">
                <span className="font-extrabold text-diho-cream">Hai: </span>
                <span className="italic">
                  &ldquo;I have 29 more chapters ready. DiHo said no. They are very good summaries
                  though.&rdquo;
                </span>{' '}
                ❤️
              </p>
            </div>
          </div>
          <div className="ml-1 rounded-lg border-l-4 border-accent-gold bg-accent-gold/[0.12] px-5 py-4 italic">
            <div className="flex gap-3">
              <GuideAvatar character="diho" size="md" borderClassName="border-2 border-white" />
              <p className="text-sm font-semibold leading-[1.65] text-soft-charcoal/90">
                <span className="font-extrabold not-italic text-[#9a6b12]">DiHo: </span>
                <span className="font-[family-name:var(--font-hand)] text-lg font-bold text-[#9a6b12]">
                  &ldquo;Hai. We talked about this.&rdquo;
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/neighborhood"
            className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-warm-pink px-6 py-3 font-[family-name:var(--font-hand)] text-xl font-bold text-diho-cream shadow-[0_6px_0_rgba(180,60,90,0.35)] transition-transform hover:-translate-y-0.5"
          >
            The Neighborhood
          </Link>
          <Link
            href="/strip"
            className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-hai-blue px-6 py-3 font-[family-name:var(--font-hand)] text-xl font-bold text-diho-cream shadow-[0_6px_0_rgba(30,64,175,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Read the Strip
          </Link>
        </div>
        <p className="mt-8 font-[family-name:var(--font-hand)] text-lg font-semibold text-hai-blue">
          — DiHo ❤️
        </p>
      </div>
    </section>
  )
}
