import { Section, Text } from '@react-email/components'
import { BobNoteBox } from './components/BobNoteBox'
import { EmailButton } from './components/EmailButton'
import { EmailLayout } from './components/EmailLayout'
import { PinnedNote } from './components/PinnedNote'
import {
  bodyText,
  excerpt,
  getEmailAssets,
  roomLabel,
  titleStyle,
  whiteCard,
} from './components/email-constants'

export type PostApprovedEmailProps = {
  siteUrl: string
  username: string
  postExcerpt: string
  room: string
}

export default function PostApprovedEmail({
  siteUrl,
  username,
  postExcerpt,
  room,
}: PostApprovedEmailProps) {
  const assets = getEmailAssets(siteUrl)
  const boardUrl = `${assets.site}/neighborhood`

  return (
    <EmailLayout siteUrl={siteUrl} preview="Your post is live on the Haidiho bulletin board.">
      <Section style={whiteCard}>
        <Text style={titleStyle}>Your post is live ❤️</Text>
        <Text style={bodyText}>
          Hey {username} —
          <br />
          <br />
          Your post just went up on the Haidiho neighborhood bulletin board.
          <br />
          <br />
          Go see it. Maybe someone&apos;s already replied. Maybe BOB has something to say about it.
          <br />
          <br />
          Probably not. That&apos;s BOB.
          <br />
          But maybe. ❤️
        </Text>

        <PinnedNote tag={`📌 ${roomLabel(room)}`}>{excerpt(postExcerpt)}</PinnedNote>

        <Section style={{ textAlign: 'center', margin: '24px 0 8px' }}>
          <EmailButton href={boardUrl}>See your post on the board →</EmailButton>
        </Section>

        <BobNoteBox />
      </Section>
    </EmailLayout>
  )
}
