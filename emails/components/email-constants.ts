import type { CSSProperties } from 'react'
import { getEmailLinkUrl, getEmailSiteUrl } from '@/lib/site-url'

/** Haidiho transactional email design tokens */
export const EMAIL = {
  cream: '#FFF8F0',
  navy: '#16284C',
  charcoal: '#2D2D2D',
  haiBlue: '#4A90D9',
  haiBlueDark: '#1E40AF',
  gold: '#F5A623',
  goldLight: '#FEF5E4',
  pink: '#FF6B8A',
  tipBlue: '#E8F2FC',
  bobBeige: '#F5EDE0',
  noteCream: '#F5F0E8',
  noteReply: '#EDE8DC',
  white: '#FFFFFF',
  muted: '#5c5c5c',
  grey: '#999999',
  divider: '#E8DCC8',
  shadow: '0 12px 32px rgba(22, 40, 76, 0.08)',
  cardShadow: '0 4px 16px rgba(45, 45, 45, 0.06)',
} as const

export const EMAIL_FONT = 'Arial, Helvetica, sans-serif'

/** Branded Hai & DiHo sticker logo (256×256) for email headers. */
export const EMAIL_LOGO = {
  file: 'haidiho-email-logo.png',
  width: 256,
  height: 256,
} as const

/** Absolute asset URLs for email clients — always a public origin, never localhost. */
export function getEmailAssets() {
  const base = getEmailSiteUrl()
  return {
    logo: `${base}/images/${EMAIL_LOGO.file}`,
    logoWidth: EMAIL_LOGO.width,
    logoHeight: EMAIL_LOGO.height,
    hai: `${base}/images/hai-there-chat-icon.png`,
    diho: `${base}/images/diho-there-chat-icon-v2.png`,
    site: getEmailLinkUrl(),
  }
}

export const bodyStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  backgroundColor: EMAIL.cream,
  fontFamily: EMAIL_FONT,
}

export const outerContainer: CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: EMAIL.cream,
}

export const contentPad: CSSProperties = {
  padding: '28px 20px 12px',
}

export const whiteCard: CSSProperties = {
  backgroundColor: EMAIL.white,
  borderRadius: '16px',
  border: `1px solid ${EMAIL.divider}`,
  boxShadow: EMAIL.shadow,
  padding: '28px 24px',
}

export const titleStyle: CSSProperties = {
  margin: '0 0 16px',
  fontSize: '26px',
  fontWeight: 700,
  lineHeight: 1.25,
  color: EMAIL.navy,
  fontFamily: EMAIL_FONT,
}

export const bodyText: CSSProperties = {
  margin: '0 0 14px',
  fontSize: '16px',
  lineHeight: 1.65,
  color: EMAIL.charcoal,
  fontFamily: EMAIL_FONT,
}

export const smallGrey: CSSProperties = {
  margin: '16px 0 0',
  fontSize: '13px',
  lineHeight: 1.55,
  color: EMAIL.grey,
  fontFamily: EMAIL_FONT,
}

export const goldItalic: CSSProperties = {
  margin: '0 0 18px',
  fontSize: '18px',
  lineHeight: 1.5,
  fontStyle: 'italic',
  fontWeight: 700,
  color: EMAIL.gold,
  fontFamily: EMAIL_FONT,
}

export function excerpt(text: string, max = 220) {
  const t = text.trim().replace(/\s+/g, ' ')
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

export function roomLabel(room: string) {
  const map: Record<string, string> = {
    water_cooler: 'Water Cooler',
    training_room: 'Training Room',
    help_desk: 'Help Desk',
  }
  return map[room] ?? room.replace(/_/g, ' ')
}
