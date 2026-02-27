import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: {
    default: 'INK ADDICTION | タトゥースタジオ',
    template: '%s | INK ADDICTION',
  },
  description:
    '完全予約制のタトゥースタジオ INK ADDICTION。和彫・洋彫・アニメ・ファインラインなど多彩なジャンルに対応。衛生管理徹底、まずは無料相談から。',
}

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
            <p className="site-footer__logo">INK ADDICTION</p>
            <nav className="site-footer__nav" aria-label="フッターナビ">
              <a href="/gallery">Gallery</a>
              <a href="/styles">Styles</a>
              <a href="/availability">Availability</a>
              <a href="/pricing">Pricing</a>
              <a href="/faq">FAQ</a>
              <a href="/inquiry">Contact</a>
            </nav>
            <p className="site-footer__copy">
              © {new Date().getFullYear()} INK ADDICTION. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
