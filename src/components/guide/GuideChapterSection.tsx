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
      className="scroll-mt-28 overflow-hidden rounded-2xl bg-diho-cream pb-2 pt-14 shadow-[0_8px_28px_rgba(45,45,45,0.07)] first:pt-10 sm:pt-16"
      data-chapter={chapter.number}
    >
      <header className="relative overflow-hidden rounded-t-xl bg-guide-navy text-diho-cream sm:rounded-t-[14px]">
        <div
          className="absolute -right-6 top-0 h-24 w-24 rounded-full bg-hai-blue/20 blur-2xl"
          aria-hidden
        />
        <div className="relative px-5 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-7">
          <p className={GUIDE_CHAPTER_LABEL}>{chapter.label}</p>
          <h2 className={cn(GUIDE_CHAPTER_TITLE, 'mt-2 max-w-2xl')}>{chapter.title}</h2>
          <p className="mt-3 max-w-xl font-[family-name:var(--font-hand)] text-lg font-semibold leading-relaxed text-accent-gold sm:text-xl">
            {chapter.subhead}
          </p>
        </div>
        <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6">
          <GuideAvatar
            character="diho"
            size="lg"
            borderClassName="border-2 border-diho-cream/90 shadow-md"
          />
        </div>
      </header>

      <div className="rounded-b-xl bg-diho-cream px-5 py-9 sm:px-8 sm:py-11">
        <GuideBlocks blocks={chapter.blocks} />
        <GuideComplianceFooter chapterNumber={chapter.number} text={chapter.compliance} />
      </div>
    </section>
  )
}
