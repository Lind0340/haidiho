'use client'

import { GUIDE_CHAPTERS } from '@/lib/guide/chapters'
import { cn } from '@/lib/utils'

type Props = {
  activeChapter: number
  readChapters: Set<number>
  onSelect: (n: number) => void
  className?: string
}

/** Horizontal chapter picker — mobile + tablet (sidebar hidden below lg). */
export function GuideMobileChapterNav({ activeChapter, readChapters, onSelect, className }: Props) {
  return (
    <nav
      className={cn('lg:hidden', className)}
      aria-label="Jump to chapter"
    >
      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-hai-blue">
        Chapters
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {GUIDE_CHAPTERS.map((ch) => {
          const isActive = activeChapter === ch.number
          const isRead = readChapters.has(ch.number)
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelect(ch.number)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-2 text-left transition-colors',
                'min-h-[44px] touch-manipulation',
                isActive
                  ? 'border-hai-blue bg-hai-blue text-diho-cream shadow-sm'
                  : 'border-[#d4c4a8] bg-[#fffef8] text-soft-charcoal hover:bg-hai-blue/10',
              )}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="block font-[family-name:var(--font-hand)] text-sm font-bold leading-none">
                {isRead && !isActive ? '✓ ' : ''}
                Ch. {ch.number}
              </span>
              <span
                className={cn(
                  'mt-0.5 block max-w-[9.5rem] truncate text-[11px] font-semibold',
                  isActive ? 'text-diho-cream/90' : 'text-soft-charcoal/70',
                )}
              >
                {ch.title}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
