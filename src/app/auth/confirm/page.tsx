export default function AuthConfirmPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        You&apos;re in ❤️
      </h1>
      <p className="mt-3 text-sm font-semibold text-soft-charcoal/80">
        Magic link confirmed. Head back to the neighborhood — Hai&apos;s already waving.
      </p>
      <a
        href="/neighborhood"
        className="mt-6 inline-flex rounded-xl bg-hai-blue px-6 py-3 font-[family-name:var(--font-hand)] text-lg font-bold text-diho-cream"
      >
        Come On In
      </a>
    </div>
  )
}
