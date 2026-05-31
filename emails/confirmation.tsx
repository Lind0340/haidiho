import { Hr, Link, Section, Text } from '@react-email/components'
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

export type ConfirmationEmailProps = {
  siteUrl: string
  confirmationUrl: string
}

export default function ConfirmationEmail({ siteUrl, confirmationUrl }: ConfirmationEmailProps) {
  const assets = getEmailAssets()

  return (
    <EmailLayout siteUrl={siteUrl} preview="Confirm your Haidiho account — one click and you're in.">
      <Section style={whiteCard}>
        <Text style={titleStyle}>Welcome to the neighborhood</Text>
        <Text style={bodyText}>
          Hey — thanks for signing up.
          <br />
          <br />
          Confirm your email and you&apos;ll be ready to read stories, post on the board, and say hi
          to Hai &amp; DiHo.
        </Text>

        <HaiSaysBox haiAvatarUrl={assets.hai}>
          I have been waiting. Not in a weird way. In a welcoming way. ❤️
        </HaiSaysBox>

        <Section style={{ textAlign: 'center', margin: '28px 0 20px' }}>
          <EmailButton href={confirmationUrl}>Confirm &amp; come on in 👋</EmailButton>
        </Section>

        <Text style={smallGrey}>
          Or copy this link:
          <br />
          <Link href={confirmationUrl} style={{ color: '#4A90D9', wordBreak: 'break-all' }}>
            {confirmationUrl}
          </Link>
        </Text>

        <Hr style={{ borderColor: '#E8DCC8', margin: '24px 0 16px' }} />

        <Text style={smallGrey}>
          Didn&apos;t sign up? You can ignore this email — nothing will change.
        </Text>
      </Section>
    </EmailLayout>
  )
}
