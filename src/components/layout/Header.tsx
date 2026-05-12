'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/styles', label: 'Styles' },
  { href: '/availability', label: 'Availability' },
  { href: '/artist', label: 'Artist' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <Link
          href="/"
          className="site-header__logo"
          aria-label="INK ADDICTION トップへ"
        >
          INK ADDICTION
        </Link>

        <nav className="site-header__nav" aria-label="メインナビゲーション">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="site-nav__link">
              {l.label}
            </Link>
          ))}
          <Link href="/inquiry" className="site-nav__cta">
            Contact
          </Link>
        </nav>

        <button
          className={`site-header__burger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="site-mobile-nav"
          aria-label="モバイルナビゲーション"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="site-mobile-nav__link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/inquiry"
            className="site-mobile-nav__cta"
            onClick={() => setMenuOpen(false)}
          >
            Contact — 無料相談
          </Link>
        </nav>
      )}
    </header>
  )
}
