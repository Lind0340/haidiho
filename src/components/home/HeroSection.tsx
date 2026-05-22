import Image from 'next/image'
import Link from 'next/link'
import type { StripEntry } from '@/lib/strip-data'

const FALLBACK_HERO = '/images/strip-001-hero.png'
const STRIP_HERO_WIDTH = 1024
const STRIP_HERO_HEIGHT = 682

type Props = {
  latestStrip?: StripEntry | null
}

export function HeroSection({ latestStrip }: Props) {
  const heroSrc = latestStrip?.imageSrc ?? FALLBACK_HERO
  const heroAlt = latestStrip
    ? `Strip ${String(latestStrip.number).padStart(3, '0')} — ${latestStrip.title}`
    : 'Strip 001 — Hai and DiHo at their desks on their first day together'
  return (
    <section className="relative px-7 pb-10 pt-1">
      <div className="relative grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] lg:gap-7">
        <div className="relative z-10 mt-5 min-h-[390px] overflow-visible rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] px-8 pb-5 pt-1 shadow-[0_12px_26px_rgba(45,45,45,0.08)]">
          <div className="absolute -left-5 top-6 rotate-[-6deg] rounded-sm bg-[#9bd7d2] px-2.5 py-2 font-[family-name:var(--font-hand)] text-[15px] font-semibold leading-[1.15] text-soft-charcoal shadow-md">
            maybe
            <br />
            coffee
            <br />
            first
          </div>

          <div className="-mt-1 mx-auto flex justify-center">
            <Image
              src="/images/hero-tagline-transparent.png"
              alt="Real humans. AI coworkers. Figuring it out one coffee at a time."
              width={1024}
              height={397}
              priority
              className="h-auto w-[min(100%,290px)]"
            />
          </div>

          <div className="mx-auto flex justify-center">
            <Image
              src="/images/haidiho-wordmark-transparent.png"
              alt="HaiDiHo (hi-dee-ho)"
              width={929}
              height={320}
              priority
              className="h-auto w-[min(100%,300px)]"
            />
          </div>

          <p className="mt-2 text-center text-[26px] font-extrabold leading-[1.12] tracking-[-0.03em] text-soft-charcoal">
            your guide to the care,
            <br />
            feeding and training of
            <br />
            your <span className="text-hai-blue">AI</span> coworker
          </p>

          <div className="mt-4 flex justify-center">
            <Link
              href="/neighborhood"
              className="inline-flex min-w-[210px] items-center justify-center rounded-xl bg-[#0867e8] px-7 py-3.5 text-xl font-extrabold text-diho-cream shadow-[0_8px_0_rgba(30,64,175,0.35)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Come On In 👋
            </Link>
          </div>

          <p className="mt-2 text-center text-sm font-bold text-soft-charcoal/70">
            cartoons, actual tips, and a lot of coffee
          </p>
        </div>

        <div className="relative z-0 mt-5 w-full min-w-0">
          <div className="relative aspect-[1024/682] w-full overflow-hidden rounded-[24px] border-[5px] border-[#fff8f0] bg-[#d8c1a6] shadow-[0_16px_32px_rgba(45,45,45,0.18)]">
            <Image
              src={heroSrc}
              alt={heroAlt}
              width={STRIP_HERO_WIDTH}
              height={STRIP_HERO_HEIGHT}
              priority
              className="h-full w-full object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 620px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
