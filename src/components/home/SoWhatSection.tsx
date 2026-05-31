import Image from 'next/image'

function RedUnderline() {
  return (
    <svg
      className="mt-0.5 h-2 w-full max-w-[245px] text-warm-pink xl:max-w-[280px]"
      viewBox="0 0 300 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 8C50 2 100 10 150 6C200 2 250 10 298 5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SoWhatSection() {
  return (
    <section className="px-1 pb-3 pt-2 sm:px-4 lg:px-2">
      <div className="grid grid-cols-1 items-start gap-5 overflow-visible rounded-[18px] border border-[#ead8c2]/80 bg-[#fff6e8] px-5 py-6 shadow-[0_8px_20px_rgba(45,45,45,0.06)] sm:rounded-[22px] sm:px-8 sm:py-7 md:grid-cols-[1fr_1.05fr] md:gap-6 xl:gap-8 xl:px-10 xl:py-9">
        <div>
          <h2 className="font-[family-name:var(--font-lora)] text-2xl font-bold leading-tight text-soft-charcoal sm:text-[30px] xl:text-[34px]">
            So What Is This Place?
          </h2>
          <RedUnderline />

          <p className="mt-5 text-[15px] font-semibold leading-[1.55] text-soft-charcoal sm:text-base xl:text-[17px] xl:leading-[1.6]">
            You got an AI coworker whether you asked for one or not. They started Monday. They know
            everything except what&apos;s useful about you specifically. They&apos;re eager.
            Occasionally unhinged. And they&apos;re not going anywhere.
          </p>
          <p className="mt-3 text-[15px] font-semibold leading-[1.55] text-soft-charcoal sm:text-base xl:text-[17px] xl:leading-[1.6]">
            This is where we figure this out together. With cartoons. With real stories. With actual
            tips that work. And with a lot of coffee.
          </p>
        </div>

        <div className="relative pt-3 xl:pt-4">
          <div className="overflow-hidden rounded-2xl bg-[#f9e9d8] shadow-[inset_0_-2px_4px_rgba(45,45,45,0.05),0_3px_12px_rgba(45,45,45,0.08)] ring-1 ring-[#ead8c2]/70">
            <Image
              src="/images/so-what-art-v1-padded.png"
              alt="Hai says: I have already optimized this website. You're welcome."
              width={500}
              height={212}
              className="h-auto w-full object-contain object-top"
              sizes="(max-width: 1024px) 50vw, 560px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
