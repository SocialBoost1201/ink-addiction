import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="hero" aria-label="ヒーローセクション">
      <div className="hero__bg" aria-hidden="true">
        {/* 将来: 作品画像 or 動画を背景に設定 */}
        <div className="hero__gradient" />
      </div>
      <div className="hero__content">
        <p className="hero__eyebrow">Tattoo Studio</p>
        <h1 className="hero__title">
          <span className="hero__title-line">INK</span>
          <span className="hero__title-line hero__title-line--accent">ADDICTION</span>
        </h1>
        <p className="hero__copy">
          彫ることは、生き方の表明だ。
        </p>
        <div className="hero__actions">
          <Link href="/gallery" className="btn btn--primary">
            作品を見る
          </Link>
          <Link href="/inquiry" className="btn btn--ghost">
            無料相談
          </Link>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-label">Scroll</span>
      </div>
    </section>
  )
}
