import type { Metadata } from 'next'
import { NeighborhoodHub } from '@/components/neighborhood/NeighborhoodHub'
import { fetchRoomStats } from '@/lib/data/neighborhood'

export const metadata: Metadata = {
  title: 'The Neighborhood | Haidiho',
  description:
    'Pick a room — Water Cooler, Training Room, or Help Desk — and share real stories about AI coworkers.',
}

export default async function NeighborhoodPage() {
  const roomStats = await fetchRoomStats()
  return <NeighborhoodHub roomStats={roomStats} />
}
