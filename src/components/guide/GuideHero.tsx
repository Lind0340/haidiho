import { GuideAvatar } from '@/components/guide/GuideAvatar'
import { FilledHeart } from '@/components/mug-wall/MugWallDecor'

type Props = {
  activeChapter: number
  onChapterSelect: (n: number) => void
}

export function GuideHero({ activeChapter, onChapterSelect }: Props) {
  return (
    <header className="relative overflow-hidden rounded-t-[18px] bg-[#16284c] text-diho-cream">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-hai-blue/20 blur-2xl" aria-hidden />
      <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-accent-gold/15 blur-2xl" aria-hidden />

      <div className="relative px-5 py-10 sm:px-10 sm:py-12">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-hai-blue">
          Haidiho
        </p>
        <p className="mt-2 text-center text-xs font-extrabold uppercase tracking-[0.25em] text-diho-cream/60">
          a note from diho
        </p>
        <h1 className="mt-3 flex items-center justify-center gap-2 text-center font-[family-name:var(--font-hand)] text-4xl font-bold leading-tight sm:text-5xl">
          So You Got An AI Coworker.
          <FilledHeart className="text-2xl sm:text-3xl" />
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base font-semibold leading-relaxed text-diho-cream/90 sm:text-lg">
          The care, feeding and training of your new favorite colleague. From someone who has been
          there. Is still there. Send coffee.
        </p>
        <p className="mt-4 text-center font-[family-name:var(--font-hand)] text-xl font-semibold text-accent-gold sm:text-2xl">
          — DiHo, Human Worker ❤️
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
          <div className="rounded-[14px] border border-hai-blue/40 bg-hai-blue/25 p-4">
            <div className="flex gap-3">
              <GuideAvatar character="hai" size="md" borderClassName="border border-white/50" />
              <p className="text-sm font-semibold leading-relaxed">
                &ldquo;I also helped write this! I wanted to add 29 more chapters. DiHo said no.
                They are very good summaries though. ❤️ — Hai&rdquo;
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[14px] border border-accent-gold/40 bg-accent-gold/15 px-4 py-3">
            <GuideAvatar character="diho" size="md" borderClassName="border border-white/50" />
            <p className="font-[family-name:var(--font-hand)] text-lg font-bold text-accent-gold">
              Hai. We talked about this.
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm font-bold text-diho-cream/80">
          Seven chapters · scroll or jump below
        </p>
        <nav
          className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          aria-label="Chapters"
        >
          {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChapterSelect(n)}
              className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-2 text-xs font-extrabold transition-all sm:h-10 sm:min-w-[2.5rem] sm:text-sm ${
                activeChapter === n
                  ? 'bg-accent-gold text-[#16284c] shadow-md ring-2 ring-diho-cream/40'
                  : 'bg-diho-cream/20 text-diho-cream hover:bg-diho-cream/35'
              }`}
              aria-label={`Chapter ${n}`}
              aria-current={activeChapter === n ? 'step' : undefined}
            >
              {n}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
