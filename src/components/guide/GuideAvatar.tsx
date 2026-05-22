import Image from 'next/image'
import { cn } from '@/lib/utils'

const HAI_ICON = '/images/hai-there-chat-icon.png'
const HAI_W = 477
const HAI_H = 593

const DIHO_ICON = '/images/diho-there-chat-icon-v2.png'
const DIHO_W = 983
const DIHO_H = 866

type Size = 'sm' | 'md' | 'lg'

const SIZE_PX: Record<Size, number> = {
  sm: 36,
  md: 40,
  lg: 56,
}

type Props = {
  character: 'hai' | 'diho'
  size?: Size
  className?: string
  borderClassName?: string
}

/** Circular avatar with correct intrinsic aspect ratio (no squash). */
export function GuideAvatar({ character, size = 'sm', className, borderClassName }: Props) {
  const px = SIZE_PX[size]
  const isHai = character === 'hai'

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full bg-diho-cream shadow-sm',
        borderClassName ?? 'border-2 border-white/80',
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={isHai ? HAI_ICON : DIHO_ICON}
        alt=""
        fill
        sizes={`${px}px`}
        className={cn(
          'object-cover',
          isHai ? 'object-[50%_8%]' : 'object-[50%_12%]',
        )}
        draggable={false}
      />
    </div>
  )
}

export { HAI_ICON, HAI_W, HAI_H, DIHO_ICON, DIHO_W, DIHO_H }
