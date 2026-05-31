'use client'

import { GUIDE_CHAPTER_TITLE_SM } from '@/components/guide/guide-typography'
import { GUIDE_CHAPTERS } from '@/lib/guide/chapters'
import { GUIDE_PROGRESS_ITEMS } from '@/lib/guide/guide-ui'
import { cn } from '@/lib/utils'

type Props = {
  activeChapter: number
  readChapters: Set<number>
  onSelect: (n: number) => void
}

export function GuideSidebar({ activeChapter, readChapters, onSelect }: Props) {
  const progressPct = Math.round((readChapters.size / GUIDE_CHAPTERS.length) * 100)

  return (
    <aside className="relative min-h-full px-4 py-7 sm:px-5 sm:py-8">
      <div className="relative z-10">
        <p className="font-[family-name:var(--font-fun)] text-[10px] font-bold uppercase tracking-[0.2em] text-hai-blue">
          Table of contents
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-hand)] text-[2.1rem] font-bold leading-none text-soft-charcoal">
          THE GUIDE
        </h2>
        <p className="mt-2 border-b border-dashed border-[#d4c4a8] pb-3 text-sm font-bold leading-snug text-soft-charcoal/80">
          How to work with AI without losing your mind.{' '}
          <span className="text-warm-pink">❤️</span>
        </p>

        <nav className="mt-5 space-y-0.5" aria-label="Guide chapters">
          {GUIDE_CHAPTERS.map((ch) => {
            const isActive = activeChapter === ch.number
            const isRead = readChapters.has(ch.number)

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => onSelect(ch.number)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-r-lg py-2 pl-2 pr-2 text-left transition-colors',
                  isActive ? 'guide-index-item-active' : 'hover:bg-[#fff6e8]/90',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-[family-name:var(--font-hand)] text-sm font-bold',
                    isActive
                      ? 'border-hai-blue bg-hai-blue text-diho-cream'
                      : isRead
                        ? 'border-hai-blue/50 bg-hai-blue/10 text-hai-blue'
                        : 'border-[#d4c4a8] bg-white text-soft-charcoal/55',
                  )}
                  aria-hidden
                >
                  {isRead && !isActive ? '✓' : ch.number}
                </span>
                <span className={cn(GUIDE_CHAPTER_TITLE_SM, 'min-w-0 leading-snug')}>
                  {ch.title}
                  {isActive && (
                    <span className="ml-1 inline-block text-accent-gold" aria-hidden>
                      ⭐
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="mt-6 rounded-xl border-2 border-dashed border-[#d4c4a8] bg-[#fffef8]/95 px-3 py-3 shadow-sm">
          <p className="font-[family-name:var(--font-hand)] text-base font-bold text-hai-blue">
            DiHo&apos;s Guide Progress
          </p>
          <ul className="mt-2 space-y-1.5">
            {GUIDE_PROGRESS_ITEMS.map((item, i) => {
              const done = i === 0 ? readChapters.size > 0 : readChapters.size > i
              return (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs font-semibold text-soft-charcoal/80"
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-sm border text-[10px]',
                      done
                        ? 'border-hai-blue bg-hai-blue/15 text-hai-blue'
                        : 'border-[#d4c4a8] bg-white',
                    )}
                    aria-hidden
                  >
                    {done ? '✓' : ''}
                  </span>
                  {item}
                </li>
              )
            })}
          </ul>
          <div className="mt-3">
            <div className="h-2.5 overflow-hidden rounded-full border border-[#ead8c2] bg-[#ead8c2]">
              <div
                className="h-full rounded-full bg-hai-blue transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1 text-right font-[family-name:var(--font-hand)] text-sm font-bold text-hai-blue">
              {progressPct}%
            </p>
          </div>
        </div>

        <div className="guide-sticky-note mt-6 max-w-[210px] rotate-[-2deg] bg-[#fff59d] px-3 py-2.5 shadow-md">
          <p className="font-[family-name:var(--font-hand)] text-[15px] font-bold leading-snug text-soft-charcoal">
            This is a living guide. It grows. It changes. Just like AI (and humans).{' '}
            <span className="text-warm-pink">❤️</span>
          </p>
        </div>
      </div>
    </aside>
  )
}
