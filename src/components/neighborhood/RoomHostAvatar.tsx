import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { RoomHostCharacter } from '@/lib/neighborhood-data'

const HOST_IMAGES: Record<'diho' | 'hai', { src: string; w: number; h: number }> = {
  diho: { src: '/images/diho-there-chat-icon-v2.png', w: 983, h: 866 },
  hai: { src: '/images/hai-there-chat-icon.png', w: 983, h: 866 },
}

type Props = {
  character: RoomHostCharacter
  message: string
  className?: string
  hostBg?: string
  size?: 'default' | 'hub'
}

const AVATAR = {
  default: { box: 'h-11 w-11', bobText: 'text-xs' },
  hub: { box: 'h-14 w-14 sm:h-16 sm:w-16', bobText: 'text-[11px] sm:text-xs' },
} as const

export function RoomHostAvatar({ character, message, className, hostBg, size = 'default' }: Props) {
  const s = AVATAR[size]

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-xl border border-[#ead8c2]/80 px-3 py-2.5',
        hostBg ?? 'bg-diho-cream/80',
        className,
      )}
    >
      {character === 'bob' ? (
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full border-2 border-accent-gold/60 bg-[#fff6e8] font-extrabold tracking-tight text-soft-charcoal shadow-sm',
            s.box,
            s.bobText,
          )}
          aria-hidden
        >
          BOB
        </div>
      ) : (
        <div
          className={cn(
            'relative shrink-0 overflow-hidden rounded-full border-2 border-white/90 bg-diho-cream shadow-[0_4px_10px_rgba(45,45,45,0.08)]',
            s.box,
          )}
        >
          <Image
            src={HOST_IMAGES[character].src}
            alt=""
            width={HOST_IMAGES[character].w}
            height={HOST_IMAGES[character].h}
            className="h-full w-full scale-110 object-cover object-top"
          />
        </div>
      )}
      <p
        className={cn(
          'font-semibold leading-snug text-soft-charcoal/90',
          size === 'hub' ? 'pt-1.5 text-sm' : 'pt-1 text-sm',
        )}
      >
        {message}
      </p>
    </div>
  )
}
