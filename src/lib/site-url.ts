/**
 * Canonical site URL for emails, auth redirects, and metadata.
 * On Vercel, set NEXT_PUBLIC_SITE_URL in Project → Environment Variables.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    return process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/$/, '')
  }

  if (process.env.NEXT_PUBLIC_APP_URL?.trim()) {
    return process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, '')
  }

  // Vercel production domain (preferred over preview *.vercel.app when set)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/$/, '')}`
  }

  if (process.env.VERCEL_URL?.trim()) {
    return `https://${process.env.VERCEL_URL.trim().replace(/\/$/, '')}`
  }

  return 'https://haidiho.com'
}

/** Client-safe: only public env vars (set on Vercel for Production + Preview). */
export function getPublicSiteUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/$/, '')
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000'
  )
    .trim()
    .replace(/\/$/, '')
}
