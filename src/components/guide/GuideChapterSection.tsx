import { GuideAvatar } from '@/components/guide/GuideAvatar'
import { GuideBlocks } from '@/components/guide/GuideBlocks'
import { GuideComplianceFooter } from '@/components/guide/GuideComplianceFooter'
import { GUIDE_CHAPTER_LABEL, GUIDE_CHAPTER_TITLE } from '@/components/guide/guide-typography'
import type { GuideChapter } from '@/lib/guide/types'
import { cn } from '@/lib/utils'

type Props = {
  chapter: GuideChapter
}

export function GuideChapterSection({ chapter }: Props) {
  return (
    <section
      id={chapter.id}
      className="guide-chapter-sheet scroll-mt-28"
      data-chapter={chapter.number}
    >
      <header className="guide-chapter-header relative mt-1">
        <span
          className="absolute -left-1 top-2 h-5 w-9 -rotate-6 bg-[#f5e6c8]/95 shadow-sm"
          aria-hidden
        />
        <span
          className="absolute -right-1 top-3 h-5 w-9 rotate-4 bg-[#f5e6c8]/95 shadow-sm"
          aria-hidden
        />

        <div className="relative border border-[#c8dff5] border-l-[5px] border-l-hai-blue bg-[#f7fbff] px-4 py-4 sm:px-5 sm:py-5">
          <p className={cn(GUIDE_CHAPTER_LABEL, 'text-hai-blue')}>{chapter.label}</p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
              <div className="overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
                <GuideAvatar character="diho" size="sm" borderClassName="border-0" />
              </div>
              <div className="-ml-2 overflow-hidden rounded-full border-2 border-white bg-hai-blue/20 shadow-sm sm:ml-0 sm:mt-1">
                <GuideAvatar character="hai" size="sm" borderClassName="border-0" />
              </div>
            </div>
            <h2
              className={cn(
                GUIDE_CHAPTER_TITLE,
                'min-w-0 flex-1 text-[1.65rem] text-guide-navy drop-shadow-none sm:text-[2.15rem]',
              )}
            >
              {chapter.title}
            </h2>
          </div>

          <p className="guide-marker-highlight mt-3 font-[family-name:var(--font-hand)] text-lg font-semibold leading-snug text-soft-charcoal sm:text-xl">
            {chapter.subhead}
          </p>
        </div>
      </header>

      <div className="mt-7 pl-1 sm:pl-2">
        <GuideBlocks blocks={chapter.blocks} />
        <GuideComplianceFooter chapterNumber={chapter.number} text={chapter.compliance} />
      </div>
    </section>
  )
}
