import { Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { EMAIL, EMAIL_FONT } from './email-constants'

const PERKS = [
  {
    icon: '📰',
    title: 'The latest strip',
    line: 'The weekly cartoon — plus a newsletter edition with Spot the Difference the site version doesn\u2019t. (Just saying.)',
    bg: '#E8F4FC',
    border: '#A8D4F0',
  },
  {
    icon: '☕',
    title: 'The mug of the week',
    line: 'One real mug from the wall, one real human behind it — name, story, and what they\u2019re drinking through.',
    bg: '#FFF9E6',
    border: '#F5E6A8',
  },
  {
    icon: '📌',
    title: 'Best stories from the board',
    line: 'Hand-picked posts from the neighborhood — questions, wins, and the kind of honest mess we all recognize.',
    bg: '#FFE8E0',
    border: '#FFB8A8',
  },
  {
    icon: '💡',
    title: 'A practical tip from Hai',
    line: 'One short AI tip that might actually help your week. Useful. Occasionally delivered at full enthusiasm.',
    bg: '#E8F2FC',
    border: '#B8D4F0',
  },
  {
    icon: '⭐',
    title: 'Something exclusive just for subscribers',
    line: 'Extras you won\u2019t find on the site — bonus art, deeper notes, and the good stuff we save for this list.',
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
                  <Text style={line}>{perk.line}</Text>
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
  fontSize: '14px',
  lineHeight: 1.55,
  color: '#4a4a4a',
  fontFamily: EMAIL_FONT,
}
