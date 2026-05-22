import { FeatureCardRow } from '@/components/home/FeatureCardRow'
import { Logo } from '@/components/layout/Logo'
import { cn } from '@/lib/utils'

type SiteHeaderProps = {
  /** When true, header sits inside the homepage cream card (no extra max-width shell). */
  embedded?: boolean
  className?: string
}

export function SiteHeader({ embedded = false, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        'relative z-20 px-4 pb-3 pt-4 sm:px-7 sm:pt-7',
        !embedded && 'border-b border-soft-charcoal/10',
        className,
      )}
    >
      <div className={cn('relative', !embedded && 'mx-auto w-full max-w-[1024px]')}>
        <Logo
          size="brand"
          className="absolute left-2 top-1 z-30 drop-shadow-[0_6px_10px_rgba(45,45,45,0.14)] sm:left-[40px] sm:top-2"
        />
        <div className="ml-[120px] min-w-0 pr-1 pt-1 sm:ml-[168px]">
          <FeatureCardRow variant="compact" />
        </div>
      </div>
    </header>
  )
}
