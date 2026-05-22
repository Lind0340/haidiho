'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonProps = {
  href?: string
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'outline' | 'ghost'
  wiggle?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}

const variants = {
  primary: 'bg-hai-blue text-diho-cream hover:bg-hai-blue/90 shadow-md',
  outline:
    'border-2 border-hai-blue text-hai-blue bg-transparent hover:bg-hai-blue/10',
  ghost: 'text-hai-blue hover:bg-hai-blue/10',
}

export function Button({
  href,
  children,
  className,
  variant = 'primary',
  wiggle = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition-colors',
    variants[variant],
    className,
  )

  const motionProps = wiggle
    ? {
        whileHover: { rotate: [-1, 1, -1, 0], transition: { duration: 0.4 } },
      }
    : {}

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  )
}
