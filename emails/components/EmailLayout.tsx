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
}

export function EmailLayout({
  siteUrl,
  preview,
  children,
  footerVariant = 'standard',
  showUnsubscribe = false,
  unsubscribeUrl,
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
              width={200}
              height={69}
              alt="Haidiho"
              style={logo}
            />
            <Hr style={divider} />
          </Section>

          <Section style={{ padding: '0 20px 8px' }}>{children}</Section>

          <Section style={{ padding: minimal ? '16px 20px 28px' : '20px 20px 32px' }}>
            {!minimal && (
              <>
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
  margin: '0 auto 16px',
  maxWidth: '200px',
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
