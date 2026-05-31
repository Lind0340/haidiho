import { HeroSection } from '@/components/home/HeroSection'
import { SoWhatSection } from '@/components/home/SoWhatSection'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { fetchHomeLatestStrip } from '@/lib/data/home'

export default async function HomePage() {
  const latestStrip = await fetchHomeLatestStrip()

  return (
    <div className="site-container flex min-h-screen flex-1 flex-col py-4 sm:py-6">
      <SiteHeader embedded />
      <HeroSection latestStrip={latestStrip} />
      <SoWhatSection />
    </div>
  )
}
