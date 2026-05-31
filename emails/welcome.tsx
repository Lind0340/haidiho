import { Section, Text } from '@react-email/components'
import { EmailButton } from './components/EmailButton'
import { DihoNoteBox } from './components/DihoNoteBox'
import { EmailLayout } from './components/EmailLayout'
import { HaiSaysBox } from './components/HaiSaysBox'
import {
  bodyText,
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
    >
      <Section style={whiteCard}>
        <Text style={goldItalic}>Hey. You made it. Glad you&apos;re here. ❤️</Text>

        <Text style={bodyText}>
          Every week you&apos;ll get:
          <br />
          <br />
          — The latest strip (newsletter version has something the site version doesn&apos;t — just
          saying)
          <br />
          — The mug of the week
          <br />
          — Best stories from the board
          <br />
          — A practical tip from Hai
          <br />
          — Something exclusive just for subscribers
          <br />
          <br />
          That&apos;s it. No spam. No 47 bullet points. I specifically asked.
        </Text>

        <HaiSaysBox haiAvatarUrl={assets.hai}>
          I have been waiting. Not in a weird way. In a welcoming way. Also — the newsletter has a
          Spot the Difference strip each week. I find all 5 immediately. ❤️ — Hai
        </HaiSaysBox>

        <DihoNoteBox>
          Hai wanted to send daily updates. We discussed it. The answer was no. ❤️ — DiHo
        </DihoNoteBox>

        <Section style={{ textAlign: 'center', margin: '28px 0 8px' }}>
          <EmailButton href={assets.site}>Come explore the neighborhood →</EmailButton>
        </Section>
      </Section>
    </EmailLayout>
  )
}
