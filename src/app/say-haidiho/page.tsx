import type { Metadata } from 'next'
import { SayHaidihoLanding } from '@/components/say-haidiho/SayHaidihoLanding'

export const metadata: Metadata = {
  title: 'Say Haidiho',
  description:
    'Subscribe to the Weekly Neighborhood Digest — stories, tips, cork-board gems, and the occasional COMPLIANCE update. One email a week. Good stuff only.',
}

export default function SayHaidihoPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-2 py-6 sm:px-4 sm:py-8">
      <SayHaidihoLanding />
    </div>
  )
}
