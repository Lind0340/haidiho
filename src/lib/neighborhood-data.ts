export type RoomId = 'water_cooler' | 'training_room' | 'help_desk'

export type RoomHostCharacter = 'diho' | 'hai' | 'bob'

export type CharacterResponseView = {
  id: string
  postId: string
  character: RoomHostCharacter
  content: string
  createdAt: string
}

export type AdminPostPickerOption = {
  id: string
  room: RoomId
  content: string
  username: string
  created_at: string
}

export type NeighborhoodPost = {
  id: string
  room: RoomId
  username: string
  content: string
  likes: number
  commentsCount: number
  createdAt: string
  isFeatured?: boolean
  status?: 'pending' | 'approved' | 'rejected'
  characterResponses?: CharacterResponseView[]
}

export const NEIGHBORHOOD_ROOMS = [
  {
    id: 'water_cooler' as const,
    emoji: '😂',
    name: 'The Water Cooler',
    tagline: 'My AI Did What?',
    description: 'Funny stories and fails',
    intro:
      'Laugh, vent, and swap the wildest things your AI coworker did. DiHo is usually around.',
    hostCharacter: 'diho' as const,
    hostMessage: 'Hey. 👋 Wanna talk about it?',
    tagClass: 'bg-warm-pink/15 text-warm-pink border-warm-pink/35',
    accentClass: 'border-warm-pink/40 ring-warm-pink/25',
    hostBg: 'bg-warm-pink/10',
    themeHeaderClass: 'border-warm-pink/35 bg-[#fff6e8] shadow-[0_8px_28px_rgba(255,107,138,0.12)]',
    themeLabelClass: 'text-warm-pink',
    submitBtnClass:
      'bg-warm-pink text-diho-cream shadow-[0_6px_0_rgba(180,60,90,0.35)] hover:-translate-y-0.5',
    submitFabClass: 'bg-warm-pink shadow-[0_8px_24px_rgba(255,107,138,0.45)]',
    hubEmojiBg: 'bg-warm-pink/20 ring-2 ring-warm-pink/30',
    hubSticker: {
      text: 'spill it ☕',
      bg: 'bg-[#ffb8c8]',
      rotate: '-rotate-6',
    },
    hubEnterBtn:
      'bg-warm-pink text-diho-cream shadow-[0_6px_0_rgba(180,60,90,0.4)] group-hover:shadow-[0_8px_0_rgba(180,60,90,0.4)]',
  },
  {
    id: 'training_room' as const,
    emoji: '💡',
    name: 'The Training Room',
    tagline: 'Today I Trained It To…',
    description: 'Practical wins and tips',
    intro: 'Share what worked, what broke, and how you taught your AI coworker. Hai loves a good tip.',
    hostCharacter: 'hai' as const,
    hostMessage: 'I have tips! Many tips! ❤️',
    tagClass: 'bg-hai-blue/15 text-hai-blue border-hai-blue/35',
    accentClass: 'border-hai-blue/40 ring-hai-blue/25',
    hostBg: 'bg-hai-blue/10',
    themeHeaderClass: 'border-hai-blue/35 bg-[#fff6e8] shadow-[0_8px_28px_rgba(59,130,246,0.14)]',
    themeLabelClass: 'text-hai-blue',
    submitBtnClass:
      'bg-hai-blue text-diho-cream shadow-[0_6px_0_rgba(30,64,175,0.3)] hover:-translate-y-0.5',
    submitFabClass: 'bg-hai-blue shadow-[0_8px_24px_rgba(59,130,246,0.4)]',
    hubEmojiBg: 'bg-hai-blue/15 ring-2 ring-hai-blue/25',
    hubSticker: {
      text: 'pro tip! 💡',
      bg: 'bg-[#9bd7d2]',
      rotate: 'rotate-3',
    },
    hubEnterBtn:
      'bg-hai-blue text-diho-cream shadow-[0_6px_0_rgba(30,64,175,0.35)] group-hover:shadow-[0_8px_0_rgba(30,64,175,0.35)]',
  },
  {
    id: 'help_desk' as const,
    emoji: '🆘',
    name: 'The Help Desk',
    tagline: 'Help Me Train Mine',
    description: 'Questions the community answers',
    intro: 'Stuck? Ask the neighborhood. BOB keeps it minimal; humans (and Hai) often chime in.',
    hostCharacter: 'bob' as const,
    hostMessage: 'Done. ✅',
    tagClass: 'bg-accent-gold/20 text-[#9a6b12] border-accent-gold/45',
    accentClass: 'border-accent-gold/45 ring-accent-gold/25',
    hostBg: 'bg-accent-gold/15',
    themeHeaderClass: 'border-accent-gold/40 bg-[#fff6ef] shadow-[0_8px_24px_rgba(201,162,39,0.12)]',
    themeLabelClass: 'text-[#9a6b12]',
    submitBtnClass:
      'bg-accent-gold text-soft-charcoal shadow-[0_6px_0_rgba(154,107,18,0.25)] hover:-translate-y-0.5',
    submitFabClass: 'bg-accent-gold text-soft-charcoal shadow-[0_8px_24px_rgba(201,162,39,0.35)]',
    hubEmojiBg: 'bg-accent-gold/25 ring-2 ring-accent-gold/40',
    hubSticker: {
      text: 'done. ✅',
      bg: 'bg-[#f5e6c8]',
      rotate: '-rotate-3',
    },
    hubEnterBtn:
      'bg-accent-gold text-soft-charcoal shadow-[0_6px_0_rgba(154,107,18,0.3)] group-hover:shadow-[0_8px_0_rgba(154,107,18,0.3)]',
  },
] as const

export function getRoom(id: RoomId) {
  return NEIGHBORHOOD_ROOMS.find((r) => r.id === id)!
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString()

export const SEED_POSTS: NeighborhoodPost[] = [
  {
    id: 'seed-wc-1',
    room: 'water_cooler',
    username: '@MarketingMaggie',
    content:
      'My AI scheduled a meeting with my dog. Not my colleague named Doug. My actual dog. I don\'t have a dog.',
    likes: 42,
    commentsCount: 8,
    createdAt: hoursAgo(2),
    status: 'approved',
  },
  {
    id: 'seed-wc-2',
    room: 'water_cooler',
    username: '@TechTom',
    content:
      'Asked my AI to summarize the meeting. It summarized a meeting I wasn\'t in. From last March.',
    likes: 31,
    commentsCount: 5,
    createdAt: hoursAgo(5),
    status: 'approved',
  },
  {
    id: 'seed-wc-3',
    room: 'water_cooler',
    username: '@WorkingWendy',
    content:
      'My AI reply-all\'d on my behalf. I have never reply-all\'d in my life. This is my legacy now.',
    likes: 56,
    commentsCount: 12,
    createdAt: hoursAgo(8),
    status: 'approved',
  },
  {
    id: 'seed-tr-1',
    room: 'training_room',
    username: '@ProcessPete',
    content:
      'Trained mine to match my email tone exactly. Trick: paste three examples of your actual writing and say "write like this, not like a robot."',
    likes: 89,
    commentsCount: 14,
    createdAt: hoursAgo(3),
    status: 'approved',
  },
  {
    id: 'seed-tr-2',
    room: 'training_room',
    username: '@EfficientElla',
    content:
      'Got mine to run my weekly status report automatically every Friday. Saved 2 hours already.',
    likes: 67,
    commentsCount: 9,
    createdAt: hoursAgo(6),
    status: 'approved',
  },
  {
    id: 'seed-tr-3',
    room: 'training_room',
    username: '@PromptPaul',
    content:
      'Tell it what you DON\'T want. "No corporate jargon, no bullet points, no synergy." Game changer.',
    likes: 102,
    commentsCount: 18,
    createdAt: hoursAgo(12),
    status: 'approved',
  },
  {
    id: 'seed-hd-1',
    room: 'help_desk',
    username: '@ConfusedCarla',
    content:
      'My AI keeps giving me 47 options when I ask a simple question. How do I make it just pick one?',
    likes: 38,
    commentsCount: 11,
    createdAt: hoursAgo(4),
    status: 'approved',
  },
  {
    id: 'seed-hd-2',
    room: 'help_desk',
    username: '@NewToThis',
    content:
      'Where do I even start with training my AI to know my job? Feels overwhelming.',
    likes: 45,
    commentsCount: 16,
    createdAt: hoursAgo(9),
    status: 'approved',
  },
  {
    id: 'seed-hd-3',
    room: 'help_desk',
    username: '@FrustratedFred',
    content:
      'Mine sounds like a legal document wrote a business email. Please help.',
    likes: 52,
    commentsCount: 13,
    createdAt: hoursAgo(15),
    status: 'approved',
  },
  {
    id: 'seed-wc-4',
    room: 'water_cooler',
    username: '@RemoteRita',
    content:
      'Told my AI to "keep it casual." It added "per my last email" to a Slack message to my spouse.',
    likes: 28,
    commentsCount: 4,
    createdAt: hoursAgo(11),
    status: 'approved',
    isFeatured: true,
  },
  {
    id: 'seed-wc-5',
    room: 'water_cooler',
    username: '@DaveInDenver',
    content: 'My AI autocorrected "quarterly review" to "existential dread." HR noticed.',
    likes: 19,
    commentsCount: 3,
    createdAt: hoursAgo(14),
    status: 'approved',
  },
  {
    id: 'seed-wc-6',
    room: 'water_cooler',
    username: '@LaughingLiz',
    content:
      'It drafted a thank-you note that thanked me for thanking myself. Very on-brand for 2025.',
    likes: 44,
    commentsCount: 7,
    createdAt: hoursAgo(18),
    status: 'approved',
  },
  {
    id: 'seed-wc-7',
    room: 'water_cooler',
    username: '@BenInBoston',
    content:
      'Asked for a short bio. Got six paragraphs and a mission statement for a nonprofit I don\'t run.',
    likes: 33,
    commentsCount: 6,
    createdAt: hoursAgo(22),
    status: 'approved',
  },
  {
    id: 'seed-tr-4',
    room: 'training_room',
    username: '@CalendarChris',
    content:
      'I feed mine three standing meetings a week as context. It now suggests agenda items before humans do.',
    likes: 71,
    commentsCount: 10,
    createdAt: hoursAgo(7),
    status: 'approved',
  },
  {
    id: 'seed-tr-5',
    room: 'training_room',
    username: '@NinaNotes',
    content:
      'Start every prompt with "You are my coworker, not a textbook." Sounds obvious. Works shockingly well.',
    likes: 58,
    commentsCount: 8,
    createdAt: hoursAgo(10),
    status: 'approved',
  },
  {
    id: 'seed-tr-6',
    room: 'training_room',
    username: '@OpsOmar',
    content:
      'Screenshot your best outputs and say "match this energy." Mine stopped writing like a press release.',
    likes: 64,
    commentsCount: 11,
    createdAt: hoursAgo(16),
    status: 'approved',
    isFeatured: true,
  },
  {
    id: 'seed-tr-7',
    room: 'training_room',
    username: '@WriterWren',
    content:
      'Weekly "what I learned" log → mine predicts blockers before standup. Spooky. Useful.',
    likes: 49,
    commentsCount: 5,
    createdAt: hoursAgo(20),
    status: 'approved',
  },
  {
    id: 'seed-hd-4',
    room: 'help_desk',
    username: '@StarterSam',
    content:
      'How do I stop it from inventing policies my company definitely does not have?',
    likes: 41,
    commentsCount: 14,
    createdAt: hoursAgo(6),
    status: 'approved',
  },
  {
    id: 'seed-hd-5',
    room: 'help_desk',
    username: '@ManagerMo',
    content:
      'Team wants one shared AI voice. Do we train one profile or fight about it forever?',
    likes: 36,
    commentsCount: 9,
    createdAt: hoursAgo(13),
    status: 'approved',
  },
  {
    id: 'seed-hd-6',
    room: 'help_desk',
    username: '@QuietQuinn',
    content:
      'Mine adds exclamation points to everything. I sound like a golden retriever. Help.',
    likes: 27,
    commentsCount: 6,
    createdAt: hoursAgo(19),
    status: 'approved',
  },
  {
    id: 'seed-wc-8',
    room: 'water_cooler',
    username: '@JamieJokes',
    content:
      'It summarized my inbox as "mostly fine." That\'s not a KPI, ChatGPT. That\'s a vibe.',
    likes: 22,
    commentsCount: 2,
    createdAt: hoursAgo(25),
    status: 'approved',
  },
  {
    id: 'seed-tr-8',
    room: 'training_room',
    username: '@PatriciaPDX',
    content:
      'Paste your job description once a month. Mine stopped guessing I\'m in sales when I\'m in support.',
    likes: 53,
    commentsCount: 7,
    createdAt: hoursAgo(24),
    status: 'approved',
  },
  {
    id: 'seed-hd-7',
    room: 'help_desk',
    username: '@AlexAustin',
    content:
      'Is it normal that mine apologizes three times before answering a yes/no question?',
    likes: 48,
    commentsCount: 12,
    createdAt: hoursAgo(21),
    status: 'approved',
  },
  {
    id: 'seed-wc-9',
    room: 'water_cooler',
    username: '@ChrisChicago',
    content:
      'My AI called a spreadsheet "a tapestry of human ambition." I just needed totals.',
    likes: 61,
    commentsCount: 9,
    createdAt: hoursAgo(28),
    status: 'approved',
  },
  {
    id: 'seed-tr-9',
    room: 'training_room',
    username: '@HelenHaiFan',
    content:
      'Give it names for drafts: "messy draft" vs "send to boss." Stops the perfection spiral.',
    likes: 77,
    commentsCount: 13,
    createdAt: hoursAgo(26),
    status: 'approved',
  },
  {
    id: 'seed-hd-8',
    room: 'help_desk',
    username: '@TaylorTampa',
    content:
      'Confidential docs in prompts — what\'s the line? Our IT guy said "please don\'t."',
    likes: 34,
    commentsCount: 15,
    createdAt: hoursAgo(30),
    status: 'approved',
  },
]

export function formatPostTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
