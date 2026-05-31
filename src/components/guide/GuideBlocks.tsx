import { GuideAvatar } from '@/components/guide/GuideAvatar'
import type { GuideBlock, GuideCalloutLine, GuideCharacter, GuideDialogueLine } from '@/lib/guide/types'
import {
  GUIDE_BEAT,
  GUIDE_DIHO_VOICE,
  GUIDE_OPENER,
  GUIDE_PAREN,
  GUIDE_SECTION,
  isGuideOpener,
  isGuideParenAside,
  isGuidePunchline,
  isGuideSectionHeader,
} from '@/components/guide/guide-typography'
import { GuideTemplateBox } from '@/components/guide/GuideTemplateBox'
import { cn } from '@/lib/utils'

const CALLOUT_STYLES: Record<
  GuideCharacter,
  { bg: string; border: string; label: string; spoken: string }
> = {
  hai: {
    bg: 'bg-hai-blue/12',
    border: 'border-hai-blue/35',
    label: 'text-hai-blue-dark',
    spoken: 'text-hai-blue-dark',
  },
  diho: {
    bg: 'bg-accent-gold/15',
    border: 'border-accent-gold/45',
    label: 'text-[#9a6b12]',
    spoken: 'text-soft-charcoal',
  },
  bob: {
    bg: 'bg-[#e8e0d4]',
    border: 'border-[#a89888]/60',
    label: 'text-soft-charcoal',
    spoken: 'text-soft-charcoal',
  },
  derek: {
    bg: 'bg-[#ede4d4]',
    border: 'border-[#9a7b4f]/45',
    label: 'text-[#5c4a2a]',
    spoken: 'text-[#5c4a2a]',
  },
  trisha: {
    bg: 'bg-warm-pink/12',
    border: 'border-warm-pink/40',
    label: 'text-warm-pink',
    spoken: 'text-soft-charcoal',
  },
  compliance: {
    bg: 'bg-[#e8ebf0]',
    border: 'border-[#b8bec8]',
    label: 'text-soft-charcoal/70',
    spoken: 'text-soft-charcoal',
  },
}

function CharacterAvatar({ character }: { character: GuideCharacter }) {
  if (character === 'hai') {
    return <GuideAvatar character="hai" size="lg" borderClassName="border-2 border-white" />
  }
  if (character === 'diho') {
    return <GuideAvatar character="diho" size="lg" borderClassName="border-2 border-white" />
  }
  if (character === 'bob') {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-accent-gold/50 bg-[#fff6e8] text-xs font-extrabold shadow-sm">
        BOB
      </div>
    )
  }
  if (character === 'derek') {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#9a7b4f]/40 bg-[#e8dcc8] text-lg shadow-sm">
        👓
      </div>
    )
  }
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-warm-pink/40 bg-diho-cream text-lg shadow-sm">
      ❤️
    </div>
  )
}

function RichLine({ text, className }: { text: string; className?: string }) {
  const segments: { spoken: boolean; text: string }[] = []
  const re = /"([^"]+)"/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segments.push({ spoken: false, text: text.slice(last, m.index) })
    segments.push({ spoken: true, text: m[1] ?? '' })
    last = m.index + m[0].length
  }
  if (last < text.length) segments.push({ spoken: false, text: text.slice(last) })

  if (segments.length === 0) {
    const trimmed = text.trim()
    const fullQuote = trimmed.match(/^["'](.+)["']\.?$/)
    if (fullQuote) {
      return (
        <span className={cn('italic font-semibold', className)}>
          &ldquo;{fullQuote[1]}&rdquo;
        </span>
      )
    }
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.spoken ? (
          <em key={i} className="font-semibold italic text-inherit">
            &ldquo;{seg.text}&rdquo;
          </em>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </span>
  )
}

function CalloutLine({ line, spokenClass }: { line: GuideCalloutLine; spokenClass: string }) {
  switch (line.kind) {
    case 'spoken':
      return (
        <p className={cn('text-xl font-semibold leading-snug sm:text-2xl', spokenClass)}>
          <span className="italic">&ldquo;{line.text}&rdquo;</span>
        </p>
      )
    case 'tag':
      return (
        <p className="font-[family-name:var(--font-hand)] text-xl font-bold leading-none text-soft-charcoal sm:text-2xl">
          {line.text}
        </p>
      )
    case 'narration':
    default:
      return (
        <p className="text-sm font-medium leading-relaxed text-soft-charcoal/75">{line.text}</p>
      )
  }
}

function DialogueTurn({ line }: { line: GuideDialogueLine }) {
  const isSpoken = line.kind !== 'narration'
  const label = line.speaker === 'diho' ? 'DiHo' : 'Hai'
  const labelClass = line.speaker === 'diho' ? 'text-accent-gold' : 'text-diho-cream'

  return (
    <p className="leading-[1.65]">
      <span className={cn('font-extrabold', labelClass)}>{label}: </span>
      <span className={cn(isSpoken && 'italic font-medium')}>
        {isSpoken ? <>&ldquo;{line.text}&rdquo;</> : line.text}
      </span>
    </p>
  )
}

function ParagraphLine({ line }: { line: string }) {
  const trimmed = line.trim()
  if (!trimmed) return null

  if (isGuideOpener(trimmed)) {
    return <p className={cn(GUIDE_OPENER, 'mb-1 mt-1')}>{trimmed}</p>
  }
  if (isGuideParenAside(trimmed)) {
    return <p className={cn(GUIDE_PAREN, 'my-4')}>{trimmed}</p>
  }
  if (isGuidePunchline(trimmed)) {
    return (
      <p className={cn(GUIDE_BEAT, 'guide-marker-highlight my-7')}>
        {trimmed}
      </p>
    )
  }

  return (
    <p className="font-medium">
      <RichLine text={line} />
    </p>
  )
}

function ParagraphBody({ part }: { part: string }) {
  const lines = part.split('\n').filter((l) => l.trim())

  return (
    <div className="space-y-4">
      {lines.map((line, j) => (
        <ParagraphLine key={j} line={line} />
      ))}
    </div>
  )
}

function Paragraph({ text }: { text: string }) {
  if (isGuideSectionHeader(text)) {
    return <h3 className={cn(GUIDE_SECTION, 'mt-10 mb-3 first:mt-0')}>{text}</h3>
  }

  const parts = text.split(/\n\n+/)
  return (
    <div className={cn(GUIDE_DIHO_VOICE, 'space-y-5')}>
      {parts.map((part, i) => {
        const sectionMatch = part.match(/^(ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN):[^\n]*/i)
        if (sectionMatch && part.length > sectionMatch[0].length) {
          const header = sectionMatch[0].trim()
          const rest = part.slice(sectionMatch[0].length).replace(/^\n+/, '')
          return (
            <div key={i} className="space-y-4">
              <h3 className={GUIDE_SECTION}>{header}</h3>
              {rest ? <ParagraphBody part={rest} /> : null}
            </div>
          )
        }

        return <ParagraphBody key={i} part={part} />
      })}
    </div>
  )
}

export function GuideBlocks({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="mx-auto max-w-[44rem] space-y-8 pl-0 text-left after:clear-both after:block after:content-[''] sm:pl-2 lg:pl-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <div key={i} className="clear-both">
                <Paragraph text={block.text} />
              </div>
            )
          case 'hai_note':
            return (
              <aside
                key={i}
                className={cn(
                  'guide-hai-note relative my-10 w-full rounded-2xl bg-hai-blue p-4 text-diho-cream shadow-[4px_6px_0_rgba(30,64,175,0.22),0_10px_24px_rgba(74,144,217,0.28)]',
                  'sm:p-5',
                  'lg:-mr-2 lg:ml-auto lg:max-w-[min(100%,320px)] lg:rotate-[0.6deg]',
                  'xl:float-right xl:clear-right xl:mb-8 xl:ml-8',
                )}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <GuideAvatar
                    character="hai"
                    size="sm"
                    borderClassName="border-2 border-white/70"
                    className="bg-white/25"
                  />
                  <span className="text-xs font-extrabold uppercase tracking-wide text-diho-cream/95">
                    Hai&apos;s Note ❤️
                  </span>
                </div>
                <div className="space-y-2.5 text-[15px] font-semibold">
                  {block.lines.map((line, j) => (
                    <DialogueTurn key={j} line={line} />
                  ))}
                </div>
              </aside>
            )
          case 'aside':
            return (
              <blockquote
                key={i}
                className="my-8 rounded-r-xl border-l-4 border-accent-gold bg-accent-gold/[0.1] py-4 pl-5 pr-3 text-left italic"
              >
                <div className={cn(GUIDE_DIHO_VOICE, 'space-y-4 font-medium text-soft-charcoal/90')}>
                  {block.text.split('\n\n').map((p, j) => (
                    <p key={j}>
                      <RichLine text={p} />
                    </p>
                  ))}
                </div>
              </blockquote>
            )
          case 'callout': {
            const style = CALLOUT_STYLES[block.character]
            return (
              <div
                key={i}
                className={cn(
                  'my-10 flex w-full max-w-none gap-4 rounded-xl p-5 shadow-[0_4px_18px_rgba(45,45,45,0.07)] sm:gap-5 sm:p-6',
                  style.bg,
                )}
              >
                <CharacterAvatar character={block.character} />
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm font-extrabold whitespace-pre-line', style.label)}>
                    {block.title}
                  </p>
                  <div className="mt-4 space-y-3">
                    {block.lines.map((line, j) => (
                      <CalloutLine key={j} line={line} spokenClass={style.spoken} />
                    ))}
                  </div>
                  {block.footer && (
                    <p className="mt-5 font-[family-name:var(--font-hand)] text-xl font-bold leading-none text-soft-charcoal sm:text-2xl">
                      {block.footer}
                    </p>
                  )}
                </div>
              </div>
            )
          }
          case 'template':
            return (
              <div key={i} className="clear-both">
                <GuideTemplateBox content={block.content} />
              </div>
            )
          case 'water_cooler':
            return (
              <article
                key={i}
                className="my-10 w-full rounded-r-xl border-l-4 border-l-warm-pink bg-warm-pink/[0.09] py-4 pl-5 pr-3"
              >
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-warm-pink">
                  😂 From The Water Cooler
                </p>
                <p className={cn(GUIDE_DIHO_VOICE, 'mt-3 font-medium')}>
                  <span className="italic">&ldquo;{block.quote}&rdquo;</span>
                </p>
                <p className="mt-3 text-sm font-bold text-soft-charcoal/55">{block.author}</p>
              </article>
            )
          case 'transition':
            return (
              <div
                key={i}
                className={cn(
                  GUIDE_DIHO_VOICE,
                  'my-10 rounded-2xl bg-[#f5ebe0]/80 px-5 py-6 sm:px-6',
                )}
              >
                {block.text.split('\n\n').map((p, j) => {
                  const trimmed = p.trim()
                  const isCloser = /come on\.?\s*❤️?$/i.test(trimmed)
                  return (
                    <p
                      key={j}
                      className={cn(
                        j > 0 && 'mt-5',
                        isCloser && cn(GUIDE_BEAT, 'mt-6 text-hai-blue'),
                      )}
                    >
                      <RichLine text={p} />
                    </p>
                  )
                })}
              </div>
            )
          case 'illustration':
            return (
              <figure
                key={i}
                className="my-8 overflow-hidden rounded-xl bg-[#f5ebe0]/90 px-4 py-6 text-center"
              >
                <p className="font-[family-name:var(--font-hand)] text-lg font-semibold text-soft-charcoal/75">
                  {block.caption}
                </p>
              </figure>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
