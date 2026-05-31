import { Img } from '@react-email/components'
import type { CSSProperties } from 'react'

type Props = {
  src: string
  alt: string
  nativeWidth: number
  nativeHeight: number
  displayWidth: number
  style?: CSSProperties
}

/** Transparent bust portrait — preserves aspect ratio for email clients. */
export function EmailPortrait({
  src,
  alt,
  nativeWidth,
  nativeHeight,
  displayWidth,
  style,
}: Props) {
  const displayHeight = Math.round((displayWidth * nativeHeight) / nativeWidth)

  return (
    <Img
      src={src}
      width={displayWidth}
      height={displayHeight}
      alt={alt}
      style={{ display: 'block', margin: 0, ...style }}
    />
  )
}
