export type StripEntry = {
  id: string
  number: number
  title: string
  /** Footer copy — use \\n for line breaks as in the strip art. */
  caption: string
  /** When true, the final line renders as a highlighted punchline. */
  emphasizeLastLine?: boolean
  imageSrc: string
  imageWidth: number
  imageHeight: number
  slug?: string
  category?: string
  inspiredByMember?: string
}

/** Chronological story order — 001 (First Day) through 007 (Billable Hours). */
export const STRIP_ENTRIES: StripEntry[] = [
  {
    id: 'strip-001',
    number: 1,
    title: 'First Day',
    caption:
      'This is Hai. This is DiHo. They work together.\nOne of them has seventeen suggestions.\nOne of them needs more coffee.\nWelcome to Haidiho.',
    emphasizeLastLine: true,
    imageSrc: '/images/strips/strip-001.png',
    imageWidth: 1024,
    imageHeight: 682,
  },
  {
    id: 'strip-002',
    number: 2,
    title: 'Processing',
    caption:
      'Hai processes approximately 2 million pieces of information per day.\nThis one took a little longer.\n“Thanks Hai. Good work today.”\nEntry 247: Sometimes two words mean everything.',
    emphasizeLastLine: true,
    imageSrc: '/images/strips/strip-002.png',
    imageWidth: 1024,
    imageHeight: 682,
  },
  {
    id: 'strip-003',
    number: 3,
    title: 'Monday',
    caption:
      '8:59am. Monday.\nHai has prepared 47 things.\nDiHo has prepared a coat she hasn’t taken off yet.\nThis happens every week.\nNeither of them is wrong.',
    emphasizeLastLine: true,
    imageSrc: '/images/strips/strip-003.png',
    imageWidth: 1024,
    imageHeight: 682,
  },
  {
    id: 'strip-004',
    number: 4,
    title: 'The Help Desk',
    caption:
      'One desperate question. Four words of wisdom.\nThree follow-ups. Zero additional words.\nThe Help Desk. We help. Then we stop.',
    emphasizeLastLine: true,
    imageSrc: '/images/strips/strip-004.png',
    imageWidth: 1024,
    imageHeight: 682,
  },
  {
    id: 'strip-005',
    number: 5,
    title: 'Compliance Training',
    caption:
      'Hai finished on May 1st. Score: 100%.\nThree improvement suggestions included.\nDiHo’s was due May 15th.\nIt is May 19th.\nThe CEO knows.',
    emphasizeLastLine: true,
    imageSrc: '/images/strips/strip-005.png',
    imageWidth: 1024,
    imageHeight: 682,
  },
  {
    id: 'strip-006',
    number: 6,
    title: 'Better Than Me',
    caption:
      '“How can you do me better than me?” DiHo asked.\nHai analyzed her writing personality.\nHe admired her. He also fixed her. 😇',
    imageSrc: '/images/strips/strip-006.png',
    imageWidth: 1024,
    imageHeight: 682,
  },
  {
    id: 'strip-007',
    number: 7,
    title: 'Billable Hours',
    caption:
      'DiHo ate a sandwich at her desk on Tuesday.\nHai logged it under Professional Development.\nIt seemed accurate.',
    emphasizeLastLine: true,
    imageSrc: '/images/strips/strip-007.png',
    imageWidth: 1024,
    imageHeight: 682,
  },
].sort((a, b) => a.number - b.number)
