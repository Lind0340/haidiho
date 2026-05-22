import Anthropic from '@anthropic-ai/sdk'
import { AI_MODERATOR_SYSTEM_PROMPT } from '@/lib/ai-moderator-prompt'
import type { RoomId } from '@/types/database'

export type ModerationDecision = 'approve' | 'reject'

export type ModerationVerdict = {
  decision: ModerationDecision
  reason: string
  userMessage: string
  viaAi: boolean
}

const ROOM_LABELS: Record<RoomId, string> = {
  water_cooler: 'Water Cooler (casual stories)',
  training_room: 'Training Room (tips & how-tos)',
  help_desk: 'Help Desk (questions & advice)',
}

function getAnthropicKey() {
  return process.env.ANTHROPIC_API_KEY?.trim() || null
}

function parseVerdictJson(raw: string): ModerationVerdict | null {
  const trimmed = raw.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      decision?: string
      reason?: string
      user_message?: string
    }
    const decision = parsed.decision === 'reject' ? 'reject' : 'approve'
    return {
      decision,
      reason: String(parsed.reason ?? '').trim() || 'No reason given',
      userMessage:
        decision === 'reject'
          ? String(parsed.user_message ?? '').trim() ||
            "That one doesn't fit the neighborhood vibe — try a workplace or AI coworker angle? ❤️"
          : '',
      viaAi: true,
    }
  } catch {
    return null
  }
}

/** Lightweight fallback when Anthropic is not configured. */
function rulesFallback(content: string): ModerationVerdict {
  const lower = content.toLowerCase()
  const blocked = [/\b(kill|kys)\s+(yourself|urself)\b/]
  for (const pattern of blocked) {
    if (pattern.test(lower)) {
      return {
        decision: 'reject',
        reason: 'Matched safety blocklist',
        userMessage:
          "Hai couldn't post that — keep it about AI-at-work and skip links or harsh stuff. ❤️",
        viaAi: false,
      }
    }
  }
  return {
    decision: 'approve',
    reason: 'Auto-approved (AI moderator not configured)',
    userMessage: '',
    viaAi: false,
  }
}

export async function reviewNeighborhoodContent(opts: {
  content: string
  contentType: 'story' | 'post' | 'comment'
  room?: RoomId | null
}): Promise<ModerationVerdict> {
  const apiKey = getAnthropicKey()
  if (!apiKey) return rulesFallback(opts.content)

  const anthropic = new Anthropic({ apiKey })
  const roomLine = opts.room
    ? `Room: ${ROOM_LABELS[opts.room]}\n`
    : ''
  const typeLabel =
    opts.contentType === 'story'
      ? 'story submission'
      : opts.contentType === 'post'
        ? 'feed post'
        : 'comment/reply'

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
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
    const parsed = parseVerdictJson(raw)
    if (parsed) return parsed

    console.warn('[ai-moderator] unparseable response, approving:', raw.slice(0, 200))
    return {
      decision: 'approve',
      reason: 'AI response unparseable; approved by fallback',
      userMessage: '',
      viaAi: true,
    }
  } catch (err) {
    console.error('[ai-moderator]', err)
    return rulesFallback(opts.content)
  }
}
