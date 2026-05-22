import { NewsletterSignup } from '@/components/forms/NewsletterSignup'

export default function SayHaidihoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="text-center">
        <h1 className="font-[family-name:var(--font-hand)] text-5xl font-bold text-soft-charcoal">
          say haidiho
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-soft-charcoal/85">
          Weekly warmth in your inbox — strips, mugs, tips, and the occasional AI coworker drama.
        </p>
      </header>
      <div className="mx-auto mt-10 max-w-md">
        <NewsletterSignup source="say_haidiho" />
        <p className="mt-6 text-center text-sm font-semibold text-soft-charcoal/70">
          Hai is glowing. DiHo already made coffee. You&apos;re in good company. ❤️
        </p>
      </div>
    </div>
  )
}
