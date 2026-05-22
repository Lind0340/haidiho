import { cn } from '@/lib/utils'

type StripCaptionProps = {
  text: string
  emphasizeLastLine?: boolean
  className?: string
}

/** Renders strip footer copy with preserved line breaks (and optional punchline emphasis). */
export function StripCaption({ text, emphasizeLastLine = false, className }: StripCaptionProps) {
  const lines = text.split('\n')

  if (!emphasizeLastLine || lines.length < 2) {
    return (
      <p
        className={cn(
          'whitespace-pre-line text-sm font-semibold leading-relaxed text-soft-charcoal/85',
          className,
        )}
      >
        {text}
      </p>
    )
  }

  const lead = lines.slice(0, -1).join('\n')
  const punchline = lines[lines.length - 1]

  return (
    <div className={cn('text-sm font-semibold leading-relaxed text-soft-charcoal/85', className)}>
      <p className="whitespace-pre-line">{lead}</p>
      <p className="mt-2 font-bold text-hai-blue">{punchline}</p>
    </div>
  )
}
