export function GuideSpiralBinding() {
  const ringCount = 13
  const width = 720
  const step = width / (ringCount + 1)

  return (
    <div className="guide-spiral-strip" aria-hidden>
      <svg
        viewBox={`0 0 ${width} 52`}
        className="guide-spiral-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="guide-wire" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8d8d8" />
            <stop offset="45%" stopColor="#9a9a9a" />
            <stop offset="100%" stopColor="#6e6e6e" />
          </linearGradient>
        </defs>

        {Array.from({ length: ringCount }, (_, i) => {
          const cx = step * (i + 1)
          return (
            <g key={i}>
              {/* punched hole in paper */}
              <ellipse cx={cx} cy="42" rx="7" ry="3.5" fill="#c8baa8" opacity="0.9" />
              <ellipse cx={cx} cy="42" rx="5" ry="2.5" fill="#ebe4d8" />

              {/* metal wire loop */}
              <path
                d={`M ${cx - 13} 42 C ${cx - 13} 10, ${cx - 4} 4, ${cx} 4 C ${cx + 4} 4, ${cx + 13} 10, ${cx + 13} 42`}
                fill="none"
                stroke="url(#guide-wire)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d={`M ${cx - 9} 42 C ${cx - 9} 16, ${cx - 3} 12, ${cx} 12 C ${cx + 3} 12, ${cx + 9} 16, ${cx + 9} 42`}
                fill="none"
                stroke="#ececec"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.85"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
