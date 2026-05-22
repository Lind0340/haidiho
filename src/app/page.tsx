import { HeroSection } from '@/components/home/HeroSection'
import { HomeCommunitySection } from '@/components/home/HomeCommunitySection'
import { SoWhatSection } from '@/components/home/SoWhatSection'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { fetchHomePageData } from '@/lib/data/home'

export default async function HomePage() {
  const homeData = await fetchHomePageData()

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1024px] flex-1 flex-col px-3 py-4 sm:px-6 lg:px-10">
      <SiteHeader embedded />
      <HeroSection latestStrip={homeData.latestStrip} />
      <HomeCommunitySection data={homeData} />
      <SoWhatSection />
    </div>
  )
}
