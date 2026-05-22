import { MugWallPage } from '@/components/mug-wall/MugWallPage'
import { fetchApprovedMugs } from '@/lib/data/mugs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'the mug wall',
  description:
    'Real mugs. Real people. Real conversations. A wall of mugs from humans training their AI coworkers.',
}

export default async function MugsPage() {
  const { mugs, featuredId } = await fetchApprovedMugs()
  return <MugWallPage mugs={mugs} featuredId={featuredId} />
}
