import { Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EMAIL, EMAIL_FONT } from './email-constants'

export function BobNoteBox() {
  return (
    <Section style={box}>
      <table role="presentation" cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
            <td style={{ width: 44, verticalAlign: 'top', paddingRight: 10 }}>
              <div style={avatar}>B</div>
            </td>
            <td style={{ verticalAlign: 'top' }}>
              <Text style={title}>BOB — Derek&apos;s AI Assistant</Text>
              <Text style={done}>Done. ✅</Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  )
}

const box: CSSProperties = {
  backgroundColor: EMAIL.bobBeige,
  borderRadius: '12px',
  padding: '14px 16px',
  margin: '20px 0',
  border: `1px solid ${EMAIL.divider}`,
}

const avatar: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: EMAIL.gold,
  color: EMAIL.navy,
  fontWeight: 800,
  fontSize: '16px',
  lineHeight: '36px',
  textAlign: 'center',
  fontFamily: EMAIL_FONT,
}

const title: CSSProperties = {
  margin: '0 0 4px',
  fontSize: '13px',
  fontWeight: 700,
  color: EMAIL.navy,
  fontFamily: EMAIL_FONT,
}

const done: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 700,
  color: EMAIL.charcoal,
  fontFamily: EMAIL_FONT,
}
