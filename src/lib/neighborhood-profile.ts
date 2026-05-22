/** Display handle for neighborhood posts from a profile row or email fallback. */
export function neighborhoodDisplayName(
  profile: { username: string | null; display_name: string | null } | null | undefined,
  email?: string | null,
) {
  if (profile?.display_name) return profile.display_name
  if (profile?.username) {
    const u = profile.username.replace(/^@/, '')
    return u ? `@${u}` : '@neighbor'
  }
  if (email) {
    const local = email.split('@')[0]?.trim()
    if (local) return `@${local}`
  }
  return '@neighbor'
}
