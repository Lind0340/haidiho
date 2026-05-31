import { Button } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EMAIL, EMAIL_FONT } from './email-constants'

type Variant = 'hai' | 'gold'

type Props = {
  href: string
  children: React.ReactNode
  variant?: Variant
}

export function EmailButton({ href, children, variant = 'hai' }: Props) {
  const isGold = variant === 'gold'
  const style: CSSProperties = {
    backgroundColor: isGold ? EMAIL.gold : EMAIL.haiBlue,
    color: isGold ? EMAIL.navy : EMAIL.cream,
    padding: '14px 28px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '16px',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: EMAIL_FONT,
    lineHeight: 1.2,
    boxShadow: isGold ? '0 4px 0 rgba(154, 107, 18, 0.35)' : '0 6px 0 rgba(30, 64, 175, 0.35)',
  }

  return (
    <Button href={href} style={style}>
      {children}
    </Button>
  )
}
