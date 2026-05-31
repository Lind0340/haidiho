import { cn } from '@/lib/utils'

type SiteCanvasProps = {
  children: React.ReactNode
  className?: string
}

/** Warm tan page background + Hai-blue dot grid — used on every page, full scroll height. */
export function SiteCanvas({ children, className }: SiteCanvasProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-1 flex-col overflow-x-clip bg-page-tan',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 min-h-full w-full opacity-45 [background-image:radial-gradient(#4a90d9_1px,transparent_1px)] [background-size:26px_26px]"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">{children}</div>
    </div>
  )
}
