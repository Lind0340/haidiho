import { Img, Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EmailButton } from './components/EmailButton'
import { EmailLayout } from './components/EmailLayout'
import { WelcomeDihoNote } from './components/WelcomeDihoNote'
import { WelcomeHaiSays } from './components/WelcomeHaiSays'
import { WelcomePerkCards } from './components/WelcomePerkCards'
import {
  bodyText,
  EMAIL,
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
                <td style={{ padding: '0 10px', textAlign: 'center', verticalAlign: 'bottom' }}>
                  <Img
                    src={assets.hai}
                    width={72}
                    height={89}
                    alt="Hai"
                    style={{ display: 'inline-block' }}
                  />
                </td>
                <td style={{ padding: '0 10px', textAlign: 'center', verticalAlign: 'bottom' }}>
                  <Img
                    src={assets.diho}
                    width={76}
                    height={67}
                    alt="DiHo"
                    style={{ display: 'inline-block' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section style={{ textAlign: 'center', margin: '8px 0 8px' }}>
          <EmailButton href={assets.site}>Come explore the neighborhood →</EmailButton>
        </Section>
      </Section>
    </EmailLayout>
  )
}

const ctaCharacters: CSSProperties = {
  textAlign: 'center',
  margin: '24px 0 4px',
  padding: '12px 8px 4px',
  backgroundColor: EMAIL.noteCream,
  borderRadius: '14px',
  border: `1px dashed ${EMAIL.divider}`,
}
