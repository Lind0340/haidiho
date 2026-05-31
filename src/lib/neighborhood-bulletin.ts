import type { NeighborhoodPost, RoomId } from '@/lib/neighborhood-data'

export type RoomFilter = 'all' | RoomId

export type BulletinCardStyle = 'sticky' | 'notebook' | 'index' | 'receipt'

/** Minimum posts on the board — padded with SEED_POSTS when the DB is sparse */
export const BOARD_FILL_TARGET = 24

const STICKY_COLORS = [
  { bg: '#fff9c4', pin: '#e53935' },
  { bg: '#ffcdd2', pin: '#1e88e5' },
  { bg: '#c8e6c9', pin: '#fdd835' },
  { bg: '#bbdefb', pin: '#43a047' },
  { bg: '#ffe0b2', pin: '#8e24aa' },
  { bg: '#e1bee7', pin: '#f4511e' },
  { bg: '#ffccbc', pin: '#c62828' },
  { bg: '#b2dfdb', pin: '#6a1b9a' },
  { bg: '#f8bbd0', pin: '#1565c0' },
  { bg: '#dcedc8', pin: '#ef6c00' },
  { bg: '#fff59d', pin: '#c62828' },
  { bg: '#f8bbd9', pin: '#3949ab' },
  { bg: '#b3e5fc', pin: '#e65100' },
  { bg: '#ffe082', pin: '#5d4037' },
  { bg: '#d1c4e9', pin: '#00796b' },
  { bg: '#ffab91', pin: '#283593' },
] as const

const NOTEBOOK_PAPERS = [
  { bg: '#fffef8', line: 'rgba(74, 144, 217, 0.22)' },
  { bg: '#fff0f5', line: 'rgba(255, 107, 138, 0.18)' },
  { bg: '#f0fff4', line: 'rgba(67, 160, 71, 0.18)' },
  { bg: '#fff8e8', line: 'rgba(245, 166, 35, 0.2)' },
  { bg: '#f3f8ff', line: 'rgba(59, 130, 246, 0.18)' },
  { bg: '#faf5ff', line: 'rgba(142, 68, 173, 0.15)' },
] as const

const INDEX_PAPERS = [
  { bg: '#faf6ee', border: '#d4c4a8' },
  { bg: '#ffe8f0', border: '#e8a4b8' },
  { bg: '#e8f5e9', border: '#81c784' },
  { bg: '#fff3e0', border: '#ffb74d' },
  { bg: '#e3f2fd', border: '#64b5f6' },
  { bg: '#f3e5f5', border: '#ba68c8' },
] as const

const RECEIPT_PAPERS = [
  { bg: '#fffde7', pin: '#f9a825' },
  { bg: '#fce4ec', pin: '#c2185b' },
  { bg: '#e0f7fa', pin: '#00838f' },
  { bg: '#ffffff', pin: '#757575' },
  { bg: '#fff6e8', pin: '#6d4c41' },
  { bg: '#f1f8e9', pin: '#558b2f' },
] as const

export function cardStyleForPost(id: string): BulletinCardStyle {
  const n = hash(id) % 100
  if (n < 66) return 'sticky'
  if (n < 78) return 'notebook'
  if (n < 92) return 'index'
  return 'receipt'
}

export function stickyColorForPost(id: string) {
  return STICKY_COLORS[hash(id) % STICKY_COLORS.length]!
}

export function notebookPaperForPost(id: string) {
  return NOTEBOOK_PAPERS[hash(id + 'nb') % NOTEBOOK_PAPERS.length]!
}

export function indexPaperForPost(id: string) {
  return INDEX_PAPERS[hash(id + 'ix') % INDEX_PAPERS.length]!
}

export function receiptPaperForPost(id: string) {
  return RECEIPT_PAPERS[hash(id + 'rc') % RECEIPT_PAPERS.length]!
}

/** Hand-picked tilts — no near-zero angles; half-degrees feel less mechanical */
const CARD_ROTATIONS = [
  -13.5, 11.2, -9.8, 12.4, -11.7, 8.3, -10.1, 13.2, -12.6, 7.4, -13.8, 6.9, -8.7, 11.9, -7.2,
  10.6, -13.1, 9.3, -6.8, 12.8, -11.4, 8.9, -10.7, 11.1, -9.2, 12.1, -13.4, 7.8, -8.4, 6.2,
  -11.8, 13.6, -7.6, 10.2, -12.3, 9.7, -13.7, 8.1, -6.5, 11.6, -10.4, 12.9, -9.1, 7.1, -11.3,
  10.8, -8.6, 13.3, -12.2, 6.7, -10.9, 11.5, -7.9, 9.4, -13.9, 8.5,
] as const

const CARD_NUDGES = [
  { x: -4, y: 2 },
  { x: 5, y: -3 },
  { x: -2, y: 6 },
  { x: 7, y: 1 },
  { x: -6, y: -2 },
  { x: 3, y: 5 },
  { x: -5, y: 4 },
  { x: 6, y: -4 },
  { x: -3, y: -5 },
  { x: 4, y: 3 },
  { x: -7, y: 2 },
  { x: 2, y: -6 },
] as const

const CARD_ORIGINS = [
  '42% 14%',
  '58% 10%',
  '50% 8%',
  '46% 18%',
  '54% 12%',
  '48% 6%',
  '56% 16%',
  '44% 11%',
] as const

export function cardRotation(id: string): number {
  return CARD_ROTATIONS[hash(id + 'rot') % CARD_ROTATIONS.length]!
}

export function cardNudge(id: string): { x: number; y: number } {
  return CARD_NUDGES[hash(id + 'nudge') % CARD_NUDGES.length]!
}

export function cardTransformOrigin(id: string): string {
  return CARD_ORIGINS[hash(id + 'origin') % CARD_ORIGINS.length]!
}

export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export function cardSizeForPost(id: string, style: BulletinCardStyle): CardSize {
  const n = hash(id + 'sz') % 100
  if (style === 'sticky') {
    if (n < 38) return 'sm'
    if (n < 82) return 'md'
    return 'lg'
  }
  if (style === 'notebook') {
    if (n < 30) return 'md'
    return 'xl'
  }
  if (style === 'index') {
    return n < 45 ? 'sm' : 'md'
  }
  return n < 55 ? 'xs' : 'sm'
}

export function postSlotClass(id: string, style: BulletinCardStyle): string {
  const size = cardSizeForPost(id, style)
  if (style === 'notebook' && size === 'xl') return 'md:col-span-2'
  if (style === 'sticky' && size === 'lg') return 'sm:col-span-2'
  return ''
}

export function hostNoteRotation(room: RoomId): number {
  const angles: Record<RoomId, number> = {
    water_cooler: -3.8,
    training_room: 2.6,
    help_desk: -2.1,
  }
  return angles[room]
}

function hash(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % 997
  return h
}

const PREVIEW_LEN = 220

export function truncateContent(content: string, max = PREVIEW_LEN) {
  if (content.length <= max) return { text: content, truncated: false }
  return { text: `${content.slice(0, max).trim()}…`, truncated: true }
}

export function roomLabel(room: RoomId) {
  if (room === 'water_cooler') return { emoji: '😂', label: 'Water Cooler', color: '#FF6B6B' }
  if (room === 'training_room') return { emoji: '💡', label: 'Training Room', color: '#F5A623' }
  return { emoji: '🆘', label: 'Help Desk', color: '#4A90D9' }
}

export function parseCityFromContent(content: string): { city: string | null; body: string } {
  const m = content.match(/^📍\s+(.+?)\n\n([\s\S]*)$/)
  if (m) return { city: m[1]!.trim(), body: m[2]! }
  return { city: null, body: content }
}

export function displayFrom(post: NeighborhoodPost, city?: string | null) {
  const name = post.username.replace(/^@/, '')
  const loc = city?.trim() ?? parseCityFromContent(post.content).city
  if (loc) return `From ${name} (${loc})`
  return `From ${name}`
}

export function postBodyForDisplay(content: string) {
  return parseCityFromContent(content).body
}

export const EMPTY_ROOM_COPY: Record<RoomId, string> = {
  water_cooler:
    'Nothing here yet.\nBe the first to share\na funny AI moment.\nDiHo dares you. 😄',
  training_room: 'No tips yet.\nHai is very ready\nto read yours.\nVery ready. ❤️',
  help_desk: 'No questions yet.\nBOB is prepared.\nDone. ✅',
}
