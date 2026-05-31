import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { AccountForm } from '@/components/auth/AccountForm'

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) redirect('/auth/signin')

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <h1 className="font-[family-name:var(--font-hand)] text-4xl font-bold text-soft-charcoal">
        Your account
      </h1>
      <AccountForm profile={profile} email={user.email ?? ''} />
    </div>
  )
}
