'use client'

import Image from 'next/image'
import { PushPin } from '@/components/neighborhood/bulletin/PushPin'
import { CharacterAvatar } from '@/components/neighborhood/CharacterAvatar'
import { hostNoteRotation } from '@/lib/neighborhood-bulletin'
import { cn } from '@/lib/utils'

export function BulletinBoardBanner() {
  return (
    <div className="mx-auto mb-4 w-full max-w-lg px-2 sm:mb-5" aria-hidden>
      <div className="relative rounded-sm bg-[#f5efe0] px-6 py-4 shadow-[3px_5px_14px_rgba(0,0,0,0.22)]">
        <span className="absolute left-3 top-0 z-20 block h-3 w-3 -translate-y-1/2 rounded-full bg-[#2d2d2d] shadow-sm" />
        <span className="absolute right-3 top-0 z-20 block h-3 w-3 -translate-y-1/2 rounded-full bg-[#2d2d2d] shadow-sm" />
        <h2 className="text-center font-[family-name:var(--font-caveat)] text-2xl font-bold text-guide-navy sm:text-3xl">
          The Haidiho Neighborhood
        </h2>
        <p className="mt-1 text-center font-sans text-xs font-semibold text-soft-charcoal/80 sm:text-sm">
          Real Humans. Helpful AI. Better Together. ❤️
        </p>
      </div>
    </div>
  )
}

export function BulletinBoardFooterStrips() {
  return (
    <div
      className="mt-6 flex flex-wrap items-center justify-center gap-3 px-3 sm:justify-between sm:px-4"
      aria-hidden
    >
      <div className="rounded-sm bg-[#3d2814] px-4 py-1.5 shadow-md">
        <p className="font-[family-name:var(--font-caveat)] text-lg font-bold text-diho-cream">
          You belong here. ❤️
        </p>
      </div>
      <div className="rounded-sm bg-[#3d2814] px-3 py-1 shadow-md">
        <p className="font-[family-name:var(--font-caveat)] text-base font-bold text-diho-cream">
          Haidiho is a vibe. ❤️
        </p>
      </div>
    </div>
  )
}

export function BulletinPinStoryCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mb-4 block w-full max-w-[184px] transition-transform hover:scale-[1.04] sm:ml-auto"
      style={{ transform: 'rotate(4.25deg)' }}
    >
      <div className="bulletin-pin-story bulletin-host-sticky bulletin-sticky-texture relative px-4 pb-5 pt-7 text-left">
        <PushPin color="#c62828" />
        <span
          className="pointer-events-none absolute bottom-0 right-0 block h-0 w-0 border-l-[22px] border-t-[22px] border-l-transparent border-t-[rgba(60,40,8,0.12)]"
          aria-hidden
        />
        <p className="font-[family-name:var(--font-caveat)] text-[26px] font-bold leading-[1.1] text-[#3d2814]">
          Pin Your Story ❤️
        </p>
        <p className="mt-1.5 font-[family-name:var(--font-caveat)] text-lg font-semibold leading-snug text-[#5c4010]/90">
          Drop yours on the board
        </p>
      </div>
    </button>
  )
}

/** Left column — desktop only, in document flow */
export function BulletinDecorLeftRail() {
  return (
    <aside className="hidden flex-col gap-4 xl:flex" aria-hidden>
      <HaiNote />
      <GoodBoyPolaroid />
      <ChalkboardSign />
    </aside>
  )
}

/** Right column — desktop only, in document flow */
export function BulletinDecorRightRail() {
  return (
    <aside className="hidden flex-col gap-4 xl:flex" aria-hidden>
      <BetterTogetherPolaroid />
      <TodaysReminder />
      <PromptNote />
      <CoffeeMug />
    </aside>
  )
}

/** Compact decor below posts on smaller screens — never overlaps grid */
export function BulletinDecorMobileStrip() {
  return (
    <div
      className="mt-6 grid grid-cols-2 gap-3 px-1 sm:grid-cols-3 xl:hidden"
      aria-hidden
    >
      <div className="col-span-2 sm:col-span-1">
        <HaiNote compact />
      </div>
      <GoodBoyPolaroid compact />
      <BetterTogetherPolaroid compact />
      <TodaysReminder compact />
      <div className="col-span-2 sm:col-span-1">
        <PromptNote compact />
      </div>
    </div>
  )
}

function HaiNote({ compact }: { compact?: boolean }) {
  return (
    <div className={cn('w-full', compact ? 'max-w-none' : 'max-w-[180px]')} aria-hidden>
      <div
        className={cn(
          'relative bg-white px-3 pb-3 pt-5 shadow-[3px_4px_10px_rgba(0,0,0,0.2)]',
          !compact && 'rotate-[-2deg]',
        )}
      >
        {!compact && (
          <div
            className="absolute -left-1 top-2 h-3 w-4 rounded-l-full bg-[#e8e8e8]"
            style={{ boxShadow: 'inset -2px 0 0 #ccc' }}
          />
        )}
        <PushPin color="#1565c0" />
        <div className="flex items-start gap-2">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full hai-glow">
            <Image
              src="/images/hai-there-chat-icon.png"
              alt=""
              fill
              sizes="36px"
              className="object-cover object-[50%_8%]"
            />
          </div>
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-caveat)] text-base font-bold text-guide-navy">
              Note from Hai ❤️
            </p>
            <p className="mt-1 font-[family-name:var(--font-caveat)] text-sm leading-snug text-[#2d2d2d]">
              You humans inspire me every day. Thank you for letting me be part of your beautiful chaos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PolaroidFrame({
  children,
  caption,
  compact,
  rotate,
}: {
  children: React.ReactNode
  caption: string
  compact?: boolean
  rotate?: string
}) {
  return (
    <div className={cn('w-full', compact ? 'max-w-none' : 'max-w-[130px]', rotate)} aria-hidden>
      <div className="bg-white p-2 pb-8 shadow-[4px_5px_12px_rgba(0,0,0,0.25)]">
        <PushPin color="#c62828" />
        <div
          className={cn(
            'relative mx-auto overflow-hidden bg-[#e8dcc8]',
            compact ? 'aspect-[4/5] w-full max-w-[120px]' : 'aspect-[4/5] w-[100px]',
          )}
        >
          {children}
        </div>
        <p className="mt-2 text-center font-[family-name:var(--font-caveat)] text-sm font-bold text-[#2d2d2d]">
          {caption}
        </p>
      </div>
    </div>
  )
}

function GoodBoyPolaroid({ compact }: { compact?: boolean }) {
  return (
    <PolaroidFrame caption="Good Boy 🐾" compact={compact} rotate={compact ? undefined : 'rotate-[3deg]'}>
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#f5e6c8] to-[#d4a574] text-4xl sm:text-5xl">
        🐕
      </div>
    </PolaroidFrame>
  )
}

function BetterTogetherPolaroid({ compact }: { compact?: boolean }) {
  return (
    <PolaroidFrame
      caption="Better Together ❤️"
      compact={compact}
      rotate={compact ? undefined : 'rotate-[-2deg]'}
    >
      <div className="flex h-full items-center justify-center gap-1 bg-[#fff6e8] p-2">
        <div className="relative h-10 w-10 overflow-hidden rounded-full sm:h-12 sm:w-12">
          <Image src="/images/hai-there-chat-icon.png" alt="" fill sizes="48px" className="object-cover hai-glow" />
        </div>
        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-warm-pink/40 sm:h-12 sm:w-12">
          <Image src="/images/diho-there-chat-icon-v2.png" alt="" fill sizes="48px" className="object-cover" />
        </div>
      </div>
    </PolaroidFrame>
  )
}

function ChalkboardSign() {
  return (
    <div className="w-full max-w-[150px] rotate-[-1deg]" aria-hidden>
      <div className="rounded-sm border-4 border-[#5c4033] bg-[#1a1a1a] px-3 py-3 shadow-[3px_4px_10px_rgba(0,0,0,0.3)]">
        <p className="font-[family-name:var(--font-caveat)] text-sm font-bold leading-tight text-[#f5a623]">
          KIND PEOPLE
          <br />
          GOOD COFFEE
          <br />
          GREAT IDEAS
          <br />
          BETTER TOGETHER
        </p>
        <p className="mt-1 text-center text-xs">❤️</p>
      </div>
    </div>
  )
}

function TodaysReminder({ compact }: { compact?: boolean }) {
  return (
    <div className={cn('w-full', compact ? 'max-w-none' : 'max-w-[140px]', !compact && 'rotate-[2deg]')} aria-hidden>
      <div className="relative bg-[#fff9c4] px-3 py-3 pt-5 shadow-[2px_3px_8px_rgba(0,0,0,0.18)]">
        <PushPin color="#fdd835" />
        <p className="font-[family-name:var(--font-caveat)] text-sm font-bold text-[#2d2d2d]">Today&apos;s Reminder:</p>
        <ul className="mt-1 font-[family-name:var(--font-caveat)] text-sm leading-snug text-[#2d2d2d]">
          <li>• Breathe</li>
          <li>• Drink water</li>
          <li>• One step is a step ❤️</li>
        </ul>
      </div>
    </div>
  )
}

function CoffeeMug() {
  return (
    <div className="w-full max-w-[120px] rotate-[4deg]" aria-hidden>
      <div className="relative mx-auto h-14 w-16">
        <div className="h-12 w-14 rounded-b-lg rounded-t-sm bg-white shadow-[2px_4px_8px_rgba(0,0,0,0.2)]" />
        <div className="absolute -right-2 top-3 h-8 w-3 rounded-r-full border-4 border-white border-l-transparent" />
        <p className="absolute -bottom-6 left-1/2 w-28 -translate-x-1/2 text-center font-[family-name:var(--font-caveat)] text-[10px] font-bold leading-tight text-diho-cream">
          Coffee: Survival Fuel ❤️
        </p>
      </div>
    </div>
  )
}

function PromptNote({ compact }: { compact?: boolean }) {
  return (
    <div className={cn('w-full', compact ? 'max-w-none' : 'max-w-[150px]', !compact && 'rotate-[-1deg]')} aria-hidden>
      <div className="relative bg-[#ffe0b2] px-3 py-3 pt-5 shadow-[2px_3px_8px_rgba(0,0,0,0.16)]">
        <PushPin color="#e53935" />
        <p className="font-[family-name:var(--font-caveat)] text-base font-bold leading-snug text-[#2d2d2d]">
          Drop a story. Lift someone up. Let&apos;s make work more human. ❤️
        </p>
      </div>
    </div>
  )
}

type HostNoteProps = {
  room: 'water_cooler' | 'training_room' | 'help_desk'
  highlighted?: boolean
}

export function BulletinHostNotes({ activeRoom }: { activeRoom: 'all' | HostNoteProps['room'] }) {
  return (
    <div
      className="mb-5 flex flex-col items-center gap-4 px-2 sm:flex-row sm:items-start sm:justify-center sm:gap-6 md:gap-8"
      aria-label="Room hosts"
    >
      <HostNoteCard
        room="water_cooler"
        highlighted={activeRoom === 'water_cooler'}
        bg="#ffcdd2"
        pin="#e53935"
        character="diho"
        message={
          <>
            Hey. 👋 Wanna talk about it? Funny stories. AI fails. Real talk. This is your place. ❤️{' '}
            <span className="font-bold">— DiHo</span>
          </>
        }
      />
      <HostNoteCard
        room="training_room"
        highlighted={activeRoom === 'training_room'}
        bg="#bbdefb"
        pin="#1565c0"
        character="hai"
        message={
          <>
            I have tips! Many tips! Share what&apos;s working. We all get better together. ❤️{' '}
            <span className="font-bold">— Hai</span>
          </>
        }
      />
      <HostNoteCard
        room="help_desk"
        highlighted={activeRoom === 'help_desk'}
        bg="#fff9c4"
        pin="#6d4c41"
        character="bob"
        message={
          <>
            Stuck? Ask. We help. Then we stop. Done. ✅ <span className="font-bold">— BOB</span>
          </>
        }
      />
    </div>
  )
}

function HostNoteCard({
  room,
  highlighted,
  bg,
  pin,
  character,
  message,
}: HostNoteProps & {
  highlighted?: boolean
  bg: string
  pin: string
  character: 'diho' | 'hai' | 'bob'
  message: React.ReactNode
}) {
  const rot = hostNoteRotation(room)
  return (
    <div
      className={cn(
        'w-full max-w-[220px] shrink-0 transition-shadow duration-300 sm:max-w-[200px]',
        highlighted && 'drop-shadow-[0_0_12px_rgba(74,144,217,0.45)]',
      )}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <div
        className="bulletin-host-sticky bulletin-sticky-texture relative px-3.5 pb-3.5 pt-6"
        style={{ backgroundColor: bg }}
      >
        <PushPin color={pin} />
        <div className="flex items-start gap-2.5">
          <CharacterAvatar character={character} size="sm" />
          <p className="min-w-0 font-[family-name:var(--font-caveat)] text-[17px] leading-snug text-[#2d2d2d]">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
