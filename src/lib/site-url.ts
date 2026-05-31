const PRODUCTION_ORIGIN = 'https://haidiho.com'

function isLocalhostUrl(url: string): boolean {
  try {
    const host = new URL(url.includes('://') ? url : `https://${url}`).hostname
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')
  } catch {
    return false
  }
}

function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/$/, '')
}

/**
 * Public HTTPS origin for images in email HTML (Gmail cannot load localhost).
 */
export function getEmailSiteUrl(): string {
  const assetBase = process.env.EMAIL_ASSET_BASE_URL?.trim()
  if (assetBase && !isLocalhostUrl(assetBase)) {
    return normalizeOrigin(assetBase)
  }

  const publicSite = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (publicSite && !isLocalhostUrl(publicSite)) {
    return normalizeOrigin(publicSite)
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()) {
    return `https://${normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL)}`
  }

  return PRODUCTION_ORIGIN
}

/**
 * Links in email bodies (CTA, unsubscribe, footer).
 */
export function getEmailLinkUrl(): string {
  const site = getSiteUrl()
  if (isLocalhostUrl(site)) return getEmailSiteUrl()
  return site
}

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
