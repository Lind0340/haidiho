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

export type StoryConfirmationEmailProps = {
  siteUrl: string
  name: string
}

export default function StoryConfirmationEmail({ siteUrl, name }: StoryConfirmationEmailProps) {
  const assets = getEmailAssets()
  const boardUrl = `${assets.site}/neighborhood`

  return (
    <EmailLayout siteUrl={siteUrl} preview="Your story is in the queue — we read every one.">
      <Section style={whiteCard}>
        <Text style={titleStyle}>Got your story ❤️</Text>
        <Text style={bodyText}>
          Hey {name} —
          <br />
          <br />
          Your story is in the queue.
          <br />
          <br />
          We read every single one. Every single one.
          <br />
          <br />
          If yours becomes a strip your name goes on it and the whole neighborhood hears about it.
          <br />
          <br />
          That&apos;s the deal. ❤️ — DiHo
        </Text>

        <HaiSaysBox haiAvatarUrl={assets.hai}>
          I have pre-analyzed your story for comic potential. Results are promising. I cannot share
          more at this time. ❤️ — Hai
        </HaiSaysBox>

        <Text style={smallGrey}>
          Stories that become strips get featured in the newsletter too. Just saying. ❤️
        </Text>

        <Section style={{ textAlign: 'center', margin: '28px 0 4px' }}>
          <EmailButton href={boardUrl}>Check out the bulletin board →</EmailButton>
        </Section>
      </Section>
    </EmailLayout>
  )
}
