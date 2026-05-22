import type { Metadata } from 'next'
import { StripPageContent } from '@/components/strip/StripPageContent'
import { fetchPublishedStrips } from '@/lib/data/strips'

export const metadata: Metadata = {
  title: 'The Strip | Haidiho',
  description: 'Weekly cartoons from real humans training their AI coworkers.',
}

export default async function StripPage() {
  const strips = await fetchPublishedStrips()
  return <StripPageContent strips={strips} />
}
