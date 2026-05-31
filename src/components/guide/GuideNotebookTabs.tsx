'use client'

import { GUIDE_CHAPTERS } from '@/lib/guide/chapters'
import { GUIDE_TAB_META } from '@/lib/guide/guide-ui'
import { cn } from '@/lib/utils'

type Props = {
  activeChapter: number
  onSelect: (n: number) => void
  variant: 'edge' | 'strip'
}

export function GuideNotebookTabs({ activeChapter, onSelect, variant }: Props) {
  if (variant === 'strip') {
    return (
      <nav
        className="mb-4 flex flex-wrap gap-1.5 border-b border-dashed border-[#d4c4a8] pb-3 lg:flex xl:hidden"
        aria-label="Chapter tabs"
      >
        {GUIDE_CHAPTERS.map((ch, i) => {
          const tab = GUIDE_TAB_META[i]!
          const isActive = activeChapter === ch.number
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelect(ch.number)}
              title={ch.title}
              className={cn(
                'inline-flex min-h-[40px] touch-manipulation items-center gap-1 rounded-full border border-[#c9b896]/70 px-2.5 py-1 text-xs font-bold shadow-sm transition-colors',
                isActive && 'ring-2 ring-hai-blue/35',
              )}
              style={{ backgroundColor: tab.color }}
              aria-current={isActive ? 'step' : undefined}
            >
              <span aria-hidden>{tab.icon}</span>
              <span className="font-[family-name:var(--font-hand)]">{tab.short}</span>
            </button>
          )
        })}
      </nav>
    )
  }

  return (
    <nav
      className="guide-notebook-tabs absolute z-30 hidden flex-col gap-1 xl:flex"
      aria-label="Chapter tabs"
    >
      {GUIDE_CHAPTERS.map((ch, i) => {
        const tab = GUIDE_TAB_META[i]!
        const isActive = activeChapter === ch.number
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => onSelect(ch.number)}
            title={`Chapter ${ch.number}: ${ch.title}`}
            className={cn(
              'guide-notebook-tab relative flex min-h-[52px] w-[54px] flex-col items-center justify-center rounded-r-md border border-l-0 border-[#a89878]/80 py-1.5 pl-1 pr-0.5 text-center shadow-[2px_2px_4px_rgba(45,45,45,0.12)] transition-transform hover:translate-x-0.5 touch-manipulation',
              isActive && 'translate-x-0.5 ring-2 ring-hai-blue/35',
            )}
            style={{ backgroundColor: tab.color }}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="text-sm leading-none" aria-hidden>
              {tab.icon}
            </span>
            <span className="mt-0.5 max-w-full px-0.5 font-[family-name:var(--font-hand)] text-[8.5px] font-bold leading-[1.1] text-soft-charcoal">
              {tab.short}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
