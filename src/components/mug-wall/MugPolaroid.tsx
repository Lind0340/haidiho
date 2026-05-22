import Image from 'next/image'
import type { MugWallEntry } from '@/lib/mug-wall-data'

type MugPolaroidProps = {
  entry: MugWallEntry
  isFeatured?: boolean
}

const POLAROID_WIDTH = 141
const POLAROID_HEIGHT = 147

export function MugPolaroid({ entry, isFeatured }: MugPolaroidProps) {
  return (
    <article
      className="relative w-full"
      style={{ transform: `rotate(${entry.rotate}deg)` }}
    >
      {isFeatured && (
        <span
          className="absolute -right-1 -top-1 z-10 text-lg drop-shadow"
          title="Mug of the week"
          aria-label="Featured mug of the week"
        >
          ⭐
        </span>
      )}
      <Image
        src={entry.polaroidSrc}
        alt={`${entry.name}'s mug — ${entry.mugText}`}
        width={POLAROID_WIDTH}
        height={POLAROID_HEIGHT}
        className="h-auto w-full drop-shadow-[0_10px_18px_rgba(45,45,45,0.22)]"
        sizes="(max-width: 640px) 44vw, 141px"
      />
    </article>
  )
}
