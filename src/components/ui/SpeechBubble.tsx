'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type SpeechBubbleProps = {
  children: React.ReactNode
  className?: string
  tail?: 'left' | 'right' | 'bottom'
  variant?: 'hai' | 'diho' | 'neutral'
}

const variantStyles = {
  hai: 'border-hai-blue/30 bg-white text-soft-charcoal',
  diho: 'border-warm-pink/40 bg-white text-soft-charcoal',
  neutral: 'border-soft-charcoal/15 bg-white text-soft-charcoal',
}

export function SpeechBubble({
  children,
  className,
  tail = 'left',
  variant = 'neutral',
}: SpeechBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className={cn(
        'relative rounded-2xl border-2 px-4 py-3 text-sm font-medium leading-relaxed shadow-sm sm:text-base',
        variantStyles[variant],
        className,
      )}
    >
      {children}
      {tail === 'left' && (
        <span
          className="absolute -left-2 top-6 h-4 w-4 rotate-45 border-b-2 border-l-2 border-inherit bg-inherit"
          aria-hidden
        />
      )}
      {tail === 'right' && (
        <span
          className="absolute -right-2 top-6 h-4 w-4 rotate-45 border-r-2 border-t-2 border-inherit bg-inherit"
          aria-hidden
        />
      )}
    </motion.div>
  )
}
