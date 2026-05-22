import Image from 'next/image'

/** Center hero mug on the intro panel */
export function HeroMugIllustration() {
  return (
    <div className="relative mx-auto my-2 flex h-[150px] w-full max-w-[180px] items-end justify-center">
      <Image
        src="/images/mug-wall/hero-mug.png"
        alt=""
        width={180}
        height={160}
        priority
        className="h-auto w-full max-w-[160px] object-contain drop-shadow-[0_10px_18px_rgba(45,45,45,0.15)]"
        sizes="160px"
      />
    </div>
  )
}
