import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '衛生管理 | INK ADDICTION',
  description: 'INK ADDICTIONの衛生管理・感染症対策についてご説明します。安心・安全な施術環境のためのガイドラインです。',
}

const SAFETY_ITEMS = [
  {
    icon: '🩺',
    title: '使い捨て針',
    desc: '施術で使用するニードルは1ショット（パック品）を使用し、施術ごとに廃棄します。使い回しは一切行いません。',
  },
  {
    icon: '🧤',
    title: '滅菌手袋',
    desc: '施術者は毎回滅菌済みのニトリルグローブを着用します。作業中に手袋を交換することもあります。',
  },
  {
    icon: '🧴',
    title: '施術部位の消毒',
    desc: '施術前に施術部位をアルコールで消毒します。また、施術中も定期的に消毒を行います。',
  },
  {
    icon: '🗑️',
    title: '廃棄物の適正処理',
    desc: '使用済みニードル・グローブ等は感染性廃棄物として適切に分別・廃棄します。',
  },
  {
    icon: '✨',
    title: 'スタジオの清潔維持',
    desc: 'ベッド・チェアは毎施術後に消毒します。床・器具は定期的に消毒洗浄しています。',
  },
  {
    icon: '🚫',
    title: '体調不良時の施術中止',
    desc: '施術者・お客様いずれかの体調不良時は施術を延期します。無理な施術は行いません。',
  },
]

export default function SafetyPage() {
  return (
    <main className="static-page">
      <div className="static-page__inner">
        <header className="static-page__header">
          <p className="section-eyebrow">Safety</p>
          <h1 className="static-page__title">衛生管理</h1>
          <p className="static-page__lead">
            お客様が安心して施術を受けていただけるよう、<br />
            衛生管理を徹底しています。
          </p>
        </header>

        <div className="safety-grid">
          {SAFETY_ITEMS.map((item) => (
            <div key={item.title} className="safety-card">
              <p className="safety-card__icon">{item.icon}</p>
              <h2 className="safety-card__title">{item.title}</h2>
              <p className="safety-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="static-page__section">
          <h2>施術後のアフターケアについて</h2>
          <p>
            施術後は適切なアフターケアが仕上がりに影響します。施術完了後に詳しい説明をお伝えします。
            また、経過観察中のご質問はメールにて対応いたします。
          </p>
        </section>

        <section className="static-page__section">
          <h2>施術をお断りする場合</h2>
          <ul className="static-list">
            <li>18歳未満の方（年齢確認あり）</li>
            <li>妊娠中・授乳中の方</li>
            <li>ケロイド体質の方（ご相談ください）</li>
            <li>施術部位に皮膚疾患・炎症がある方</li>
            <li>飲酒された状態の方</li>
          </ul>
        </section>

        <div className="static-page__cta">
          <p>不安な点はまずご相談ください</p>
          <Link href="/inquiry" className="btn btn--primary btn--lg">無料相談する</Link>
        </div>
      </div>
    </main>
  )
}
