import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NeighborhoodBulletinBoard } from '@/components/neighborhood/NeighborhoodBulletinBoard'
import { fetchCommunityPosts } from '@/lib/data/neighborhood'
import { getRoom, type RoomId } from '@/lib/neighborhood-data'
import { isRoomId } from '@/lib/neighborhood-routes'
import { createServerSupabaseClient } from '@/lib/supabase-server'

type Props = { params: Promise<{ room: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { room: slug } = await params
  if (!isRoomId(slug)) return { title: 'The Neighborhood | Haidiho' }
  const room = getRoom(slug)
  return {
    title: `${room.name} | The Neighborhood | Haidiho`,
    description: room.intro,
  }
}

export default async function NeighborhoodRoomPage({ params }: Props) {
  const { room: slug } = await params
  if (!isRoomId(slug)) notFound()

  const room = slug as RoomId
  const supabase = await createServerSupabaseClient()
  const userId = supabase ? (await supabase.auth.getUser()).data.user?.id : null
  const { posts, nextCursor } = await fetchCommunityPosts({ room: 'all', userId })

  return (
    <NeighborhoodBulletinBoard initialPosts={posts} initialCursor={nextCursor} />
  )
}
