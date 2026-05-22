import Anthropic from '@anthropic-ai/sdk'
import { HAIBOT_SYSTEM_PROMPT } from '@/lib/haibot-prompt'
import { NextResponse } from 'next/server'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function getAnthropicKey() {
  return process.env.ANTHROPIC_API_KEY?.trim() || null
}

/** GET /api/haibot — check whether the server loaded your API key (no secret exposed). */
export async function GET() {
  const key = getAnthropicKey()
  return NextResponse.json({
    configured: Boolean(key),
    hint: key
      ? 'ANTHROPIC_API_KEY is loaded. Hai There! should work.'
      : 'Add ANTHROPIC_API_KEY=sk-ant-... to .env.local (same line, no spaces), save, then restart npm run dev.',
  })
}

export async function POST(request: Request) {
  const apiKey = getAnthropicKey()
  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'ANTHROPIC_API_KEY is not configured',
        hint: 'In .env.local use ANTHROPIC_API_KEY=sk-ant-... on one line, save the file, restart the dev server.',
      },
      { status: 503 },
    )
  }

  let body: { messages?: ChatMessage[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const messages = body.messages?.filter((m) => m.content?.trim()) ?? []
  if (messages.length === 0) {
    return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
  }

  const anthropic = new Anthropic({ apiKey })

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      temperature: 1,
      system: HAIBOT_SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const reply = textBlock && textBlock.type === 'text' ? textBlock.text : ''

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[haibot]', err)
    return NextResponse.json({ error: 'Failed to reach Hai' }, { status: 500 })
  }
}
