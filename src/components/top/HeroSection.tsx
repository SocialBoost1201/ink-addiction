import Link from 'next/link'

const TICKER_TEXT = [
  'INK ADDICTION',
  'TATTOO ARTIST',
  'TOKYO',
  'CUSTOM DESIGN',
  'APPOINTMENT ONLY',
  'HAND-CRAFTED INK',
  '完全予約制',
]

const tickerString = TICKER_TEXT.map((t) => `${t} ✦`).join('  ') + '  '

export function HeroSection() {
  return (
    <section className="hero" aria-label="INK ADDICTION ヒーロー">
      {/* Animated red rule */}
      <div className="hero__rule" aria-hidden="true" />

      {/* Background watermark */}
      <p className="hero__watermark" aria-hidden="true">INK</p>

      {/* Main body */}
      <div className="hero__body">
        <div className="hero__left">
          {/* Top meta row */}
          <div className="hero__meta">
            <span className="hero__eyebrow">Tattoo Studio — Tokyo</span>
            <span className="hero__est">Est. 2020</span>
          </div>

          {/* Title */}
          <h1 className="hero__heading">
            <span className="hero__heading-ink">INK</span>
            <span className="hero__heading-addiction">ADDICTION</span>
          </h1>

          {/* Tagline */}
          <p className="hero__tagline">
            彫ることは、<br />生き方の表明だ。
          </p>

          {/* CTA */}
          <div className="hero__actions">
            <Link href="/gallery" className="hero__btn-primary">
              作品を見る
              <span aria-hidden="true">——→</span>
            </Link>
            <Link href="/inquiry" className="hero__btn-ghost">
              無料相談
            </Link>
          </div>
        </div>

        {/* Right sidebar: vertical text + scroll indicator */}
        <div className="hero__sidebar" aria-hidden="true">
          <span className="hero__vert">彫刺師</span>
          <div className="hero__scroll-wrap">
            <span className="hero__scroll-line" />
            <span className="hero__scroll-label">Scroll</span>
          </div>
        </div>
      </div>

      {/* Marquee ticker — pure CSS animation, no JS needed */}
      <div className="hero__ticker" aria-hidden="true">
        <div className="hero__ticker-track">
          {/* Two identical sets for seamless loop */}
          <div className="hero__ticker-set">
            <span className="hero__ticker-item">{tickerString}</span>
          </div>
          <div className="hero__ticker-set">
            <span className="hero__ticker-item">{tickerString}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
