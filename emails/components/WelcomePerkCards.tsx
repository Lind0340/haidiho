import { Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EMAIL, EMAIL_FONT } from './email-constants'

/** Exact welcome-email bullet copy — icon + name + one line per item. */
const PERKS = [
  {
    icon: '📰',
    title: 'The latest strip',
    line: '(newsletter version has something the site version doesn\u2019t \u2014 just saying)',
    bg: '#E8F4FC',
    border: '#A8D4F0',
  },
  {
    icon: '☕',
    title: 'The mug of the week',
    line: null,
    bg: '#FFF9E6',
    border: '#F5E6A8',
  },
  {
    icon: '📌',
    title: 'Best stories from the board',
    line: null,
    bg: '#FFE8E0',
    border: '#FFB8A8',
  },
  {
    icon: '💡',
    title: 'A practical tip from Hai',
    line: null,
    bg: '#E8F2FC',
    border: '#B8D4F0',
  },
  {
    icon: '⭐',
    title: 'Something exclusive just for subscribers',
    line: null,
    bg: '#FCE4EC',
    border: '#F5B8CC',
  },
] as const

export function WelcomePerkCards() {
  return (
    <Section style={{ margin: '16px 0 20px' }}>
      {PERKS.map((perk) => (
        <Section
          key={perk.title}
          style={{
            ...card,
            backgroundColor: perk.bg,
            border: `1px solid ${perk.border}`,
          }}
        >
          <table role="presentation" cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={iconCell}>
                  <Text style={icon}>{perk.icon}</Text>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <Text style={title}>{perk.title}</Text>
                  {perk.line ? <Text style={line}>{perk.line}</Text> : null}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
      ))}
    </Section>
  )
}

const card: CSSProperties = {
  borderRadius: '12px',
  padding: '12px 14px',
  marginBottom: '10px',
  boxShadow: EMAIL.cardShadow,
}

const iconCell: CSSProperties = {
  width: 44,
  verticalAlign: 'top',
  paddingRight: 10,
}

const icon: CSSProperties = {
  margin: 0,
  fontSize: '26px',
  lineHeight: 1.1,
  textAlign: 'center',
}

const title: CSSProperties = {
  margin: '0 0 4px',
  fontSize: '15px',
  fontWeight: 700,
  color: EMAIL.navy,
  fontFamily: EMAIL_FONT,
  lineHeight: 1.3,
}

const line: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.5,
  color: EMAIL.muted,
  fontFamily: EMAIL_FONT,
}
