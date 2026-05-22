import { complianceFontSizePx } from '@/components/guide/guide-typography'

type Props = {
  chapterNumber: number
  text: string
}

export function GuideComplianceFooter({ chapterNumber, text }: Props) {
  const size = complianceFontSizePx(chapterNumber)

  return (
    <footer className="mt-8 rounded-b-xl bg-[#d9dde5] px-4 py-4 sm:px-6">
      <div className="flex gap-3">
        <div
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#b8bec8] bg-[#eceef2] text-[10px] font-extrabold leading-none text-soft-charcoal/60"
          aria-hidden
        >
          C
        </div>
        <p
          className="min-w-0 flex-1 text-left font-medium leading-snug text-soft-charcoal/70"
          style={{ fontSize: `${size}px` }}
        >
          {text}
        </p>
      </div>
    </footer>
  )
}
