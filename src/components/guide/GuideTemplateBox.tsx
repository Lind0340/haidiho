'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  content: string
}

export function GuideTemplateBox({ content }: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative my-10 w-full rounded-xl border-2 border-dashed border-hai-blue bg-[#fffdf8] p-5 pt-12 shadow-[0_4px_14px_rgba(74,144,217,0.12)] sm:p-6 sm:pt-12">
      <span
        className="absolute -left-1 top-3 h-6 w-10 -rotate-6 bg-[#f5e6c8]/95 shadow-sm"
        aria-hidden
      />
      <button
        type="button"
        onClick={copy}
        className="absolute right-4 top-4 rounded-lg border border-hai-blue/30 bg-hai-blue/10 px-3 py-1.5 text-xs font-bold text-hai-blue transition-colors hover:bg-hai-blue/20"
      >
        {copied ? 'Copied ❤️' : 'Copy'}
      </button>
      <span className="absolute left-5 top-4 text-sm font-extrabold text-hai-blue">Try This →</span>
      <pre
        className={cn(
          'whitespace-pre-wrap font-mono text-[15px] font-medium leading-[1.75] text-soft-charcoal/90',
        )}
      >
        {content}
      </pre>
    </div>
  )
}
