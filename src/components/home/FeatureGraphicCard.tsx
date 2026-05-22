import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type FeatureGraphicCardProps = {
  href: string
  src: string
  alt: string
  variant?: 'default' | 'compact'
  isActive?: boolean
}

const CARD_WIDTH = 334
const CARD_HEIGHT = 216

const variantStyles = {
  default: {
    slot: 'h-[108px]',
    sizes: '167px',
  },
  compact: {
    slot: 'h-[80px]',
    sizes: '124px',
  },
} as const

/** One slot in the homepage feature row — 167×108 display (334×216 @2x art). */
export function FeatureGraphicCard({
  href,
  src,
  alt,
  variant = 'default',
  isActive = false,
}: FeatureGraphicCardProps) {
  const styles = variantStyles[variant]

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-w-0 w-full items-center justify-center rounded-xl transition-transform hover:-translate-y-0.5',
        styles.slot,
        isActive &&
          'ring-[2.5px] ring-[#4a90d9] ring-offset-2 ring-offset-diho-cream shadow-[0_0_0_1px_rgba(74,144,217,0.35)]',
      )}
    >
      <Image
        key={src}
        src={src}
        alt={alt}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        sizes={styles.sizes}
        className="max-h-full max-w-full object-contain object-center"
      />
    </Link>
  )
}
