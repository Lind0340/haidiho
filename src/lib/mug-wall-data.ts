export type MugWallEntry = {
  id: string
  /** Full polaroid art — mug, pin/tape, and name label */
  polaroidSrc: string
  mugText: string
  /** Why they love this mug — optional submission field */
  mugLove?: string
  name: string
  role: string
  rotate: number
  isFeatured?: boolean
}

export const MUG_WALL_ENTRIES: MugWallEntry[] = [
  {
    id: 'jess',
    polaroidSrc: '/images/mug-wall/polaroids/jess.png',
    mugText: 'OPTIMIZE AUTOMATE ELEVATE',
    name: 'Jess',
    role: 'Marketing Optimizer',
    rotate: -4,
  },
  {
    id: 'mike',
    polaroidSrc: '/images/mug-wall/polaroids/mike.png',
    mugText: 'COFFEE: SURVIVAL FUEL',
    name: 'Mike',
    role: 'Process Wrangler',
    rotate: 3,
  },
  {
    id: 'priya',
    polaroidSrc: '/images/mug-wall/polaroids/priya.png',
    mugText: 'AI sidekick in training',
    name: 'Priya',
    role: 'AI Ops Manager',
    rotate: -2,
  },
  {
    id: 'sam',
    polaroidSrc: '/images/mug-wall/polaroids/sam.png',
    mugText: 'TALK TO MY AI',
    name: 'Sam',
    role: 'Founder',
    rotate: 5,
  },
  {
    id: 'leah',
    polaroidSrc: '/images/mug-wall/polaroids/leah.png',
    mugText: 'CHAOS COORDINATOR (Thanks, AI)',
    name: 'Leah',
    role: 'Creative Director',
    rotate: -3,
  },
  {
    id: 'dan',
    polaroidSrc: '/images/mug-wall/polaroids/dan.png',
    mugText: 'DATA IS MY LOVE LANGUAGE',
    name: 'Dan',
    role: 'Data Nerd',
    rotate: 4,
  },
  {
    id: 'tasha',
    polaroidSrc: '/images/mug-wall/polaroids/tasha.png',
    mugText: 'LESS WORK MORE POSSIBILITIES',
    name: 'Tasha',
    role: 'Biz Ops Boss',
    rotate: -5,
  },
  {
    id: 'alex',
    polaroidSrc: '/images/mug-wall/polaroids/alex.png',
    mugText: 'BUILDING THE FUTURE TOGETHER',
    name: 'Alex',
    role: 'Product Builder',
    rotate: 2,
  },
]
