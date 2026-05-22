import type { Metadata } from 'next'
import { GuidePageContent } from '@/components/guide/GuidePageContent'

export const metadata: Metadata = {
  title: 'The Guide',
  description:
    'So you got an AI coworker. DiHo\'s real-talk guide to the care, feeding, and training of your new favorite colleague.',
}

export default function GuidePage() {
  return <GuidePageContent />
}
