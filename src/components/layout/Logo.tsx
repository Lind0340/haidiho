import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type LogoProps = {
  size?: 'sm' | 'md' | 'brand'
  showWordmark?: boolean
  className?: string
}

const sizes = {
  sm: { img: 56, className: 'w-14' },
  md: { img: 82, className: 'w-[82px]' },
  brand: { img: 112, className: 'w-28' },
}

export function Logo({ size = 'md', showWordmark = true, className }: LogoProps) {
  const s = sizes[size]

  return (
    <Link
      href="/"
      className={cn(
        'inline-flex shrink-0 items-center',
        className,
      )}
    >
      <Image
        src="/images/site-logo-transparent.png"
        alt={showWordmark ? 'Haidiho.com' : ''}
        width={s.img}
        height={s.img}
        className={cn('h-auto shrink-0 object-contain', s.className)}
        priority
      />
    </Link>
  )
}
