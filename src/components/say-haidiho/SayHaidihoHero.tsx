import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Standalone office establishing shot — not cropped from the full-page mockup */
const HERO_ART = '/images/say-haidiho/hero-desk.png'
const HERO_ART_W = 1024
const HERO_ART_H = 1024

function Tape({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute h-5 w-14 -rotate-2 bg-[#f5e6c8]/90 shadow-sm',
        className,
      )}
      style={{
        backgroundImage:
          'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)',
      }}
    />
  )
}

function NotebookSignup() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[360px]">
      <div className="relative rounded-sm border border-[#d4c4a8] bg-[#fffef8] px-6 py-6 shadow-[4px_10px_22px_rgba(45,45,45,0.1)] sm:py-7">
        <Tape className="left-4 -top-3" />
        <Tape className="right-5 top-0 rotate-[3deg]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 23px, #c8dff5 23px, #c8dff5 24px)',
          }}
        />
        <div className="relative">
          <h1 className="font-[family-name:var(--font-hand)] text-[2.45rem] font-bold leading-none text-soft-charcoal lg:text-[2.75rem]">
            say haidiho <span className="text-warm-pink">❤️</span>
          </h1>
          <p className="mt-3 text-[15px] font-bold leading-relaxed text-soft-charcoal/90 lg:text-base">
            One email a week from the office where your AI coworker lives on — tips, magic,
            cork-board gems, and the occasional COMPLIANCE update. Good stuff only. Promise.{' '}
            <span className="text-warm-pink">❤️</span>
          </p>
          <Link
            href="#signup"
            className="mt-5 inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl bg-[#0867e8] px-5 py-3.5 text-base font-extrabold text-white shadow-[0_8px_0_rgba(30,64,175,0.35)] transition-transform hover:-translate-y-0.5 active:translate-y-0 lg:text-lg"
          >
            Say Haidiho <span className="text-warm-pink">❤️</span>
          </Link>
        </div>
      </div>
      <p className="mt-3 text-center text-2xl lg:text-left" aria-hidden>
        🪴
      </p>
    </div>
  )
}

/**
 * Newsletter hero — matches the mockup:
 * signup notebook on the LEFT, full office art on the RIGHT (never cropped with object-cover).
 */
export function SayHaidihoHero() {
  return (
    <section className="mx-auto max-w-[1080px] px-3 pt-4 sm:px-5">
      <div className="overflow-hidden rounded-[20px] border border-[#c9b896]/70 bg-[#fff8f0] shadow-[0_16px_40px_rgba(45,45,45,0.12)]">
        <div className="grid lg:grid-cols-[minmax(280px,400px)_minmax(0,1fr)] lg:items-stretch">
          {/* 1 — Signup card (left on desktop, top on mobile) */}
          <div className="relative flex items-center justify-center border-[#e8dcc8] px-5 py-8 sm:px-8 sm:py-10 lg:border-r lg:py-12">
            <div
              className="pointer-events-none absolute inset-y-6 left-0 hidden w-2 rounded-r-full bg-[repeating-linear-gradient(180deg,#c4b896_0px,#c4b896_3px,transparent_3px,transparent_9px)] opacity-50 lg:block"
              aria-hidden
            />
            <NotebookSignup />
          </div>

          {/* 2 — Office illustration (right on desktop, below card on mobile) */}
          <div className="flex min-h-[240px] items-center justify-center border-t border-[#e8dcc8] px-3 py-5 sm:px-5 sm:py-6 lg:min-h-[380px] lg:border-t-0 lg:px-6 lg:py-8">
            <div className="guide-desk-surface w-full max-w-none !rounded-[14px] !p-3 sm:!p-4 lg:!rounded-[18px] lg:!p-5">
              <Image
                src={HERO_ART}
                alt="Hai and DiHo at the office desk"
                width={HERO_ART_W}
                height={HERO_ART_H}
                priority
                unoptimized
                className="mx-auto block h-auto w-full max-h-[min(72vw,520px)] object-contain lg:max-h-[480px]"
                sizes="(max-width: 1024px) 92vw, 640px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
