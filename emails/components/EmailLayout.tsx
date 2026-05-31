import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { CSSProperties } from 'react'
import {
  EMAIL,
  EMAIL_FONT,
  bodyStyle,
  contentPad,
  getEmailAssets,
  outerContainer,
} from './email-constants'

type FooterVariant = 'standard' | 'minimal'

type Props = {
  siteUrl: string
  preview: string
  children: React.ReactNode
  footerVariant?: FooterVariant
  showUnsubscribe?: boolean
  unsubscribeUrl?: string
  /** Coffee + heart accent above the sign-off (welcome email). */
  footerAccent?: boolean
}

export function EmailLayout({
  siteUrl,
  preview,
  children,
  footerVariant = 'standard',
  showUnsubscribe = false,
  unsubscribeUrl,
  footerAccent = false,
}: Props) {
  const assets = getEmailAssets()
  const minimal = footerVariant === 'minimal'

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={outerContainer}>
          <Section style={contentPad}>
            <Img
              src={assets.logo}
              width={assets.logoWidth}
              height={assets.logoHeight}
              alt="HaiDiHo — real humans, AI coworkers"
              style={logo}
            />
            <Hr style={divider} />
          </Section>

          <Section style={{ padding: '0 20px 8px' }}>{children}</Section>

          <Section style={{ padding: minimal ? '16px 20px 28px' : '20px 20px 32px' }}>
            {!minimal && (
              <>
                {footerAccent ? (
                  <Section style={footerAccentWrap}>
                    <Text style={footerAccentIcons} aria-hidden>
                      ☕&nbsp;&nbsp;❤️&nbsp;&nbsp;☕
                    </Text>
                  </Section>
                ) : null}
                <Text style={footerTagline}>
                  Real humans. AI coworkers.
                  <br />
                  One coffee at a time. ☕
                </Text>
                <Text style={footerSign}>— Hai &amp; DiHo ❤️</Text>
              </>
            )}
            {showUnsubscribe && unsubscribeUrl ? (
              <Text style={footerLinks}>
                <Link href={unsubscribeUrl} style={link}>
                  Unsubscribe
                </Link>
                {' · '}
                <Link href={assets.site} style={link}>
                  haidiho.com
                </Link>
              </Text>
            ) : (
              <Text style={footerLinks}>
                <Link href={assets.site} style={link}>
                  haidiho.com
                </Link>
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const logo: CSSProperties = {
  display: 'block',
  margin: '0 auto 12px',
  maxWidth: '256px',
  width: '100%',
  height: 'auto',
}

const divider: CSSProperties = {
  borderColor: EMAIL.haiBlue,
  borderWidth: '2px 0 0',
  margin: '0 0 8px',
  opacity: 0.35,
}

const footerTagline: CSSProperties = {
  margin: '0 0 8px',
  fontSize: '14px',
  lineHeight: 1.55,
  color: EMAIL.charcoal,
  textAlign: 'center',
  fontFamily: EMAIL_FONT,
}

const footerSign: CSSProperties = {
  margin: '0 0 16px',
  fontSize: '14px',
  fontWeight: 700,
  color: EMAIL.navy,
  textAlign: 'center',
  fontFamily: EMAIL_FONT,
}

const footerLinks: CSSProperties = {
  margin: 0,
  fontSize: '12px',
  color: EMAIL.grey,
  textAlign: 'center',
  fontFamily: EMAIL_FONT,
}

const link: CSSProperties = {
  color: EMAIL.haiBlue,
  textDecoration: 'underline',
}

const footerAccentWrap: CSSProperties = {
  textAlign: 'center',
  margin: '0 auto 12px',
  padding: '10px 16px',
  backgroundColor: EMAIL.goldLight,
  borderRadius: '999px',
  border: `1px solid ${EMAIL.gold}55`,
  maxWidth: '200px',
}

const footerAccentIcons: CSSProperties = {
  margin: 0,
  fontSize: '20px',
  lineHeight: 1.2,
  letterSpacing: '0.15em',
  fontFamily: EMAIL_FONT,
}
