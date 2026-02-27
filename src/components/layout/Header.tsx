import Link from 'next/link'

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo" aria-label="INK ADDICTION トップへ">
          INK ADDICTION
        </Link>
        <nav className="site-header__nav" aria-label="メインナビゲーション">
          <Link href="/gallery" className="site-nav__link">Gallery</Link>
          <Link href="/styles" className="site-nav__link">Styles</Link>
          <Link href="/availability" className="site-nav__link">Availability</Link>
          <Link href="/artist" className="site-nav__link">Artist</Link>
          <Link href="/inquiry" className="site-nav__link site-nav__link--cta">Contact</Link>
        </nav>
        {/* モバイル用ハンバーガーは将来実装 */}
      </div>
    </header>
  )
}
