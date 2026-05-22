/** Small hand-drawn accents used across the mug wall page */

export function SketchHeart({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 28"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 24s-10-6.5-10-12a5.5 5.5 0 0 1 10-2.5A5.5 5.5 0 0 1 26 12c0 5.5-10 12-10 12z" />
    </svg>
  )
}

export function FilledHeart({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      ❤️
    </span>
  )
}

export function PushPin({ color }: { color: 'blue' | 'red' }) {
  const head = color === 'blue' ? '#4a90d9' : '#e85a4f'
  const rim = color === 'blue' ? '#2d6cb0' : '#c0392b'
  return (
    <div className="absolute -top-2 left-1/2 z-20 -translate-x-1/2" aria-hidden>
      <div
        className="h-3.5 w-3.5 rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
        style={{ background: `radial-gradient(circle at 35% 30%, ${head}, ${rim})` }}
      />
      <div className="mx-auto h-2 w-0.5 rounded-full bg-neutral-400" />
    </div>
  )
}

export function StickyTape() {
  return (
    <div
      className="absolute -top-2 left-1/2 z-10 h-4 w-10 -translate-x-1/2 rotate-[-4deg] bg-[#ffc4d6]/90 shadow-sm"
      aria-hidden
    />
  )
}
