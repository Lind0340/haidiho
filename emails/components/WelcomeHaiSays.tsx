import { Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EmailCharacterPortrait } from './EmailCharacterPortrait'
import { EMAIL, EMAIL_FONT } from './email-constants'

type Props = {
  haiImageUrl: string
  children: React.ReactNode
}

/** Hai’s voice — portrait only, no caps label or speech-bubble art. */
export function WelcomeHaiSays({ haiImageUrl, children }: Props) {
  return (
    <Section style={box}>
      <table role="presentation" cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ width: 76, verticalAlign: 'top', paddingRight: 12 }}>
              <EmailCharacterPortrait src={haiImageUrl} alt="Hai" character="hai" size={64} />
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
  backgroundColor: EMAIL.tipBlue,
  borderRadius: '14px',
  padding: '18px 16px 18px 14px',
  margin: '22px 0',
  border: `1px solid ${EMAIL.haiBlue}44`,
  boxShadow: '0 2px 8px rgba(74, 144, 217, 0.12)',
}

const copy: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.65,
  fontWeight: 400,
  color: EMAIL.charcoal,
  fontFamily: EMAIL_FONT,
}
