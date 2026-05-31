/** Write a browser preview of the confirm email. Usage: node scripts/preview-confirm-email.mjs */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnvLocal() {
  const path = resolve(root, '.env.local')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvLocal()

const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://haidiho.com'
).replace(/\/$/, '')

const email = process.argv[2] ?? 'wade.lindgren@gmail.com'
const html = readFileSync(resolve(root, 'supabase/email-templates/confirm-signup.html'), 'utf8')
  .replaceAll('{{ .SiteURL }}', siteUrl)
  .replaceAll('{{ .ConfirmationURL }}', `${siteUrl}/auth/confirm?sample=1`)
  .replaceAll('{{ .Email }}', email)

const outDir = resolve(root, 'email-preview')
mkdirSync(outDir, { recursive: true })
const out = resolve(outDir, 'confirm-signup-sample.html')
writeFileSync(out, html, 'utf8')
console.log(`Preview written: ${out}`)
