export function ArtistSection() {
  return (
    <section className="artist" aria-labelledby="artist-heading">
      <div className="artist__inner">
        <div className="artist__text">
          <p className="section-eyebrow">Artist</p>
          <h2 id="artist-heading" className="section-title">
            アーティストについて
          </h2>
          <p className="artist__bio">
            東京を拠点に活動するタトゥーアーティスト。
            和彫からアニメ・ファインラインまで、
            オーダーメイドで一人ひとりの身体に合わせた作品を制作する。
          </p>
          <ul className="artist__specs" role="list">
            <li className="artist__spec">
              <span className="artist__spec-label">スタジオ</span>
              <span className="artist__spec-value">INK ADDICTION</span>
            </li>
            <li className="artist__spec">
              <span className="artist__spec-label">スタイル</span>
              <span className="artist__spec-value">和彫 / 洋彫 / アニメ / ファインライン</span>
            </li>
            <li className="artist__spec">
              <span className="artist__spec-label">予約</span>
              <span className="artist__spec-value">完全予約制</span>
            </li>
            <li className="artist__spec">
              <span className="artist__spec-label">衛生管理</span>
              <span className="artist__spec-value">ディスポーザブル器具使用・滅菌機完備</span>
            </li>
          </ul>
        </div>
        <div className="artist__image-wrap" aria-hidden="true">
          <div className="artist__image-placeholder" />
        </div>
      </div>
    </section>
  )
}
