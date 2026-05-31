'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from '@/lib/auth'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/types/database'
import { HaidihoErrors, friendlyError } from '@/lib/errors'

type Props = {
  profile: Profile | null
  email: string
}

export function AccountForm({ profile, email }: Props) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    if (!supabase || !profile) return
    setBusy(true)
    setError(null)
    const { error: err } = await supabase
      .from('profiles')
      .update({ display_name: displayName, bio })
      .eq('id', profile.id)
    setBusy(false)
    if (err) setError(friendlyError(err))
    else setMessage('Profile updated. Hai approves. ❤️')
  }

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="mt-6 rounded-[18px] border border-[#ead8c2] bg-[#fff6e8] p-4 sm:p-5">
      <p className="text-sm font-semibold text-soft-charcoal/70">{email}</p>
      <p className="text-xs font-bold text-hai-blue">Role: {profile?.role ?? 'member'}</p>
      <form onSubmit={save} className="mt-4 space-y-3">
        <label className="block text-xs font-bold text-soft-charcoal/70">
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="field-touch mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-base sm:text-sm"
          />
        </label>
        <label className="block text-xs font-bold text-soft-charcoal/70">
          Bio
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="field-touch mt-1 w-full rounded-lg border border-[#ead8c2] bg-diho-cream px-3 py-2 text-base sm:text-sm"
          />
        </label>
        {error && <p className="text-sm text-warm-pink">{error}</p>}
        {message && <p className="text-sm font-bold text-hai-blue">{message}</p>}
        <button
          type="submit"
          disabled={busy}
          className="field-touch rounded-xl bg-hai-blue px-4 py-3 font-bold text-diho-cream disabled:opacity-60"
        >
          Save
        </button>
      </form>
      <button
        type="button"
        onClick={handleSignOut}
        className="mt-4 text-sm font-bold text-soft-charcoal/70 hover:text-warm-pink"
      >
        Sign out
      </button>
    </div>
  )
}
