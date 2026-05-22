import type { ReactNode } from 'react'

/** Wooden cupboard interior — mugs sit on two shelves inside */
export function MugWallCupboard({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative mt-4 min-h-[340px] overflow-hidden rounded-lg border-[3px] border-[#6b4f2e] shadow-[inset_0_0_40px_rgba(0,0,0,0.35),0_4px_12px_rgba(45,45,45,0.15)]"
      aria-label="Mug wall cupboard"
    >
      {/* back wall — wood grain */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            linear-gradient(180deg, rgba(0,0,0,0.22) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.28) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.18) 0%, transparent 6%, transparent 94%, rgba(0,0,0,0.18) 100%),
            repeating-linear-gradient(
              92deg,
              transparent 0px,
              transparent 18px,
              rgba(60,40,20,0.06) 18px,
              rgba(60,40,20,0.06) 20px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.04) 0px,
              rgba(255,255,255,0.04) 1px,
              transparent 1px,
              transparent 48px
            ),
            linear-gradient(175deg, #dcc9a8 0%, #c4a574 28%, #b8956a 52%, #c9ad7f 78%, #9a7348 100%)
          `,
        }}
      />

      {/* ceiling lip */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-3 bg-gradient-to-b from-[#5c3d1f] to-transparent opacity-90"
        aria-hidden
      />

      {/* left interior wall */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-[1] w-4 bg-gradient-to-r from-[#4a3218] via-[#6b4f2e]/80 to-transparent sm:w-5"
        aria-hidden
      />

      {/* right interior wall */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 top-0 z-[1] w-4 bg-gradient-to-l from-[#4a3218] via-[#6b4f2e]/80 to-transparent sm:w-5"
        aria-hidden
      />

      {/* upper shelf */}
      <div
        className="pointer-events-none absolute left-0 right-0 z-[2] h-[14px]"
        style={{ top: 'calc(50% - 7px)' }}
        aria-hidden
      >
        <div className="absolute inset-x-2 top-0 h-[6px] rounded-sm bg-gradient-to-b from-[#e8d4b0] to-[#a88455] shadow-[0_3px_6px_rgba(0,0,0,0.35)]" />
        <div className="absolute inset-x-2 top-[5px] h-[3px] bg-[#7d5c38]" />
        <div className="absolute inset-x-0 top-[8px] h-8 bg-gradient-to-b from-black/12 to-transparent" />
      </div>

      {/* lower shelf lip / floor shadow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-6 bg-gradient-to-t from-black/25 to-transparent"
        aria-hidden
      />

      {/* floor board */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-2 bg-gradient-to-t from-[#5c3d1f] to-[#8b6914]"
        aria-hidden
      />

      {/* warm interior glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,230,180,0.2),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 px-3 py-5 sm:px-4 sm:py-6">{children}</div>
    </div>
  )
}
