import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '料金 | INK ADDICTION',
  description: 'INK ADDICTIONのタトゥー料金についてご案内します。サイズ・デザインにより異なりますが、まずは無料相談からどうぞ。',
}

const PRICE_TABLE = [
  { size: '極小（〜3cm）', time: '30分〜1時間', price: '¥15,000〜' },
  { size: '小（3〜8cm）', time: '1〜2時間', price: '¥25,000〜' },
  { size: '中（8〜15cm）', time: '2〜4時間', price: '¥50,000〜' },
  { size: '大（15cm〜）', time: '4時間〜', price: '¥80,000〜' },
  { size: 'ハーフスリーブ', time: '複数セッション', price: '¥150,000〜' },
  { size: 'フルスリーブ', time: '複数セッション', price: '¥300,000〜' },
]

const FAQ_PRICING = [
  { q: '料金はどのように決まりますか？', a: 'サイズ・デザインの複雑さ・カラー有無・施術時間などにより変動します。事前にデザイン案をご共有いただいた上でお見積もりをお伝えします。' },
  { q: '追加料金はありますか？', a: '基本料金以外に追加費用は発生しません。事前見積もりをお伝えした後は変更がない限り追加料金は不要です。' },
  { q: '分割払いはできますか？', a: '現在は一括払いのみ対応しています。現金・振込払いをご選択いただけます。' },
]

export default function PricingPage() {
  return (
    <main className="static-page">
      <div className="static-page__inner">
        <header className="static-page__header">
          <p className="section-eyebrow">Pricing</p>
          <h1 className="static-page__title">料金</h1>
          <p className="static-page__lead">
            正確な料金はデザイン確定後にお見積もりをお伝えします。<br />
            以下は目安です。まずはお気軽にご相談ください。
          </p>
        </header>

        {/* 料金表 */}
        <section className="pricing-table-wrap">
          <div className="admin-table-wrap">
            <table className="admin-table pricing-table">
              <thead>
                <tr>
                  <th>サイズ目安</th>
                  <th>施術時間目安</th>
                  <th>料金目安</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_TABLE.map((row) => (
                  <tr key={row.size}>
                    <td className="pricing-table__size">{row.size}</td>
                    <td className="admin-table__muted">{row.time}</td>
                    <td className="pricing-table__price">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="pricing-note">
            ※ 上記はあくまで目安です。カバーアップ・修正・特殊技法は別途お見積もりします。
          </p>
        </section>

        {/* 含まれるもの */}
        <section className="static-page__section">
          <h2>料金に含まれるもの</h2>
          <ul className="static-list">
            <li>デザイン相談・修正（無制限）</li>
            <li>施術費用</li>
            <li>初回アフターケアの説明・用品案内</li>
            <li>施術後の経過相談（メール対応）</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="static-page__section">
          <h2>料金に関するQ&A</h2>
          <dl className="pricing-faq">
            {FAQ_PRICING.map((item) => (
              <div key={item.q} className="pricing-faq__item">
                <dt className="pricing-faq__q">{item.q}</dt>
                <dd className="pricing-faq__a">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="static-page__cta">
          <p>料金の詳細はお気軽にご相談ください</p>
          <Link href="/inquiry" className="btn btn--primary btn--lg">無料相談する</Link>
        </div>
      </div>
    </main>
  )
}
