import { render } from '@react-email/render'
import ConfirmationEmail from '../../../emails/confirmation'
import WelcomeEmail from '../../../emails/welcome'
import MugConfirmationEmail from '../../../emails/mug-confirmation'
import StoryConfirmationEmail from '../../../emails/story-confirmation'
import PostApprovedEmail from '../../../emails/post-approved'
import ReplyNotificationEmail from '../../../emails/reply-notification'
import ModerationAlertEmail from '../../../emails/moderation-alert'
import { getSiteUrl } from '@/lib/email/newsletter-types'

export function buildUnsubscribeUrl(token: string, siteUrl = getSiteUrl()) {
  const base = siteUrl.replace(/\/$/, '')
  return `${base}/unsubscribe?token=${encodeURIComponent(token)}`
}

export async function renderConfirmationHtml(siteUrl: string, confirmationUrl: string) {
  return render(<ConfirmationEmail siteUrl={siteUrl} confirmationUrl={confirmationUrl} />)
}

export async function renderWelcomeHtml(
  siteUrl: string,
  welcomeBack?: boolean,
  unsubscribeUrl?: string,
) {
  return render(
    <WelcomeEmail siteUrl={siteUrl} welcomeBack={welcomeBack} unsubscribeUrl={unsubscribeUrl} />,
  )
}

export async function renderMugConfirmationHtml(siteUrl: string, memberName: string) {
  return render(<MugConfirmationEmail siteUrl={siteUrl} memberName={memberName} />)
}

export async function renderStoryConfirmationHtml(siteUrl: string, name: string) {
  return render(<StoryConfirmationEmail siteUrl={siteUrl} name={name} />)
}

export async function renderPostApprovedHtml(
  siteUrl: string,
  username: string,
  postExcerpt: string,
  room: string,
) {
  return render(
    <PostApprovedEmail
      siteUrl={siteUrl}
      username={username}
      postExcerpt={postExcerpt}
      room={room}
    />,
  )
}

export async function renderReplyNotificationHtml(
  siteUrl: string,
  username: string,
  postExcerpt: string,
  replyExcerpt: string,
) {
  return render(
    <ReplyNotificationEmail
      siteUrl={siteUrl}
      username={username}
      postExcerpt={postExcerpt}
      replyExcerpt={replyExcerpt}
    />,
  )
}

export async function renderModerationAlertHtml(
  siteUrl: string,
  counts: { total: number; communityPosts: number; mugSubmissions: number; storySubmissions: number },
) {
  return render(
    <ModerationAlertEmail
      siteUrl={siteUrl}
      total={counts.total}
      communityPosts={counts.communityPosts}
      mugSubmissions={counts.mugSubmissions}
      storySubmissions={counts.storySubmissions}
    />,
  )
}
