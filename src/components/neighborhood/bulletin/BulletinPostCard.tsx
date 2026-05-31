'use client'

import type { NeighborhoodPost } from '@/lib/neighborhood-data'
import {
  cardNudge,
  cardRotation,
  cardTransformOrigin,
  cardSizeForPost,
  cardStyleForPost,
  displayFrom,
  indexPaperForPost,
  notebookPaperForPost,
  receiptPaperForPost,
  roomLabel,
  stickyColorForPost,
  postBodyForDisplay,
  truncateContent,
  type CardSize,
} from '@/lib/neighborhood-bulletin'
import { PushPin } from '@/components/neighborhood/bulletin/PushPin'
import { cn } from '@/lib/utils'

type Props = {
  post: NeighborhoodPost
  liked?: boolean
  dimmed?: boolean
  onOpen: () => void
  onLike: () => void
}

export function BulletinPostCard({ post, liked, dimmed, onOpen, onLike }: Props) {
  const style = cardStyleForPost(post.id)
  const size = cardSizeForPost(post.id, style)
  const rot = cardRotation(post.id)
  const nudge = cardNudge(post.id)
  const origin = cardTransformOrigin(post.id)
  const room = roomLabel(post.room)
  const { text, truncated } = truncateContent(postBodyForDisplay(post.content))

  return (
    <article
      className={cn(
        'relative min-w-0 cursor-pointer transition-opacity duration-300',
        dimmed && 'pointer-events-none opacity-30',
        !dimmed && 'opacity-100',
      )}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div
        className="bulletin-card-tilt relative mx-auto w-full"
        style={{
          ['--card-rot' as string]: `${rot}deg`,
          ['--card-tx' as string]: `${nudge.x}px`,
          ['--card-ty' as string]: `${nudge.y}px`,
          ['--card-origin' as string]: origin,
        }}
      >
        {post.isFeatured && (
          <span className="absolute -right-1 -top-1 z-10 text-lg drop-shadow" title="Featured">
            ⭐
          </span>
        )}

        {style === 'sticky' && (
          <StickyCard post={post} room={room} size={size} text={text} truncated={truncated} liked={liked} onLike={onLike} onOpen={onOpen} />
        )}
        {style === 'notebook' && (
          <NotebookCard post={post} room={room} size={size} text={text} truncated={truncated} liked={liked} onLike={onLike} onOpen={onOpen} />
        )}
        {style === 'index' && (
          <IndexCard post={post} room={room} size={size} text={text} truncated={truncated} liked={liked} onLike={onLike} onOpen={onOpen} />
        )}
        {style === 'receipt' && (
          <ReceiptCard post={post} room={room} size={size} text={text} truncated={truncated} liked={liked} onLike={onLike} onOpen={onOpen} />
        )}
      </div>
    </article>
  )
}

function CardFooter({
  likes,
  commentsCount,
  liked,
  onLike,
  onOpen,
}: {
  likes: number
  commentsCount: number
  liked?: boolean
  onLike: () => void
  onOpen: () => void
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs font-bold text-soft-charcoal/70">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onLike()
        }}
        className={cn('inline-flex items-center gap-1', liked && 'text-warm-pink')}
      >
        ❤️ {likes}
      </button>
      <span className="inline-flex items-center gap-1">💬 {commentsCount}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onOpen()
        }}
        className="ml-auto rounded-sm bg-white/70 px-1.5 py-0.5 font-[family-name:var(--font-caveat)] text-[11px] font-bold text-hai-blue shadow-sm"
      >
        Reply ↩
      </button>
    </div>
  )
}

function RoomTag({ room }: { room: ReturnType<typeof roomLabel> }) {
  return (
    <p className="font-sans text-[10px] font-extrabold uppercase tracking-wide" style={{ color: room.color }}>
      {room.emoji} {room.label}
    </p>
  )
}

function StickyCard({
  post,
  room,
  size,
  text,
  truncated,
  liked,
  onLike,
  onOpen,
}: {
  post: NeighborhoodPost
  room: ReturnType<typeof roomLabel>
  size: CardSize
  text: string
  truncated: boolean
  liked?: boolean
  onLike: () => void
  onOpen: () => void
}) {
  const c = stickyColorForPost(post.id)
  return (
    <div
      className={cn(
        'bulletin-sticky-texture relative mx-auto shadow-[3px_5px_14px_rgba(40,25,8,0.22)]',
        size === 'sm' && 'w-[70%] max-w-[142px] px-2.5 pb-3 pt-5 min-h-[105px]',
        size === 'md' && 'w-full max-w-[240px] px-3.5 pb-4 pt-5 min-h-[148px]',
        size === 'lg' && 'w-full px-5 pb-5 pt-6 min-h-[200px]',
      )}
      style={{ backgroundColor: c.bg }}
    >
      <PushPin color={c.pin} />
      <RoomTag room={room} />
      <p
        className={cn(
          'mt-1 font-[family-name:var(--font-caveat)] font-bold leading-tight text-[#2D2D2D]',
          size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg',
        )}
      >
        {displayFrom(post)}
      </p>
      <p
        className={cn(
          'mt-2 font-[family-name:var(--font-caveat)] leading-snug text-[#2D2D2D]',
          size === 'sm' && 'text-base',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl',
        )}
      >
        {text}
      </p>
      {truncated && <p className="mt-1 font-sans text-xs font-bold text-hai-blue">…read more</p>}
      <CardFooter
        likes={post.likes}
        commentsCount={post.commentsCount}
        liked={liked}
        onLike={onLike}
        onOpen={onOpen}
      />
    </div>
  )
}

function NotebookCard({
  post,
  room,
  size,
  text,
  truncated,
  liked,
  onLike,
  onOpen,
}: {
  post: NeighborhoodPost
  room: ReturnType<typeof roomLabel>
  size: CardSize
  text: string
  truncated: boolean
  liked?: boolean
  onLike: () => void
  onOpen: () => void
}) {
  const paper = notebookPaperForPost(post.id)
  return (
    <div
      className={cn(
        'relative w-full notebook-lines shadow-[4px_6px_16px_rgba(40,25,8,0.2)]',
        size === 'md' && 'px-4 pb-5 pt-5 min-h-[175px]',
        size === 'xl' && 'px-6 pb-7 pt-6 min-h-[270px]',
      )}
      style={{ backgroundColor: paper.bg, ['--notebook-line' as string]: paper.line }}
    >
      <PushPin color="#1565c0" />
      <div
        className="absolute bottom-0 left-0 right-0 h-4 opacity-90"
        style={{
          backgroundColor: paper.bg,
          clipPath:
            'polygon(0 50%, 3% 100%, 7% 55%, 11% 100%, 15% 60%, 19% 100%, 23% 50%, 27% 100%, 31% 65%, 35% 100%, 39% 55%, 43% 100%, 47% 70%, 51% 100%, 55% 50%, 59% 100%, 63% 60%, 67% 100%, 71% 55%, 75% 100%, 79% 65%, 83% 100%, 87% 50%, 91% 100%, 95% 70%, 100% 100%)',
        }}
      />
      <RoomTag room={room} />
      <p
        className={cn(
          'mt-1 font-[family-name:var(--font-caveat)] font-bold text-[#2D2D2D]',
          size === 'xl' ? 'text-xl' : 'text-lg',
        )}
      >
        {displayFrom(post)}
      </p>
      <p
        className={cn(
          'mt-2 font-[family-name:var(--font-caveat)] leading-relaxed text-[#2D2D2D]',
          size === 'xl' ? 'text-2xl' : 'text-xl',
        )}
      >
        {text}
      </p>
      {truncated && <p className="mt-1 font-sans text-xs font-bold text-hai-blue">…read more</p>}
      <CardFooter
        likes={post.likes}
        commentsCount={post.commentsCount}
        liked={liked}
        onLike={onLike}
        onOpen={onOpen}
      />
    </div>
  )
}

function IndexCard({
  post,
  room,
  size,
  text,
  truncated,
  liked,
  onLike,
  onOpen,
}: {
  post: NeighborhoodPost
  room: ReturnType<typeof roomLabel>
  size: CardSize
  text: string
  truncated: boolean
  liked?: boolean
  onLike: () => void
  onOpen: () => void
}) {
  const paper = indexPaperForPost(post.id)
  return (
    <div
      className={cn(
        'relative mx-auto index-lines shadow-[2px_4px_10px_rgba(40,25,8,0.15)]',
        size === 'sm' && 'w-[76%] max-w-[190px] px-3 pb-3 pt-5 min-h-[120px]',
        size === 'md' && 'w-full px-4 pb-4 pt-5 min-h-[165px]',
      )}
      style={{ backgroundColor: paper.bg, borderColor: paper.border, borderWidth: 1, borderStyle: 'solid' }}
    >
      <PushPin color="#6d4c41" />
      <RoomTag room={room} />
      <p className="mt-1 font-sans text-sm font-bold text-[#2D2D2D]">{displayFrom(post)}</p>
      <p className="mt-2 font-sans text-[13px] leading-relaxed text-[#2D2D2D]">{text}</p>
      {truncated && <p className="mt-1 font-sans text-xs font-bold text-hai-blue">…read more</p>}
      <CardFooter
        likes={post.likes}
        commentsCount={post.commentsCount}
        liked={liked}
        onLike={onLike}
        onOpen={onOpen}
      />
    </div>
  )
}

function ReceiptCard({
  post,
  room,
  size,
  text,
  truncated,
  liked,
  onLike,
  onOpen,
}: {
  post: NeighborhoodPost
  room: ReturnType<typeof roomLabel>
  size: CardSize
  text: string
  truncated: boolean
  liked?: boolean
  onLike: () => void
  onOpen: () => void
}) {
  const paper = receiptPaperForPost(post.id)
  return (
    <div
      className={cn(
        'relative mx-auto shadow-[2px_5px_10px_rgba(40,25,8,0.16)]',
        size === 'xs' && 'w-[58%] min-w-[118px] max-w-[138px] px-2.5 pb-3 pt-5 min-h-[95px]',
        size === 'sm' && 'w-[72%] min-w-[130px] max-w-[178px] px-3 pb-4 pt-5 min-h-[115px]',
      )}
      style={{
        backgroundColor: paper.bg,
        borderRadius: '2px 2px 4px 6px / 2px 2px 3px 5px',
      }}
    >
      <PushPin color={paper.pin} />
      <RoomTag room={room} />
      <p
        className={cn(
          'mt-1 font-[family-name:var(--font-caveat)] font-bold',
          size === 'xs' ? 'text-sm' : 'text-base',
        )}
      >
        {displayFrom(post)}
      </p>
      <p
        className={cn(
          'mt-2 font-[family-name:var(--font-caveat)] leading-snug',
          size === 'xs' ? 'text-sm' : 'text-[17px]',
        )}
      >
        {text}
      </p>
      {truncated && <p className="mt-1 font-sans text-xs font-bold text-hai-blue">…read more</p>}
      <CardFooter
        likes={post.likes}
        commentsCount={post.commentsCount}
        liked={liked}
        onLike={onLike}
        onOpen={onOpen}
      />
    </div>
  )
}
