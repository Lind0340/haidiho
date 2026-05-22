'use client'

import { usePathname } from 'next/navigation'
import { SiteCanvas } from '@/components/layout/SiteCanvas'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { DiHoThere } from '@/components/dihobot/DiHoThere'
import { HaiThere } from '@/components/haibot/HaiThere'
import { PageTransition } from '@/components/motion/PageTransition'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      <PageTransition className="flex min-h-screen w-full flex-1 flex-col">
        <SiteCanvas>
          {!isHome && <SiteHeader />}
          {children}
          <SiteFooter />
        </SiteCanvas>
      </PageTransition>
      <DiHoThere />
      <HaiThere />
    </>
  )
}
