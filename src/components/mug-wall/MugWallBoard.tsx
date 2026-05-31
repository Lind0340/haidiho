import Image from 'next/image'
import { MugPolaroid } from '@/components/mug-wall/MugPolaroid'
import { MugWallCupboard } from '@/components/mug-wall/MugWallCupboard'
import { FilledHeart } from '@/components/mug-wall/MugWallDecor'
import type { MugWallEntry } from '@/lib/mug-wall-data'

type Props = {
  mugs: MugWallEntry[]
  featuredId: string | null
}

export function MugWallBoard({ mugs, featuredId }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] px-4 pb-4 pt-5 shadow-[0_12px_26px_rgba(45,45,45,0.08)] sm:px-5">
      <h2 className="relative text-center font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal">
        Real mugs. Real stories. Real humans.
        <FilledHeart className="ml-1 inline text-base" />
      </h2>

      <MugWallCupboard>
        <div className="grid min-h-[280px] grid-cols-2 gap-x-2 gap-y-2 sm:min-h-[320px] sm:grid-cols-4 sm:grid-rows-2 sm:gap-x-2 sm:gap-y-2">
          {mugs.map((entry, index) => (
            <div
              key={entry.id}
              className={index < 4 ? 'flex items-end justify-center pb-1 pt-2' : 'flex items-end justify-center pb-0 pt-4'}
            >
              <MugPolaroid entry={entry} isFeatured={entry.id === featuredId || entry.isFeatured} />
            </div>
          ))}
        </div>
      </MugWallCupboard>

      <div className="relative mt-8">
        <Image
          src="/images/mug-wall/mug-wall-banner.png"
          alt="Your mug. Your story. Your people. Every mug adds to something bigger. Learn from real humans, get ideas that actually work, and build your AI support crew."
          width={807}
          height={192}
          sizes="(max-width: 1024px) 100vw, 676px"
          className="h-auto w-full object-contain"
        />
      </div>

      <p className="relative mt-4 text-center font-[family-name:var(--font-hand)] text-base font-semibold text-soft-charcoal/80">
        New mugs added daily. Come back and see who&apos;s brewing.
        <span className="ml-1 text-hai-blue" aria-hidden>
          ♡
        </span>
      </p>
    </section>
  )
}
