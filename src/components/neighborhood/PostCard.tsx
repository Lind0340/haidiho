'use client'

import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { CharacterResponseCard } from '@/components/neighborhood/CharacterResponseCard'
import {
  formatPostTime,
  getRoom,
  type NeighborhoodPost,
} from '@/lib/neighborhood-data'

type Props = {
  post: NeighborhoodPost
  liked: boolean
  onLike: () => void
  onReply: (postId: string, content: string) => void
  /** Hide room badge when viewing a single-room feed */
  hideRoomBadge?: boolean
}

export function PostCard({ post, liked, onLike, onReply, hideRoomBadge }: Props) {
  const room = getRoom(post.room)
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [comments, setComments] = useState<
    { id: string; username: string; content: string; createdAt: string }[]
  >([])
  const [loadingComments, setLoadingComments] = useState(false)

  const loadComments = useCallback(async () => {
    setLoadingComments(true)
    const res = await fetch(`/api/neighborhood/comments?postId=${post.id}`)
    const data = await res.json()
    setComments(data.comments ?? [])
    setLoadingComments(false)
  }, [post.id])

  const toggleComments = () => {
    if (!showReply && comments.length === 0) loadComments()
    setShowReply((v) => !v)
  }

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(post.id, replyText.trim())
    setReplyText('')
  }

  return (
    <article className="rounded-[18px] border border-[#ead8c2] bg-[#fff6e8] p-4 shadow-[0_6px_16px_rgba(45,45,45,0.06)] sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        {!hideRoomBadge && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-extrabold',
              room.tagClass,
            )}
          >
            <span aria-hidden>{room.emoji}</span>
            {room.name}
          </span>
        )}
        {post.status === 'pending' && (
          <span className="rounded-full bg-accent-gold/25 px-2 py-0.5 text-xs font-bold text-[#9a6b12]">
            In review
          </span>
        )}
        <time className="ml-auto text-xs font-semibold text-soft-charcoal/55">
          {formatPostTime(post.createdAt)}
        </time>
      </div>

      <p className="mt-3 font-bold text-soft-charcoal">{post.username}</p>
      <p className="mt-1 text-sm font-medium leading-relaxed text-soft-charcoal/90 sm:text-base">
        {post.content}
      </p>

      {post.characterResponses?.map((r) => (
        <CharacterResponseCard key={r.id} response={r} />
      ))}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#ead8c2]/70 pt-3">
        <button
          type="button"
          onClick={onLike}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-bold transition-colors',
            liked
              ? 'text-warm-pink'
              : 'text-soft-charcoal/70 hover:bg-warm-pink/10 hover:text-warm-pink',
          )}
        >
          <span aria-hidden>{liked ? '❤️' : '🤍'}</span>
          {Math.max(0, post.likes)}
        </button>
        <button
          type="button"
          onClick={toggleComments}
          className="text-sm font-semibold text-soft-charcoal/55 hover:text-hai-blue"
        >
          💬 {post.commentsCount}
        </button>
        <button
          type="button"
          onClick={toggleComments}
          className="ml-auto rounded-lg px-3 py-1 text-sm font-bold text-hai-blue hover:bg-hai-blue/10"
        >
          Reply
        </button>
      </div>

      {showReply && (
        <div className="mt-3 border-t border-[#ead8c2]/50 pt-3">
          {loadingComments ? (
            <p className="text-xs text-soft-charcoal/50">Loading replies…</p>
          ) : (
            <ul className="mb-3 space-y-2">
              {comments.map((c) => (
                <li key={c.id} className="text-sm">
                  <span className="font-bold">{c.username}</span>{' '}
                  <span className="text-soft-charcoal/85">{c.content}</span>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={submitReply} className="flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add a reply…"
              className="flex-1 rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-hai-blue px-3 py-2 text-sm font-bold text-diho-cream"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </article>
  )
}
