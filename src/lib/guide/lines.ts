import type { GuideCalloutLine } from '@/lib/guide/types'

/** Character dialogue — italic, reads as spoken */
export function say(text: string): GuideCalloutLine {
  return { kind: 'spoken', text }
}

/** Stage direction / narrator — regular, muted */
export function stage(text: string): GuideCalloutLine {
  return { kind: 'narration', text }
}

/** Punchy tag line (Done. ✅, etc.) */
export function tag(text: string): GuideCalloutLine {
  return { kind: 'tag', text }
}
