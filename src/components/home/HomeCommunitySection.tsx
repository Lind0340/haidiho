import Link from 'next/link'
import type { HomePageData } from '@/lib/data/home'
import { NewsletterSignup } from '@/components/forms/NewsletterSignup'
import { postRowToNeighborhood } from '@/lib/data/neighborhood'
import type { PostWithProfile } from '@/types/database'

type Props = {
  data: HomePageData
}

export function HomeCommunitySection({ data }: Props) {
  const posts = data.recentPosts.map((row) => postRowToNeighborhood(row as PostWithProfile))

  return (
    <section className="mt-10 space-y-8 pb-8">
      <div className="rounded-[18px] border border-[#ead8c2] bg-[#fff6e8] px-5 py-4 text-center shadow-[0_6px_16px_rgba(45,45,45,0.06)]">
        <p className="font-[family-name:var(--font-hand)] text-lg font-bold text-soft-charcoal">
          The neighborhood is buzzing
        </p>
        <p className="mt-1 text-sm font-semibold text-soft-charcoal/75">
          {data.stats.subscriberCount > 0 && `${data.stats.subscriberCount} subscribers · `}
          {data.stats.postCount} stories · {data.stats.mugCount} mugs on the wall
        </p>
      </div>

      {posts.length > 0 && (
        <div>
          <h2 className="font-[family-name:var(--font-hand)] text-2xl font-bold text-soft-charcoal">
            Fresh from the neighborhood
          </h2>
          <ul className="mt-3 space-y-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-[14px] border border-[#ead8c2] bg-[#fff6e8] px-4 py-3 text-sm"
              >
                <span className="font-bold">{post.username}</span>
                <p className="mt-1 font-medium text-soft-charcoal/85 line-clamp-2">{post.content}</p>
              </li>
            ))}
          </ul>
          <Link href="/neighborhood" className="mt-3 inline-block text-sm font-bold text-hai-blue hover:underline">
            See the full feed →
          </Link>
        </div>
      )}

      {data.featuredMug && (
        <div className="rounded-[18px] border border-accent-gold/40 bg-[#fff6e8] p-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-accent-gold">Mug of the week</p>
          <p className="mt-1 font-bold">{data.featuredMug.member_name}</p>
          <p className="text-sm text-soft-charcoal/80">{data.featuredMug.mug_text}</p>
        </div>
      )}

      <NewsletterSignup source="homepage" />
    </section>
  )
}
