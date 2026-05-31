'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FilledHeart } from '@/components/mug-wall/MugWallDecor'
import { BulletinPostCard } from '@/components/neighborhood/bulletin/BulletinPostCard'
import {
  BulletinBoardBanner,
  BulletinBoardFooterStrips,
  BulletinDecorLeftRail,
  BulletinDecorMobileStrip,
  BulletinDecorRightRail,
  BulletinHostNotes,
  BulletinPinStoryCard,
} from '@/components/neighborhood/bulletin/BulletinDecor'
import { BulletinPostExpandModal } from '@/components/neighborhood/bulletin/BulletinPostExpandModal'
import { BulletinSubmitModal } from '@/components/neighborhood/bulletin/BulletinSubmitModal'
import {
  NeighborhoodSignInModal,
  restoreNeighborhoodScroll,
  saveNeighborhoodScroll,
} from '@/components/neighborhood/NeighborhoodSignInModal'
import { authFetch } from '@/lib/auth-fetch'
import { getProfile } from '@/lib/auth'
import { cardNudge, cardRotation, cardStyleForPost, cardTransformOrigin, postSlotClass } from '@/lib/neighborhood-bulletin'
import { type NeighborhoodPost } from '@/lib/neighborhood-data'
import { neighborhoodDisplayName } from '@/lib/neighborhood-profile'
import { HaidihoErrors } from '@/lib/errors'
import { createClient } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Post = NeighborhoodPost & { likedByUser?: boolean }

type PendingAction =
  | { type: 'like'; post: Post }
  | { type: 'reply'; postId: string; content: string }
  | { type: 'submit' }

type Props = {
  initialPosts: NeighborhoodPost[]
  initialCursor: string | null
}

export function NeighborhoodBulletinBoard({ initialPosts, initialCursor }: Props) {
  const router = useRouter()
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
  const [expandedPost, setExpandedPost] = useState<Post | null>(null)
  const [newPostIds, setNewPostIds] = useState<Set<string>>(new Set())
  const pendingAction = useRef<PendingAction | null>(null)

  const showToast = useCallback((message: string, ms = 5000) => {
    setToast(message)
    setTimeout(() => setToast(null), ms)
  }, [])

  const loadPosts = useCallback(
    async (next?: string | null, append = false) => {
      if (!isSupabaseConfigured()) {
        setLoadError(HaidihoErrors.generic)
        if (!append) {
          setPosts([])
          setCursor(null)
        }
        return
      }

      if (!append) setLoading(true)
      setLoadError(null)

      const params = new URLSearchParams({ room: 'all' })
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
            const added = list.filter((p) => !ids.has(p.id))
            if (added.length) {
              setNewPostIds((s) => new Set([...s, ...added.map((p) => p.id)]))
            }
            return [...prev, ...added]
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
    [],
  )

  useEffect(() => {
    restoreNeighborhoodScroll()
  }, [])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    const channel = supabase
      .channel('neighborhood_bulletin_all')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_posts' },
        (payload: { new: Record<string, unknown> }) => {
          const row = payload.new as { status?: string; id?: string }
          if (row.status !== 'approved' || !row.id) return
          setNewPostIds((s) => new Set([...s, row.id!]))
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
          }
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
        void loadPosts()
      })
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
  }, [loadPosts])

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
    saveNeighborhoodScroll()
    setAuthOpen(true)
    return false
  }, [showToast])

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
      if (expandedPost?.id === post.id) {
        setExpandedPost((p) =>
          p ? { ...p, likedByUser: liked, likes: Math.max(0, p.likes + (liked ? 1 : -1)) } : p,
        )
      }

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
    [expandedPost?.id, loadPosts, requireAuth, showToast],
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
    async (message: string) => {
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

  const openPost = (post: Post) => setExpandedPost(post)

  return (
    <div className="neighborhood-scene relative min-h-screen overflow-x-clip px-2 pb-28 pt-3 sm:px-4 sm:pb-24 sm:pt-4 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.22]"
        style={{ backgroundImage: "url('/images/neighborhood/coffee-shop-board.jpg')" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a1208]/40 via-transparent to-[#1a1208]/80" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="relative z-20 mb-6 text-center">
          <h1 className="flex items-center justify-center gap-2 font-[family-name:var(--font-hand)] text-4xl font-bold text-diho-cream sm:text-5xl">
            the neighborhood
            <FilledHeart className="text-2xl text-warm-pink" />
          </h1>
          <p className="mt-2 font-sans text-sm font-semibold text-diho-cream/80 sm:text-base">
            Real humans. Real stories.
            <br className="sm:hidden" /> Real conversations.
          </p>
        </header>

        <div
          className="relative rounded-md p-2 sm:p-3"
          style={{
            background: 'linear-gradient(180deg, #3d2814 0%, #1f160c 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div className="cork-board rounded-sm px-2 py-4 sm:px-4 sm:py-6">
            <BulletinBoardBanner />
            <BulletinHostNotes activeRoom="all" />

            <div className="hidden sm:flex sm:justify-end sm:px-2 xl:hidden">
              <BulletinPinStoryCard onClick={() => void openSubmitStory()} />
            </div>

            {loadError && (
              <p className="mx-auto mb-4 max-w-md rounded-lg bg-warm-pink/20 px-4 py-3 text-center font-sans text-sm font-semibold text-diho-cream">
                {loadError}
              </p>
            )}

            <div className="bulletin-board-layout mx-auto grid w-full max-w-6xl gap-4 xl:grid-cols-[150px_minmax(0,1fr)_150px] xl:gap-6">
              <BulletinDecorLeftRail />

              <div className="min-w-0">
                <div className="mb-3 hidden justify-end xl:flex">
                  <BulletinPinStoryCard onClick={() => void openSubmitStory()} />
                </div>

                {loading ? (
                  <p className="py-16 text-center font-sans text-sm font-semibold text-diho-cream/70">
                    Pinning stories to the board…
                  </p>
                ) : (
                  <div className="bulletin-masonry w-full">
                    {posts.length === 0 && !loadError && (
                      <div className="bulletin-post-slot col-span-full">
                        <p className="rounded-sm bg-[#f5efe0] px-6 py-10 text-center font-[family-name:var(--font-caveat)] text-xl font-bold text-guide-navy">
                          Nothing on the board yet. Be the first to pin a story. ❤️
                        </p>
                      </div>
                    )}

                    {posts.map((post) => {
                      const isNew = newPostIds.has(post.id)
                      const style = cardStyleForPost(post.id)
                      const rot = cardRotation(post.id)
                      const nudge = cardNudge(post.id)
                      const origin = cardTransformOrigin(post.id)
                      return (
                        <div
                          key={post.id}
                          className={cn(
                            'bulletin-post-slot',
                            postSlotClass(post.id, style),
                            isNew && 'bulletin-drop-in',
                          )}
                          onAnimationEnd={() => {
                            if (isNew) {
                              setNewPostIds((s) => {
                                const next = new Set(s)
                                next.delete(post.id)
                                return next
                              })
                            }
                          }}
                        >
                          <div
                            className={cn(!isNew && 'bulletin-pin-in')}
                            style={{
                              ['--card-rot' as string]: `${rot}deg`,
                              ['--card-tx' as string]: `${nudge.x}px`,
                              ['--card-ty' as string]: `${nudge.y}px`,
                              ['--card-origin' as string]: origin,
                            }}
                          >
                            <BulletinPostCard
                              post={post}
                              liked={Boolean(post.likedByUser)}
                              onOpen={() => openPost(post)}
                              onLike={() => void toggleLike(post)}
                            />
                          </div>
                        </div>
                      )
                    })}

                    {cursor && !loading && (
                      <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="bulletin-post-slot col-span-full rounded-sm bg-[#f5efe0] px-4 py-3 text-center font-[family-name:var(--font-caveat)] text-xl font-bold text-guide-navy shadow-md transition hover:bg-white disabled:opacity-60"
                      >
                        {loadingMore ? 'Finding more stories…' : 'More stories below ↓'}
                      </button>
                    )}
                  </div>
                )}

                <BulletinDecorMobileStrip />
              </div>

              <BulletinDecorRightRail />
            </div>

            <BulletinBoardFooterStrips />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void openSubmitStory()}
        className="safe-fab-bottom fixed left-1/2 z-50 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 touch-manipulation rounded-full bg-accent-gold px-5 py-3.5 font-[family-name:var(--font-caveat)] text-lg font-bold text-soft-charcoal shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:hidden sm:px-6 sm:text-xl"
      >
        📌 Pin Your Story
      </button>

      <BulletinSubmitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={handleSubmitted}
        defaultRoom={null}
        displayName={posterName}
      />

      <BulletinPostExpandModal
        post={expandedPost}
        liked={Boolean(expandedPost?.likedByUser)}
        onClose={() => setExpandedPost(null)}
        onLike={() => expandedPost && void toggleLike(expandedPost)}
        onReply={handleReply}
      />

      <NeighborhoodSignInModal
        open={authOpen}
        defaultMode={authDefaultMode}
        onClose={() => {
          setAuthOpen(false)
          pendingAction.current = null
        }}
        onSignedIn={onAuthSuccess}
      />

      {toast && (
        <div
          role="status"
          className="fixed bottom-[calc(7.5rem+env(safe-area-inset-bottom,0px))] left-1/2 z-[55] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-[#ead8c2] bg-[#fff6e8] px-4 py-3 text-center text-sm font-bold text-soft-charcoal shadow-lg sm:bottom-36"
        >
          {toast}
        </div>
      )}
    </div>
  )
}

