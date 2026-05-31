import { Section, Text } from '@react-email/components'
import { EmailButton } from './components/EmailButton'
import { EmailLayout } from './components/EmailLayout'
import { HaiSaysBox } from './components/HaiSaysBox'
import {
  bodyText,
  getEmailAssets,
  smallGrey,
  titleStyle,
  whiteCard,
} from './components/email-constants'

export type MugConfirmationEmailProps = {
  siteUrl: string
  memberName: string
}

export default function MugConfirmationEmail({ siteUrl, memberName }: MugConfirmationEmailProps) {
  const assets = getEmailAssets(siteUrl)
  const mugsUrl = `${assets.site}/mugs`

  return (
    <EmailLayout siteUrl={siteUrl} preview="Your mug is in the queue — we'll be in touch. ☕">
      <Section style={whiteCard}>
        <Text style={titleStyle}>We got your mug ❤️</Text>
        <Text style={bodyText}>
          Hey {memberName} —
          <br />
          <br />
          Your mug made it to the queue. We review every single one.
          <br />
          <br />
          If it gets approved it goes up on the Mug Wall for the whole neighborhood to see.
          <br />
          <br />
          And if it ends up in a strip? Your name goes on it. ❤️
        </Text>

        <HaiSaysBox haiAvatarUrl={assets.hai}>
          I have already studied your mug. I have thoughts. Good thoughts. ❤️ — Hai
        </HaiSaysBox>

        <Text style={smallGrey}>
          We&apos;ll be in touch if your mug gets featured. Keep an eye on the neighborhood. ❤️
        </Text>

        <Section style={{ textAlign: 'center', margin: '28px 0 4px' }}>
          <EmailButton href={mugsUrl} variant="gold">
            Visit the Mug Wall →
          </EmailButton>
        </Section>
      </Section>
    </EmailLayout>
  )
}
