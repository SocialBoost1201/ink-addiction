import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import Link from 'next/link'

export const metadata: Metadata = {
  title: {
    default: 'INK ADDICTION | タトゥースタジオ',
    template: '%s | INK ADDICTION',
  },
  description:
    '完全予約制のタトゥースタジオ INK ADDICTION。和彫・洋彫・アニメ・ファインラインなど多彩なジャンルに対応。衛生管理徹底、まずは無料相談から。',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'INK ADDICTION',
    title: 'INK ADDICTION | タトゥースタジオ',
    description: '完全予約制のタトゥースタジオ INK ADDICTION。和彫・洋彫・アニメ・ファインラインなど多彩なジャンルに対応。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INK ADDICTION | タトゥースタジオ',
    description: '完全予約制のタトゥースタジオ INK ADDICTION。和彫・洋彫・アニメ・ファインラインなど多彩なジャンルに対応。',
  },
  robots: { index: true, follow: true },
}

const footerLinks = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/styles', label: 'Styles' },
  { href: '/availability', label: 'Availability' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/inquiry', label: 'Contact' },
]

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <div id="main-content">
          {children}
        </div>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <div className="site-footer__top">
              <div className="site-footer__brand">
                <Link href="/" className="site-footer__logo">INK ADDICTION</Link>
                <p className="site-footer__tagline">完全予約制タトゥースタジオ — Tokyo</p>
              </div>
              <nav className="site-footer__nav" aria-label="フッターナビ">
                {footerLinks.map((l) => (
                  <Link key={l.href} href={l.href}>{l.label}</Link>
                ))}
              </nav>
            </div>
            <div className="site-footer__rule" aria-hidden="true" />
            <div className="site-footer__bottom">
              <p className="site-footer__copy">
                © {new Date().getFullYear()} INK ADDICTION. All rights reserved.
              </p>
              <div className="site-footer__legal">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/safety">衛生管理について</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
