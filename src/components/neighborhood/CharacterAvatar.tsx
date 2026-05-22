import Image from 'next/image'
import { cn } from '@/lib/utils'
import { NEIGHBORHOOD_CHARACTERS, type CharacterId } from '@/lib/characters'

const HOST_IMAGES: Record<'diho' | 'hai', string> = {
  diho: '/images/diho-there-chat-icon-v2.png',
  hai: '/images/hai-there-chat-icon.png',
}

type Props = {
  character: CharacterId
  size?: 'sm' | 'md'
  borderClassName?: string
  className?: string
}

const SIZE = { sm: 40, md: 48 } as const

export function CharacterAvatar({
  character,
  size = 'md',
  borderClassName,
  className,
}: Props) {
  const px = SIZE[size]
  const meta = NEIGHBORHOOD_CHARACTERS[character]
  const border = borderClassName ?? meta.avatarBorderClass

  if (character === 'bob') {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-[#faf6ef] font-extrabold tracking-tight text-soft-charcoal',
          border,
          className,
        )}
        style={{ width: px, height: px, fontSize: px < 44 ? 10 : 11 }}
        aria-hidden
      >
        BOB
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full bg-diho-cream shadow-sm',
        border,
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={HOST_IMAGES[character]}
        alt=""
        fill
        sizes={`${px}px`}
        className={cn(
          'object-cover',
          character === 'hai' ? 'object-[50%_8%]' : 'object-[50%_12%]',
        )}
        draggable={false}
      />
    </div>
  )
}
