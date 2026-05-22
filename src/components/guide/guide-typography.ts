/** Nunito body — conversational, never justified */
export const GUIDE_BODY =
  'text-left font-sans text-lg font-medium leading-[1.85] text-soft-charcoal antialiased'

/** DiHo narrative */
export const GUIDE_DIHO_VOICE =
  'text-left font-sans text-[1.125rem] font-medium leading-[1.85] text-soft-charcoal antialiased sm:text-[1.2rem]'

/** Big friendly opener (Caveat) */
export const GUIDE_OPENER =
  'font-[family-name:var(--font-hand)] text-[1.75rem] font-bold leading-snug text-guide-navy sm:text-[2rem]'

/** Emphasis beat — hand font, no boxes or rules */
export const GUIDE_BEAT =
  'font-[family-name:var(--font-hand)] text-[1.5rem] font-semibold leading-snug text-guide-navy sm:text-[1.65rem]'

/** Section labels inside chapters */
export const GUIDE_SECTION =
  'font-[family-name:var(--font-hand)] text-[1.45rem] font-bold leading-snug text-hai-blue sm:text-[1.55rem]'

/** Chapter header band — big handwritten title */
export const GUIDE_CHAPTER_TITLE =
  'font-[family-name:var(--font-hand)] text-[2.35rem] font-bold leading-[1.08] text-balance text-diho-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)] sm:text-[2.85rem]'

/** Chapter number label (Comic Neue — playful caps) */
export const GUIDE_CHAPTER_LABEL =
  'font-[family-name:var(--font-fun)] text-xs font-bold uppercase tracking-[0.2em] text-hai-blue'

/** Sidebar / compact chapter name */
export const GUIDE_CHAPTER_TITLE_SM =
  'font-[family-name:var(--font-hand)] text-[15px] font-bold leading-tight'

/** Parenthetical asides in the flow */
export const GUIDE_PAREN =
  'font-sans text-base font-semibold italic leading-[1.75] text-hai-blue'

export function isGuideSectionHeader(text: string): boolean {
  const t = text.trim()
  if (t.length > 72 || t.length < 3) return false
  if (/^(ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN):/i.test(t)) return true
  if (t.endsWith(':') && /^[A-Z0-9\s'’.,&—–!?-]+$/.test(t)) return true
  return false
}

export function isGuideOpener(text: string): boolean {
  return /^hey\.?\s+diho\s+here\.?$/i.test(text.trim())
}

/** Tight punchline — only true mic-drop moments, not every short sentence */
export function isGuidePunchline(text: string): boolean {
  const t = text.trim()
  if (t.includes('\n') || t.length > 52 || t.length < 6) return false
  if (t.startsWith('(') || t.endsWith(':')) return false
  if (t.includes('"') || t.includes('http') || t.includes(';')) return false
  if (isGuideSectionHeader(t) || isGuideOpener(t)) return false

  const words = t.split(/\s+/).length
  if (words > 10) return false

  // List-y or explanatory openers stay in normal body voice
  if (
    /^(they|your|most|every|before|after|four|open|tell|give|here|there|when|what|how|why|if|the|a|an|and|but|look|you|we|i've|i'm|i was|not |please|paste|update|check|match|working|context|diHo)/i.test(
      t,
    )
  ) {
    return false
  }

  return true
}

export function isGuideParenAside(text: string): boolean {
  const t = text.trim()
  return t.startsWith('(') && t.endsWith(')')
}

export function complianceFontSizePx(chapterNumber: number): number {
  return Math.max(5, 11 - (chapterNumber - 1))
}
