import { Img } from '@react-email/components'
import type { CSSProperties } from 'react'

type Character = 'hai' | 'diho'

type Props = {
  src: string
  alt: string
  character: Character
  size?: number
}

/** Circular crop of launcher art — face only, no speech-bubble text. */
export function EmailCharacterPortrait({ src, alt, character, size = 64 }: Props) {
  const crop = CROPS[character]
  const scale = size / crop.baseSize

  return (
    <table
      role="presentation"
      cellPadding={0}
      cellSpacing={0}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: crop.bg,
      }}
    >
      <tbody>
        <tr>
          <td
            style={{
              width: size,
              height: size,
              overflow: 'hidden',
              borderRadius: '50%',
              textAlign: 'center',
              verticalAlign: 'top',
              lineHeight: 0,
            }}
          >
            <Img
              src={src}
              alt={alt}
              width={Math.round(crop.imgWidth * scale)}
              height={Math.round(crop.imgHeight * scale)}
              style={{
                display: 'block',
                margin: `${Math.round(crop.marginTop * scale)}px auto 0`,
                marginLeft:
                  crop.marginLeft !== undefined
                    ? `${Math.round(crop.marginLeft * scale)}px`
                    : 'auto',
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const CROPS: Record<
  Character,
  {
    baseSize: number
    imgWidth: number
    imgHeight: number
    marginTop: number
    marginLeft?: number
    bg: CSSProperties['backgroundColor']
  }
> = {
  hai: {
    baseSize: 64,
    imgWidth: 64,
    imgHeight: 100,
    marginTop: 2,
    bg: '#E8F2FC',
  },
  diho: {
    baseSize: 64,
    imgWidth: 72,
    imgHeight: 64,
    marginTop: 4,
    marginLeft: -2,
    bg: '#F5EDE0',
  },
}
