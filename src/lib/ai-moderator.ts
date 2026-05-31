import Anthropic from '@anthropic-ai/sdk'
import { AI_MODERATOR_SYSTEM_PROMPT } from '@/lib/ai-moderator-prompt'
import type { RoomId } from '@/types/database'

export type AiConfidence = 'high' | 'medium' | 'low'

export type AiModerationResult = {
  approved: boolean
  confidence: AiConfidence
  reason: string
  flags: string[]
}

/** Legacy shape used by submission routes */
export type ModerationDecision = 'approve' | 'reject'

export type ModerationVerdict = {
  decision: ModerationDecision
  reason: string
  userMessage: string
  viaAi: boolean
  ai: AiModerationResult
  /** True when content stays pending for Wade after AI pass */
  awaitingHumanReview: boolean
}

export const AI_REJECTION_USER_MESSAGE =
  "Thanks for sharing! We reviewed your post and it wasn't quite right for the neighborhood this time. Feel free to try again. ❤️"

const ROOM_LABELS: Record<RoomId, string> = {
  water_cooler: 'Water Cooler (casual stories)',
  training_room: 'Training Room (tips & how-tos)',
  help_desk: 'Help Desk (questions & advice)',
}

function getAnthropicKey() {
  return process.env.ANTHROPIC_API_KEY?.trim() || null
}

export function parseAiModerationJson(raw: string): AiModerationResult | null {
  const trimmed = raw.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      approved?: boolean
      confidence?: string
      reason?: string
      flags?: unknown
    }
    const confidence =
      parsed.confidence === 'low' || parsed.confidence === 'medium' ? parsed.confidence : 'high'
    const flags = Array.isArray(parsed.flags)
      ? parsed.flags.map((f) => String(f)).filter(Boolean)
      : []
    return {
      approved: parsed.approved !== false,
      confidence,
      reason: String(parsed.reason ?? '').trim() || 'No reason given',
      flags,
    }
  } catch {
    return null
  }
}

function rulesFallback(content: string): AiModerationResult {
  const lower = content.toLowerCase()
  const blocked = [/\b(kill|kys)\s+(yourself|urself)\b/]
  for (const pattern of blocked) {
    if (pattern.test(lower)) {
      return {
        approved: false,
        confidence: 'high',
        reason: 'Matched safety blocklist',
        flags: ['safety'],
      }
    }
  }
  return {
    approved: true,
    confidence: 'low',
    reason: 'Auto-queued (AI moderator not configured)',
    flags: ['needs_human_review'],
  }
}

export function verdictFromAiResult(ai: AiModerationResult): ModerationVerdict {
  if (!ai.approved) {
    return {
      decision: 'reject',
      reason: ai.reason,
      userMessage: AI_REJECTION_USER_MESSAGE,
      viaAi: true,
      ai,
      awaitingHumanReview: false,
    }
  }

  return {
    decision: 'approve',
    reason: ai.reason,
    userMessage: '',
    viaAi: true,
    ai,
    awaitingHumanReview: ai.confidence === 'low',
  }
}

export async function reviewContentWithClaude(opts: {
  content: string
  room?: RoomId | null
  contentType?: 'story' | 'post' | 'comment'
}): Promise<AiModerationResult> {
  const apiKey = getAnthropicKey()
  if (!apiKey) return rulesFallback(opts.content)

  const anthropic = new Anthropic({ apiKey })
  const roomLine = opts.room ? `Room: ${ROOM_LABELS[opts.room]}\n` : ''
  const typeLabel =
    opts.contentType === 'story'
      ? 'story submission'
      : opts.contentType === 'post'
        ? 'neighborhood post'
        : opts.contentType === 'comment'
          ? 'comment/reply'
          : 'community post'

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      temperature: 0,
      system: AI_MODERATOR_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `${roomLine}Content type: ${typeLabel}\n\n---\n${opts.content}\n---`,
        },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const raw = textBlock && textBlock.type === 'text' ? textBlock.text : ''
    const parsed = parseAiModerationJson(raw)
    if (parsed) return parsed

    console.warn('[ai-moderator] unparseable response, needs human review:', raw.slice(0, 200))
    return {
      approved: true,
      confidence: 'low',
      reason: 'AI response unparseable; queued for human review',
      flags: ['unparseable_ai_response'],
    }
  } catch (err) {
    console.error('[ai-moderator]', err)
    return rulesFallback(opts.content)
  }
}

/** @deprecated Use reviewContentWithClaude — kept for callers */
export async function reviewNeighborhoodContent(opts: {
  content: string
  contentType: 'story' | 'post' | 'comment'
  room?: RoomId | null
}): Promise<ModerationVerdict> {
  const ai = await reviewContentWithClaude(opts)
  return verdictFromAiResult(ai)
}
