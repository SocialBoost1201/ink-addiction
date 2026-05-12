import Link from 'next/link'

const SPECS = [
  { label: 'Studio', value: 'INK ADDICTION' },
  { label: 'Style', value: '和彫 / 洋彫 / アニメ / ファインライン' },
  { label: '予約', value: '完全予約制' },
  { label: '衛生管理', value: 'ディスポーザブル器具使用 / 滅菌機完備' },
  { label: '言語', value: '日本語 / English' },
]

export function ArtistSection() {
  return (
    <section className="artist" aria-labelledby="artist-heading">
      <div className="artist__inner">
        {/* Left: text content */}
        <div className="artist__text">
          <span className="artist__section-num" aria-hidden="true">002</span>

          <p className="section-eyebrow">Artist</p>
          <h2 id="artist-heading" className="section-title">
            アーティスト<br />プロフィール
          </h2>

          <p className="artist__bio">
            東京を拠点に活動するタトゥーアーティスト。和彫の伝統的な技法から
            洋彫・アニメ・ファインラインまで、クライアント一人ひとりの身体と
            ライフスタイルに合わせたオーダーメイド作品を制作する。
            彫ることは、その人の生き方そのものを刻む行為だと信じている。
          </p>

          <dl className="artist__specs">
            {SPECS.map((s) => (
              <div key={s.label} className="artist__spec">
                <dt className="artist__spec-label">{s.label}</dt>
                <dd className="artist__spec-value">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div style={{ marginTop: '40px' }}>
            <Link href="/artist" className="btn btn--ghost">
              詳細プロフィール
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Right: image */}
        <div className="artist__image-wrap" aria-hidden="true">
          <div className="artist__image-placeholder" />
        </div>
      </div>
    </section>
  )
}
