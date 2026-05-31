import { Section, Text } from '@react-email/components'
import { EmailButton } from './components/EmailButton'
import { EmailLayout } from './components/EmailLayout'
import { HaiSaysBox } from './components/HaiSaysBox'
import {
  bodyText,
  getEmailAssets,
  titleStyle,
  whiteCard,
} from './components/email-constants'

export type ModerationAlertEmailProps = {
  siteUrl: string
  total: number
  communityPosts: number
  mugSubmissions: number
  storySubmissions: number
}

export default function ModerationAlertEmail({
  siteUrl,
  total,
  communityPosts,
  mugSubmissions,
  storySubmissions,
}: ModerationAlertEmailProps) {
  const assets = getEmailAssets(siteUrl)
  const modUrl = `${assets.site}/admin/moderation`

  return (
    <EmailLayout
      siteUrl={siteUrl}
      preview={`${total} posts waiting in the neighborhood moderation queue`}
      footerVariant="minimal"
    >
      <Section style={whiteCard}>
        <Text style={titleStyle}>Posts waiting for review</Text>
        <Text style={bodyText}>
          You have {total} {total === 1 ? 'item' : 'items'} waiting in the moderation queue.
          <br />
          <br />
          — {communityPosts} community {communityPosts === 1 ? 'post' : 'posts'}
          <br />
          — {mugSubmissions} mug {mugSubmissions === 1 ? 'submission' : 'submissions'}
          <br />
          — {storySubmissions} story {storySubmissions === 1 ? 'submission' : 'submissions'}
        </Text>

        <Section style={{ textAlign: 'center', margin: '24px 0 8px' }}>
          <EmailButton href={modUrl}>Review now →</EmailButton>
        </Section>

        <HaiSaysBox haiAvatarUrl={assets.hai}>
          I pre-screened these already. My confidence levels are included in the queue. ❤️ — Hai
        </HaiSaysBox>
      </Section>
    </EmailLayout>
  )
}
