import { HeroSection } from '@/components/home/HeroSection'
import { SoWhatSection } from '@/components/home/SoWhatSection'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { fetchHomeLatestStrip } from '@/lib/data/home'

export default async function HomePage() {
  const latestStrip = await fetchHomeLatestStrip()

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1024px] flex-1 flex-col px-3 py-4 sm:px-6 lg:px-10">
      <SiteHeader embedded />
      <HeroSection latestStrip={latestStrip} />
      <SoWhatSection />
    </div>
  )
}
