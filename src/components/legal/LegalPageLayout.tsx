import Image from 'next/image'
import type { ReactNode } from 'react'

type Character = 'diho' | 'hai'

type Props = {
  title: string
  character: Character
  characterNote: string
  lastUpdated: string
  children: ReactNode
}

const AVATARS = {
  diho: { src: '/images/diho-there-chat-icon-v2.png', alt: 'DiHo' },
  hai: { src: '/images/hai-there-chat-icon.png', alt: 'Hai' },
} as const

export function LegalPageLayout({ title, character, characterNote, lastUpdated, children }: Props) {
  const avatar = AVATARS[character]

  return (
    <article className="relative mx-auto w-full max-w-[800px] overflow-x-clip px-4 py-8 sm:px-6 sm:py-14">
      <div
        className="pointer-events-none absolute left-0 top-24 hidden opacity-20 sm:block"
        aria-hidden
      >
        <Image src={AVATARS.diho.src} alt="" width={72} height={72} />
      </div>
      <div
        className="pointer-events-none absolute right-0 top-32 hidden opacity-20 sm:block"
        aria-hidden
      >
        <Image src={AVATARS.hai.src} alt="" width={72} height={72} />
      </div>

      <header className="relative z-10">
        <div className="flex gap-4 rounded-[16px] border border-[#ead8c2] bg-[#fff6e8] p-4 sm:p-5">
          <Image src={avatar.src} alt={avatar.alt} width={56} height={56} className="shrink-0" />
          <p className="text-sm font-medium leading-relaxed text-soft-charcoal sm:text-base">
            {characterNote}
          </p>
        </div>
        <h1 className="mt-8 font-[family-name:var(--font-hand)] text-4xl font-bold text-[#16284C] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-2 text-sm font-semibold text-soft-charcoal/60">
          Last updated: {lastUpdated}
        </p>
      </header>

      <div className="legal-prose relative z-10 mt-10 space-y-8 text-[#2D2D2D]">{children}</div>
    </article>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-[family-name:var(--font-hand)] text-xl font-bold text-[#16284C] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-base font-medium leading-[1.8] text-[#2D2D2D]">
        {children}
      </div>
    </section>
  )
}

export function formatLegalDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
