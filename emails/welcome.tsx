import { Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EmailButton } from './components/EmailButton'
import { EmailCharacterPortrait } from './components/EmailCharacterPortrait'
import { EmailLayout } from './components/EmailLayout'
import { WelcomeDihoNote } from './components/WelcomeDihoNote'
import { WelcomeHaiSays } from './components/WelcomeHaiSays'
import { WelcomePerkCards } from './components/WelcomePerkCards'
import {
  bodyText,
  EMAIL,
  EMAIL_FONT,
  getEmailAssets,
  goldItalic,
  whiteCard,
} from './components/email-constants'

export type WelcomeEmailProps = {
  siteUrl: string
  welcomeBack?: boolean
  unsubscribeUrl?: string
}

export default function WelcomeEmail({ siteUrl, welcomeBack, unsubscribeUrl }: WelcomeEmailProps) {
  const assets = getEmailAssets()

  return (
    <EmailLayout
      siteUrl={siteUrl}
      preview={
        welcomeBack
          ? 'Welcome back to the Haidiho neighborhood'
          : 'Haidiho! Welcome to the neighborhood 👋'
      }
      showUnsubscribe={Boolean(unsubscribeUrl)}
      unsubscribeUrl={unsubscribeUrl}
      footerAccent
    >
      <Section style={whiteCard}>
        <Text style={goldItalic}>Hey. You made it. Glad you&apos;re here. ❤️</Text>

        <Text style={bodyText}>Every week you&apos;ll get:</Text>

        <WelcomePerkCards />

        <Text style={{ ...bodyText, marginTop: 4 }}>
          That&apos;s it. No spam. No 47 bullet points. I specifically asked.
        </Text>

        <WelcomeHaiSays haiImageUrl={assets.hai}>
          I have been waiting. Not in a weird way. In a welcoming way. Also — the newsletter has a
          Spot the Difference strip each week. I find all 5 immediately. ❤️ — Hai
        </WelcomeHaiSays>

        <WelcomeDihoNote dihoImageUrl={assets.diho}>
          Hai wanted to send daily updates. We discussed it. The answer was no. ❤️ — DiHo
        </WelcomeDihoNote>

        <Section style={ctaCharacters}>
          <table role="presentation" cellPadding={0} cellSpacing={0} style={{ margin: '0 auto' }}>
            <tbody>
              <tr>
                <td style={{ padding: '0 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <EmailCharacterPortrait src={assets.hai} alt="Hai" character="hai" size={80} />
                </td>
                <td style={{ padding: '0 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <EmailCharacterPortrait src={assets.diho} alt="DiHo" character="diho" size={80} />
                </td>
              </tr>
            </tbody>
          </table>
          <Text style={ctaLead}>
            The strip, the mugs, the board — and two coworkers who are very ready to help you figure
            this out.
          </Text>
          <Text style={ctaSub}>
            Five minutes. One coffee. Come say hi. ☕
          </Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '16px 0 8px' }}>
          <EmailButton href={assets.site}>Come explore the neighborhood →</EmailButton>
        </Section>
      </Section>
    </EmailLayout>
  )
}

const ctaCharacters: CSSProperties = {
  textAlign: 'center',
  margin: '24px 0 4px',
  padding: '16px 18px 20px',
  backgroundColor: EMAIL.noteCream,
  borderRadius: '14px',
  border: `1px dashed ${EMAIL.divider}`,
}

const ctaLead: CSSProperties = {
  margin: '16px 0 8px',
  fontSize: '15px',
  lineHeight: 1.6,
  fontWeight: 600,
  color: EMAIL.navy,
  textAlign: 'center',
  fontFamily: EMAIL_FONT,
}

const ctaSub: CSSProperties = {
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.5,
  fontStyle: 'italic',
  color: EMAIL.muted,
  textAlign: 'center',
  fontFamily: EMAIL_FONT,
}
