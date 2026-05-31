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
        'relative z-20 px-3 pb-3 pt-3 sm:px-7 sm:pt-7',
        !embedded && 'border-b border-soft-charcoal/10',
        className,
      )}
    >
      <div className={cn('relative', !embedded && 'site-container !px-0')}>
        <Logo
          size="brand"
          className="absolute left-1 top-0.5 z-30 w-[4.5rem] drop-shadow-[0_6px_10px_rgba(45,45,45,0.14)] sm:left-[40px] sm:top-2 sm:w-28 xl:w-[7.5rem]"
        />
        <div className="ml-[4.75rem] min-w-0 pr-0.5 pt-0.5 sm:ml-[168px] sm:pr-1 sm:pt-1 xl:ml-[188px]">
          <FeatureCardRow variant="compact" />
        </div>
      </div>
    </header>
  )
}
