import Image from 'next/image'
import Link from 'next/link'
import { SketchHeart } from '@/components/mug-wall/MugWallDecor'

const INTRO_ART = '/images/mug-wall/mug-wall-intro.png?v=3'
const INTRO_ART_WIDTH = 387
const INTRO_ART_HEIGHT = 228

export function MugWallIntro() {
  return (
    <aside className="relative overflow-visible rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] px-4 pb-6 pt-5 shadow-[0_12px_26px_rgba(45,45,45,0.08)] sm:px-6">
      <Image
        src={INTRO_ART}
        alt="the mug wall — Real mugs. Real people. Real conversations."
        width={INTRO_ART_WIDTH}
        height={INTRO_ART_HEIGHT}
        priority
        unoptimized
        className="mx-auto h-auto w-full object-contain"
        sizes="(max-width: 1024px) 100vw, 298px"
      />

      <p className="mt-3 text-center text-[15px] font-extrabold leading-snug text-soft-charcoal">
        A wall of mugs from real humans
        <br />
        training their AI coworkers.
      </p>

      <p className="mt-2 text-center text-[13px] font-semibold leading-relaxed text-soft-charcoal/85">
        Share your mug. Share your story. Let&apos;s learn from each other (over coffee, of course).
      </p>

      <div className="mt-3 flex justify-center">
        <SketchHeart className="h-7 w-7 text-hai-blue" />
      </div>

      <div className="mt-4 flex justify-center">
        <Link
          href="/say-haidiho"
          className="inline-flex min-h-[3rem] w-full max-w-[280px] items-center justify-center gap-2 rounded-xl bg-[#0867e8] px-6 py-3.5 text-base font-extrabold text-white shadow-[0_8px_0_rgba(30,64,175,0.35)] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:min-w-[220px] sm:w-auto sm:text-lg"
        >
          Add My Mug to the Wall
          <span aria-hidden>☕</span>
        </Link>
      </div>

      <p className="mt-2 text-center text-xs font-bold text-soft-charcoal/65">
        It takes 2 minutes. Makes a difference.
      </p>

      <ul className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] font-bold text-soft-charcoal/75">
        <li className="flex items-center gap-1">
          <span className="text-hai-blue">✓</span> Inspire others
        </li>
        <li className="flex items-center gap-1">
          <span className="text-hai-blue">✓</span> Get inspired
        </li>
        <li className="flex items-center gap-1">
          <span className="text-hai-blue">✓</span> Build the community
        </li>
      </ul>
    </aside>
  )
}
