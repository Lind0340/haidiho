import { NEIGHBORHOOD_ROOMS, type RoomId } from '@/lib/neighborhood-data'

export function isRoomId(slug: string): slug is RoomId {
  return NEIGHBORHOOD_ROOMS.some((r) => r.id === slug)
}

export function roomHref(room: RoomId) {
  return `/neighborhood/${room}`
}
