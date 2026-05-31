import type { Metadata } from 'next'
import { NeighborhoodBulletinBoard } from '@/components/neighborhood/NeighborhoodBulletinBoard'
import { fetchCommunityPosts } from '@/lib/data/neighborhood'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'The Neighborhood | Haidiho',
  description:
    'A warm cork board of real stories — Water Cooler laughs, Training Room tips, and Help Desk questions.',
}

export default async function NeighborhoodPage() {
  const supabase = await createServerSupabaseClient()
  const userId = supabase ? (await supabase.auth.getUser()).data.user?.id : null
  const { posts, nextCursor } = await fetchCommunityPosts({ room: 'all', userId })

  return (
    <NeighborhoodBulletinBoard initialPosts={posts} initialCursor={nextCursor} />
  )
}
