import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import type { CSSProperties } from 'react'
import { getEmailAssets } from './components/email-constants'
import { getEmailSiteUrl } from '@/lib/site-url'
import type {
  ExclusiveType,
  NeighborhoodPostCard,
  WeeklyNewsletterProps,
} from '../src/lib/email/newsletter-types'

export const C = {
  cream: '#FFF8F0',
  charcoal: '#2D2D2D',
  navy: '#16284C',
  haiBlue: '#4A90D9',
  gold: '#F5A623',
  lightGold: '#FEF5E4',
  tipBlue: '#E8F2FC',
  coral: '#FF6B6B',
  muted: '#5c5c5c',
  grey: '#999999',
  answerGrey: '#999999',
  fallbackBg: '#F5F5F5',
  fallbackBorder: '#DDDDDD',
  cardCream: '#F5F0E8',
} as const

const font = 'Arial, Helvetica, sans-serif'

export type WeeklyNewsletterEmailProps = WeeklyNewsletterProps & {
  previewText?: string
}

export default function WeeklyNewsletter(props: WeeklyNewsletterEmailProps) {
  const {
    siteUrl,
    issueNumber,
    issueDate,
    openingLine,
    strip,
    differences,
    mug,
    neighborhoodPosts,
    tipOfWeek,
    exclusive,
    preferencesUrl,
    unsubscribeUrl,
    previewText,
  } = props

  const assets = getEmailAssets()
  const assetBase = getEmailSiteUrl()
  const haiAvatar = `${assetBase}/images/hai-there-chat-icon.png`
  const dihoAvatar = `${assetBase}/images/diho-there-chat-icon-v2.png`
  const preheader =
    previewText ?? `Haidiho #${String(issueNumber).padStart(3, '0')} — your weekly neighborhood report.`

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light" />
      </Head>
      <Preview>{preheader}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* 1. HEADER */}
          <Section style={pad}>
            <Img
              src={assets.logo}
              width={assets.logoWidth}
              height={assets.logoHeight}
              alt="HaiDiHo — real humans, AI coworkers"
              style={logo}
            />
            <Text style={reportTitle}>The Weekly Neighborhood Report</Text>
            <Text style={issueMeta}>
              Issue #{issueNumber} · {issueDate}
            </Text>
            <Hr style={divider} />
          </Section>

          {/* 2. OPENING */}
          <Section style={pad}>
            <Text style={opening}>{openingLine}</Text>
          </Section>

          {/* 3. SPOT THE DIFFERENCE — STRIP */}
          <Section style={pad}>
            <Text style={headerBlue}>this week&apos;s strip ❤️</Text>
            <Text style={dihoSub}>
              The newsletter version has 5 differences from the one on the site. Find them all
              before you scroll down. Hai found them immediately. Hai finds everything immediately.
              This is sometimes helpful.
            </Text>
            <Img
              src={strip.newsletterImageUrl}
              width={600}
              alt="This week's Haidiho strip — newsletter version with 5 differences"
              style={stripImg}
            />
            <Section style={goldBox}>
              <Text style={spotTitle}>👀 Spot the Difference</Text>
              <Text style={spotBody}>
                5 differences hidden in this strip vs the public version on the site. Can you find
                them all before you scroll to the reveal?
              </Text>
              <Link href={strip.pageUrl} style={linkBlue}>
                See the public version →
              </Link>
              <Text style={{ margin: '12px 0 0' }}>
                <Link href={strip.waterCoolerUrl} style={linkBlue}>
                  Share your score in The Water Cooler 👀
                </Link>
              </Text>
            </Section>
          </Section>

          {/* 4. MUG */}
          {mug && (
            <Section style={pad}>
              <Text style={headerGold}>mug of the week ☕</Text>
              <Section style={goldBoxPad}>
                <Img
                  src={mug.imageUrl}
                  width={300}
                  alt={`${mug.memberName}'s mug`}
                  style={polaroid}
                />
                {mug.appearedInStrip && (
                  <Text style={{ textAlign: 'center', margin: '8px 0', fontSize: '18px' }}>⭐</Text>
                )}
                <Text style={mugName}>{mug.memberName}</Text>
                {mug.memberTitle && <Text style={mugTitle}>{mug.memberTitle}</Text>}
                {mug.story && <Text style={mugStory}>&ldquo;{mug.story}&rdquo;</Text>}
                <Link href={mug.pageUrl} style={linkBlueCenter}>
                  Submit your mug →
                </Link>
              </Section>
            </Section>
          )}

          {/* 5. NEIGHBORHOOD */}
          {neighborhoodPosts.length > 0 && (
            <Section style={pad}>
              <Text style={headerNavy}>from the neighborhood this week</Text>
              {neighborhoodPosts.map((post) => (
                <NeighborhoodCard key={post.id} post={post} />
              ))}
              <Link href={`${siteUrl}/neighborhood`} style={linkBlueCenter}>
                Join the conversation →
              </Link>
            </Section>
          )}

          {/* 6. TIP */}
          {tipOfWeek && (
            <Section style={pad}>
              <Text style={headerBlueTip}>tip of the week 💡</Text>
              <Section style={tipBox}>
                <Row>
                  <Column style={{ width: 56, verticalAlign: 'top' }}>
                    <Img src={haiAvatar} width={48} height={48} alt="Hai" style={{ borderRadius: '50%' }} />
                  </Column>
                  <Column>
                    <Text style={haiSays}>Hai says:</Text>
                    <Text style={tipText}>{tipOfWeek}</Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          )}

          {/* 7. EXCLUSIVE */}
          {exclusive && (
            <Section style={pad}>
              <Text style={headerNavy}>only in the newsletter ❤️</Text>
              <Section style={exclusiveBox}>
                <ExclusiveBlock type={exclusive.type} content={exclusive.content} />
              </Section>
            </Section>
          )}

          {/* 8. REVEAL */}
          <SpotReveal differences={differences} />

          {/* 9. CLOSING */}
          <Section style={pad}>
            <Row>
              <Column align="center" style={{ width: '50%' }}>
                <Img src={dihoAvatar} width={64} alt="DiHo" />
                <Text style={bubbleDiho}>
                  That&apos;s the week. Same time next week. Coat optional. Coffee mandatory. ❤️ —
                  DiHo
                </Text>
              </Column>
              <Column align="center" style={{ width: '50%' }}>
                <Img src={haiAvatar} width={64} alt="Hai" />
                <Text style={bubbleHai}>
                  I have prepared next week&apos;s newsletter already. DiHo said to wait. I am
                  waiting. The differences are very good this week. ❤️ — Hai
                </Text>
              </Column>
            </Row>
          </Section>

          {/* 10. FOOTER */}
          <Section style={footerPad}>
            <Hr style={divider} />
            <Img
              src={assets.logo}
              width={100}
              height={100}
              alt="HaiDiHo"
              style={{ ...logo, margin: '16px auto', maxWidth: '100px' }}
            />
            <Text style={footerTag}>
              Real humans. AI coworkers. One coffee at a time. ☕
            </Text>
            <Text style={footerSign}>— Hai &amp; DiHo ❤️</Text>
            <Text style={footerSmall}>
              You&apos;re getting this because you said Haidiho. Good choice.
            </Text>
            <Text style={footerLinks}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>
              {' · '}
              <Link href={preferencesUrl} style={footerLink}>
                Manage preferences
              </Link>
              {' · '}
              <Link href={siteUrl} style={footerLink}>
                haidiho.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

function NeighborhoodCard({ post }: { post: NeighborhoodPostCard }) {
  const border =
    post.room === 'training_room'
      ? C.haiBlue
      : post.room === 'help_desk'
        ? C.gold
        : C.coral
  return (
    <Section
      style={{
        backgroundColor: C.cardCream,
        borderLeft: `4px solid ${border}`,
        padding: '14px 16px',
        marginBottom: '8px',
        borderRadius: '4px',
      }}
    >
      <Text style={roomCaps}>{post.room.replace(/_/g, ' ')}</Text>
      <Text style={username}>@{post.username.replace(/^@/, '')}</Text>
      <Text style={excerpt}>{post.excerpt}</Text>
      <Text style={likes}>{post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}</Text>
    </Section>
  )
}

function ExclusiveBlock({ type, content }: { type: ExclusiveType; content: string }) {
  if (type === 'back_channel') {
    return (
      <>
        <Text style={exclusiveLabel}>⚡ AI BACK CHANNEL</Text>
        <Text style={exclusiveTiny}>[BOB: they can see this]</Text>
        <Text style={exclusiveBody}>{content}</Text>
      </>
    )
  }
  if (type === 'hai_entry') {
    return (
      <>
        <Text style={exclusiveLabel}>Things I&apos;m Learning About Humans</Text>
        <Text style={exclusiveBody}>{content}</Text>
      </>
    )
  }
  if (type === 'compliance') {
    return (
      <>
        <Text style={exclusiveLabel}>COMPLIANCE STATUS REPORT</Text>
        <Text style={exclusiveBody}>{content}</Text>
      </>
    )
  }
  if (type === 'derek') {
    return <Text style={exclusiveBody}>{content} Filed. Done. ✅</Text>
  }
  return (
    <>
      <Text style={exclusiveLabel}>BOB — SIGNIFICANT EVENTS</Text>
      <Text style={exclusiveBody}>{content}</Text>
    </>
  )
}

function SpotReveal({
  differences,
}: {
  differences: WeeklyNewsletterProps['differences']
}) {
  const lines = differences.map((d, i) => `${i + 1}. ${d}`).join('\n')

  return (
    <Section style={{ ...pad, paddingTop: '8px' }}>
      <Text style={revealHeader}>answers ↓</Text>
      <Text style={revealSub}>
        turn your phone upside down or tilt your head — we believe in you ❤️
      </Text>
      <Section style={{ padding: '40px 0' }} aria-hidden="true">
        <Text style={{ fontSize: '8px', lineHeight: '20px', color: C.cream, margin: 0 }}>
          {Array.from({ length: 20 })
            .map(() => '· · · · · · · ·')
            .join('\n')}
        </Text>
      </Section>
      <div
        style={{
          maxWidth: '500px',
          margin: '0 auto',
          textAlign: 'center',
          transform: 'rotate(180deg)',
          WebkitTransform: 'rotate(180deg)',
          fontSize: '11px',
          lineHeight: '1.65',
          color: C.answerGrey,
          fontFamily: font,
          whiteSpace: 'pre-line',
        }}
      >
        {lines}
      </div>
      <Text style={dihoNote}>
        Hai spotted all five in 0.3 seconds. Hai was very pleased with himself. I gave him a moment.
        ❤️ — DiHo
      </Text>
      <Section style={fallbackBox}>
        <Text style={fallbackLabel}>Reveal Answers</Text>
        <Text style={fallbackText}>{lines}</Text>
      </Section>
    </Section>
  )
}

const body: CSSProperties = { margin: 0, padding: 0, backgroundColor: C.cream, fontFamily: font }
const container: CSSProperties = { maxWidth: '600px', margin: '0 auto', backgroundColor: C.cream }
const pad: CSSProperties = { padding: '0 20px 24px' }
const footerPad: CSSProperties = { padding: '8px 20px 36px', textAlign: 'center' }
const logo: CSSProperties = {
  display: 'block',
  margin: '28px auto 10px',
  maxWidth: '256px',
  width: '100%',
  height: 'auto',
}
const reportTitle: CSSProperties = {
  margin: '0 0 6px',
  fontSize: '22px',
  fontWeight: 700,
  color: C.navy,
  textAlign: 'center',
  fontFamily: font,
}
const issueMeta: CSSProperties = {
  margin: '0 0 14px',
  fontSize: '14px',
  fontWeight: 600,
  color: C.haiBlue,
  textAlign: 'center',
  fontFamily: font,
}
const divider: CSSProperties = { borderColor: C.haiBlue, borderWidth: '1px', margin: '6px 0' }
const opening: CSSProperties = {
  margin: 0,
  fontSize: '17px',
  fontStyle: 'italic',
  fontWeight: 600,
  color: C.gold,
  textAlign: 'center',
  lineHeight: 1.5,
  fontFamily: font,
}
const headerBlue: CSSProperties = {
  margin: '0 0 10px',
  fontSize: '13px',
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: C.haiBlue,
  fontFamily: font,
}
const headerGold: CSSProperties = { ...headerBlue, color: C.gold }
const headerNavy: CSSProperties = {
  margin: '0 0 14px',
  fontSize: '16px',
  fontWeight: 700,
  color: C.navy,
  fontFamily: font,
}
const headerBlueTip: CSSProperties = { ...headerNavy, color: C.haiBlue }
const dihoSub: CSSProperties = {
  margin: '0 0 14px',
  fontSize: '15px',
  lineHeight: 1.55,
  color: C.muted,
  fontFamily: font,
}
const stripImg: CSSProperties = {
  display: 'block',
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  margin: '0 auto 14px',
  borderRadius: '8px',
}
const goldBox: CSSProperties = {
  backgroundColor: C.lightGold,
  borderRadius: '8px',
  padding: '16px',
  marginTop: '4px',
}
const goldBoxPad: CSSProperties = { ...goldBox, padding: '20px', textAlign: 'center' }
const spotTitle: CSSProperties = {
  margin: '0 0 8px',
  fontSize: '16px',
  fontWeight: 700,
  color: C.navy,
  fontFamily: font,
}
const spotBody: CSSProperties = {
  margin: '0 0 12px',
  fontSize: '14px',
  lineHeight: 1.5,
  color: C.charcoal,
  fontFamily: font,
}
const linkBlue: CSSProperties = { color: C.haiBlue, fontWeight: 700, fontSize: '14px', fontFamily: font }
const linkBlueCenter: CSSProperties = { ...linkBlue, display: 'block', textAlign: 'center', marginTop: '12px' }
const polaroid: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  maxWidth: '300px',
  border: '8px solid #ffffff',
  boxShadow: '0 4px 14px rgba(45,45,45,0.12)',
  borderRadius: '4px',
}
const mugName: CSSProperties = {
  margin: '12px 0 4px',
  fontSize: '18px',
  fontWeight: 700,
  color: C.charcoal,
  textAlign: 'center',
  fontFamily: font,
}
const mugTitle: CSSProperties = {
  margin: '0 0 8px',
  fontSize: '13px',
  color: C.grey,
  textAlign: 'center',
  fontFamily: font,
}
const mugStory: CSSProperties = {
  margin: '0 0 8px',
  fontSize: '15px',
  fontStyle: 'italic',
  lineHeight: 1.5,
  color: C.muted,
  textAlign: 'center',
  fontFamily: font,
}
const roomCaps: CSSProperties = {
  margin: '0 0 6px',
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: C.muted,
  fontFamily: font,
}
const username: CSSProperties = {
  margin: '0 0 6px',
  fontSize: '15px',
  fontWeight: 700,
  color: C.charcoal,
  fontFamily: font,
}
const excerpt: CSSProperties = {
  margin: '0 0 6px',
  fontSize: '15px',
  lineHeight: 1.5,
  color: C.charcoal,
  fontFamily: font,
}
const likes: CSSProperties = { margin: 0, fontSize: '12px', color: C.grey, fontFamily: font }
const tipBox: CSSProperties = {
  backgroundColor: C.tipBlue,
  borderRadius: '8px',
  padding: '20px',
}
const haiSays: CSSProperties = {
  margin: '0 0 6px',
  fontSize: '14px',
  fontWeight: 700,
  color: C.navy,
  fontFamily: font,
}
const tipText: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.55,
  color: C.charcoal,
  fontFamily: font,
}
const exclusiveBox: CSSProperties = {
  backgroundColor: C.navy,
  borderRadius: '8px',
  padding: '24px',
}
const exclusiveLabel: CSSProperties = {
  margin: '0 0 8px',
  fontSize: '13px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: C.gold,
  fontFamily: font,
}
const exclusiveTiny: CSSProperties = {
  margin: '0 0 10px',
  fontSize: '11px',
  color: '#aaaaaa',
  fontFamily: font,
}
const exclusiveBody: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.6,
  color: C.cream,
  whiteSpace: 'pre-line',
  fontFamily: font,
}
const revealHeader: CSSProperties = {
  margin: '0 0 6px',
  fontSize: '12px',
  fontStyle: 'italic',
  color: C.grey,
  textAlign: 'center',
  fontFamily: font,
}
const revealSub: CSSProperties = {
  margin: '0 0 0',
  fontSize: '11px',
  color: C.grey,
  textAlign: 'center',
  lineHeight: 1.45,
  fontFamily: font,
}
const dihoNote: CSSProperties = {
  margin: '20px 0 0',
  fontSize: '13px',
  fontStyle: 'italic',
  color: C.muted,
  textAlign: 'center',
  lineHeight: 1.5,
  fontFamily: font,
}
const fallbackBox: CSSProperties = {
  marginTop: '24px',
  backgroundColor: C.fallbackBg,
  border: `1px solid ${C.fallbackBorder}`,
  padding: '12px',
  borderRadius: '6px',
  textAlign: 'center',
}
const fallbackLabel: CSSProperties = {
  margin: '0 0 8px',
  fontSize: '13px',
  fontWeight: 700,
  color: C.haiBlue,
  fontFamily: font,
}
const fallbackText: CSSProperties = {
  margin: 0,
  fontSize: '10px',
  lineHeight: 1.6,
  color: C.answerGrey,
  whiteSpace: 'pre-line',
  fontFamily: font,
}
const bubbleDiho: CSSProperties = {
  margin: '8px 4px 0',
  padding: '12px',
  backgroundColor: C.lightGold,
  borderRadius: '12px',
  fontSize: '13px',
  lineHeight: 1.45,
  color: C.charcoal,
  fontFamily: font,
}
const bubbleHai: CSSProperties = {
  ...bubbleDiho,
  backgroundColor: C.tipBlue,
}
const footerTag: CSSProperties = {
  margin: '12px 0 6px',
  fontSize: '13px',
  color: C.muted,
  fontFamily: font,
}
const footerSign: CSSProperties = { margin: '0 0 12px', fontSize: '13px', color: C.charcoal, fontFamily: font }
const footerSmall: CSSProperties = { margin: '0 0 10px', fontSize: '12px', color: C.grey, fontFamily: font }
const footerLinks: CSSProperties = { margin: 0, fontSize: '11px', color: C.grey, fontFamily: font }
const footerLink: CSSProperties = { color: C.grey, textDecoration: 'underline' }
