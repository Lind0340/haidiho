import type { PostWithProfile } from '@/types/database'
import type { NeighborhoodPost, RoomId as NeighborhoodRoomId } from '@/lib/neighborhood-data'

export const PAGE_SIZE = 20

function profileName(
  p: { username: string | null; display_name: string | null } | null | undefined,
  guestAuthor?: string | null,
) {
  if (guestAuthor) return guestAuthor.startsWith('@') ? guestAuthor : guestAuthor
  if (!p) return '@neighbor'
  if (p.username) return p.username.startsWith('@') ? p.username : `@${p.username}`
  if (p.display_name) return p.display_name
  return '@neighbor'
}

export function postRowToNeighborhood(
  row: PostWithProfile & { guest_author?: string | null },
  likedByUser = false,
): NeighborhoodPost & { avatarUrl?: string | null; likedByUser?: boolean } {
  const profiles = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
  return {
    id: row.id,
    room: row.room as NeighborhoodRoomId,
    username: profileName(profiles, row.guest_author),
    content: row.content,
    likes: row.like_count,
    commentsCount: row.comment_count,
    createdAt: row.created_at,
    status: row.status,
    avatarUrl: profiles?.avatar_url ?? null,
    likedByUser,
  }
}
