'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect } from 'react'
import { StripCaption } from '@/components/strip/StripCaption'
import { FilledHeart } from '@/components/mug-wall/MugWallDecor'
import type { StripEntry } from '@/lib/strip-data'

type StripModalProps = {
  strip: StripEntry | null
  onClose: () => void
}

export function StripModal({ strip, onClose }: StripModalProps) {
  useEffect(() => {
    if (!strip) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [strip, onClose])

  return (
    <AnimatePresence>
      {strip && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="strip-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-soft-charcoal/70 backdrop-blur-[2px]"
            aria-label="Close strip"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[20px] border border-[#ead8c2] bg-[#fff6e8] shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#ead8c2]/80 px-4 py-3 sm:px-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-hai-blue">
                  Strip {String(strip.number).padStart(3, '0')}
                </p>
                <h2
                  id="strip-modal-title"
                  className="flex items-center gap-1.5 font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal sm:text-3xl"
                >
                  {strip.title}
                  <FilledHeart className="text-lg" />
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-[#ead8c2] bg-diho-cream px-3 py-1.5 text-sm font-bold text-soft-charcoal hover:bg-hai-blue/10"
              >
                Close ✕
              </button>
            </div>

            <div className="overflow-y-auto">
              <Image
                src={strip.imageSrc}
                alt={`${strip.title} — full strip`}
                width={strip.imageWidth}
                height={strip.imageHeight}
                className="h-auto w-full"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
              <div className="border-t border-[#ead8c2]/60 px-4 py-4 sm:px-5">
                <StripCaption text={strip.caption} emphasizeLastLine={strip.emphasizeLastLine} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
