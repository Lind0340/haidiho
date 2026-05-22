import type { RoomHostCharacter } from '@/lib/neighborhood-data'

export type CharacterId = RoomHostCharacter

export type CharacterMeta = {
  id: CharacterId
  name: string
  title: string
  /** Card border + glow */
  cardClass: string
  avatarBorderClass: string
}

export const NEIGHBORHOOD_CHARACTERS: Record<CharacterId, CharacterMeta> = {
  diho: {
    id: 'diho',
    name: 'DiHo',
    title: 'Human Worker',
    cardClass:
      'border-2 border-accent-gold/80 bg-[#fff6e8] shadow-[0_0_20px_rgba(201,162,39,0.28)]',
    avatarBorderClass: 'border-2 border-accent-gold/70',
  },
  hai: {
    id: 'hai',
    name: 'Hai',
    title: 'AI Coworker',
    cardClass:
      'border-2 border-hai-blue/70 bg-[#fff6e8] shadow-[0_0_22px_rgba(59,130,246,0.32)]',
    avatarBorderClass: 'border-2 border-hai-blue/80',
  },
  bob: {
    id: 'bob',
    name: 'BOB',
    title: "Derek's AI Assistant",
    cardClass: 'border border-[#ead8c2] bg-[#faf6ef]',
    avatarBorderClass: 'border border-[#d4c4a8]',
  },
}

export const CHARACTER_LIST = Object.values(NEIGHBORHOOD_CHARACTERS)
