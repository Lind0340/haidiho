import Image from 'next/image'

export function GuideDeskHero() {
  return (
    <section className="relative mx-auto max-w-[1100px] px-3 pt-2 sm:px-5 sm:pt-4">
      <div className="relative h-[220px] overflow-hidden rounded-2xl border border-[#c9b896]/60 shadow-[0_10px_28px_rgba(45,45,45,0.12)] sm:h-[320px] sm:rounded-[20px] sm:shadow-[0_16px_40px_rgba(45,45,45,0.15)] lg:h-[480px]">
        <Image
          src="/images/guide/guide-desk-hero.png"
          alt="A cozy desk with coffee, sticky notes, and a notebook about AI"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: '50% 18%' }}
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 100vw, 1100px"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-page-tan/95 to-transparent sm:h-12"
          aria-hidden
        />
      </div>
    </section>
  )
}
