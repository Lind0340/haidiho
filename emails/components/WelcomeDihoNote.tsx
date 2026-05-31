import { Img, Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EMAIL, EMAIL_FONT } from './email-constants'

type Props = {
  dihoImageUrl: string
  children: React.ReactNode
}

/** DiHo’s note — gold warmth, side-eye energy (Ask DiHo launcher art). */
export function WelcomeDihoNote({ dihoImageUrl, children }: Props) {
  return (
    <Section style={box}>
      <table role="presentation" cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ width: 80, verticalAlign: 'top', paddingRight: 8 }}>
              <Img
                src={dihoImageUrl}
                width={68}
                height={60}
                alt="DiHo"
                style={{ display: 'block', margin: 0 }}
              />
            </td>
            <td style={{ verticalAlign: 'middle' }}>
              <Text style={copy}>{children}</Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  )
}

const box: CSSProperties = {
  backgroundColor: '#FEF3D6',
  borderRadius: '14px',
  padding: '18px 16px 18px 12px',
  margin: '22px 0',
  border: `2px solid ${EMAIL.gold}`,
  boxShadow: '0 3px 10px rgba(245, 166, 35, 0.18)',
}

const copy: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.65,
  fontWeight: 500,
  fontStyle: 'italic',
  color: EMAIL.charcoal,
  fontFamily: EMAIL_FONT,
}
