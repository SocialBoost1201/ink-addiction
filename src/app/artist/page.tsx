import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'アーティスト | INK ADDICTION',
  description: 'INK ADDICTIONのタトゥーアーティストプロフィール。和彫・洋彫・アニメなど多彩なジャンルに対応。',
}

const SPECS = [
  { label: '活動拠点', value: '日本' },
  { label: '対応ジャンル', value: '和彫・洋彫・アニメ・ファインライン・ブラック&グレー' },
  { label: '対応言語', value: '日本語・英語' },
  { label: 'スタイル', value: 'マシン彫り / 手彫り' },
  { label: '予約方式', value: '完全予約制' },
]

const STUDIOS = [
  { period: '2015〜2018', name: 'Studio A（東京）', note: 'マシン技法習得・洋彫を中心に経験' },
  { period: '2018〜2021', name: 'Studio B（大阪）', note: '和彫・彫師に師事、伝統的技法習得' },
  { period: '2021〜現在', name: 'INK ADDICTION', note: '独立開業・国内外でゲストワーク経験' },
]

export default function ArtistPage() {
  return (
    <main className="static-page">
      <div className="static-page__inner">
        <header className="static-page__header">
          <p className="section-eyebrow">Artist</p>
          <h1 className="static-page__title">アーティスト</h1>
        </header>

        {/* プロフィール */}
        <section className="artist-profile">
          <div className="artist-profile__avatar">
            <div className="artist-profile__avatar-placeholder">INK</div>
          </div>
          <div className="artist-profile__content">
            <h2 className="artist-profile__name">INK ADDICTION</h2>
            <p className="artist-profile__bio">
              和彫から洋彫・アニメ・ファインラインまで幅広いジャンルに対応するタトゥーアーティスト。
              国内複数スタジオでの修行を経て独立。「完成度へのこだわり」と「安心できる環境」を
              コンセプトに、ひとりひとりのイメージを丁寧に形にすることを大切にしています。
            </p>
            <p className="artist-profile__bio">
              デザイン持ち込みはもちろん、イメージだけお伝えいただいてのオリジナルデザインも得意です。
              まずはお気軽にご相談ください。
            </p>
          </div>
        </section>

        {/* スペック */}
        <section className="static-page__section">
          <h2>プロフィール</h2>
          <dl className="artist-specs">
            {SPECS.map((s) => (
              <div key={s.label} className="artist-specs__row">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 経歴 */}
        <section className="static-page__section">
          <h2>経歴</h2>
          <ol className="artist-timeline">
            {STUDIOS.map((s) => (
              <li key={s.period} className="artist-timeline__item">
                <span className="artist-timeline__period">{s.period}</span>
                <div className="artist-timeline__body">
                  <p className="artist-timeline__studio">{s.name}</p>
                  <p className="artist-timeline__note">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* SNS */}
        <section className="static-page__section">
          <h2>SNS</h2>
          <p className="static-page__text">作品は Instagram・TikTok で随時更新しています。</p>
          <div className="artist-sns">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="btn btn--ghost">Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
              className="btn btn--ghost">TikTok</a>
          </div>
        </section>

        <div className="static-page__cta">
          <p>作品のご依頼・ご相談はこちら</p>
          <Link href="/inquiry" className="btn btn--primary btn--lg">お問い合わせ</Link>
        </div>
      </div>
    </main>
  )
}
