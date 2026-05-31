'use client'

import { useCallback, useEffect, useState } from 'react'
import { GUIDE_CHAPTERS } from '@/lib/guide/chapters'
import { GuideChapterSection } from '@/components/guide/GuideChapterSection'
import { GuideClosing } from '@/components/guide/GuideClosing'
import { GuideDeskHero } from '@/components/guide/GuideDeskHero'
import { GuideMobileChapterNav } from '@/components/guide/GuideMobileChapterNav'
import { GuideNotebookTabs } from '@/components/guide/GuideNotebookTabs'
import { GuideSidebar } from '@/components/guide/GuideSidebar'
import { GuideSpiralBinding } from '@/components/guide/GuideSpiralBinding'
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
    <div className="overflow-x-hidden pb-14 pt-2 sm:pt-4">
      <GuideDeskHero />

      <div className="relative z-10 mx-auto -mt-4 max-w-[1100px] px-3 sm:-mt-8 sm:px-5 lg:-mt-10">
        <div className="sticky top-0 z-30 space-y-2.5 border-b border-[#d4c4a8] bg-page-tan/95 py-2.5 backdrop-blur-sm lg:hidden">
          <label className="sr-only" htmlFor="guide-chapter-select">
            Jump to chapter
          </label>
          <select
            id="guide-chapter-select"
            value={activeChapter}
            onChange={(e) => scrollToChapter(Number(e.target.value))}
            className="w-full min-h-[44px] rounded-xl border border-[#d4c4a8] bg-[#fffef8] px-3 py-2.5 text-sm font-bold text-soft-charcoal touch-manipulation"
          >
            {GUIDE_CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.number}>
                Ch. {ch.number}: {ch.title}
              </option>
            ))}
          </select>
          <GuideMobileChapterNav
            activeChapter={activeChapter}
            readChapters={readChapters}
            onSelect={scrollToChapter}
          />
        </div>

        <div className="guide-desk-surface relative mt-3">
          <div className="relative rotate-0 md:rotate-[0.25deg] lg:rotate-[0.35deg]">
            <div className="hidden sm:block">
              <GuideSpiralBinding />
            </div>

            <div className="guide-notebook-cover relative">
              <GuideNotebookTabs
                activeChapter={activeChapter}
                onSelect={scrollToChapter}
                variant="edge"
              />

              <div className="guide-notebook-spread guide-spiral-notebook pt-1 sm:pt-2">
                <div className="flex flex-col lg:flex-row">
                  <div className="guide-notebook-page guide-notebook-page-left hidden w-[280px] shrink-0 lg:block xl:w-[300px]">
                    <GuideSidebar
                      activeChapter={activeChapter}
                      readChapters={readChapters}
                      onSelect={scrollToChapter}
                    />
                  </div>

                  <div className="guide-page-crease hidden lg:block" aria-hidden />

                  <main className="guide-notebook-page guide-notebook-page-right relative min-w-0 flex-1 px-4 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-9">
                    <GuideNotebookTabs
                      activeChapter={activeChapter}
                      onSelect={scrollToChapter}
                      variant="strip"
                    />

                    <div className="relative z-10 mb-8 text-center sm:mb-10 lg:mb-12">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-hai-blue">
                        Real humans. AI coworkers.
                      </p>
                      <h1 className="mt-2 flex flex-wrap items-center justify-center gap-2 font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal sm:text-4xl lg:text-5xl">
                        Let&apos;s do this.
                        <FilledHeart />
                      </h1>
                      <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-relaxed text-soft-charcoal/80 sm:text-base">
                        DiHo&apos;s real talk. Hai helped. Mostly. 😄
                      </p>
                    </div>

                    <div className="guide-sticky-note absolute right-3 top-3 z-20 hidden max-w-[130px] rotate-[2deg] bg-[#ffcdd2] px-2.5 py-2 shadow-md lg:block">
                      <span
                        className="absolute -left-1 -top-3 h-8 w-3 rotate-12 rounded-sm bg-[#c0c0c0] shadow-sm"
                        aria-hidden
                      />
                      <p className="font-[family-name:var(--font-hand)] text-[13px] font-bold leading-tight text-soft-charcoal">
                        Bookmark this page. <span className="text-warm-pink">❤️</span>
                      </p>
                    </div>

                    <div className="relative z-10 space-y-10 sm:space-y-12 lg:space-y-14">
                      {GUIDE_CHAPTERS.map((chapter) => (
                        <GuideChapterSection key={chapter.id} chapter={chapter} />
                      ))}
                    </div>

                    <div className="guide-sticky-note relative z-10 mx-auto mt-8 max-w-[220px] rotate-[-1deg] bg-[#dceefb] px-3 py-2.5 shadow-md sm:mt-10 lg:ml-auto lg:mr-4">
                      <p className="font-[family-name:var(--font-hand)] text-[14px] font-bold leading-snug text-soft-charcoal">
                        Reminder from Hai: You&apos;re doing great. Keep going.{' '}
                        <span className="text-warm-pink">❤️</span>
                      </p>
                    </div>

                    <GuideClosing />
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
