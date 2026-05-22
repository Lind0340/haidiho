'use client'

import { FilledHeart } from '@/components/mug-wall/MugWallDecor'
import { RoomCard } from '@/components/neighborhood/RoomCard'
import { NEIGHBORHOOD_ROOMS } from '@/lib/neighborhood-data'
import { roomHref } from '@/lib/neighborhood-routes'
import type { RoomStats } from '@/types/database'
import { useMemo } from 'react'

type Props = {
  roomStats: RoomStats[]
}

export function NeighborhoodHub({ roomStats }: Props) {
  const statsMap = useMemo(() => {
    const m = new Map<string, RoomStats>()
    for (const s of roomStats) m.set(s.room, s)
    return m
  }, [roomStats])

  return (
    <div className="px-3 pb-20 pt-3 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <header className="relative mb-8 text-center sm:mb-10">
          <div
            className="pointer-events-none absolute -left-2 top-8 hidden rotate-[-8deg] rounded-sm bg-[#9bd7d2] px-2 py-1.5 font-[family-name:var(--font-hand)] text-sm font-bold text-soft-charcoal shadow-md sm:block"
            aria-hidden
          >
            pick one!
          </div>
          <div className="relative mx-auto max-w-lg rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] px-6 py-5 shadow-[0_12px_26px_rgba(45,45,45,0.08)]">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hai-blue">Haidiho</p>
            <h1 className="mt-2 flex items-center justify-center gap-2 font-[family-name:var(--font-hand)] text-4xl font-bold text-soft-charcoal sm:text-5xl">
              the neighborhood
              <FilledHeart className="text-2xl" />
            </h1>
            <p className="mt-3 text-base font-semibold leading-relaxed text-soft-charcoal/85">
              Three rooms. Three vibes. Tap a door — read free, sign up to share your story. ❤️
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          {NEIGHBORHOOD_ROOMS.map((room) => (
            <RoomCard
              key={room.id}
              roomId={room.id}
              href={roomHref(room.id)}
              stats={statsMap.get(room.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
