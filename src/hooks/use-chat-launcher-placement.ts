'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/** Keeps DiHo / Hai launchers above neighborhood FABs on small screens. */
export function useChatLauncherPlacement(side: 'left' | 'right') {
  const pathname = usePathname() ?? ''
  const isNeighborhood = pathname.startsWith('/neighborhood')
  const isRoomPage =
    isNeighborhood && pathname !== '/neighborhood' && pathname.split('/').filter(Boolean).length >= 2

  const horizontal = side === 'left' ? 'left-3' : 'right-3'

  if (!isNeighborhood) {
    return cn(horizontal, 'bottom-3 max-sm:bottom-[max(0.75rem,env(safe-area-inset-bottom))]')
  }

  if (isRoomPage && side === 'right') {
    return cn(
      horizontal,
      'bottom-[calc(7.25rem+env(safe-area-inset-bottom,0px))] sm:bottom-3',
    )
  }

  return cn(horizontal, 'bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-3')
}
