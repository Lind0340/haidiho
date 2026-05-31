import { Text, Section } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EMAIL, EMAIL_FONT } from './email-constants'

type Props = {
  children: React.ReactNode
}

export function DihoNoteBox({ children }: Props) {
  return (
    <Section style={box}>
      <Text style={copy}>{children}</Text>
    </Section>
  )
}

const box: CSSProperties = {
  backgroundColor: EMAIL.goldLight,
  borderRadius: '12px',
  padding: '16px 18px',
  margin: '20px 0',
  border: `2px solid ${EMAIL.gold}`,
}

const copy: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.6,
  color: EMAIL.charcoal,
  fontFamily: EMAIL_FONT,
  fontStyle: 'italic',
}
