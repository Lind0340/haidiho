import { CharacterAvatar } from '@/components/neighborhood/CharacterAvatar'
import { NEIGHBORHOOD_CHARACTERS } from '@/lib/characters'
import { formatPostTime, type CharacterResponseView } from '@/lib/neighborhood-data'
import { cn } from '@/lib/utils'

type Props = {
  response: CharacterResponseView
  className?: string
}

export function CharacterResponseCard({ response, className }: Props) {
  const meta = NEIGHBORHOOD_CHARACTERS[response.character]

  return (
    <div
      className={cn(
        'mt-4 rounded-[14px] p-3.5 sm:p-4',
        meta.cardClass,
        className,
      )}
    >
      <div className="flex gap-3">
        <CharacterAvatar character={response.character} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-[family-name:var(--font-hand)] text-lg font-bold text-soft-charcoal">
              {meta.name}
            </span>
            <span className="text-xs font-bold text-soft-charcoal/55">{meta.title}</span>
            <span className="ml-auto text-xs font-semibold text-soft-charcoal/45">
              {formatPostTime(response.createdAt)}
            </span>
          </div>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-soft-charcoal/90 sm:text-[15px]">
            {response.content}
          </p>
        </div>
      </div>
    </div>
  )
}
