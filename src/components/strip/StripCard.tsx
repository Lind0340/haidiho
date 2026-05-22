'use client'

import Image from 'next/image'
import { StripCaption } from '@/components/strip/StripCaption'
import { FilledHeart } from '@/components/mug-wall/MugWallDecor'
import type { StripEntry } from '@/lib/strip-data'
import { cn } from '@/lib/utils'

type StripCardProps = {
  strip: StripEntry
  onOpen: (strip: StripEntry) => void
  className?: string
}

export function StripCard({ strip, onOpen, className }: StripCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(strip)}
      className={cn(
        'group w-full cursor-pointer overflow-hidden rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] text-left shadow-[0_10px_24px_rgba(45,45,45,0.08)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(45,45,45,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hai-blue',
        className,
      )}
    >
      <div className="overflow-hidden rounded-t-[18px] bg-[#f5ebe0]">
        <Image
          src={strip.imageSrc}
          alt={`Strip ${String(strip.number).padStart(3, '0')} — ${strip.title}`}
          width={strip.imageWidth}
          height={strip.imageHeight}
          className="h-auto w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
        />
      </div>

      <div className="space-y-2 px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-xs font-extrabold uppercase tracking-wide text-hai-blue">
          Strip {String(strip.number).padStart(3, '0')}
        </p>
        <h2 className="flex items-center gap-1.5 font-[family-name:var(--font-hand)] text-2xl font-bold leading-tight text-soft-charcoal">
          {strip.title}
          <FilledHeart className="text-base" />
        </h2>
        <StripCaption text={strip.caption} emphasizeLastLine={strip.emphasizeLastLine} />
        <p className="text-xs font-bold text-hai-blue/80 group-hover:text-hai-blue">Read full strip →</p>
      </div>
    </button>
  )
}
