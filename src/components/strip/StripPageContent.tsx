import { StripCta } from '@/components/strip/StripCta'
import { StripGrid } from '@/components/strip/StripGrid'
import { FilledHeart } from '@/components/mug-wall/MugWallDecor'
import type { StripEntry } from '@/lib/strip-data'

type Props = {
  strips: StripEntry[]
}

export function StripPageContent({ strips }: Props) {
  return (
    <div className="overflow-x-clip px-3 pb-12 pt-3 sm:px-6 sm:pt-4 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hai-blue">Haidiho</p>
          <h1 className="mt-2 flex flex-wrap items-center justify-center gap-2 font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal sm:text-4xl md:text-5xl">
            the strip
            <FilledHeart className="text-2xl" />
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-relaxed text-soft-charcoal/85">
            Weekly cartoons from real humans training their AI coworkers. Start with Strip 001 and
            read through 007 — click any card for the full strip.
          </p>
        </header>

        <StripGrid strips={strips} />
        <StripCta />
      </div>
    </div>
  )
}
