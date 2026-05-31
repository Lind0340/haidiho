'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HaiMessageContent } from '@/components/haibot/HaiMessageContent'
import { useChatLauncherPlacement } from '@/hooks/use-chat-launcher-placement'
import { cn } from '@/lib/utils'

type Message = { role: 'user' | 'assistant'; content: string }

const GREETING =
  "Hey. ☕ I'm DiHo — human worker, professional side-eye, coffee-dependent.\n\nHai's over there glowing and optimizing things. I'm here to tell you what actually worked, what absolutely did not, and whether you've had coffee yet.\n\nBring me your AI drama, your weird drafts, your \"why did it rewrite my whole personality\" moments. I'll validate you for like twelve seconds and then we'll get useful. Fair?"

/** Bump version when replacing the launcher art so browsers skip cached PNGs. */
const CHAT_ICON_VERSION = '3'
const CHAT_ICON = `/images/diho-there-chat-icon-v2.png?v=${CHAT_ICON_VERSION}`
const CHAT_ICON_WIDTH = 983
const CHAT_ICON_HEIGHT = 866

function formatMessageForClipboard(msg: Message) {
  const label = msg.role === 'user' ? 'You' : 'DiHo'
  return `${label}:\n${msg.content}`
}

export function DiHoThere() {
  const launcherPlacement = useChatLauncherPlacement('left')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const listRef = useRef<HTMLDivElement>(null)
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('diho-there:open', onOpen)
    return () => window.removeEventListener('diho-there:open', onOpen)
  }, [])

  useEffect(() => {
    if (open) scrollToBottom()
  }, [open, messages, scrollToBottom])

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current)
    }
  }, [])

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant')

  function startNewChat() {
    setMessages([{ role: 'assistant', content: GREETING }])
    setInput('')
    setCopyStatus('idle')
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('copied')
      if (copyResetRef.current) clearTimeout(copyResetRef.current)
      copyResetRef.current = setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      setCopyStatus('failed')
      if (copyResetRef.current) clearTimeout(copyResetRef.current)
      copyResetRef.current = setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  function copyLastReply() {
    if (!lastAssistantMessage) return
    void copyText(formatMessageForClipboard(lastAssistantMessage))
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/dihobot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = (await res.json()) as { reply?: string; error?: string }
      const reply =
        data.reply ??
        (res.status === 503
          ? "My brain's not plugged in yet — check ANTHROPIC_API_KEY in .env.local and restart the dev server. Hai would call this a 'configuration moment.' ☕"
          : data.error ?? "Give me a second — even the human half needs a coffee refill. ☕")
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "Something went sideways on my end. Not everything needs to be optimized — try again in a minute? ☕",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-soft-charcoal/30 backdrop-blur-sm lg:hidden"
              aria-label="Close DiHo There chat"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 z-[70] flex h-[min(85vh,640px)] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border-2 border-warm-pink/35 bg-diho-cream shadow-2xl sm:bottom-4 sm:left-4 sm:h-[min(80vh,600px)] sm:rounded-2xl"
              role="dialog"
              aria-label="DiHo There chat"
            >
              <header className="flex items-center gap-3 border-b border-warm-pink/20 bg-[#fff6e8] px-4 py-3">
                <Image
                  src={CHAT_ICON}
                  alt=""
                  width={CHAT_ICON_WIDTH}
                  height={CHAT_ICON_HEIGHT}
                  unoptimized
                  className="h-12 w-auto shrink-0 object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-[family-name:var(--font-comic)] text-lg font-bold lowercase tracking-tight text-soft-charcoal">
                    DiHo There!
                  </p>
                  <p className="text-xs font-semibold text-soft-charcoal/70">
                    Human worker · real talk, real coffee
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={startNewChat}
                    className="rounded-full px-2 py-1 text-[11px] font-bold text-soft-charcoal/60 hover:bg-warm-pink/10"
                    title="Clear thread so DiHo uses the latest voice (no server restart needed)"
                  >
                    New chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full px-3 py-1 text-sm font-bold text-soft-charcoal/60 hover:bg-warm-pink/10"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </header>

              <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((msg, i) => (
                  <div
                    key={`${msg.role}-${i}`}
                    className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'rounded-bl-md bg-soft-charcoal text-diho-cream'
                          : 'rounded-br-md border-2 border-warm-pink/25 bg-white text-soft-charcoal shadow-sm',
                      )}
                    >
                      {msg.role === 'assistant' ? (
                        <HaiMessageContent content={msg.content} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <p className="animate-pulse text-sm font-medium text-warm-pink">
                    DiHo is thinking… ☕
                  </p>
                )}
              </div>

              <div className="border-t border-warm-pink/15 bg-white px-3 pb-2 pt-2">
                <button
                  type="button"
                  onClick={copyLastReply}
                  disabled={!lastAssistantMessage || loading}
                  className="mx-auto flex w-full max-w-xs items-center justify-center gap-1.5 rounded-full border border-warm-pink/30 bg-diho-cream px-3 py-1.5 text-xs font-bold text-soft-charcoal transition-colors hover:bg-warm-pink/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copyStatus === 'copied' ? 'Copied!' : "Copy DiHo's reply"}
                </button>
                {copyStatus === 'failed' && (
                  <p className="mt-2 text-center text-xs font-semibold text-warm-pink">
                    Couldn&apos;t copy — try selecting the text manually.
                  </p>
                )}
              </div>

              <form onSubmit={sendMessage} className="border-t border-warm-pink/10 bg-white p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Say something to DiHo…"
                    className="flex-1 rounded-full border-2 border-warm-pink/25 bg-diho-cream px-4 py-2.5 text-sm outline-none focus:border-warm-pink"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="rounded-full bg-soft-charcoal px-4 py-2.5 text-sm font-bold text-diho-cream disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-3 left-3 z-50 p-0 transition-transform hover:scale-105"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        aria-expanded={open}
        aria-label={open ? 'Close DiHo There chat' : 'Open DiHo There chat'}
      >
        <Image
          src={CHAT_ICON}
          alt="DiHo There — open chat"
          width={CHAT_ICON_WIDTH}
          height={CHAT_ICON_HEIGHT}
          unoptimized
          className="h-[4.25rem] w-auto object-contain drop-shadow-[0_8px_18px_rgba(45,45,45,0.22)] sm:h-[84px]"
          sizes="84px"
          priority
        />
      </motion.button>
    </>
  )
}
