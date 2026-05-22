import type { Metadata } from 'next'
import { Caveat, Comic_Neue, Lora, Nunito } from 'next/font/google'
import { SiteChrome } from '@/components/layout/SiteChrome'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800'],
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['500', '600', '700'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['600', '700'],
})

const comicNeue = Comic_Neue({
  subsets: ['latin'],
  variable: '--font-comic',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'haidiho — your guide to your AI coWorker',
    template: '%s | haidiho',
  },
  description:
    'A warm, funny community teaching humans how to care for, feed, and train their AI coworker.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://haidiho.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${caveat.variable} ${lora.variable} ${comicNeue.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
