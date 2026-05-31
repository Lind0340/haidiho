import type { ReactNode } from 'react'
import { NewsletterSignup } from '@/components/forms/NewsletterSignup'
import { SayHaidihoHero } from '@/components/say-haidiho/SayHaidihoHero'
import { cn } from '@/lib/utils'

const INSIDE_CARDS = [
  {
    icon: '📧',
    title: 'The Weekly Neighborhood Digest',
    tagline: 'STORIES. LAUGHS. TOOLS WE ACTUALLY USE.',
    body:
      'One longer, smarter take on workplace chaos. Real talk. Real tips. Real help from Hai & DiHo. No fluff. Just good stuff to make your work week a little less weird. ❤️',
    bg: 'bg-[#dceefb]',
    border: 'border-[#a8d4f0]',
  },
  {
    icon: '⭐',
    title: 'The Unlock (Deep Dive + Differences)',
    tagline: 'DEEPER LOOKS AT TOPICS. REAL DIFFERENCES. MORE MAGIC.',
    body:
      'The longer of our two posts on a topic deserves more attention. This is where we go deeper — into the nuance, the messy bits, and the things you didn\'t see the first time. ❤️',
    bg: 'bg-[#fce4ec]',
    border: 'border-[#f5b8cc]',
  },
  {
    icon: '☕',
    title: 'Blog of the Week',
    tagline: 'COOL FINDS. BIG IDEAS. SMALL SIGNALS.',
    body:
      'A human-written blog that made us pause, smile, or write down a line. Good ideas live everywhere. We bring them here. ❤️',
    bg: 'bg-[#fff9e6]',
    border: 'border-[#f5e6a8]',
  },
  {
    icon: '📌',
    title: 'From the Neighborhood',
    tagline: 'STORIES & QUESTIONS FROM OUR WONDERFUL HUMANS.',
    body:
      'Your good questions. Your wins. Your stories. We share a few each week (names stay anonymous). This community is what makes this place matter. ❤️',
    bg: 'bg-[#ffe8e0]',
    border: 'border-[#ffb8a8]',
  },
  {
    icon: '💡',
    title: 'Tip of the Week',
    tagline: 'TINY MOVES. BIG IMPACT.',
    body:
      'One practical nudge that actually helps. Not complicated. Not overwhelming. Just a small way to make Monday (Or Tuesday. Or Thursday.) better. ❤️',
    bg: 'bg-[#d8f0f8]',
    border: 'border-[#9fd4ea]',
  },
  {
    icon: '🪴',
    title: 'Desk or Life Makeover',
    tagline: 'SOMETHING WE\'RE TESTING. SHARING. LEARNING.',
    body:
      'A tool. A prompt. A ritual. A change. If it makes our day better, we\'ll pass it along. Sometimes it\'s chaos. Sometimes it\'s genius. Always it\'s real. ❤️',
    bg: 'bg-[#e2f5e2]',
    border: 'border-[#a8d8a8]',
  },
  {
    icon: '👓',
    title: 'The Bob Word',
    tagline: 'ONE QUESTION. ONE ANSWER. THAT\'S THE SYSTEM.',
    body:
      'Bob answers one question from the neighborhood with clarity, wisdom, and excellent timing. ❤️',
    bg: 'bg-[#ebe4f8]',
    border: 'border-[#c8b8e8]',
    wide: true,
  },
] as const

const TESTIMONIALS = [
  {
    name: 'Jamie',
    city: 'Seattle',
    quote:
      'It\'s like coffee with coworkers who get it and actually make my workday better.',
  },
  {
    name: 'Alex',
    city: 'Austin',
    quote: 'I look forward to this every week. Hai & DiHo feel like my office besties now.',
  },
  {
    name: 'Priya',
    city: 'Toronto',
    quote: 'Practical, human, funny. It\'s the one email I actually read all the way through.',
  },
] as const

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

function StickyNote({
  children,
  className,
  color = 'bg-[#fff59d]',
}: {
  children: ReactNode
  className?: string
  color?: string
}) {
  return (
    <div
      className={cn(
        'z-10 max-w-[120px] rotate-[-4deg] px-2.5 py-2 font-[family-name:var(--font-hand)] text-[13px] font-bold leading-tight text-soft-charcoal shadow-md',
        color,
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SayHaidihoLanding() {
  return (
    <div className="relative overflow-x-hidden pb-16">
      <SayHaidihoHero />

      {/* Signup — right below hero */}
      <section id="signup" className="relative mx-auto mt-6 max-w-[520px] scroll-mt-24 px-4 sm:mt-8">
        <p className="text-center font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal sm:text-4xl">
          ready? say it. <span aria-hidden>✉️</span>
        </p>

        <div className="relative mt-6">
          <NewsletterSignup source="say_haidiho" variant="landing" />
        </div>
      </section>

      {/* Parchment — what's in the box */}
      <section className="relative mx-auto mt-6 max-w-[900px] px-3 sm:mt-8 sm:px-5">
        <div className="say-haidiho-parchment relative rounded-[24px] border border-[#d4c4a8] px-5 py-8 shadow-[0_20px_50px_rgba(45,45,45,0.12)] sm:px-10 sm:py-10">
          <Tape className="left-8 -top-2.5" />
          <Tape className="right-10 -top-2 rotate-[4deg]" />

          <header className="text-center">
            <h2 className="font-[family-name:var(--font-hand)] text-4xl font-bold text-soft-charcoal sm:text-[2.75rem]">
              what&apos;s in the box?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base font-bold leading-relaxed text-soft-charcoal/85 sm:text-lg">
              The{' '}
              <span className="text-hai-blue">Weekly Neighborhood Digest</span> — one email, once a
              week, packed with strips, tips, neighborhood drama, and things Hai insists you need to
              know.
            </p>
          </header>

          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {INSIDE_CARDS.map((card) => (
              <li
                key={card.title}
                className={cn(
                  'rounded-[16px] border-2 px-4 py-4 shadow-[0_4px_12px_rgba(45,45,45,0.06)] sm:px-5 sm:py-5',
                  card.bg,
                  card.border,
                  'wide' in card && card.wide && 'md:col-span-2 md:mx-auto md:max-w-[calc(50%-0.5rem)]',
                )}
              >
                <p className="text-2xl" aria-hidden>
                  {card.icon}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-hand)] text-xl font-bold text-soft-charcoal sm:text-[1.35rem]">
                  {card.title}
                </h3>
                <div className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.05em] text-hai-blue sm:text-[11px]">
                  {card.tagline}
                </div>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-soft-charcoal/85">
                  {card.body}
                </p>
              </li>
            ))}
          </ul>

          {/* Frequency */}
          <div className="mt-8 border-t border-dashed border-[#d4c4a8] pt-6">
            <p className="text-center font-[family-name:var(--font-hand)] text-xl font-bold text-soft-charcoal">
              — how frequently should we email? —
            </p>
            <ul className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-2">
              <li className="flex items-center justify-center gap-2 text-sm font-bold text-soft-charcoal/85">
                <span className="text-lg" aria-hidden>
                  📬
                </span>
                Once a week — usually on Friday
              </li>
              <li className="flex items-center justify-center gap-2 text-sm font-bold text-soft-charcoal/85">
                <span className="text-lg" aria-hidden>
                  ☕
                </span>
                We read. We breathe. We double-check it&apos;s worth your time.
              </li>
              <li className="flex items-center justify-center gap-2 text-sm font-bold text-soft-charcoal/85">
                <span className="text-lg" aria-hidden>
                  🚫
                </span>
                No fluff. No spam. No &ldquo;10 AI hacks that will change your life.&rdquo;
              </li>
            </ul>
          </div>

          {/* Testimonials */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={t.name}
                className={cn(
                  'relative rounded-sm border border-[#d4c4a8] bg-[#fffef8] px-4 py-4 shadow-[2px_4px_10px_rgba(45,45,45,0.08)]',
                  i === 0 && 'rotate-[-1.5deg]',
                  i === 1 && 'rotate-[0.5deg]',
                  i === 2 && 'rotate-[1.5deg]',
                )}
              >
                <Tape className={cn('left-1/2 -top-2.5 -translate-x-1/2', i === 1 && 'rotate-1')} />
                <p className="text-sm font-semibold italic leading-relaxed text-soft-charcoal/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-2 text-xs font-extrabold text-hai-blue">
                  — {t.name} ({t.city})
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="relative mx-auto mt-10 max-w-[520px] px-4">
        <p className="text-center text-sm font-bold text-soft-charcoal/75">
          Proudly powered by good humans and coffee. Thanks for joining our corner.{' '}
          <span className="text-warm-pink">❤️</span>
        </p>

        <div className="relative mt-10 hidden min-h-[100px] sm:flex sm:justify-between">
          <StickyNote className="relative left-0 top-0 max-w-[130px] rotate-[-3deg]" color="bg-[#fff59d]">
            Pull up a chair.
            <br />
            You belong here. <span className="text-warm-pink">❤️</span>
          </StickyNote>
          <StickyNote className="relative right-0 top-0 max-w-[140px] rotate-[2deg]" color="bg-[#c8e6c9]">
            Good humans.
            <br />
            Better together. <span className="text-warm-pink">❤️</span>
          </StickyNote>
        </div>
      </section>
    </div>
  )
}
