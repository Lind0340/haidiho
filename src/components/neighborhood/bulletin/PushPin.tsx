type Props = { color?: string; className?: string }

export function PushPin({ color = '#c62828', className = '' }: Props) {
  return (
    <span
      className={`absolute left-1/2 top-0 z-20 block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.35)] ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden
    />
  )
}
