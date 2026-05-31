import { Section, Text } from '@react-email/components'
import { DihoNoteBox } from './components/DihoNoteBox'
import { EmailButton } from './components/EmailButton'
import { EmailLayout } from './components/EmailLayout'
import { PinnedNote } from './components/PinnedNote'
import { bodyText, excerpt, getEmailAssets, titleStyle, whiteCard } from './components/email-constants'

export type ReplyNotificationEmailProps = {
  siteUrl: string
  username: string
  postExcerpt: string
  replyExcerpt: string
}

export default function ReplyNotificationEmail({
  siteUrl,
  username,
  postExcerpt,
  replyExcerpt,
}: ReplyNotificationEmailProps) {
  const assets = getEmailAssets(siteUrl)
  const boardUrl = `${assets.site}/neighborhood`

  return (
    <EmailLayout siteUrl={siteUrl} preview="Someone replied to your post on the Haidiho board.">
      <Section style={whiteCard}>
        <Text style={titleStyle}>You got a reply ❤️</Text>
        <Text style={bodyText}>
          Hey {username} —
          <br />
          <br />
          Someone pinned a reply to your post on the Haidiho board.
          <br />
          <br />
          Come see what they said. ❤️
        </Text>

        <PinnedNote label="Your post:" variant="post">
          {excerpt(postExcerpt)}
        </PinnedNote>

        <PinnedNote label="Their reply:" variant="reply">
          {excerpt(replyExcerpt)}
        </PinnedNote>

        <Section style={{ textAlign: 'center', margin: '24px 0 8px' }}>
          <EmailButton href={boardUrl}>See the conversation →</EmailButton>
        </Section>

        <DihoNoteBox>This is what the neighborhood is for. ❤️ — DiHo</DihoNoteBox>
      </Section>
    </EmailLayout>
  )
}
