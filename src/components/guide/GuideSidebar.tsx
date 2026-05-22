'use client'

import { GUIDE_CHAPTER_TITLE_SM } from '@/components/guide/guide-typography'
import { GUIDE_CHAPTERS } from '@/lib/guide/chapters'
import { cn } from '@/lib/utils'

type Props = {
  activeChapter: number
  readChapters: Set<number>
  onSelect: (n: number) => void
}

export function GuideSidebar({ activeChapter, readChapters, onSelect }: Props) {
  return (
    <aside className="sticky top-24 w-56 shrink-0 self-start">
      <nav
        className="space-y-0.5 rounded-xl border border-[#ead8c2] bg-[#fff6e8] p-3 shadow-[0_8px_20px_rgba(45,45,45,0.06)]"
        aria-label="Guide chapters"
      >
        <p className="px-2 pb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-hai-blue">
          Chapters
        </p>
        {GUIDE_CHAPTERS.map((ch) => {
          const isActive = activeChapter === ch.number
          const isRead = readChapters.has(ch.number)

          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelect(ch.number)}
              className={cn(
                'flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors',
                isActive
                  ? 'bg-hai-blue/12 text-hai-blue-dark'
                  : 'text-soft-charcoal/80 hover:bg-diho-cream',
              )}
            >
              <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                {isRead ? (
                  <span
                    className={cn(
                      'text-xs font-extrabold',
                      isActive ? 'text-hai-blue' : 'text-hai-blue/70',
                    )}
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      isActive ? 'bg-hai-blue ring-2 ring-hai-blue/25' : 'bg-soft-charcoal/20',
                    )}
                  />
                )}
              </span>
              <span className={cn(GUIDE_CHAPTER_TITLE_SM, 'line-clamp-2 min-w-0')}>
                <span className="font-[family-name:var(--font-fun)] text-[11px] font-bold text-hai-blue/90">
                  {ch.number}.{' '}
                </span>
                {ch.title}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
