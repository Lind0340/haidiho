export const NAV_LINKS = [
  { href: '/strip', label: 'the strip' },
  { href: '/mugs', label: 'the mug wall' },
  { href: '/neighborhood', label: 'the neighborhood' },
  { href: '/guide', label: 'the guide' },
  { href: '/say-haidiho', label: 'say haidiho' },
] as const

/** Center nav only — say haidiho lives in the header CTA button */
export const NAV_HEADER_LINKS = NAV_LINKS.filter((link) => link.href !== '/say-haidiho')
