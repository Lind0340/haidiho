'use client'

import { createClient } from '@/lib/supabase'
import type { UserRole } from '@/types/database'

export async function signUp(email: string, password: string, username: string) {
  const supabase = createClient()
  if (!supabase) throw new Error('Supabase not configured')

  const handle = username.replace(/^@/, '').trim()
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: handle, display_name: `@${handle}` },
      emailRedirectTo: `${siteUrl.replace(/\/$/, '')}/auth/confirm`,
    },
  })
  if (error) throw error

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      username: handle,
      display_name: `@${handle}`,
    })
  }

  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signInWithMagicLink(email: string) {
  const supabase = createClient()
  if (!supabase) throw new Error('Supabase not configured')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/confirm` },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createClient()
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getSession() {
  const supabase = createClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getCurrentUser() {
  const supabase = createClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getProfile(userId: string) {
  const supabase = createClient()
  if (!supabase) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function isAdmin(userId: string) {
  const profile = await getProfile(userId)
  return profile?.role === 'admin'
}

export async function isModerator(userId: string) {
  const profile = await getProfile(userId)
  return profile?.role === 'moderator' || profile?.role === 'admin'
}

export function hasRole(role: UserRole | null | undefined, allowed: UserRole[]) {
  return role != null && allowed.includes(role)
}
