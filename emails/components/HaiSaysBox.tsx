import { Img, Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EMAIL, EMAIL_FONT } from './email-constants'

type Props = {
  haiAvatarUrl: string
  children: React.ReactNode
}

export function HaiSaysBox({ haiAvatarUrl, children }: Props) {
  return (
    <Section style={box}>
      <table role="presentation" cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ width: 48, verticalAlign: 'top', paddingRight: 12 }}>
              <Img
                src={haiAvatarUrl}
                width={40}
                height={40}
                alt="Hai"
                style={{ borderRadius: '50%', display: 'block' }}
              />
            </td>
            <td style={{ verticalAlign: 'top' }}>
              <Text style={label}>Hai says:</Text>
              <Text style={copy}>{children}</Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  )
}

const box: CSSProperties = {
  backgroundColor: EMAIL.tipBlue,
  borderRadius: '12px',
  padding: '16px 18px',
  margin: '20px 0',
  border: `1px solid ${EMAIL.haiBlue}33`,
}

const label: CSSProperties = {
  margin: '0 0 6px',
  fontSize: '12px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: EMAIL.haiBlue,
  fontFamily: EMAIL_FONT,
}

const copy: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.6,
  color: EMAIL.charcoal,
  fontFamily: EMAIL_FONT,
}
