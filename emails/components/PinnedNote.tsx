import { Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EMAIL, EMAIL_FONT } from './email-constants'

type Props = {
  label?: string
  children: React.ReactNode
  variant?: 'post' | 'reply'
  tag?: string
}

export function PinnedNote({ label, children, variant = 'post', tag }: Props) {
  const tilt = variant === 'reply' ? '1.5deg' : '-1.2deg'
  const bg = variant === 'reply' ? EMAIL.noteReply : EMAIL.noteCream

  return (
    <Section
      style={{
        ...note,
        backgroundColor: bg,
        transform: `rotate(${tilt})`,
      }}
    >
      {label ? <Text style={labelStyle}>{label}</Text> : null}
      {tag ? <Text style={tagStyle}>{tag}</Text> : null}
      <Text style={body}>{children}</Text>
    </Section>
  )
}

const note: CSSProperties = {
  borderRadius: '8px',
  border: `1px solid ${EMAIL.divider}`,
  boxShadow: EMAIL.cardShadow,
  padding: '14px 16px',
  margin: '12px 0 16px',
}

const labelStyle: CSSProperties = {
  margin: '0 0 6px',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: EMAIL.grey,
  fontFamily: EMAIL_FONT,
}

const tagStyle: CSSProperties = {
  margin: '0 0 8px',
  fontSize: '13px',
  fontWeight: 800,
  color: EMAIL.haiBlue,
  fontFamily: EMAIL_FONT,
}

const body: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.55,
  color: EMAIL.charcoal,
  fontFamily: EMAIL_FONT,
}
