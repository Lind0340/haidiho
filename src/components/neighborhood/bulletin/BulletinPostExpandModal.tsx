'use client'

import { useCallback, useEffect, useState } from 'react'
import { CharacterResponseCard } from '@/components/neighborhood/CharacterResponseCard'
import { PushPin } from '@/components/neighborhood/bulletin/PushPin'
import {
  cardRotation,
  cardStyleForPost,
  displayFrom,
  postBodyForDisplay,
  roomLabel,
  stickyColorForPost,
} from '@/lib/neighborhood-bulletin'
import { formatPostTime, type NeighborhoodPost } from '@/lib/neighborhood-data'
import { cn } from '@/lib/utils'

type Props = {
  post: NeighborhoodPost | null
  liked?: boolean
  onClose: () => void
  onLike: () => void
  onReply: (postId: string, content: string) => void
}

export function BulletinPostExpandModal({ post, liked, onClose, onLike, onReply }: Props) {
  const [replyText, setReplyText] = useState('')
  const [comments, setComments] = useState<
    { id: string; username: string; content: string; createdAt: string }[]
  >([])
  const [loadingComments, setLoadingComments] = useState(false)

  const loadComments = useCallback(async () => {
    if (!post) return
    setLoadingComments(true)
    const res = await fetch(`/api/neighborhood/comments?postId=${post.id}`)
    const data = await res.json()
    setComments(data.comments ?? [])
    setLoadingComments(false)
  }, [post])

  useEffect(() => {
    if (!post) return
    setReplyText('')
    void loadComments()
  }, [post, loadComments])

  useEffect(() => {
    if (!post) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [post, onClose])

  if (!post) return null

  const style = cardStyleForPost(post.id)
  const rot = cardRotation(post.id)
  const room = roomLabel(post.room)
  const sticky = stickyColorForPost(post.id)

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(post.id, replyText.trim())
    setReplyText('')
    void loadComments()
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#1a1208]/70 p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulletin-post-title"
    >
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div
        className="relative z-10 max-h-[min(92vh,100dvh)] w-full max-w-lg overflow-y-auto rounded-t-2xl sm:max-h-[92vh] sm:rounded-none"
        style={{ transform: `rotate(${Math.min(2, Math.max(-2, rot))}deg)` }}
      >
        <div
          className={cn(
            'relative rounded-t-2xl px-4 pb-5 pt-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:rounded-sm sm:px-5',
            style === 'sticky' && 'min-h-[200px]',
          )}
          style={{
            backgroundColor:
              style === 'sticky'
                ? sticky.bg
                : style === 'index'
                  ? '#faf6ee'
                  : '#fffef8',
          }}
        >
          <PushPin color={style === 'sticky' ? sticky.pin : '#1565c0'} />
          {post.isFeatured && (
            <span className="absolute right-3 top-3 text-xl" aria-hidden>
              ⭐
            </span>
          )}
          <p className="font-sans text-[10px] font-extrabold uppercase tracking-wide" style={{ color: room.color }}>
            {room.emoji} {room.label}
          </p>
          <h2
            id="bulletin-post-title"
            className="mt-2 font-[family-name:var(--font-caveat)] text-2xl font-bold text-[#2d2d2d]"
          >
            {displayFrom(post)}
          </h2>
          <time className="mt-1 block font-sans text-xs font-semibold text-soft-charcoal/55">
            {formatPostTime(post.createdAt)}
          </time>
          <p className="mt-4 font-[family-name:var(--font-caveat)] text-2xl leading-relaxed text-[#2d2d2d] whitespace-pre-wrap">
            {postBodyForDisplay(post.content)}
          </p>

          {post.characterResponses?.map((r) => (
            <div key={r.id} className="mt-4">
              <CharacterResponseCard response={r} />
            </div>
          ))}

          <div className="mt-5 flex items-center gap-4 border-t border-black/10 pt-4">
            <button
              type="button"
              onClick={onLike}
              className={cn(
                'inline-flex items-center gap-1 font-sans text-sm font-bold',
                liked ? 'text-warm-pink' : 'text-soft-charcoal/70',
              )}
            >
              ❤️ {post.likes}
            </button>
            <span className="font-sans text-sm font-bold text-soft-charcoal/60">💬 {post.commentsCount}</span>
          </div>

          <div className="mt-4 rounded-sm border border-dashed border-[#d4c4a8]/80 bg-[#fff6e8]/90 p-3">
            <p className="font-[family-name:var(--font-caveat)] text-lg font-bold text-hai-blue">Add a note ↩</p>
            {loadingComments ? (
              <p className="mt-2 text-xs text-soft-charcoal/50">Loading replies…</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {comments.map((c) => (
                  <li key={c.id} className="font-[family-name:var(--font-caveat)] text-lg">
                    <span className="font-bold">{c.username}</span> {c.content}
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={submitReply} className="mt-3 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply…"
                className="flex-1 rounded-lg border border-[#ead8c2] bg-white px-3 py-2 font-sans text-sm outline-none focus:border-hai-blue"
              />
              <button
                type="submit"
                className="rounded-lg bg-hai-blue px-3 py-2 font-sans text-sm font-bold text-diho-cream"
              >
                Pin ↩
              </button>
            </form>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-4 block font-sans text-sm font-bold text-diho-cream/80 hover:text-diho-cream"
        >
          Back to the board
        </button>
      </div>
    </div>
  )
}
