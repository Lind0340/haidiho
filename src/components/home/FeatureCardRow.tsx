'use client'

import { FeatureGraphicCard } from '@/components/home/FeatureGraphicCard'
import { FEATURE_GRAPHIC_CARDS } from '@/lib/feature-cards'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

type FeatureCardRowProps = {
  className?: string
  variant?: 'default' | 'compact'
}

export function FeatureCardRow({ className, variant = 'default' }: FeatureCardRowProps) {
  const pathname = usePathname()
  const isCompact = variant === 'compact'

  return (
    <div
      className={cn(
        isCompact && 'snap-x snap-mandatory -mx-1 overflow-x-auto pb-1 [scrollbar-width:thin] md:mx-0 md:snap-none md:overflow-visible',
        className,
      )}
    >
      <div
        className={cn(
          isCompact
            ? 'flex w-max gap-2 px-1 md:grid md:w-full md:grid-cols-5 md:gap-2 md:px-0'
            : 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4',
        )}
      >
        {FEATURE_GRAPHIC_CARDS.map((card) => (
          <div
            key={card.href}
            className={cn(isCompact && 'w-[7.5rem] shrink-0 snap-start sm:w-[118px] md:w-auto md:shrink')}
          >
            <FeatureGraphicCard
              {...card}
              variant={variant}
              isActive={pathname === card.href}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
