import { cn } from '@/lib/utils'

export function HeroWordmark({ className }: { className?: string }) {
  return (
    <div className={cn('mx-auto block w-fit', className)}>
      <span className="relative block text-[82px] font-extrabold leading-none tracking-[-0.065em]">
        <span className="text-hai-blue">hai</span>
        <span className="text-hai-blue-dark">diho</span>
        <span
          className="absolute -right-3 top-3 text-xl text-hai-blue"
          aria-hidden
        >
          ♥
        </span>
      </span>
      <div className="relative mt-1 w-[296px]">
        <span className="absolute -left-1 -top-2 text-xl text-warm-pink" aria-hidden>
          ♥
        </span>
        <svg className="h-4 w-full text-hai-blue" viewBox="0 0 280 12" fill="none" aria-hidden>
          <path
            d="M20 8 C 60 2, 110 9, 150 6 C 190 3, 235 8, 268 5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
