'use client'

import Link from 'next/link'
import { RoomHostAvatar } from '@/components/neighborhood/RoomHostAvatar'
import { HaidihoErrors } from '@/lib/errors'
import { getRoom, type RoomId } from '@/lib/neighborhood-data'
import type { RoomStats } from '@/types/database'
import { cn } from '@/lib/utils'

type Props = {
  roomId: RoomId
  stats?: RoomStats
  href?: string
}

export function RoomCard({ roomId, stats, href }: Props) {
  const room = getRoom(roomId)
  const count = stats?.post_count ?? 0
  const preview = stats?.latest_preview

  const inner = (
    <>
      {href && room.hubSticker && (
        <div
          className={cn(
            'pointer-events-none absolute -right-1 -top-3 z-10 rounded-sm px-2.5 py-1.5 font-[family-name:var(--font-hand)] text-base font-bold leading-tight text-soft-charcoal shadow-md sm:-right-2 sm:-top-4',
            room.hubSticker.bg,
            room.hubSticker.rotate,
          )}
          aria-hidden
        >
          {room.hubSticker.text}
        </div>
      )}

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.5)] transition-transform group-hover:scale-105 sm:h-16 sm:w-16 sm:text-4xl',
                room.hubEmojiBg,
              )}
              aria-hidden
            >
              {room.emoji}
            </span>
            <div className="min-w-0 pt-0.5">
              <h2 className="font-[family-name:var(--font-hand)] text-2xl font-bold leading-tight text-soft-charcoal sm:text-[1.75rem]">
                {room.name}
              </h2>
              <p
                className={cn(
                  'mt-0.5 font-[family-name:var(--font-hand)] text-lg font-semibold leading-snug sm:text-xl',
                  room.themeLabelClass,
                )}
              >
                {room.tagline}
              </p>
            </div>
          </div>

          <p className="mt-2.5 text-sm font-bold text-soft-charcoal/70">{room.description}</p>

          <span
            className={cn(
              'mt-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-extrabold',
              room.tagClass,
            )}
          >
            {count} {count === 1 ? 'story' : 'stories'} inside
          </span>

          <div
            className={cn(
              'relative mt-4 rounded-2xl border border-[#ead8c2]/90 bg-diho-cream/90 px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]',
              'before:absolute before:-bottom-2 before:left-6 before:h-3 before:w-3 before:rotate-45 before:border-b before:border-l before:border-[#ead8c2]/90 before:bg-diho-cream/90',
            )}
          >
            {preview ? (
              <p className="text-sm font-medium leading-relaxed text-soft-charcoal/88">
                <span className="font-bold text-soft-charcoal">{preview.username}</span>{' '}
                <span className="line-clamp-2">{preview.content}</span>
              </p>
            ) : (
              <p className="text-sm font-semibold italic text-soft-charcoal/55">
                {HaidihoErrors.emptyRoom}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 sm:w-[11.5rem] sm:shrink-0">
          <RoomHostAvatar
            character={room.hostCharacter}
            message={room.hostMessage}
            hostBg={room.hostBg}
            size="hub"
            className="border-[#ead8c2]/60 shadow-[0_4px_12px_rgba(45,45,45,0.06)]"
          />

          {href && (
            <span
              className={cn(
                'inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-center font-[family-name:var(--font-hand)] text-lg font-bold transition-transform group-hover:-translate-y-0.5 sm:text-xl',
                room.hubEnterBtn,
              )}
            >
              Come on in 👋
            </span>
          )}
        </div>
      </div>
    </>
  )

  const className = cn(
    'group relative block overflow-visible rounded-[20px] border bg-[#fff6e8] p-5 text-left shadow-[0_12px_26px_rgba(45,45,45,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(45,45,45,0.1)] sm:p-6',
    room.accentClass,
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}
