'use client'

import { useCallback, useEffect, useState } from 'react'
import { GUIDE_CHAPTERS } from '@/lib/guide/chapters'
import { GuideChapterSection } from '@/components/guide/GuideChapterSection'
import { GuideClosing } from '@/components/guide/GuideClosing'
import { GuideHero } from '@/components/guide/GuideHero'
import { GuideSidebar } from '@/components/guide/GuideSidebar'
import { FilledHeart } from '@/components/mug-wall/MugWallDecor'

const READ_KEY = 'haidiho-guide-read'

export function GuidePageContent() {
  const [activeChapter, setActiveChapter] = useState(1)
  const [readChapters, setReadChapters] = useState<Set<number>>(new Set())

  useEffect(() => {
    try {
      const raw = localStorage.getItem(READ_KEY)
      if (raw) setReadChapters(new Set(JSON.parse(raw) as number[]))
    } catch {
      /* ignore */
    }
  }, [])

  const markRead = useCallback((n: number) => {
    setReadChapters((prev) => {
      const next = new Set(prev)
      next.add(n)
      try {
        localStorage.setItem(READ_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  useEffect(() => {
    const sections = GUIDE_CHAPTERS.map((ch) => document.getElementById(ch.id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            const n = Number((entry.target as HTMLElement).dataset.chapter)
            if (n) {
              setActiveChapter(n)
              markRead(n)
            }
          }
        }
      },
      { rootMargin: '-15% 0px -50% 0px', threshold: [0, 0.15, 0.35] },
    )

    sections.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [markRead])

  function scrollToChapter(n: number) {
    const id = GUIDE_CHAPTERS.find((c) => c.number === n)?.id
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="px-3 pb-12 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-4 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-hai-blue lg:hidden">
          Haidiho · the guide
        </p>

        <div className="overflow-hidden rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] shadow-[0_12px_26px_rgba(45,45,45,0.08)]">
          <GuideHero activeChapter={activeChapter} onChapterSelect={scrollToChapter} />

          <div className="sticky top-0 z-20 border-b border-[#ead8c2] bg-[#fff6e8]/95 px-4 py-2.5 backdrop-blur-sm lg:hidden">
            <label className="sr-only" htmlFor="guide-chapter-select">
              Jump to chapter
            </label>
            <select
              id="guide-chapter-select"
              value={activeChapter}
              onChange={(e) => scrollToChapter(Number(e.target.value))}
              className="w-full rounded-xl border border-[#ead8c2] bg-diho-cream px-3 py-2.5 text-sm font-bold text-soft-charcoal"
            >
              {GUIDE_CHAPTERS.map((ch) => (
                <option key={ch.id} value={ch.number}>
                  Ch. {ch.number}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-0 lg:gap-8 lg:p-8 lg:pt-10">
            <div className="hidden lg:block lg:pl-1">
              <GuideSidebar
                activeChapter={activeChapter}
                readChapters={readChapters}
                onSelect={scrollToChapter}
              />
            </div>

            <main className="min-w-0 flex-1 px-4 pb-8 pt-8 sm:px-6 lg:px-0 lg:pb-10">
              <div className="mb-12 hidden text-center lg:block">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hai-blue">
                  Read online — all seven chapters
                </p>
                <p className="mt-2 flex items-center justify-center gap-2 font-[family-name:var(--font-hand)] text-3xl font-bold text-guide-navy">
                  the guide
                  <FilledHeart />
                </p>
                <p className="mx-auto mt-2 max-w-md text-center text-base font-medium leading-[1.8] text-soft-charcoal/75">
                  DiHo&apos;s real talk on training your AI coworker. Hai adds margin notes. COMPLIANCE
                  adds footnotes. You add coffee.
                </p>
              </div>

              <div className="space-y-14 sm:space-y-16">
                {GUIDE_CHAPTERS.map((chapter) => (
                  <GuideChapterSection key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </main>
          </div>

          <GuideClosing />
        </div>
      </div>
    </div>
  )
}
