import { createAdminClient } from '@/lib/supabase-server'
import type { SiteSetting } from '@/types/database'

export default async function AdminMerchPage() {
  const admin = createAdminClient()
  let storeActive = false
  let products: { name: string; slug: string; status: string; character: string | null }[] = []

  if (admin) {
    const { data: setting } = await admin
      .from('site_settings')
      .select('value')
      .eq('key', 'merch_store_active')
      .maybeSingle()
    const val = (setting as Pick<SiteSetting, 'value'> | null)?.value
    storeActive = val === true || val === 'true'

    const { data } = await admin
      .from('products')
      .select('name, slug, status, character')
      .order('name')
      .limit(30)
    products = (data ?? []) as typeof products
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        Merch
      </h1>
      <p className="mt-2 text-sm font-semibold">
        Store visible to users:{' '}
        <span className={storeActive ? 'text-hai-blue' : 'text-warm-pink'}>
          {storeActive ? 'ON' : 'OFF (draft mode)'}
        </span>
      </p>
      <ul className="mt-6 max-h-96 space-y-1 overflow-auto text-sm">
        {products.map((p) => (
          <li key={p.slug}>
            {p.name} — {p.character} — {p.status}
          </li>
        ))}
      </ul>
    </div>
  )
}
