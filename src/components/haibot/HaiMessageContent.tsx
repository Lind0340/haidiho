import { Fragment, type ReactNode } from 'react'

type HaiMessageContentProps = {
  content: string
}

/** **bold** and *emphasis* from the model → visible bold (no literal asterisks). */
function parseInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const emphasized = match[1] ?? match[2]
    parts.push(
      <strong key={key++} className="font-bold">
        {emphasized}
      </strong>,
    )
    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

function isBulletBlock(block: string) {
  const lines = block.split('\n').filter((line) => line.trim())
  return lines.length > 0 && lines.every((line) => /^[-•*]\s+/.test(line.trim()))
}

function Paragraph({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <p>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {parseInline(line)}
        </Fragment>
      ))}
    </p>
  )
}

function splitIntoBlocks(content: string) {
  if (content.includes('\n\n')) {
    return content.split(/\n\n+/).map((b) => b.trim()).filter(Boolean)
  }
  if (content.includes('\n')) {
    return content.split('\n').map((b) => b.trim()).filter(Boolean)
  }
  return [content.trim()].filter(Boolean)
}

export function HaiMessageContent({ content }: HaiMessageContentProps) {
  const blocks = splitIntoBlocks(content)

  if (blocks.length === 0) return null

  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        if (isBulletBlock(block)) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-4">
              {block
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, lineIndex) => {
                  const body = line.replace(/^[-•*]\s+/, '')
                  return <li key={`${i}-${lineIndex}`}>{parseInline(body)}</li>
                })}
            </ul>
          )
        }

        return <Paragraph key={i} text={block} />
      })}
    </div>
  )
}
