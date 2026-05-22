export type GuideCharacter = 'hai' | 'diho' | 'bob' | 'derek' | 'trisha' | 'compliance'

/** spoken = character voice (italic); narration = stage/context; tag = punchline sign-off */
export type GuideCalloutLine =
  | { kind: 'spoken'; text: string }
  | { kind: 'narration'; text: string }
  | { kind: 'tag'; text: string }

export type GuideDialogueLine = {
  speaker: 'hai' | 'diho'
  text: string
  /** Default spoken — italic dialogue after the name */
  kind?: 'spoken' | 'narration'
}

export type GuideBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'hai_note'; lines: GuideDialogueLine[] }
  | { type: 'aside'; text: string }
  | {
      type: 'callout'
      character: GuideCharacter
      title: string
      lines: GuideCalloutLine[]
      footer?: string
    }
  | { type: 'template'; content: string }
  | { type: 'water_cooler'; quote: string; author: string }
  | { type: 'transition'; text: string }
  | { type: 'illustration'; caption: string }

export type GuideChapter = {
  id: string
  number: number
  label: string
  title: string
  subhead: string
  blocks: GuideBlock[]
  compliance: string
}
