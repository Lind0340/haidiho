'use client'

import { useMemo, useState } from 'react'
import { StripCard } from '@/components/strip/StripCard'
import { StripModal } from '@/components/strip/StripModal'
import type { StripEntry } from '@/lib/strip-data'

type Props = {
  strips: StripEntry[]
}

export function StripGrid({ strips: initialStrips }: Props) {
  const [activeStrip, setActiveStrip] = useState<StripEntry | null>(null)
  const strips = useMemo(
    () => [...initialStrips].sort((a, b) => a.number - b.number),
    [initialStrips],
  )

  return (
    <>
      {/* Row-first grid so strips read 001 → 007 left-to-right, not column-masonry order */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {strips.map((strip) => (
          <StripCard key={strip.id} strip={strip} onOpen={setActiveStrip} />
        ))}
      </div>

      <StripModal strip={activeStrip} onClose={() => setActiveStrip(null)} />
    </>
  )
}
