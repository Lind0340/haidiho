import { SketchHeart } from '@/components/mug-wall/MugWallDecor'
import { StorySubmissionForm } from '@/components/forms/StorySubmissionForm'

export function StripCta() {
  return (
    <section className="mt-10 overflow-hidden rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] px-6 py-8 text-center shadow-[0_10px_24px_rgba(45,45,45,0.08)] sm:px-10 sm:py-10">
      <SketchHeart className="mx-auto h-8 w-8 text-warm-pink" />
      <h2 className="mt-3 font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal sm:text-4xl">
        Your story could be next
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-relaxed text-soft-charcoal/85 sm:text-base">
        Real humans. Real AI coworkers. Real moments worth drawing. Share yours — we might turn it into
        the next strip.
      </p>
      <StorySubmissionForm />
    </section>
  )
}
