'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import {
  NeighborhoodSignInModal,
  restoreNeighborhoodScroll,
  saveNeighborhoodScroll,
} from '@/components/neighborhood/NeighborhoodSignInModal'
import { PostCard } from '@/components/neighborhood/PostCard'
import { RoomHostAvatar } from '@/components/neighborhood/RoomHostAvatar'
import { SubmitStoryModal } from '@/components/neighborhood/SubmitStoryModal'
import { authFetch } from '@/lib/auth-fetch'
import { getProfile } from '@/lib/auth'
import { getRoom, type NeighborhoodPost, type RoomId } from '@/lib/neighborhood-data'
import { neighborhoodDisplayName } from '@/lib/neighborhood-profile'
import { HaidihoErrors } from '@/lib/errors'
import { isSupabaseConfigured } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Post = NeighborhoodPost & { likedByUser?: boolean }

type PendingAction =
  | { type: 'like'; post: Post }
  | { type: 'reply'; postId: string; content: string }
  | { type: 'submit' }

type Props = {
  room: RoomId
  initialPosts: NeighborhoodPost[]
  initialCursor: string | null
}

export function NeighborhoodRoomContent({ room, initialPosts, initialCursor }: Props) {
  const router = useRouter()
  const roomMeta = getRoom(room)
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authDefaultMode, setAuthDefaultMode] = useState<'signin' | 'signup'>('signin')
  const [posterName, setPosterName] = useState('@neighbor')
  const [toast, setToast] = useState<string | null>(null)
  const pendingAction = useRef<PendingAction | null>(null)

  const showToast = useCallback((message: string, ms = 5000) => {
    setToast(message)
    setTimeout(() => setToast(null), ms)
  }, [])

  const loadPosts = useCallback(
    async (next?: string | null, append = false) => {
      if (!isSupabaseConfigured()) {
        setLoadError(HaidihoErrors.generic)
        setPosts([])
        setCursor(null)
        return
      }

      if (!append) setLoading(true)
      setLoadError(null)

      const params = new URLSearchParams({ room })
      if (next) params.set('cursor', next)

      try {
        const res = await fetch(`/api/neighborhood/posts?${params}`)
        const data = await res.json()
        if (!res.ok) {
          setLoadError(data.error ?? HaidihoErrors.generic)
          if (!append) setPosts([])
          return
        }
        const list = (data.posts ?? []) as Post[]
        if (append) {
          setPosts((prev) => {
            const ids = new Set(prev.map((p) => p.id))
            return [...prev, ...list.filter((p) => !ids.has(p.id))]
          })
        } else {
          setPosts(list)
        }
        setCursor(data.nextCursor ?? null)
      } catch {
        setLoadError(HaidihoErrors.generic)
        if (!append) setPosts([])
      } finally {
        if (!append) setLoading(false)
      }
    },
    [room],
  )

  useEffect(() => {
    restoreNeighborhoodScroll(room)
  }, [room])

  useEffect(() => {
    void loadPosts()
  }, [room, loadPosts])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    const channel = supabase
      .channel(`neighborhood_room_${room}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_posts' },
        (payload: { new: Record<string, unknown> }) => {
          const row = payload.new as { status?: string; room?: string }
          if (row.status !== 'approved' || row.room !== room) return
          void loadPosts()
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'community_posts' },
        (payload: { new: Record<string, unknown> }) => {
          const row = payload.new as {
            id: string
            status?: string
            like_count?: number
            comment_count?: number
            room?: string
          }
          if (row.room !== room) return
          if (row.status === 'approved') void loadPosts()
          setPosts((prev) =>
            prev.map((p) =>
              p.id === row.id
                ? {
                    ...p,
                    likes: row.like_count ?? p.likes,
                    commentsCount: row.comment_count ?? p.commentsCount,
                  }
                : p,
            ),
          )
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'post_likes' },
        () => {
          void loadPosts()
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'character_responses' },
        () => {
          void loadPosts()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room, loadPosts])

  const requireAuth = useCallback(async (): Promise<boolean> => {
    const supabase = createClient()
    if (!supabase) {
      showToast(HaidihoErrors.generic)
      return false
    }
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) return true
    saveNeighborhoodScroll(room)
    setAuthOpen(true)
    return false
  }, [room, showToast])

  const loadPosterName = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) return '@neighbor'
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return '@neighbor'
    const profile = await getProfile(user.id)
    return neighborhoodDisplayName(profile, user.email)
  }, [])

  const openSubmitStory = useCallback(async () => {
    const authed = await requireAuth()
    if (!authed) {
      pendingAction.current = { type: 'submit' }
      setAuthDefaultMode('signup')
      return
    }
    setPosterName(await loadPosterName())
    setModalOpen(true)
  }, [loadPosterName, requireAuth])

  const toggleLike = useCallback(
    async (post: Post) => {
      const authed = await requireAuth()
      if (!authed) {
        setAuthDefaultMode('signin')
        pendingAction.current = { type: 'like', post }
        return
      }

      const liked = !post.likedByUser
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                likedByUser: liked,
                likes: Math.max(0, p.likes + (liked ? 1 : -1)),
              }
            : p,
        ),
      )

      try {
        const res = await authFetch('/api/neighborhood/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: post.id, liked }),
        })
        const data = await res.json()
        if (!res.ok) {
          showToast(data.error ?? HaidihoErrors.auth)
          void loadPosts()
          return
        }
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, likes: data.like_count } : p)),
        )
      } catch {
        showToast(HaidihoErrors.generic)
        void loadPosts()
      }
    },
    [loadPosts, requireAuth, showToast],
  )

  const handleReply = useCallback(
    async (postId: string, content: string) => {
      const authed = await requireAuth()
      if (!authed) {
        setAuthDefaultMode('signin')
        pendingAction.current = { type: 'reply', postId, content }
        return
      }

      try {
        const res = await authFetch('/api/neighborhood/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, content }),
        })
        const data = await res.json()
        showToast(data.message ?? data.error ?? HaidihoErrors.generic)
        if (res.ok) void loadPosts()
      } catch {
        showToast(HaidihoErrors.generic)
      }
    },
    [loadPosts, requireAuth, showToast],
  )

  const onAuthSuccess = useCallback(async () => {
    router.refresh()
    const action = pendingAction.current
    pendingAction.current = null
    if (!action) return
    if (action.type === 'submit') {
      setPosterName(await loadPosterName())
      setModalOpen(true)
      return
    }
    if (action.type === 'like') {
      await toggleLike(action.post)
    } else {
      await handleReply(action.postId, action.content)
    }
  }, [toggleLike, handleReply, loadPosterName, router])

  const handleSubmitted = useCallback(
    async (message: string, _postedRoom: RoomId) => {
      showToast(message, 6000)
      await loadPosts()
      router.refresh()
    },
    [loadPosts, router, showToast],
  )

  const loadMore = async () => {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    await loadPosts(cursor, true)
    setLoadingMore(false)
  }

  return (
    <div className="px-3 pb-28 pt-3 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/neighborhood"
          className="inline-flex items-center gap-1 text-sm font-bold text-soft-charcoal/65 transition-colors hover:text-hai-blue"
        >
          ← Back to the neighborhood
        </Link>

        <header
          className={cn(
            'mt-4 rounded-[20px] border p-5 sm:mt-6 sm:p-6',
            roomMeta.themeHeaderClass,
          )}
        >
          <p
            className={cn(
              'text-xs font-extrabold uppercase tracking-[0.18em]',
              roomMeta.themeLabelClass,
            )}
          >
            Haidiho neighborhood
          </p>
          <h1 className="mt-2 flex items-center gap-2 font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal sm:text-4xl">
            <span aria-hidden>{roomMeta.emoji}</span>
            {roomMeta.name}
          </h1>
          <p className="mt-1 text-sm font-bold text-soft-charcoal/80">{roomMeta.tagline}</p>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-soft-charcoal/75">
            {roomMeta.intro}
          </p>
          <div className="mt-4">
            <RoomHostAvatar
              character={roomMeta.hostCharacter}
              message={roomMeta.hostMessage}
              hostBg={roomMeta.hostBg}
            />
          </div>
          <button
            type="button"
            onClick={() => void openSubmitStory()}
            className={cn(
              'mt-5 w-full rounded-xl px-4 py-3 font-[family-name:var(--font-hand)] text-xl font-bold transition-transform',
              roomMeta.submitBtnClass,
            )}
          >
            Submit Your Story ❤️
          </button>
        </header>

        <h2 className="mt-8 font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal">
          Stories in this room
        </h2>

        {loadError && (
          <p className="mt-4 rounded-xl border border-warm-pink/30 bg-warm-pink/10 px-4 py-3 text-center text-sm font-semibold text-soft-charcoal">
            {loadError}
          </p>
        )}

        {loading ? (
          <p className="mt-8 text-center text-sm font-semibold text-soft-charcoal/55">
            Loading stories…
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {posts.length === 0 && !loadError ? (
              <li className="rounded-[18px] border border-dashed border-[#ead8c2] bg-[#fff6e8]/80 px-6 py-10 text-center text-sm font-semibold text-soft-charcoal/65">
                {HaidihoErrors.emptyRoom}
              </li>
            ) : (
              posts.map((post) => (
                <li key={post.id}>
                  <PostCard
                    post={post}
                    liked={Boolean(post.likedByUser)}
                    hideRoomBadge
                    onLike={() => toggleLike(post)}
                    onReply={handleReply}
                  />
                </li>
              ))
            )}
          </ul>
        )}

        {cursor && !loading && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className={cn(
              'mt-6 w-full rounded-xl border bg-[#fff6e8] py-3 text-sm font-bold hover:bg-white/80 disabled:opacity-60',
              roomMeta.accentClass,
              roomMeta.themeLabelClass,
            )}
          >
            {loadingMore ? 'Loading…' : 'Load more stories'}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => void openSubmitStory()}
        className={cn(
          'fixed bottom-24 right-4 z-50 rounded-full px-5 py-3 font-[family-name:var(--font-hand)] text-lg font-bold transition-transform hover:-translate-y-0.5 lg:hidden',
          roomMeta.submitFabClass,
          roomMeta.id === 'help_desk' ? 'text-soft-charcoal' : 'text-diho-cream',
        )}
      >
        Submit Your Story ❤️
      </button>

      <SubmitStoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={handleSubmitted}
        defaultRoom={room}
        displayName={posterName}
      />

      <NeighborhoodSignInModal
        open={authOpen}
        defaultMode={authDefaultMode}
        scrollRoom={room}
        onClose={() => {
          setAuthOpen(false)
          pendingAction.current = null
        }}
        onSignedIn={onAuthSuccess}
      />

      {toast && (
        <div
          role="status"
          className="fixed bottom-36 left-1/2 z-[55] max-w-sm -translate-x-1/2 rounded-xl border border-[#ead8c2] bg-[#fff6e8] px-4 py-3 text-center text-sm font-bold text-soft-charcoal shadow-lg sm:bottom-8"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
