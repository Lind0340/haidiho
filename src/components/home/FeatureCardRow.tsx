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

  return (
    <div className={cn('grid grid-cols-5', variant === 'compact' ? 'gap-2' : 'gap-4', className)}>
      {FEATURE_GRAPHIC_CARDS.map((card) => (
        <FeatureGraphicCard
          key={card.href}
          {...card}
          variant={variant}
          isActive={pathname === card.href}
        />
      ))}
    </div>
  )
}
